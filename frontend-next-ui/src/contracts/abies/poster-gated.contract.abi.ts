export const PosterGatedContractAbi = [{
  inputs: [{
    internalType: 'address',
    name: '_tokenAddress',
    type: 'address',
  }, {
    internalType: 'uint256',
    name: '_threshold',
    type: 'uint256',
  }],
  stateMutability: 'nonpayable',
  type: 'constructor',
}, {
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
  anonymous: false,
  inputs: [{
    indexed: true,
    internalType: 'address',
    name: 'previousOwner',
    type: 'address',
  }, {
    indexed: true,
    internalType: 'address',
    name: 'newOwner',
    type: 'address',
  }],
  name: 'OwnershipTransferred',
  type: 'event',
}, {
  inputs: [],
  name: 'owner',
  outputs: [{
    internalType: 'address',
    name: '',
    type: 'address',
  }],
  stateMutability: 'view',
  type: 'function',
}, {
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
  stateMutability: 'nonpayable',
  type: 'function',
}, {
  inputs: [{
    internalType: 'uint256',
    name: '_newThreshold',
    type: 'uint256',
  }],
  name: 'setThreshold',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function',
}, {
  inputs: [{
    internalType: 'address',
    name: '_newTokenAddress',
    type: 'address',
  }],
  name: 'setTokenAddress',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function',
}, {
  inputs: [],
  name: 'threshold',
  outputs: [{
    internalType: 'uint256',
    name: '',
    type: 'uint256',
  }],
  stateMutability: 'view',
  type: 'function',
}, {
  inputs: [],
  name: 'tokenAddress',
  outputs: [{
    internalType: 'address',
    name: '',
    type: 'address',
  }],
  stateMutability: 'view',
  type: 'function',
}, {
  inputs: [{
    internalType: 'address',
    name: '_newOwner',
    type: 'address',
  }],
  name: 'transferOwnership',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function',
}] as const;
