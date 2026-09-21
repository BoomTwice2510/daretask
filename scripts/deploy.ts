import { network } from "hardhat";

const required = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value as `0x${string}`;
};

async function main() {
  const admin = required("DARE_ADMIN_ADDRESS");
  const judge = required("DARE_JUDGE_ADDRESS");
  const treasury = required("DARE_TREASURY_ADDRESS");
  const usdc = required("DARE_USDC_ADDRESS");
  const ethUsdFeed = required("DARE_ETH_USD_FEED");

  const { viem } = await network.connect();
  const dareProtocol = await viem.deployContract("DareProtocol", [
    admin,
    judge,
    treasury,
    usdc,
    ethUsdFeed,
  ]);

  console.log("DareProtocol deployed at:", dareProtocol.address);
  console.log({ admin, judge, treasury, usdc, ethUsdFeed });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
