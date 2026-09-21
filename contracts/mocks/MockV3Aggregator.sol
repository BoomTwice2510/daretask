// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockV3Aggregator {
    uint8 public immutable decimals = 8;
    int256 private answer;
    uint256 private updatedAt;

    constructor(int256 initialAnswer) {
        answer = initialAnswer;
        updatedAt = block.timestamp;
    }

    function setAnswer(int256 nextAnswer) external {
        answer = nextAnswer;
        updatedAt = block.timestamp;
    }

    function latestRoundData() external view returns (uint80, int256, uint256, uint256, uint80) {
        return (1, answer, updatedAt, updatedAt, 1);
    }
}
