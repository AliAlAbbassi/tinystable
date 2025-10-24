// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

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

contract TinyVault is ERC20, Ownable, ReentrancyGuard {
    IERC20 public immutable usdc;
    IAToken public immutable aUsdc;
    IPool public immutable pool;

    uint256 public totalDeposited;

    mapping(address => uint256) public userShares;
    mapping(address => uint256) public userDeposits;

    event Deposit(address indexed user, uint256 amount, uint256 shares);
    event Withdraw(address indexed user, uint256 amount, uint256 shares);

    constructor(
        address _usdc,
        address _aUsdc,
        address _pool
    ) ERC20("TinyVault USDC", "tvUSDC") Ownable(msg.sender) {
        usdc = IERC20(_usdc);
        aUsdc = IAToken(_aUsdc);
        pool = IPool(_pool);
    }

    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");

        usdc.transferFrom(msg.sender, address(this), amount);

        usdc.approve(address(pool), amount);
        pool.supply(address(usdc), amount, address(this), 0);

        uint256 shares = convertToShares(amount);

        totalDeposited += amount;
        userShares[msg.sender] += shares;
        userDeposits[msg.sender] += amount;

        _mint(msg.sender, shares);

        emit Deposit(msg.sender, amount, shares);
    }

    function withdraw(uint256 shares) external nonReentrant {
        require(shares > 0, "Shares must be greater than 0");
        require(balanceOf(msg.sender) >= shares, "Insufficient shares");

        uint256 amount = convertToAssets(shares);

        uint256 withdrawn = pool.withdraw(address(usdc), amount, address(this));

        uint256 proportionalDeposit = (userDeposits[msg.sender] * shares) /
            userShares[msg.sender];
        totalDeposited -= proportionalDeposit;
        userShares[msg.sender] -= shares;
        userDeposits[msg.sender] -= proportionalDeposit;

        _burn(msg.sender, shares);

        usdc.transfer(msg.sender, withdrawn);

        emit Withdraw(msg.sender, withdrawn, shares);
    }

    function withdrawAll() external {
        uint256 shares = balanceOf(msg.sender);
        if (shares > 0) {
            this.withdraw(shares);
        }
    }

    function totalAssets() public view returns (uint256) {
        return aUsdc.balanceOf(address(this));
    }

    function convertToShares(uint256 assets) public view returns (uint256) {
        uint256 supply = totalSupply();
        if (supply == 0) {
            return assets;
        }
        return (assets * supply) / totalAssets();
    }

    function convertToAssets(uint256 shares) public view returns (uint256) {
        uint256 supply = totalSupply();
        if (supply == 0) {
            return 0;
        }
        return (shares * totalAssets()) / supply;
    }

    function getUserBalance(address user) external view returns (uint256) {
        return convertToAssets(balanceOf(user));
    }

    function getUserYield(address user) external view returns (uint256) {
        uint256 currentBalance = convertToAssets(balanceOf(user));
        uint256 deposited = userDeposits[user];
        return currentBalance > deposited ? currentBalance - deposited : 0;
    }

    function getApy() external view returns (uint256) {
        (, , uint128 currentLiquidityRate, , , , , , , , , , , , ) = pool
            .getReserveData(address(usdc));
        return uint256(currentLiquidityRate) / 1e25;
    }

    function emergencyWithdraw() external onlyOwner {
        uint256 balance = aUsdc.balanceOf(address(this));
        if (balance > 0) {
            pool.withdraw(address(usdc), type(uint256).max, address(this));
        }
    }

    function recoverERC20(address token, uint256 amount) external onlyOwner {
        require(token != address(usdc), "Cannot recover USDC");
        require(token != address(aUsdc), "Cannot recover aUSDC");
        IERC20(token).transfer(owner(), amount);
    }
}
