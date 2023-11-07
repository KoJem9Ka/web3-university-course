// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PosterGated {
  address public tokenAddress;
  uint256 public threshold;
  address public owner;

  event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
  );

  event NewPost(address indexed user, string content, string indexed tag);

  constructor(address _tokenAddress, uint256 _threshold) {
    tokenAddress = _tokenAddress;
    threshold = _threshold;
    owner = msg.sender;
    emit OwnershipTransferred(address(0x0), owner);
  }

  modifier onlyOwner() {
    require(owner == msg.sender, "Ownable: caller is not the owner");
    _;
  }

  modifier thresholdReached() {
    IERC20 token = IERC20(tokenAddress);
    uint256 balance = token.balanceOf(msg.sender);
    require(balance >= threshold, "Not enough tokens");
    _;
  }

  function transferOwnership(address _newOwner) public onlyOwner {
    address oldOwner = owner;
    owner = _newOwner;
    emit OwnershipTransferred(oldOwner, _newOwner);
  }

  function post(string memory content, string memory tag) public thresholdReached {
    emit NewPost(msg.sender, content, tag);
  }

  function setTokenAddress(address _newTokenAddress) public onlyOwner {
    tokenAddress = _newTokenAddress;
  }

  function setThreshold(uint256 _newThreshold) public onlyOwner {
    threshold = _newThreshold;
  }
}
