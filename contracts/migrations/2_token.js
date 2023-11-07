const Token = artifacts.require('Token.sol');

module.exports = function (deployer) {
  deployer.deploy(Token, 'HelloToken', 'HELL0', 10000n * BigInt(1e18));
};
