// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./MockERC20.sol";

contract MockAToken is MockERC20 {
    address public immutable UNDERLYING_ASSET_ADDRESS;
    uint256 private _totalSupplied;

    constructor(
        string memory name,
        string memory symbol,
        address underlyingAsset
    ) MockERC20(name, symbol, 6) {
        UNDERLYING_ASSET_ADDRESS = underlyingAsset;
    }

    function setBalance(address account, uint256 amount) external {
        uint256 currentBalance = balanceOf(account);
        if (amount > currentBalance) {
            _mint(account, amount - currentBalance);
        } else if (amount < currentBalance) {
            _burn(account, currentBalance - amount);
        }
    }

    function simulateYield(address account, uint256 yieldAmount) external {
        _mint(account, yieldAmount);
    }
}