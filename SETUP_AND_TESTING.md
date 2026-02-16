# Dare Protocol - Setup and Testing Guide

## Quick Start

### What You Need
1. A Web3 wallet (MetaMask, Coinbase Wallet, etc.)
2. The wallet connected to **Base network**
3. A small amount of ETH on Base for gas fees (optional for browsing)

### The Problem We Fixed
Previously, the app would fail with:
```
ContractFunctionExecutionError: The contract function "dareCount" returned no data ("0x").
```

We've added:
- ✅ Better error handling and user-friendly error messages
- ✅ Diagnostic dashboard to verify setup
- ✅ Improved RPC endpoint reliability
- ✅ Detailed logging for troubleshooting

## Testing Steps

### Step 1: Test the Diagnostic Dashboard
1. Open the app in your browser
2. Click the **alert icon** (⚠️) in the header - top right
3. This opens `/debug` page which will:
   - ✓ Test RPC connection to Base
   - ✓ Check if contract is deployed at the address
   - ✓ Try to read dare count
   - ✓ Show wallet status

### Step 2: Verify All Checks Pass
The debug page should show:
- **RPC Connection**: ✓ Green (confirms Base network is accessible)
- **Contract Deployment**: ✓ Green (contract exists at `0xee485229e284E1dbECe1995256602C376A958586`)
- **Wallet Connection**: ✓ Connected to Base (if you click Connect)

### Step 3: Browse Dares
1. Go back to home page `/`
2. You should see a feed of dares (if any exist on contract)
3. Click on any dare to view details
4. Status bar shows live contract data

### Step 4: Create a Dare (Optional)
1. Click **"Create a Dare"** button
2. Fill in:
   - Dare description
   - Duration (hours)
   - Token (ETH or one of the allowed ERC20s)
   - Stake amount
3. Click Submit
4. Confirm transaction in wallet
5. New dare appears in feed

## How to Interpret Debug Results

### ✓ All Checks Pass
Great! The app is working correctly. If you don't see dares, it means:
- The contract has no dares yet (create the first one!)
- Or dares are there but filtered out

### ✗ RPC Connection Fails
- **Cause**: Network connectivity issue or RPC endpoint down
- **Fix**: 
  - Check your internet connection
  - Try a different RPC endpoint
  - Wait a few minutes and refresh

### ✗ Contract Deployment Fails
- **Cause**: Contract not deployed at that address on Base
- **Fixes**:
  1. Verify the contract address is correct: `0xee485229e284E1dbECe1995256602C376A958586`
  2. Check if contract was deployed on Base mainnet (not testnet)
  3. Ask the contract deployer if it's deployed yet

### ✗ Dare Count Fails (But Contract Exists)
- **Cause**: Contract exists but can't call `dareCount()` function
- **Possible reasons**:
  - Function doesn't exist in the deployed contract
  - ABI mismatch
  - Contract is proxy and not properly initialized
- **Fix**: Contact developers with the error message from browser console

## Key Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home / Browse | `/` | See all dares |
| Create Dare | `/create` | Create a new dare |
| Dare Detail | `/dare/[id]` | View and interact with specific dare |
| Profile | `/profile/[address]` | View user stats and badges |
| Leaderboard | `/leaderboard` | See top players |
| Debug | `/debug` | Diagnose connection issues |

## Contract Information

- **Network**: Base (Chain ID: 8453)
- **Address**: `0xee485229e284E1dbECe1995256602C376A958586`
- **RPC Endpoint**: `https://base.llamarpc.com`
- **View on Explorer**: https://basescan.org/address/0xee485229e284E1dbECe1995256602C376A958586

## Common Issues & Solutions

### "Wallet not connected"
- Click the **Connect** button in header
- Approve the connection request in your wallet
- Ensure wallet is on Base network

### "Please switch to Base network"
- Open your wallet
- Look for network selector dropdown
- Select "Base" or "Base Mainnet"
- Refresh the app

### Dares not loading
- Go to `/debug` and check status
- If RPC fails, try refreshing page
- Check browser console for error messages (look for `[v0]` prefix)

### Can't create dares
- Ensure you have ETH in your Base wallet (for gas)
- Check that you're not hitting the active dare limit for your tier
- Verify token contract is in the allowed list

## Troubleshooting With Logs

The app logs debugging information to the browser console. To view:
1. Press `F12` (or right-click → Inspect)
2. Go to **Console** tab
3. Look for messages starting with `[v0]`

These logs will show:
- Contract calls being made
- Data being received
- Any errors encountered

## Questions or Issues?

1. Check the `/debug` page first - it diagnoses 90% of issues
2. Look at browser console logs (F12 → Console)
3. Review `FIX_SUMMARY.md` for technical details
4. Contact the Dare Protocol team with:
   - Screenshot of debug page
   - Browser console logs
   - Your wallet address
   - Which action you were trying to do
