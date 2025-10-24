// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IAaveIntegration.sol";
import "../libraries/AaveLib.sol";

abstract contract AaveIntegration is Ownable, IAaveIntegration {
    using AaveLib for *;

    IPool public immutable pool;
    IERC20 public immutable asset;
    IAToken public immutable aToken;

    constructor(address _asset, address _aToken, address _pool) {
        asset = IERC20(_asset);
        aToken = IAToken(_aToken);
        pool = IPool(_pool);
    }

    function supply(address _asset, uint256 amount) external virtual override {
        require(_asset == address(asset), "Invalid asset");
        _supply(amount);
    }

    function withdraw(
        address _asset,
        uint256 amount
    ) external virtual override returns (uint256) {
        require(_asset == address(asset), "Invalid asset");
        return _withdraw(amount);
    }

    function getApy(
        address _asset
    ) external view virtual override returns (uint256) {
        require(_asset == address(asset), "Invalid asset");
        return AaveLib.getApy(pool, _asset);
    }

    function getTotalAssets(
        address _asset
    ) external view virtual override returns (uint256) {
        require(_asset == address(asset), "Invalid asset");
        return aToken.balanceOf(address(this));
    }

    function emergencyWithdraw(
        address _asset
    ) external virtual override onlyOwner {
        require(_asset == address(asset), "Invalid asset");
        uint256 balance = aToken.balanceOf(address(this));
        if (balance > 0) {
            AaveLib.emergencyWithdraw(pool, _asset, address(this));
        }
    }

    function _supply(uint256 amount) internal {
        AaveLib.supply(pool, asset, amount, address(this));
    }

    function _withdraw(uint256 amount) internal returns (uint256) {
        return AaveLib.withdraw(pool, address(asset), amount, address(this));
    }

    function _getTotalAssets() internal view returns (uint256) {
        return aToken.balanceOf(address(this));
    }

    function _getApy() internal view returns (uint256) {
        return AaveLib.getApy(pool, address(asset));
    }
}
