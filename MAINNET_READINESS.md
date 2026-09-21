# Dare Protocol v1 Mainnet Readiness

This document is the release gate for the non-upgradeable v1 contract.

## Locked protocol rules

- Assets: Base ETH and Base USDC only.
- Testnet: Base Sepolia ETH and Base Sepolia USDC.
- Minimum stake: 0.0002 ETH or 0.50 USDC.
- Hard maximum: $500 per side. ETH is valued with Chainlink ETH/USD at dare creation. USDC is treated as $1.
- Acceptance window: 24 hours.
- Task duration: creator-selected, 1 hour minimum, 7 days maximum. The task clock starts when accepted.
- Proof requirement is selected by the creator at creation and cannot be changed later.
- If proof is required: 24 hours after task deadline to submit proof. No proof means creator wins automatically.
- Proof review: 24 hours. No creator response means accepter wins automatically.
- Dispute reason is mandatory.
- Evidence: public, immutable, timestamped, multiple items allowed, maximum 20 items per dispute.
- Evidence window: 24 hours.
- Judge window: 48 hours from dispute, including the evidence window.
- Judge may resolve only disputed dares and must provide a decision reason hash.
- Base fee: 3% and hard maximum fee: 5%.
- Fee changes are timelocked for 48 hours. Existing dares lock their base fee at creation.
- Judge and treasury are separate 2/3 multisigs before mainnet.
- Contract is non-upgradeable.
- Emergency pause blocks new creation/acceptance but does not block existing dare proof, dispute, resolution, or payout.
- Excess ETH/USDC rescue cannot touch outstanding liabilities or accumulated protocol fees.

## XP

Winner XP is based on the USD value of one side at creation:

| Stake value | Winner XP |
| ---: | ---: |
| $0.50 to < $1 | 10 |
| $1 to < $5 | 20 |
| $5 to < $10 | 50 |
| $10 to < $25 | 70 |
| $25 to < $100 | 100 |
| $100 to < $250 | 350 |
| $250 to $500 | 500 |

Loser XP loss is 20% of the winner award, with a floor of zero.

## Badge thresholds

- None: 0 XP
- Rookie: 1-499
- Challenger: 500-999
- Contender: 1000-1999
- Gladiator: 2000-2999
- Champion: 3000-4999
- Legend: 5000-7499
- Mythic: 7500+

## Mainnet blockers

Do not deploy until every item below is green:

1. `npm install` completes from a clean checkout.
2. `npm run typecheck` passes.
3. `npm run contract:compile` passes with the production profile.
4. `npm run contract:test` passes.
5. Fuzz/invariant tests cover escrow conservation and permission boundaries.
6. Base Sepolia deployment uses the real Sepolia USDC address and a verified ETH/USD test feed or mock feed.
7. ETH create/accept/resolve paths are exercised with multiple wallets.
8. USDC approve/create/accept/resolve paths are exercised with multiple wallets.
9. Proof-required and no-proof paths are exercised.
10. Proof timeout, creator timeout, dispute, evidence, and judge resolution are exercised.
11. Pause behavior is exercised and verified not to trap existing funds.
12. Excess rescue is exercised and verified unable to touch liabilities.
13. Judge and treasury are separate 2/3 multisigs.
14. Admin is transferred away from the deployer EOA after setup.
15. BaseScan source is verified after deployment.
16. Railway indexer/keeper/notifications are operational but protocol behavior still works if Railway is offline.
17. Webhook signatures are verified and notification state is persistent.
18. No old token addresses remain in source, generated artifacts, docs, or deployment metadata.
19. External Solidity review is completed if budget permits. If not, static analysis and adversarial testing are mandatory.
20. Contract source and constructor parameters are frozen before mainnet deployment.

## Required adversarial cases

- Reentrancy through ETH recipient.
- Reverting treasury/multisig cannot block user payout because fees are pull-based.
- Unauthorized judge/admin calls.
- Judge cannot resolve Running or ProofSubmitted dares.
- Judge cannot alter an existing dare's locked base fee.
- Stale ETH/USD feed blocks new ETH dare creation.
- ETH price changes after creation do not change the dare's locked USD valuation.
- Incorrect ETH or USDC amount reverts.
- Unsupported ERC20 reverts.
- Direct accidental ETH/USDC transfer is rescueable only as excess.
- Rescue cannot touch escrow or accumulated fees.
- Double resolution is impossible.
- Double proof submission is impossible.
- Evidence cannot be edited or deleted.
- Evidence cannot be submitted by unrelated addresses.
- Proof cannot be submitted outside its 24h window.
- Creator cannot accept their own dare.
- Acceptance cannot happen after 24h.
- Task duration cannot be below 1h or above 7d.
- Fee cannot exceed 5%.
- Fee change cannot execute before 48h timelock.

## Deployment order

1. Deploy to Base Sepolia.
2. Verify contract source.
3. Configure admin/judge/treasury.
4. Transfer admin to the protocol multisig.
5. Run adversarial test matrix.
6. Run indexer/keeper/notification failure tests.
7. Freeze the release candidate.
8. Deploy the exact same source to Base Mainnet with mainnet constructor addresses.
9. Verify BaseScan source and constructor arguments.
10. Configure frontend only after the deployed address is verified.
