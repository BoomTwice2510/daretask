// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract DareProtocol is ReentrancyGuard {
    using SafeERC20 for IERC20;

    /* ============ CONSTANTS ============ */

    uint256 public constant CONFIRM_WINDOW = 24 hours;   // time for creator to confirm/dispute after proof
    uint256 public constant PROOF_WINDOW   = 24 hours;   // time after deadline to submit proof
    uint256 public constant JUDGE_WINDOW   = 72 hours;   // time for judge to act once disputed

    uint256 public constant XP_WIN           = 100;
    uint256 public constant XP_LOSS          = 10;
    uint256 public constant XP_FALSE_DISPUTE = 50;

    uint256 public constant WIN_FEE_BPS    = 300;        // base 3% fee (300 bps)

    uint256 public constant MIN_STAKE      = 0.0001 ether; // min stake (ETH or token units equivalent)
    uint256 public constant MAX_DURATION   = 7 days;       // max dare duration

    // TVL controls (ETH equivalent, single-side)
    uint256 public constant MAX_STAKE = 0.25 ether;             // per-dare cap (creator side)
    uint256 public constant MAX_TOTAL_ACTIVE_STAKE = 0.5 ether; // global active TVL cap

    // Tier-based active dare limits
    uint256 public constant MAX_DARES_LOWER_TIERS = 5;   // Rookie / Challenger / Contender / Gladiator
    uint256 public constant MAX_DARES_CHAMPION    = 7;
    uint256 public constant MAX_DARES_LEGEND      = 10;
    uint256 public constant MAX_DARES_MYTHIC      = 15;

    // Tier-based fee discounts (in basis points)
    uint256 public constant FEE_DISCOUNT_CHAMPION = 50;   // 0.5%
    uint256 public constant FEE_DISCOUNT_LEGEND   = 100;  // 1%
    uint256 public constant FEE_DISCOUNT_MYTHIC   = 200;  // 2%

    // Fixed allowed ERC20 tokens (Base mainnet)
    address public constant TOKEN_1 = 0x50F88fe97f72CD3E75b9Eb4f747F59BcEBA80d59;
    address public constant TOKEN_2 = 0x1111111111166b7FE7bd91427724B487980aFc69;

    address public judge;      // trusted resolver for disputes / timeouts
    address public treasury;   // fee sink, ideally multisig/DAO

    // Pause flag (affects only createDare / acceptDare)
    bool public paused;

    // TVL tracking (ETH equivalent, single side: creator stake only)
    uint256 public totalActiveStake;

    /* ============ BADGE / XP / STATS ============ */

    enum Badge {
        NONE,        // no badge yet
        ROOKIE,      // 1 - 499 XP
        CHALLENGER,  // 500 - 999
        CONTENDER,   // 1000 - 1999
        GLADIATOR,   // 2000 - 2999
        CHAMPION,    // 3000 - 4999
        LEGEND,      // 5000 - 7499
        MYTHIC       // 7500+
    }

    mapping(address => int256) public xp;
    mapping(address => Badge) public badge;

    // Leaderboard / profile
    mapping(uint256 => address) public winnerOf;
    mapping(address => uint256) public wins;
    mapping(address => uint256) public losses;
    mapping(address => uint256) public volume;
    mapping(address => uint256) public disputeWins;

    // Track active dares per creator (original)
    mapping(address => uint256) public activeDaresCount;

    // NEW: track active dares per accepter
    mapping(address => uint256) public activeDaresCountAccepter;

    // NEW: anti-spam: last create timestamp
    mapping(address => uint256) public lastDareCreation;

    // NEW: creator → accepter acceptance count (proxy tracking)
    mapping(address => mapping(address => uint256)) public acceptedFromCreator;

    /* ============ DARE CORE ============ */

    enum Status { Open, Running, ProofSubmitted, Disputed, Resolved, Cancelled }

    struct Dare {
        address creator;
        address accepter;
        string description;
        address token;       // address(0) = ETH
        uint256 stake;
        uint256 createdAt;
        uint256 deadline;    // when dare must be completed
        bool proofSubmitted;
        string proofURI;
        uint256 proofTime;
        uint256 disputeTime;
        Status status;
    }

    Dare[] public dares;

    /* ============ EVENTS ============ */

    event DareCreated(uint256 indexed id, address indexed creator, uint256 deadline);
    event DareAccepted(uint256 indexed id, address indexed accepter);
    event DareCancelled(uint256 indexed id);
    event DareExpired(uint256 indexed id);
    event ProofSubmitted(
        uint256 indexed id,
        address indexed accepter,
        string proofURI,
        uint256 proofTime
    );
    event DareDisputed(uint256 indexed id);
    event DareResolved(
        uint256 indexed id,
        address indexed winner,
        uint256 payoutAmount,
        uint256 feeAmount
    );
    event BadgeUpdated(address indexed user, Badge badge);
    event JudgeUpdated(address indexed oldJudge, address indexed newJudge);
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);
    event Paused(address indexed by);
    event Unpaused(address indexed by);

    /* ============ MODIFIERS ============ */

    modifier onlyJudge() {
        require(msg.sender == judge, "Not judge");
        _;
    }

    modifier onlyCreator(uint256 _id) {
        require(msg.sender == dares[_id].creator, "Not creator");
        _;
    }

    modifier onlyAccepter(uint256 _id) {
        require(msg.sender == dares[_id].accepter, "Not accepter");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Paused");
        _;
    }

    /* ============ CONSTRUCTOR ============ */

    constructor(address _judge, address _treasury) {
        require(_judge != address(0), "Zero judge");
        require(_treasury != address(0), "Zero treasury");
        judge = _judge;
        treasury = _treasury;
    }

    /* ============ ADMIN ============ */

    function setJudge(address _judge) external onlyJudge {
        require(_judge != address(0), "Zero judge");
        emit JudgeUpdated(judge, _judge);
        judge = _judge;
    }

    function setTreasury(address _treasury) external onlyJudge {
        require(_treasury != address(0), "Zero treasury");
        emit TreasuryUpdated(treasury, _treasury);
        treasury = _treasury;
    }

    function pause() external onlyJudge {
        paused = true;
        emit Paused(msg.sender);
    }

    function unpause() external onlyJudge {
        paused = false;
        emit Unpaused(msg.sender);
    }

    /* ============ INTERNAL: TOKEN ALLOWLIST ============ */

    function _isAllowedToken(address _token) internal pure returns (bool) {
        if (_token == address(0)) {
            // ETH (Base native)
            return true;
        }

        return (
            _token == TOKEN_1 ||
            _token == TOKEN_2
        );
    }

    // decimals helper
    function _getTokenDecimals(address _token) internal pure returns (uint8) {
        if (_token == address(0)) return 18;
        if (_token == TOKEN_1) return 18;
        if (_token == TOKEN_2) return 18;
        return 18;
    }

    // normalize to 18 decimals (ETH equivalent)
    function _toEthEquivalent(uint256 _amount, address _token) internal pure returns (uint256) {
        uint8 decimals = _getTokenDecimals(_token);
        if (decimals == 18) return _amount;
        if (decimals > 18) {
            return _amount / (10 ** (decimals - 18));
        } else {
            return _amount * (10 ** (18 - decimals));
        }
    }

    /* ============ INTERNAL: MAX DARES / FEES ============ */

    function _getMaxDaresForUser(address user) internal view returns (uint256) {
        Badge b = badge[user];
        if (b == Badge.MYTHIC) return MAX_DARES_MYTHIC;
        if (b == Badge.LEGEND) return MAX_DARES_LEGEND;
        if (b == Badge.CHAMPION) return MAX_DARES_CHAMPION;
        // Rookie / Challenger / Contender / Gladiator share same limit
        return MAX_DARES_LOWER_TIERS;
    }

    function _getFeeDiscountBps(address user) internal view returns (uint256) {
        Badge b = badge[user];
        if (b == Badge.MYTHIC) return FEE_DISCOUNT_MYTHIC;
        if (b == Badge.LEGEND) return FEE_DISCOUNT_LEGEND;
        if (b == Badge.CHAMPION) return FEE_DISCOUNT_CHAMPION;
        return 0;
    }

    /* ============ CREATE DARE ============ */

    function createDare(
        string calldata _description,
        uint256 _duration,
        address _token,
        uint256 _stake
    ) external payable nonReentrant whenNotPaused {
        require(bytes(_description).length > 0, "Empty description");
        require(_stake >= MIN_STAKE, "Stake below minimum");
        require(_duration > 0 && _duration <= MAX_DURATION, "Duration invalid");
        require(_isAllowedToken(_token), "Token not allowed");

        // Anti-spam: 20 minutes gap
        require(
            block.timestamp >= lastDareCreation[msg.sender] + 20 minutes,
            "Wait 20m before next dare"
        );

        // Token decimals → ETH equivalent min check
        uint256 ethEquivalent = _toEthEquivalent(_stake, _token);
        require(ethEquivalent >= MIN_STAKE, "Stake below min ETH equiv");

        // TVL controls (single side: creator stake only, in ETH equivalent)
        require(ethEquivalent <= MAX_STAKE, "Stake exceeds max limit");
        require(
            totalActiveStake + ethEquivalent <= MAX_TOTAL_ACTIVE_STAKE,
            "TVL limit reached"
        );

        uint256 userMax = _getMaxDaresForUser(msg.sender);
        require(activeDaresCount[msg.sender] < userMax, "Max active dares reached");

        if (_token == address(0)) {
            require(msg.value == _stake, "ETH mismatch");
        } else {
            IERC20(_token).safeTransferFrom(msg.sender, address(this), _stake);
        }

        uint256 id = dares.length;

        dares.push(
            Dare({
                creator: msg.sender,
                accepter: address(0),
                description: _description,
                token: _token,
                stake: _stake,
                createdAt: block.timestamp,
                deadline: block.timestamp + _duration,
                proofSubmitted: false,
                proofURI: "",
                proofTime: 0,
                disputeTime: 0,
                status: Status.Open
            })
        );

        activeDaresCount[msg.sender] += 1;
        lastDareCreation[msg.sender] = block.timestamp;

        // TVL increase (creator side only)
        totalActiveStake += ethEquivalent;

        emit DareCreated(id, msg.sender, block.timestamp + _duration);
    }

    /* ============ ACCEPT DARE ============ */

    function acceptDare(uint256 _id) external payable nonReentrant whenNotPaused {
        Dare storage d = dares[_id];

        require(d.status == Status.Open, "Not open");
        require(block.timestamp <= d.deadline, "Dare expired");
        require(msg.sender != d.creator, "Creator cannot accept");

        // Accepter active dares limit
        uint256 accepterMax = _getMaxDaresForUser(msg.sender);
        require(activeDaresCountAccepter[msg.sender] < accepterMax, "Max active dares reached");

        // Ensure stake meets ETH-equivalent min (should always be true if createDare checked)
        uint256 ethEquivalent = _toEthEquivalent(d.stake, d.token);
        require(ethEquivalent >= MIN_STAKE, "Stake below min ETH equiv");

        if (d.token == address(0)) {
            require(msg.value == d.stake, "ETH mismatch");
        } else {
            IERC20(d.token).safeTransferFrom(msg.sender, address(this), d.stake);
        }

        d.accepter = msg.sender;
        d.status = Status.Running;

        // track volume for creator and accepter
        volume[d.creator] += d.stake;
        volume[d.accepter] += d.stake;

        activeDaresCountAccepter[msg.sender] += 1;

        // Proxy tracking
        acceptedFromCreator[d.creator][msg.sender] += 1;

        emit DareAccepted(_id, msg.sender);
    }

    /* ============ CANCEL / EXPIRE WHILE OPEN ============ */

    // Creator cancels before acceptance, funds refunded to creator (no fee, no XP)
    function cancelOpenDare(uint256 _id) external nonReentrant onlyCreator(_id) {
        Dare storage d = dares[_id];

        require(d.status == Status.Open, "Not open");
        require(block.timestamp <= d.deadline, "Past deadline");

        d.status = Status.Cancelled;

        if (activeDaresCount[d.creator] > 0) {
            activeDaresCount[d.creator] -= 1;
        }

        // TVL decrease (creator side only)
        uint256 ethEquivalent = _toEthEquivalent(d.stake, d.token);
        if (totalActiveStake >= ethEquivalent) {
            totalActiveStake -= ethEquivalent;
        } else {
            totalActiveStake = 0;
        }

        _safePayout(d.creator, d.token, d.stake);
        emit DareCancelled(_id);
    }

    // Anyone can expire an unaccepted dare after deadline; funds refunded to creator (no fee, no XP)
    function expireUnacceptedDare(uint256 _id) external nonReentrant {
        Dare storage d = dares[_id];

        require(d.status == Status.Open, "Not open");
        require(block.timestamp > d.deadline, "Too early");

        d.status = Status.Cancelled;

        if (activeDaresCount[d.creator] > 0) {
            activeDaresCount[d.creator] -= 1;
        }

        // TVL decrease (creator side only)
        uint256 ethEquivalent = _toEthEquivalent(d.stake, d.token);
        if (totalActiveStake >= ethEquivalent) {
            totalActiveStake -= ethEquivalent;
        } else {
            totalActiveStake = 0;
        }

        _safePayout(d.creator, d.token, d.stake);
        emit DareExpired(_id);
    }

    /* ============ PROOF SUBMISSION BY ACCEPTER ============ */

    function submitProof(uint256 _id, string calldata _proofURI)
        external
        nonReentrant
        onlyAccepter(_id)
    {
        Dare storage d = dares[_id];

        require(d.status == Status.Running, "Not running");
        require(bytes(_proofURI).length > 0, "Empty proof");

        require(block.timestamp >= d.deadline, "Too early for proof");
        require(block.timestamp <= d.deadline + PROOF_WINDOW, "Proof window over");

        d.proofSubmitted = true;
        d.proofURI = _proofURI;
        d.proofTime = block.timestamp;
        d.status = Status.ProofSubmitted;

        emit ProofSubmitted(_id, msg.sender, _proofURI, block.timestamp);
    }

    /* ============ CREATOR CONFIRMATION (NO DISPUTE) ============ */

    function confirmSuccess(uint256 _id) external nonReentrant onlyCreator(_id) {
        Dare storage d = dares[_id];

        require(d.status == Status.ProofSubmitted, "No proof state");
        require(block.timestamp <= d.proofTime + CONFIRM_WINDOW, "Confirm window over");

        _resolve(_id, d.accepter);
    }

    /* ============ CREATOR DISPUTE ============ */

    function disputeDare(uint256 _id) external nonReentrant onlyCreator(_id) {
        Dare storage d = dares[_id];

        require(d.status == Status.ProofSubmitted, "Not proof state");
        require(block.timestamp <= d.proofTime + CONFIRM_WINDOW, "Too late to dispute");

        d.status = Status.Disputed;
        d.disputeTime = block.timestamp;

        emit DareDisputed(_id);
    }

    /* ============ AUTO-RESOLUTION ON CREATOR INACTION ============ */

    // If creator neither confirms nor disputes within CONFIRM_WINDOW,
    // anyone can call this to auto-award to accepter
    function resolveAfterConfirmTimeout(uint256 _id) external nonReentrant {
        Dare storage d = dares[_id];

        require(d.status == Status.ProofSubmitted, "Not pending confirm");
        require(block.timestamp > d.proofTime + CONFIRM_WINDOW, "Confirm window still open");

        _resolve(_id, d.accepter);
    }

    // UPDATED: If accepter fails to submit proof within PROOF_WINDOW after deadline, creator wins,
    // and now ANYONE can trigger (not only creator), payout still to creator.
    function resolveAfterProofTimeout(uint256 _id) external nonReentrant {
        Dare storage d = dares[_id];

        require(d.status == Status.Running, "Not running");
        require(d.accepter != address(0), "No accepter");
        require(block.timestamp > d.deadline + PROOF_WINDOW, "Proof window open");
        require(!d.proofSubmitted, "Proof submitted");

        _resolve(_id, d.creator);
    }

    /* ============ JUDGE RESOLUTION ============ */

    // Judge resolves disputed or stuck dares
    // - If 'creatorWins' true -> creator gets pot
    // - Else -> accepter gets pot
    function judgeResolve(uint256 _id, bool creatorWins) external nonReentrant onlyJudge {
        Dare storage d = dares[_id];

        require(
            d.status == Status.Running ||
            d.status == Status.ProofSubmitted ||
            d.status == Status.Disputed,
            "Not resolvable state"
        );
        require(d.accepter != address(0), "No accepter");

        if (d.status == Status.Disputed) {
            require(block.timestamp <= d.disputeTime + JUDGE_WINDOW, "Judge window over");
        }

        address winner = creatorWins ? d.creator : d.accepter;

        if (d.status == Status.Disputed) {
            disputeWins[winner] += 1;
        }

        _resolve(_id, winner);
    }

    /* ============ INTERNAL RESOLUTION ============ */

    function _resolve(uint256 _id, address _winner) internal {
        Dare storage d = dares[_id];

        require(
            d.status == Status.Running ||
            d.status == Status.ProofSubmitted ||
            d.status == Status.Disputed,
            "Bad pre-status"
        );
        require(d.status != Status.Resolved, "Already resolved");
        require(d.status != Status.Cancelled, "Cancelled");

        d.status = Status.Resolved;

        uint256 total = d.stake * 2;

        uint256 discount = _getFeeDiscountBps(_winner);
        uint256 feeBps = WIN_FEE_BPS;
        if (discount > feeBps) {
            feeBps = 0;
        } else {
            feeBps = feeBps - discount;
        }

        uint256 fee = (total * feeBps) / 10_000;
        uint256 payout = total - fee;

        _safePayout(_winner, d.token, payout);

        if (fee > 0 && treasury != address(0)) {
            _safePayout(treasury, d.token, fee);
        }

        winnerOf[_id] = _winner;
        if (_winner == d.creator) {
            wins[d.creator] += 1;
            losses[d.accepter] += 1;
        } else {
            wins[d.accepter] += 1;
            losses[d.creator] += 1;
        }

        // XP logic: winner +100, loser -10 (min 0)
        address loser = (_winner == d.creator) ? d.accepter : d.creator;

        xp[_winner] += int256(XP_WIN);
        _maybeUpdateBadge(_winner);

        if (xp[loser] >= int256(XP_LOSS)) {
            xp[loser] -= int256(XP_LOSS);
        } else {
            xp[loser] = 0;
        }
        _maybeUpdateBadge(loser);

        if (activeDaresCount[d.creator] > 0) {
            activeDaresCount[d.creator] -= 1;
        }
        if (activeDaresCountAccepter[d.accepter] > 0) {
            activeDaresCountAccepter[d.accepter] -= 1;
        }

        // TVL decrease (creator side only)
        uint256 ethEquivalent = _toEthEquivalent(d.stake, d.token);
        if (totalActiveStake >= ethEquivalent) {
            totalActiveStake -= ethEquivalent;
        } else {
            totalActiveStake = 0;
        }

        emit DareResolved(_id, _winner, payout, fee);
    }

    /* ============ FALSE DISPUTE PENALTY ============ */

    function penalizeFalseDispute(address user) external onlyJudge {
        if (xp[user] >= int256(XP_FALSE_DISPUTE)) {
            xp[user] -= int256(XP_FALSE_DISPUTE);
        } else {
            xp[user] = 0;
        }
        _maybeUpdateBadge(user);
    }

    /* ============ BADGE LOGIC (XP FLOOR 0) ============ */

    function _maybeUpdateBadge(address user) internal {
        int256 userXp = xp[user];

        if (userXp < 0) {
            userXp = 0;
            xp[user] = 0;
        }

        Badge newBadge;
        if (userXp >= 7500) {
            newBadge = Badge.MYTHIC;
        } else if (userXp >= 5000) {
            newBadge = Badge.LEGEND;
        } else if (userXp >= 3000) {
            newBadge = Badge.CHAMPION;
        } else if (userXp >= 2000) {
            newBadge = Badge.GLADIATOR;
        } else if (userXp >= 1000) {
            newBadge = Badge.CONTENDER;
        } else if (userXp >= 500) {
            newBadge = Badge.CHALLENGER;
        } else if (userXp > 0) {
            newBadge = Badge.ROOKIE;
        } else {
            newBadge = Badge.NONE;
        }

        if (newBadge != badge[user]) {
            badge[user] = newBadge;
            emit BadgeUpdated(user, newBadge);
        }
    }

    /* ============ SAFE PAYOUT ============ */

    function _safePayout(
        address to,
        address token,
        uint256 amount
    ) internal {
        if (amount == 0) return;
        if (token == address(0)) {
            (bool ok, ) = to.call{value: amount}("");
            require(ok, "ETH transfer failed");
        } else {
            IERC20(token).safeTransfer(to, amount);
        }
    }

    /* ============ VIEW ============ */

    function dareCount() external view returns (uint256) {
        return dares.length;
    }

    function getDare(uint256 _id)
        external
        view
        returns (
            address creator,
            address accepter,
            string memory description,
            address token,
            uint256 stake,
            uint256 createdAt,
            uint256 deadline,
            bool proofSubmitted,
            string memory proofURI,
            uint256 proofTime,
            uint256 disputeTime,
            Status status
        )
    {
        Dare storage d = dares[_id];

        return (
            d.creator,
            d.accepter,
            d.description,
            d.token,
            d.stake,
            d.createdAt,
            d.deadline,
            d.proofSubmitted,
            d.proofURI,
            d.proofTime,
            d.disputeTime,
            d.status
        );
    }

    function getUserStats(address user)
        external
        view
        returns (
            uint256 activeCountCreator,
            uint256 activeCountAccepter,
            int256 xpPoints,
            uint256 totalWins,
            uint256 totalLosses,
            uint256 totalVolume,
            uint256 totalDisputeWins
        )
    {
        return (
            activeDaresCount[user],
            activeDaresCountAccepter[user],
            xp[user],
            wins[user],
            losses[user],
            volume[user],
            disputeWins[user]
        );
    }

    function getUserBadge(address user) external view returns (Badge) {
        return badge[user];
    }

    function getUserFeeDiscountBps(address user) external view returns (uint256) {
        return _getFeeDiscountBps(user);
    }

    function getUserMaxDares(address user) external view returns (uint256) {
        return _getMaxDaresForUser(user);
    }

    function getCreateCooldown(address user) external view returns (uint256) {
        // aligned with 20 minutes gap in createDare
        uint256 nextTime = lastDareCreation[user] + 20 minutes;
        if (nextTime <= block.timestamp) {
            return 0;
        }
        return nextTime - block.timestamp;
    }

    /* ============ FALLBACK ============ */

    receive() external payable {}
    fallback() external payable {}
}
