// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IAaveIntegration {
    function supply(address asset, uint256 amount) external;
    function withdraw(address asset, uint256 amount) external returns (uint256);
    function getApy(address asset) external view returns (uint256);
    function getTotalAssets(address asset) external view returns (uint256);
    function emergencyWithdraw(address asset) external;
}