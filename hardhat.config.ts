import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import hardhatIgnitionViem from "@nomicfoundation/hardhat-ignition-viem";
import hardhatVerify from "@nomicfoundation/hardhat-verify";
import { configVariable, defineConfig } from "hardhat/config";
import "dotenv/config";

export default defineConfig({
  plugins: [hardhatToolboxViemPlugin, hardhatIgnitionViem, hardhatVerify],

  solidity: {
    profiles: {
      default: { version: "0.8.28" },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      },
    },
  },

  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    baseSepolia: {
      type: "http",
      chainType: "generic",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
  },

  verify: {
    etherscan: {
      apiKey: configVariable("BASESCAN_API_KEY"),
    },
  },
});
