const PosterGated = artifacts.require('PosterGated.sol');
const Token = artifacts.require('Token.sol');

const THRESHOLD = 10;

contract('PosterGated', (accounts) => {
  it('post ok', async () => {
    const creator = accounts[0];
    const tokenInstance = await Token.new('TestToken', 'TTKN', 100, { from: creator });
    const posterInstance = await PosterGated.new(tokenInstance.address, THRESHOLD, { from: creator });
    assert.equal(await tokenInstance.balanceOf(creator).then(BigInt), 100n);
    const eventsBefore = await posterInstance.getPastEvents('NewPost');
    assert.deepEqual(eventsBefore, []);
    const content = 'Hello, world!';
    const tag = 'hello';
    await posterInstance.post(content, tag, { from: creator });
    const eventsAfter = await posterInstance.getPastEvents('NewPost');
    assert.equal(eventsAfter.length, 1);
    const postedEvent = eventsAfter[0];
    assert.equal(postedEvent.args.user, creator);
    assert.equal(postedEvent.args.content, content);
    assert.equal(postedEvent.args.tag, web3.utils.keccak256(tag));
  });

  it('not enough tokens', async () => {
    const creator = accounts[0];
    const malicious = accounts[1];
    const tokenInstance = await Token.new('TestToken', 'TTKN', 100, { from: creator });
    const posterInstance = await PosterGated.new(tokenInstance.address, THRESHOLD, { from: creator });
    assert.equal(await tokenInstance.balanceOf(creator).then(BigInt), 100n);
    assert.equal(await tokenInstance.balanceOf(malicious).then(BigInt), 0n);
    const content = 'Hello, world!';
    const tag = 'hello';
    try {
      await posterInstance.post(content, tag, { from: malicious });
      assert.unreachable('Should throw');
    } catch (e) {
      assert.ok(e);
    }
  });

  /**
   * Creates PosterGated woth 0x0 token address, then tries to setTokenAddress and checks tokenAddress
   */
  it('method setTokenAddress', async () => {
    const creator = accounts[0];
    const tokenInstance = await Token.new('TestToken', 'TTKN', 100, { from: creator });
    const posterInstance = await PosterGated.new(tokenInstance.address, THRESHOLD, { from: creator });
    assert.equal(await posterInstance.tokenAddress(), tokenInstance.address);
    const newTokenInstance = await Token.new('TestToken', 'TTKN', 100, { from: creator });
    await posterInstance.setTokenAddress(newTokenInstance.address, { from: creator });
    assert.equal(await posterInstance.tokenAddress(), newTokenInstance.address);
  });

  it('method setThreshold', async () => {
    const creator = accounts[0];
    const tokenInstance = await Token.new('TestToken', 'TTKN', 100, { from: creator });
    const posterInstance = await PosterGated.new(tokenInstance.address, THRESHOLD, { from: creator });
    assert.equal(await posterInstance.threshold(), THRESHOLD);
    await posterInstance.setThreshold(THRESHOLD + 10, { from: creator });
    assert.equal(await posterInstance.threshold(), THRESHOLD + 10);
  });
});
