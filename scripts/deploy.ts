import hre from "hardhat";

async function main() {
  const judge = "0x019a127c6f11ac0C07864f78D9777E16B775E9eB";
  const treasury = "0x019a127c6f11ac0C07864f78D9777E16B775E9eB";

  // DareProtocol deploy with viem (Hardhat 3 + viem)
  const dareProtocol = await hre.viem.deployContract("DareProtocol", [
    judge,
    treasury,
  ]);

  console.log("DareProtocol deployed at:", dareProtocol.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
