// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../interfaces/IVault.sol";
import "../libraries/ShareMath.sol";

abstract contract BaseVault is ERC20, Ownable, ReentrancyGuard, IVault {
    mapping(address => uint256) public userShares;
    mapping(address => uint256) public userDeposits;
    uint256 public totalDeposited;

    constructor(
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) Ownable(msg.sender) {}

    function convertToShares(
        uint256 assets
    ) public view virtual returns (uint256) {
        return ShareMath.convertToShares(assets, totalSupply(), totalAssets());
    }

    function convertToAssets(
        uint256 shares
    ) public view virtual returns (uint256) {
        return ShareMath.convertToAssets(shares, totalSupply(), totalAssets());
    }

    function getUserBalance(address user) external view returns (uint256) {
        return convertToAssets(balanceOf(user));
    }

    function getUserYield(address user) external view returns (uint256) {
        uint256 currentBalance = convertToAssets(balanceOf(user));
        return ShareMath.calculateYield(currentBalance, userDeposits[user]);
    }

    function withdrawAll() external {
        uint256 shares = balanceOf(msg.sender);
        if (shares > 0) {
            this.withdraw(shares);
        }
    }

    function totalAssets() public view virtual returns (uint256);

    function deposit(uint256 amount) external virtual;

    function withdraw(uint256 shares) external virtual;

    function getApy() external view virtual returns (uint256);

    function _processDeposit(
        address user,
        uint256 amount,
        uint256 shares
    ) internal {
        totalDeposited += amount;
        userShares[user] += shares;
        userDeposits[user] += amount;
        _mint(user, shares);
        emit Deposit(user, amount, shares);
    }

    function _processWithdraw(
        address user,
        uint256 shares,
        uint256 assets
    ) internal {
        uint256 proportionalDeposit = ShareMath.calculateProportionalAmount(
            userDeposits[user],
            shares,
            userShares[user]
        );

        totalDeposited -= proportionalDeposit;
        userShares[user] -= shares;
        userDeposits[user] -= proportionalDeposit;

        _burn(user, shares);
        emit Withdraw(user, assets, shares);
    }
}
