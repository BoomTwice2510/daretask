import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DareProtocolModule = buildModule("DareProtocolModule", (m) => {
  const judge = "0x019a127c6f11ac0C07864f78D9777E16B775E9eB";
  const treasury = "0x019a127c6f11ac0C07864f78D9777E16B775E9eB";

  const dareProtocol = m.contract("DareProtocol", [judge, treasury]);

  return { dareProtocol };
});

export default DareProtocolModule;
