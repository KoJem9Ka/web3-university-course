// SPDX-License-Identifier: MIT
pragma solidity >=0.8.20 <0.9.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/utils/Context.sol";

// Нужно модифицировать контракт так, чтобы баланс аккаунта-создателя контракта был равен totalBalance, и при этом вызывалось событие Transfer с полем from равным 0.
contract Token is Context, IERC20, IERC20Metadata {
  mapping(address => uint256) private balances;
  mapping(address => mapping(address => uint256)) private allowances;
  string public name;
  string public symbol;
  uint8 public decimals = 18;
  uint256 public totalSupply;
  address public owner;

  event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
  );

  constructor(
    string memory _name,
    string memory _symbol,
    uint256 _totalSupply
  ) {
    name = _name;
    symbol = _symbol;
    totalSupply = _totalSupply;

    // Назначим баланс аккаунту-создателю контракта
    balances[_msgSender()] = _totalSupply;

    // Вызовем событие Transfer с адресом "отправителя", равным 0
    emit Transfer(address(0), _msgSender(), _totalSupply);

    owner = _msgSender();
    emit OwnershipTransferred(address(0x0), owner);
  }

  modifier onlyOwner() {
    require(owner == _msgSender(), "Ownable: caller is not the owner");
    _;
  }

  function transferOwnership(address _newOwner) public virtual onlyOwner {
    address oldOwner = owner;
    owner = _newOwner;
    emit OwnershipTransferred(oldOwner, _newOwner);
  }

  function balanceOf(address account) public view override returns (uint256) {
    return balances[account];
  }

  function transfer(
    address to,
    uint256 amount
  ) public override returns (bool) {
    address from = _msgSender();
    _transfer(from, to, amount);
    return true;
  }

  function allowance(
    address _owner,
    address _spender
  ) public view override returns (uint256) {
    return allowances[_owner][_spender];
  }

  function approve(
    address spender,
    uint256 amount
  ) public override returns (bool) {
    address from = _msgSender();
    _approve(from, spender, amount);
    return true;
  }

  function transferFrom(
    address from,
    address to,
    uint256 amount
  ) public override returns (bool) {
    address spender = _msgSender();
    _spendAllowance(from, spender, amount);
    _transfer(from, to, amount);
    return true;
  }

  function _transfer(address from, address to, uint256 amount) internal {
    require(from != address(0), "ERC20: transfer from the zero address");
    require(to != address(0), "ERC20: transfer to the zero address");
    uint256 fromBalance = balances[from];
    require(
      fromBalance >= amount,
      "ERC20: transfer amount exceeds balance"
    );
    unchecked {
      balances[from] = fromBalance - amount;
      balances[to] += amount;
    }
    emit Transfer(from, to, amount);
  }

  function _approve(
    address _owner,
    address _spender,
    uint256 _amount
  ) internal {
    require(_owner != address(0), "ERC20: approve from the zero address");
    require(_spender != address(0), "ERC20: approve to the zero address");
    allowances[_owner][_spender] = _amount;
    emit Approval(_owner, _spender, _amount);
  }

  function _spendAllowance(
    address _owner,
    address _spender,
    uint256 _amount
  ) internal {
    uint256 currentAllowance = allowance(_owner, _spender);
    if (currentAllowance != type(uint256).max) {
      require(
        currentAllowance >= _amount,
        "ERC20: insufficient allowance"
      );
      unchecked {
        _approve(_owner, _spender, currentAllowance - _amount);
      }
    }
  }

  // Добавить функцию mint(address _account, uint256 amount) . Функция должна добавлять amount к наличному totalBalance , должна вызывать событие Transfer с адреса 0 на адрес _account , должна добавлять amount к существующему балансу у _account . Функцию может вызывать только owner контракта.

  function mint(address _account, uint256 amount) public onlyOwner {
    require(_msgSender() == owner, "Only the owner can mint tokens");
    require(_account != address(0), "ERC20: mint to the zero address");

    // Увеличиваем общее количество токенов
    totalSupply += amount;
    // Увеличиваем баланс указанного аккаунта на указанное количество токенов
    balances[_account] += amount;
    // Вызываем событие Transfer с адреса 0 на указанный адрес _account
    emit Transfer(address(0), _account, amount);
  }
}
