const PosterGated = artifacts.require('PosterGated.sol');

module.exports = function (deployer) {
  deployer.deploy(PosterGated, '0x0000000000000000000000000000000000000000', 0);
};
