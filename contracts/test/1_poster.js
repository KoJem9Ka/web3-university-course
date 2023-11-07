const Poster = artifacts.require('Poster.sol');

contract('Poster', accounts => {
  it('emit event', async () => {
    const posterInstance = await Poster.deployed();
    const eventsBefore = await posterInstance.getPastEvents('NewPost');
    assert.deepEqual(eventsBefore, []);
    const content = 'Hello, world!';
    const tag = 'hello';
    await posterInstance.post(content, tag, { from: accounts[0] });
    const eventsAfter = await posterInstance.getPastEvents('NewPost');
    assert.equal(eventsAfter.length, 1);
    const postedEvent = eventsAfter[0];
    assert.equal(postedEvent.args.user, accounts[0]);
    assert.equal(postedEvent.args.content, content);
    assert.equal(postedEvent.args.tag, web3.utils.keccak256(tag));
  });
});
