// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library ShareMath {
    uint256 private constant PRECISION = 1e18;

    function convertToShares(
        uint256 assets,
        uint256 totalSupply,
        uint256 totalAssets
    ) internal pure returns (uint256) {
        if (totalSupply == 0) {
            return assets;
        }
        return (assets * totalSupply) / totalAssets;
    }

    function convertToAssets(
        uint256 shares,
        uint256 totalSupply,
        uint256 totalAssets
    ) internal pure returns (uint256) {
        if (totalSupply == 0) {
            return 0;
        }
        return (shares * totalAssets) / totalSupply;
    }

    function calculateProportionalAmount(
        uint256 totalAmount,
        uint256 userShares,
        uint256 totalShares
    ) internal pure returns (uint256) {
        if (totalShares == 0) {
            return 0;
        }
        return (totalAmount * userShares) / totalShares;
    }

    function calculateYield(
        uint256 currentBalance,
        uint256 originalDeposit
    ) internal pure returns (uint256) {
        return
            currentBalance > originalDeposit
                ? currentBalance - originalDeposit
                : 0;
    }
}
