// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IVault is IERC20 {
    event Deposit(address indexed user, uint256 amount, uint256 shares);
    event Withdraw(address indexed user, uint256 amount, uint256 shares);

    function deposit(uint256 amount) external;
    function withdraw(uint256 shares) external;
    function withdrawAll() external;

    function totalAssets() external view returns (uint256);
    function convertToShares(uint256 assets) external view returns (uint256);
    function convertToAssets(uint256 shares) external view returns (uint256);

    function getUserBalance(address user) external view returns (uint256);
    function getUserYield(address user) external view returns (uint256);
    function getApy() external view returns (uint256);
}