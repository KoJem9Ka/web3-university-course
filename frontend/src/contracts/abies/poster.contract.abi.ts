export const PosterContractAbi = [{
  anonymous: false,
  inputs: [{
    indexed: true,
    internalType: 'address',
    name: 'user',
    type: 'address',
  }, {
    indexed: false,
    internalType: 'string',
    name: 'content',
    type: 'string',
  }, {
    indexed: true,
    internalType: 'string',
    name: 'tag',
    type: 'string',
  }],
  name: 'NewPost',
  type: 'event',
}, {
  constant: false,
  inputs: [{
    internalType: 'string',
    name: 'content',
    type: 'string',
  }, {
    internalType: 'string',
    name: 'tag',
    type: 'string',
  }],
  name: 'post',
  outputs: [],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function',
}] as const;
