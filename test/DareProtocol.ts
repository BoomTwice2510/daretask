import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { network } from "hardhat";
import { parseEther, parseUnits } from "viem";

describe("DareProtocol", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();

  it("supports ETH create -> accept -> no-proof resolution", async function () {
    const [admin, creator, accepter] = await viem.getWalletClients();
    const judge = admin.account.address;
    const treasury = admin.account.address;
    const usdc = await viem.deployContract("MockUSDC");
    const feed = await viem.deployContract("MockV3Aggregator", [2000_00000000n]);
    const dare = await viem.deployContract("DareProtocol", [admin.account.address, judge, treasury, usdc.address, feed.address]);

    const stake = parseEther("0.01");
    await dare.write.createDare(["Ship it", 3600n, "0x0000000000000000000000000000000000000000", stake, false], { account: creator.account, value: stake });
    await dare.write.acceptDare([0n], { account: accepter.account, value: stake });

    const data = (await dare.read.getDare([0n])) as readonly [
      string, string, string, string, bigint, bigint, bigint, boolean, string, bigint, bigint, number,
    ];
    assert.equal(data[1].toLowerCase(), accepter.account.address.toLowerCase());
    assert.equal(data[6] > 0n, true);
    assert.equal(await publicClient.getBalance({ address: dare.address }) > 0n, true);
  });

  it("supports USDC escrow", async function () {
    const [admin, creator, accepter] = await viem.getWalletClients();
    const usdc = await viem.deployContract("MockUSDC");
    const feed = await viem.deployContract("MockV3Aggregator", [2000_00000000n]);
    const dare = await viem.deployContract("DareProtocol", [admin.account.address, admin.account.address, admin.account.address, usdc.address, feed.address]);
    const stake = parseUnits("10", 6);
    await usdc.write.mint([creator.account.address, stake], { account: admin.account });
    await usdc.write.mint([accepter.account.address, stake], { account: admin.account });
    await usdc.write.approve([dare.address, stake], { account: creator.account });
    await dare.write.createDare(["USDC dare", 3600n, usdc.address, stake, true], { account: creator.account });
    await usdc.write.approve([dare.address, stake], { account: accepter.account });
    await dare.write.acceptDare([0n], { account: accepter.account });
    const data = (await dare.read.getDare([0n])) as readonly [
      string, string, string, string, bigint, bigint, bigint, boolean, string, bigint, bigint, number,
    ];
    const meta = (await dare.read.getDareMeta([0n])) as readonly [
      boolean, bigint, bigint, bigint, string, string, string, bigint, bigint, bigint,
    ];
    assert.equal(data[3].toLowerCase(), usdc.address.toLowerCase());
    assert.equal(meta[8], 10_000000n);
  });
});
