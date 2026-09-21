// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
interface AggregatorV3Interface {
    function decimals() external view returns (uint8);
    function latestRoundData() external view returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    );
}

/// @title DareProtocol
/// @notice Non-upgradeable escrow protocol for Base ETH and Base USDC dares.
/// @dev The contract is the authority for funds and protocol rules. Off-chain services
///      may index/notify/keep permissionless actions but are never required for safety.
contract DareProtocol is ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint256 public constant ACCEPTANCE_WINDOW = 24 hours;
    uint256 public constant MIN_DURATION = 1 hours;
    uint256 public constant MAX_DURATION = 7 days;
    uint256 public constant PROOF_WINDOW = 24 hours;
    uint256 public constant CONFIRM_WINDOW = 24 hours;
    uint256 public constant EVIDENCE_WINDOW = 24 hours;
    uint256 public constant JUDGE_WINDOW = 48 hours;
    uint256 public constant CREATE_COOLDOWN = 20 minutes;

    uint256 public constant MIN_ETH_STAKE = 0.0002 ether;
    uint256 public constant MIN_USDC_STAKE = 0.50e6;
    uint256 public constant MAX_USD_STAKE_6 = 500e6;

    uint256 public constant BASE_FEE_BPS = 300;
    uint256 public constant MAX_FEE_BPS = 500;
    uint256 public constant FEE_TIMELOCK = 48 hours;

    uint256 public constant MAX_DESCRIPTION_LENGTH = 500;
    uint256 public constant MAX_URI_LENGTH = 2048;
    uint256 public constant MAX_EVIDENCE_ITEMS = 20;
    uint256 public constant ORACLE_MAX_AGE = 2 hours;

    uint256 public constant MAX_DARES_LOWER_TIERS = 5;
    uint256 public constant MAX_DARES_CHAMPION = 7;
    uint256 public constant MAX_DARES_LEGEND = 10;
    uint256 public constant MAX_DARES_MYTHIC = 15;

    uint256 public constant FEE_DISCOUNT_CHAMPION = 50;
    uint256 public constant FEE_DISCOUNT_LEGEND = 100;
    uint256 public constant FEE_DISCOUNT_MYTHIC = 200;

    // XP tiers are deliberately round-number brackets based on the USD value of one side.
    uint256 public constant XP_TIER_10_MAX = 1e6;      // < $1
    uint256 public constant XP_TIER_20_MAX = 5e6;      // < $5
    uint256 public constant XP_TIER_50_MAX = 10e6;     // < $10
    uint256 public constant XP_TIER_70_MAX = 25e6;     // < $25
    uint256 public constant XP_TIER_100_MAX = 100e6;   // < $100
    uint256 public constant XP_TIER_350_MAX = 250e6;   // < $250
    uint256 public constant XP_MAX = 500;

    enum Badge { NONE, ROOKIE, CHALLENGER, CONTENDER, GLADIATOR, CHAMPION, LEGEND, MYTHIC }
    enum Status { Open, Running, ProofSubmitted, Disputed, Resolved, Cancelled }

    struct Dare {
        address creator;
        address accepter;
        address token; // address(0) = native ETH
        uint256 stake;
        uint256 stakeUsd6; // locked at acceptance/creation valuation, used for XP
        uint256 baseFeeBps; // fee locked for this dare; later fee changes affect new dares only
        uint256 createdAt;
        uint256 acceptBy;
        uint256 acceptedAt;
        uint256 deadline;
        uint256 proofDeadline;
        uint256 proofTime;
        uint256 disputeTime;
        uint256 evidenceDeadline;
        bool proofRequired;
        bool proofSubmitted;
        string description;
        string proofURI;
        bytes32 proofHash;
        bytes32 disputeReasonHash;
        bytes32 judgeReasonHash;
        Status status;
    }

    struct Evidence {
        address submitter;
        string uri;
        bytes32 contentHash;
        uint256 submittedAt;
    }

    address public admin;
    address public pendingAdmin;
    address public judge;
    address public treasury;
    IERC20 public immutable usdc;
    AggregatorV3Interface public immutable ethUsdFeed;

    bool public paused;

    uint256 public feeBps = BASE_FEE_BPS;
    uint256 public pendingFeeBps;
    uint256 public feeEta;

    uint256 public minEthStake = MIN_ETH_STAKE;
    uint256 public minUsdcStake = MIN_USDC_STAKE;

    Dare[] public dares;
    mapping(uint256 => uint256) private dareDuration;
    mapping(uint256 => Evidence[]) private evidenceByDare;

    mapping(address => int256) public xp;
    mapping(address => Badge) public badge;
    mapping(uint256 => address) public winnerOf;
    mapping(address => uint256) public wins;
    mapping(address => uint256) public losses;
    mapping(address => uint256) public volumeUsd6;
    mapping(address => uint256) public disputeWins;
    mapping(address => uint256) public activeDaresCount;
    mapping(address => uint256) public activeDaresCountAccepter;
    mapping(address => uint256) public lastDareCreation;

    // Outstanding user liabilities, excluding protocol fees already separated into treasury accounting.
    mapping(address => uint256) public outstandingLiability;
    mapping(address => uint256) public accumulatedFees;

    event AdminTransferStarted(address indexed oldAdmin, address indexed pendingAdmin);
    event AdminTransferred(address indexed oldAdmin, address indexed newAdmin);
    event JudgeUpdated(address indexed oldJudge, address indexed newJudge);
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);
    event Paused(address indexed by);
    event Unpaused(address indexed by);
    event FeeChangeScheduled(uint256 oldFeeBps, uint256 newFeeBps, uint256 eta);
    event FeeChangeCancelled(uint256 pendingFeeBps, uint256 eta);
    event FeeChanged(uint256 oldFeeBps, uint256 newFeeBps);
    event StakeMinimumsChanged(uint256 minEthStake, uint256 minUsdcStake);
    event DareCreated(uint256 indexed id, address indexed creator, address indexed token, uint256 stake, uint256 acceptBy, uint256 duration, bool proofRequired);
    event DareAccepted(uint256 indexed id, address indexed accepter, uint256 acceptedAt, uint256 deadline, uint256 stakeUsd6);
    event DareCancelled(uint256 indexed id);
    event DareExpired(uint256 indexed id);
    event ProofSubmitted(uint256 indexed id, address indexed accepter, string proofURI, bytes32 proofHash, uint256 proofTime);
    event DareConfirmed(uint256 indexed id, address indexed creator);
    event DareDisputed(uint256 indexed id, address indexed creator, bytes32 reasonHash, uint256 evidenceDeadline);
    event EvidenceSubmitted(uint256 indexed id, address indexed submitter, uint256 index, bytes32 contentHash, uint256 submittedAt);
    event DareResolved(uint256 indexed id, address indexed winner, uint256 payoutAmount, uint256 feeAmount, uint256 xpAward, uint256 xpPenalty);
    event BadgeUpdated(address indexed user, Badge badge);
    event ExcessRescued(address indexed token, address indexed to, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    modifier onlyJudge() {
        require(msg.sender == judge, "Not judge");
        _;
    }

    modifier onlyCreator(uint256 id) {
        require(msg.sender == dares[id].creator, "Not creator");
        _;
    }

    modifier onlyAccepter(uint256 id) {
        require(msg.sender == dares[id].accepter, "Not accepter");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Paused");
        _;
    }

    constructor(address _admin, address _judge, address _treasury, address _usdc, address _ethUsdFeed) {
        require(_admin != address(0) && _judge != address(0) && _treasury != address(0), "Zero role");
        require(_usdc != address(0) && _ethUsdFeed != address(0), "Zero dependency");
        admin = _admin;
        judge = _judge;
        treasury = _treasury;
        usdc = IERC20(_usdc);
        ethUsdFeed = AggregatorV3Interface(_ethUsdFeed);
    }

    function startAdminTransfer(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Zero admin");
        pendingAdmin = newAdmin;
        emit AdminTransferStarted(admin, newAdmin);
    }

    function acceptAdmin() external {
        require(msg.sender == pendingAdmin, "Not pending admin");
        address old = admin;
        admin = pendingAdmin;
        pendingAdmin = address(0);
        emit AdminTransferred(old, admin);
    }

    function setJudge(address newJudge) external onlyAdmin {
        require(newJudge != address(0), "Zero judge");
        emit JudgeUpdated(judge, newJudge);
        judge = newJudge;
    }

    function setTreasury(address newTreasury) external onlyAdmin {
        require(newTreasury != address(0), "Zero treasury");
        emit TreasuryUpdated(treasury, newTreasury);
        treasury = newTreasury;
    }

    function pause() external onlyAdmin {
        paused = true;
        emit Paused(msg.sender);
    }

    function unpause() external onlyAdmin {
        paused = false;
        emit Unpaused(msg.sender);
    }

    function scheduleFee(uint256 newFeeBps) external onlyAdmin {
        require(newFeeBps <= MAX_FEE_BPS, "Fee too high");
        pendingFeeBps = newFeeBps;
        feeEta = block.timestamp + FEE_TIMELOCK;
        emit FeeChangeScheduled(feeBps, newFeeBps, feeEta);
    }

    function cancelScheduledFee() external onlyAdmin {
        pendingFeeBps = 0;
        feeEta = 0;
        emit FeeChangeCancelled(pendingFeeBps, feeEta);
    }

    function executeScheduledFee() external {
        require(feeEta != 0 && block.timestamp >= feeEta, "Fee timelock active");
        uint256 old = feeBps;
        uint256 next = pendingFeeBps;
        feeBps = next;
        pendingFeeBps = 0;
        feeEta = 0;
        emit FeeChanged(old, next);
    }

    function setStakeMinimums(uint256 newMinEth, uint256 newMinUsdc) external onlyAdmin {
        require(newMinEth >= MIN_ETH_STAKE, "ETH min too low");
        require(newMinUsdc >= MIN_USDC_STAKE, "USDC min too low");
        minEthStake = newMinEth;
        minUsdcStake = newMinUsdc;
        emit StakeMinimumsChanged(newMinEth, newMinUsdc);
    }

    function createDare(
        string calldata description,
        uint256 duration,
        address token,
        uint256 stake,
        bool proofRequired
    ) external payable nonReentrant whenNotPaused {
        require(bytes(description).length > 0 && bytes(description).length <= MAX_DESCRIPTION_LENGTH, "Description length");
        require(duration >= MIN_DURATION && duration <= MAX_DURATION, "Duration invalid");
        require(_isAllowedToken(token), "Token not allowed");
        require(block.timestamp >= lastDareCreation[msg.sender] + CREATE_COOLDOWN, "Create cooldown");
        require(activeDaresCount[msg.sender] < _getMaxDaresForUser(msg.sender), "Max active dares");

        uint256 stakeUsd6 = _validateAndTakeStake(msg.sender, token, stake);
        require(stakeUsd6 <= MAX_USD_STAKE_6, "Stake exceeds USD cap");

        uint256 id = dares.length;
        uint256 acceptBy = block.timestamp + ACCEPTANCE_WINDOW;
        dares.push();
        Dare storage d = dares[id];
        d.creator = msg.sender;
        d.token = token;
        d.stake = stake;
        d.stakeUsd6 = stakeUsd6;
        d.baseFeeBps = feeBps;
        d.createdAt = block.timestamp;
        d.acceptBy = acceptBy;
        d.deadline = acceptBy;
        d.proofRequired = proofRequired;
        d.description = description;
        d.status = Status.Open;
        dareDuration[id] = duration;

        activeDaresCount[msg.sender] += 1;
        lastDareCreation[msg.sender] = block.timestamp;
        outstandingLiability[token] += stake;

        emit DareCreated(id, msg.sender, token, stake, acceptBy, duration, proofRequired);
    }

    function acceptDare(uint256 id) external payable nonReentrant whenNotPaused {
        Dare storage d = dares[id];
        require(d.status == Status.Open, "Not open");
        require(block.timestamp <= d.acceptBy, "Acceptance closed");
        require(msg.sender != d.creator, "Creator cannot accept");
        require(activeDaresCountAccepter[msg.sender] < _getMaxDaresForUser(msg.sender), "Max active dares");

        _takeStake(msg.sender, d.token, d.stake);

        d.accepter = msg.sender;
        d.acceptedAt = block.timestamp;
        d.deadline = block.timestamp + _durationFromCreationEvent(id);
        d.proofDeadline = d.deadline + PROOF_WINDOW;
        d.status = Status.Running;

        outstandingLiability[d.token] += d.stake;
        activeDaresCountAccepter[msg.sender] += 1;
        volumeUsd6[d.creator] += d.stakeUsd6;
        volumeUsd6[d.accepter] += d.stakeUsd6;

        emit DareAccepted(id, msg.sender, d.acceptedAt, d.deadline, d.stakeUsd6);
    }

    function _durationFromCreationEvent(uint256 id) internal view returns (uint256) {
        return dareDuration[id];
    }

    function cancelOpenDare(uint256 id) external nonReentrant onlyCreator(id) {
        Dare storage d = dares[id];
        require(d.status == Status.Open, "Not open");
        d.status = Status.Cancelled;
        _releaseCreatorLiability(d);
        _safePayout(d.creator, d.token, d.stake);
        activeDaresCount[d.creator] -= 1;
        emit DareCancelled(id);
    }

    function expireUnacceptedDare(uint256 id) external nonReentrant {
        Dare storage d = dares[id];
        require(d.status == Status.Open, "Not open");
        require(block.timestamp > d.acceptBy, "Acceptance still open");
        d.status = Status.Cancelled;
        _releaseCreatorLiability(d);
        _safePayout(d.creator, d.token, d.stake);
        activeDaresCount[d.creator] -= 1;
        xp[msg.sender] += 10;
        _maybeUpdateBadge(msg.sender);
        emit DareExpired(id);
    }

    function submitProof(uint256 id, string calldata proofURI, bytes32 proofHash) external nonReentrant onlyAccepter(id) {
        Dare storage d = dares[id];
        require(d.status == Status.Running && d.proofRequired, "Proof not required/state");
        require(bytes(proofURI).length > 0 && bytes(proofURI).length <= MAX_URI_LENGTH, "Proof URI length");
        require(proofHash != bytes32(0), "Proof hash required");
        require(block.timestamp >= d.deadline, "Task deadline not reached");
        require(block.timestamp <= d.proofDeadline, "Proof window over");

        d.proofSubmitted = true;
        d.proofURI = proofURI;
        d.proofHash = proofHash;
        d.proofTime = block.timestamp;
        d.status = Status.ProofSubmitted;
        emit ProofSubmitted(id, msg.sender, proofURI, proofHash, block.timestamp);
    }

    function confirmSuccess(uint256 id) external nonReentrant onlyCreator(id) {
        Dare storage d = dares[id];
        require(d.status == Status.ProofSubmitted, "Not proof state");
        require(block.timestamp <= d.proofTime + CONFIRM_WINDOW, "Review window over");
        _resolve(id, d.accepter, false);
        emit DareConfirmed(id, msg.sender);
    }

    function disputeDare(uint256 id, bytes32 reasonHash) external nonReentrant onlyCreator(id) {
        Dare storage d = dares[id];
        require(d.status == Status.ProofSubmitted, "Not proof state");
        require(block.timestamp <= d.proofTime + CONFIRM_WINDOW, "Review window over");
        require(reasonHash != bytes32(0), "Reason required");

        d.status = Status.Disputed;
        d.disputeTime = block.timestamp;
        d.evidenceDeadline = block.timestamp + EVIDENCE_WINDOW;
        d.disputeReasonHash = reasonHash;
        emit DareDisputed(id, msg.sender, reasonHash, d.evidenceDeadline);
    }

    function submitEvidence(uint256 id, string calldata uri, bytes32 contentHash) external nonReentrant {
        Dare storage d = dares[id];
        require(d.status == Status.Disputed, "Not disputed");
        require(block.timestamp <= d.evidenceDeadline, "Evidence window over");
        require(msg.sender == d.creator || msg.sender == d.accepter, "Not party");
        require(bytes(uri).length > 0 && bytes(uri).length <= MAX_URI_LENGTH, "Evidence URI length");
        require(contentHash != bytes32(0), "Evidence hash required");
        require(evidenceByDare[id].length < MAX_EVIDENCE_ITEMS, "Evidence limit");

        evidenceByDare[id].push(Evidence(msg.sender, uri, contentHash, block.timestamp));
        emit EvidenceSubmitted(id, msg.sender, evidenceByDare[id].length - 1, contentHash, block.timestamp);
    }

    function resolveAfterConfirmTimeout(uint256 id) external nonReentrant {
        Dare storage d = dares[id];
        require(d.status == Status.ProofSubmitted, "Not pending confirm");
        require(block.timestamp > d.proofTime + CONFIRM_WINDOW, "Review window open");
        _resolve(id, d.accepter, false);
    }

    function resolveAfterProofTimeout(uint256 id) external nonReentrant {
        Dare storage d = dares[id];
        require(d.status == Status.Running && d.proofRequired, "Not proof-running state");
        require(block.timestamp > d.proofDeadline, "Proof window open");
        _resolve(id, d.creator, false);
    }

    function resolveNoProofRequired(uint256 id) external nonReentrant {
        Dare storage d = dares[id];
        require(d.status == Status.Running && !d.proofRequired, "Proof required/state");
        require(block.timestamp >= d.deadline, "Task deadline open");
        _resolve(id, d.accepter, false);
    }

    function judgeResolve(uint256 id, bool creatorWins, bytes32 reasonHash) external nonReentrant onlyJudge {
        Dare storage d = dares[id];
        require(d.status == Status.Disputed, "Only disputed dares");
        require(block.timestamp >= d.evidenceDeadline, "Evidence window open");
        require(block.timestamp <= d.disputeTime + JUDGE_WINDOW, "Judge window over");
        require(reasonHash != bytes32(0), "Judge reason required");

        d.judgeReasonHash = reasonHash;
        address winner = creatorWins ? d.creator : d.accepter;
        disputeWins[winner] += 1;
        _resolve(id, winner, true);
    }

    function penalizeFalseDispute(address user) external onlyJudge {
        require(user != address(0), "Zero user");
        uint256 penalty = 50;
        if (xp[user] > int256(penalty)) xp[user] -= int256(penalty);
        else xp[user] = 0;
        _maybeUpdateBadge(user);
    }

    function _resolve(uint256 id, address winner, bool) internal {
        Dare storage d = dares[id];
        require(d.status == Status.Running || d.status == Status.ProofSubmitted || d.status == Status.Disputed, "Bad state");

        d.status = Status.Resolved;
        uint256 total = d.stake * 2;
        uint256 discount = _getFeeDiscountBps(winner);
        uint256 effectiveFeeBps = d.baseFeeBps > discount ? d.baseFeeBps - discount : 0;
        uint256 fee = (total * effectiveFeeBps) / 10_000;
        uint256 payout = total - fee;

        // Liability is removed before external calls. ReentrancyGuard is an additional layer.
        outstandingLiability[d.token] -= total;
        accumulatedFees[d.token] += fee;
        _safePayout(winner, d.token, payout);

        winnerOf[id] = winner;
        address loser = winner == d.creator ? d.accepter : d.creator;
        wins[winner] += 1;
        losses[loser] += 1;

        uint256 winnerXp = _xpForUsd(d.stakeUsd6);
        uint256 loserXp = winnerXp / 5;
        if (loserXp == 0) loserXp = 1;

        xp[winner] += int256(winnerXp);
        if (xp[loser] > int256(loserXp)) xp[loser] -= int256(loserXp);
        else xp[loser] = 0;
        _maybeUpdateBadge(winner);
        _maybeUpdateBadge(loser);

        activeDaresCount[d.creator] -= 1;
        activeDaresCountAccepter[d.accepter] -= 1;

        emit DareResolved(id, winner, payout, fee, winnerXp, loserXp);
    }

    function withdrawFees(address token, uint256 amount) external onlyAdmin nonReentrant {
        require(token == address(0) || token == address(usdc), "Unsupported token");
        require(amount <= accumulatedFees[token], "Fee balance");
        accumulatedFees[token] -= amount;
        _safePayout(treasury, token, amount);
    }

    function rescueExcess(address token, uint256 amount) external onlyAdmin nonReentrant {
        require(token == address(0) || token == address(usdc), "Unsupported token");
        uint256 balance = token == address(0) ? address(this).balance : usdc.balanceOf(address(this));
        uint256 protectedBalance = outstandingLiability[token] + accumulatedFees[token];
        require(balance >= protectedBalance + amount, "Would touch protected funds");
        _safePayout(admin, token, amount);
        emit ExcessRescued(token, admin, amount);
    }

    function _validateAndTakeStake(address from, address token, uint256 stake) internal returns (uint256 usd6) {
        if (token == address(0)) {
            require(stake >= minEthStake, "ETH stake below minimum");
            require(msg.value == stake, "ETH mismatch");
            usd6 = _ethToUsd6(stake);
        } else {
            require(token == address(usdc), "Only USDC allowed");
            require(stake >= minUsdcStake, "USDC stake below minimum");
            require(msg.value == 0, "Unexpected ETH");
            usdc.safeTransferFrom(from, address(this), stake);
            usd6 = stake; // USDC is treated as $1 for protocol valuation.
        }
        require(usd6 <= MAX_USD_STAKE_6, "Stake exceeds USD cap");
    }

    function _takeStake(address from, address token, uint256 stake) internal {
        if (token == address(0)) {
            require(msg.value == stake, "ETH mismatch");
        } else {
            require(token == address(usdc), "Only USDC allowed");
            require(msg.value == 0, "Unexpected ETH");
            usdc.safeTransferFrom(from, address(this), stake);
        }
    }

    function _ethToUsd6(uint256 amountWei) internal view returns (uint256) {
        (, int256 answer, , uint256 updatedAt, ) = ethUsdFeed.latestRoundData();
        require(answer > 0 && updatedAt != 0 && block.timestamp - updatedAt <= ORACLE_MAX_AGE, "ETH oracle stale");
        uint8 decimals = ethUsdFeed.decimals();
        uint256 price = uint256(answer);
        if (decimals >= 6) return (amountWei * price) / (10 ** (18 + decimals - 6));
        return (amountWei * price * (10 ** (6 - decimals))) / 1e18;
    }

    function _isAllowedToken(address token) internal view returns (bool) {
        return token == address(0) || token == address(usdc);
    }

    function _xpForUsd(uint256 usd6) internal pure returns (uint256) {
        if (usd6 < XP_TIER_10_MAX) return 10;
        if (usd6 < XP_TIER_20_MAX) return 20;
        if (usd6 < XP_TIER_50_MAX) return 50;
        if (usd6 < XP_TIER_70_MAX) return 70;
        if (usd6 < XP_TIER_100_MAX) return 100;
        if (usd6 < XP_TIER_350_MAX) return 350;
        return XP_MAX;
    }

    function _getMaxDaresForUser(address user) internal view returns (uint256) {
        Badge b = badge[user];
        if (b == Badge.MYTHIC) return MAX_DARES_MYTHIC;
        if (b == Badge.LEGEND) return MAX_DARES_LEGEND;
        if (b == Badge.CHAMPION) return MAX_DARES_CHAMPION;
        return MAX_DARES_LOWER_TIERS;
    }

    function _getFeeDiscountBps(address user) internal view returns (uint256) {
        Badge b = badge[user];
        if (b == Badge.MYTHIC) return FEE_DISCOUNT_MYTHIC;
        if (b == Badge.LEGEND) return FEE_DISCOUNT_LEGEND;
        if (b == Badge.CHAMPION) return FEE_DISCOUNT_CHAMPION;
        return 0;
    }

    function _maybeUpdateBadge(address user) internal {
        int256 p = xp[user];
        Badge next;
        if (p >= 7500) next = Badge.MYTHIC;
        else if (p >= 5000) next = Badge.LEGEND;
        else if (p >= 3000) next = Badge.CHAMPION;
        else if (p >= 2000) next = Badge.GLADIATOR;
        else if (p >= 1000) next = Badge.CONTENDER;
        else if (p >= 500) next = Badge.CHALLENGER;
        else if (p > 0) next = Badge.ROOKIE;
        else next = Badge.NONE;
        if (next != badge[user]) {
            badge[user] = next;
            emit BadgeUpdated(user, next);
        }
    }

    function _releaseCreatorLiability(Dare storage d) internal {
        outstandingLiability[d.token] -= d.stake;
    }

    function _safePayout(address to, address token, uint256 amount) internal {
        if (amount == 0) return;
        if (token == address(0)) {
            (bool ok, ) = to.call{value: amount}("");
            require(ok, "ETH transfer failed");
        } else {
            IERC20(token).safeTransfer(to, amount);
        }
    }

    function dareCount() external view returns (uint256) { return dares.length; }

    function getDare(uint256 id) external view returns (
        address creator, address accepter, string memory description, address token, uint256 stake,
        uint256 createdAt, uint256 deadline, bool proofSubmitted, string memory proofURI,
        uint256 proofTime, uint256 disputeTime, Status status
    ) {
        Dare storage d = dares[id];
        return (d.creator, d.accepter, d.description, d.token, d.stake, d.createdAt, d.deadline, d.proofSubmitted, d.proofURI, d.proofTime, d.disputeTime, d.status);
    }

    function getDareMeta(uint256 id) external view returns (
        bool proofRequired, uint256 acceptBy, uint256 proofDeadline, uint256 evidenceDeadline,
        bytes32 proofHash, bytes32 disputeReasonHash, bytes32 judgeReasonHash, uint256 baseFeeBps, uint256 stakeUsd6, uint256 duration
    ) {
        Dare storage d = dares[id];
        return (d.proofRequired, d.acceptBy, d.proofDeadline, d.evidenceDeadline, d.proofHash, d.disputeReasonHash, d.judgeReasonHash, d.baseFeeBps, d.stakeUsd6, dareDuration[id]);
    }

    function getEvidenceCount(uint256 id) external view returns (uint256) { return evidenceByDare[id].length; }

    function getEvidence(uint256 id, uint256 index) external view returns (Evidence memory) { return evidenceByDare[id][index]; }

    function getUserStats(address user) external view returns (
        uint256 activeCountCreator,
        uint256 activeCountAccepter,
        int256 xpPoints,
        uint256 totalWins,
        uint256 totalLosses,
        uint256 totalVolumeUsd6,
        uint256 totalDisputeWins
    ) {
        return (activeDaresCount[user], activeDaresCountAccepter[user], xp[user], wins[user], losses[user], volumeUsd6[user], disputeWins[user]);
    }

    function getCreateCooldown(address user) external view returns (uint256) {
        uint256 next = lastDareCreation[user] + CREATE_COOLDOWN;
        return next > block.timestamp ? next - block.timestamp : 0;
    }

    function getDuration(uint256 id) external view returns (uint256) { return dareDuration[id]; }

    receive() external payable {}
    fallback() external payable {}
}
