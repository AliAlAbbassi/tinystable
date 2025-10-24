// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./base/BaseVault.sol";
import "./base/AaveIntegration.sol";

contract TinyVault is BaseVault, AaveIntegration {
    constructor(
        address _weth,
        address _aWeth,
        address _pool
    )
        BaseVault("TinyVault ETH", "tvETH")
        AaveIntegration(_weth, _aWeth, _pool)
    {}

    function deposit(uint256 amount) external override nonReentrant {
        require(amount > 0, "Amount must be greater than 0");

        asset.transferFrom(msg.sender, address(this), amount);

        _supply(amount);

        uint256 shares = convertToShares(amount);

        _processDeposit(msg.sender, amount, shares);
    }

    function withdraw(uint256 shares) external override nonReentrant {
        require(shares > 0, "Shares must be greater than 0");
        require(balanceOf(msg.sender) >= shares, "Insufficient shares");

        uint256 amount = convertToAssets(shares);

        uint256 withdrawn = _withdraw(amount);

        _processWithdraw(msg.sender, shares, withdrawn);

        asset.transfer(msg.sender, withdrawn);
    }

    function totalAssets() public view override returns (uint256) {
        return _getTotalAssets();
    }

    function getApy() external view override returns (uint256) {
        return _getApy();
    }

    function emergencyWithdraw() external onlyOwner {
        uint256 balance = aToken.balanceOf(address(this));
        if (balance > 0) {
            _withdraw(type(uint256).max);
        }
    }

    function recoverERC20(address token, uint256 amount) external onlyOwner {
        require(token != address(asset), "Cannot recover main asset");
        require(token != address(aToken), "Cannot recover aToken");
        IERC20(token).transfer(owner(), amount);
    }
}
