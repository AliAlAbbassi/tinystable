// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./MockAToken.sol";

contract MockAavePool {
    mapping(address => address) public assetToAToken;
    mapping(address => uint128) public liquidityRates;

    bool public shouldFailSupply;
    bool public shouldFailWithdraw;
    uint256 public withdrawReturnAmount;

    event Supply(
        address indexed asset,
        uint256 amount,
        address indexed onBehalfOf,
        uint16 referralCode
    );
    event Withdraw(address indexed asset, uint256 amount, address indexed to);

    function setAssetToAToken(address asset, address aToken) external {
        assetToAToken[asset] = aToken;
    }

    function setLiquidityRate(address asset, uint128 rate) external {
        liquidityRates[asset] = rate;
    }

    function setShouldFailSupply(bool shouldFail) external {
        shouldFailSupply = shouldFail;
    }

    function setShouldFailWithdraw(bool shouldFail) external {
        shouldFailWithdraw = shouldFail;
    }

    function setWithdrawReturnAmount(uint256 amount) external {
        withdrawReturnAmount = amount;
    }

    function supply(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 referralCode
    ) external {
        require(!shouldFailSupply, "Mock supply failure");

        IERC20(asset).transferFrom(msg.sender, address(this), amount);

        address aToken = assetToAToken[asset];
        require(aToken != address(0), "aToken not set");
        MockAToken(aToken).mint(onBehalfOf, amount);

        emit Supply(asset, amount, onBehalfOf, referralCode);
    }

    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external returns (uint256) {
        require(!shouldFailWithdraw, "Mock withdraw failure");

        address aToken = assetToAToken[asset];
        require(aToken != address(0), "aToken not set");

        uint256 withdrawAmount = amount;
        if (amount == type(uint256).max) {
            withdrawAmount = MockAToken(aToken).balanceOf(msg.sender);
        }

        uint256 actualWithdrawn = withdrawReturnAmount > 0
            ? withdrawReturnAmount
            : withdrawAmount;

        MockAToken(aToken).burn(msg.sender, withdrawAmount);

        IERC20(asset).transfer(to, actualWithdrawn);

        emit Withdraw(asset, actualWithdrawn, to);

        if (withdrawReturnAmount > 0) {
            withdrawReturnAmount = 0;
        }

        return actualWithdrawn;
    }

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
        )
    {
        return (
            0, // configuration
            1e27, // liquidityIndex
            liquidityRates[asset], // currentLiquidityRate
            1e27, // variableBorrowIndex
            0, // currentVariableBorrowRate
            0, // currentStableBorrowRate
            uint40(block.timestamp), // lastUpdateTimestamp
            1, // id
            assetToAToken[asset], // aTokenAddress
            address(0), // stableDebtTokenAddress
            address(0), // variableDebtTokenAddress
            address(0), // interestRateStrategyAddress
            0, // accruedToTreasury
            0, // unbacked
            0 // isolationModeTotalDebt
        );
    }
}
