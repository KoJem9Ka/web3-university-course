const Token = artifacts.require('Token.sol');

contract('Token', accounts => {

  it('assigns balance when created', async () => {
    const totalBalance = 10000n * BigInt(1e18);
    const creator = accounts[0];
    const instance = await Token.new('HelloToken', 'HELLO', totalBalance, { from: creator });
    const creatorBalance = await instance.balanceOf.call(creator).then(BigInt);
    assert.equal(creatorBalance, totalBalance);
    const events = await instance.getPastEvents('Transfer');
    assert.equal(events.length, 1);
  });

  it('mint', async () => {
    // Mint amount
    const totalBalance = 10000n * BigInt(1e18);
    const creator = accounts[0];
    const instance = await Token.new('HelloToken', 'HELLO', totalBalance, { from: creator });
    const destination = accounts[1];
    const mintedAmount = 10n * BigInt(1e18);
    const tx = await instance.mint(destination, mintedAmount, { from: creator });
    assert.equal(tx.logs.length, 1);
    const transferEvent = tx.logs[0];
    assert.equal(transferEvent.event, 'Transfer');
    assert.equal(transferEvent.args.from, '0x0000000000000000000000000000000000000000');
    assert.equal(transferEvent.args.to, destination);
    assert.equal(BigInt(transferEvent.args.value), mintedAmount);
    // Only owner
    try {
      await instance.mint(destination, mintedAmount, { from: destination });
      assert.fail('unreachable');
    } catch (e) {
      assert.match(e.message, /Ownable: caller is not the owner/);
    }
  });

});
