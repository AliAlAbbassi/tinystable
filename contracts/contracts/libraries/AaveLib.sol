// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IPool {
    function supply(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 referralCode
    ) external;

    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external returns (uint256);

    function getReserveData(
        address asset
    )
        external
        view
        returns (
            uint256 configuration,
            uint128 liquidityIndex,
            uint128 currentLiquidityRate,
            uint128 variableBorrowIndex,
            uint128 currentVariableBorrowRate,
            uint128 currentStableBorrowRate,
            uint40 lastUpdateTimestamp,
            uint16 id,
            address aTokenAddress,
            address stableDebtTokenAddress,
            address variableDebtTokenAddress,
            address interestRateStrategyAddress,
            uint128 accruedToTreasury,
            uint128 unbacked,
            uint128 isolationModeTotalDebt
        );
}

interface IAToken is IERC20 {
    function UNDERLYING_ASSET_ADDRESS() external view returns (address);
}

library AaveLib {
    function supply(
        IPool pool,
        IERC20 token,
        uint256 amount,
        address recipient
    ) internal {
        token.approve(address(pool), amount);
        pool.supply(address(token), amount, recipient, 0);
    }

    function withdraw(
        IPool pool,
        address asset,
        uint256 amount,
        address recipient
    ) internal returns (uint256) {
        return pool.withdraw(asset, amount, recipient);
    }

    function emergencyWithdraw(
        IPool pool,
        address asset,
        address recipient
    ) internal returns (uint256) {
        return pool.withdraw(asset, type(uint256).max, recipient);
    }

    function getApy(IPool pool, address asset) internal view returns (uint256) {
        (, , uint128 currentLiquidityRate, , , , , , , , , , , , ) = pool
            .getReserveData(asset);
        return uint256(currentLiquidityRate) / 1e25;
    }

    function getTotalAssets(IAToken aToken) internal view returns (uint256) {
        return aToken.balanceOf(address(this));
    }
}
