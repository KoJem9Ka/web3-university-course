const HDWalletProvider = require('@truffle/hdwallet-provider');
// create a file at the root of your project and name it .env -- there you can set process variables
// like the mnemomic and Infura project key below. Note: .env is ignored by git to keep your private information safe

require('dotenv').config();
const MNEMONIC = process.env.MNEMONIC;
const POLYGON_API_KEY = process.env.POLYGON_API_KEY;

module.exports = {
  /**
   * contracts_build_directory tells Truffle where to store compiled contracts
   */
  contracts_build_directory: './build/contracts',
  /**
   * contracts_directory tells Truffle where the contracts you want to compile are located
   */
  contracts_directory: './contracts',

  networks: {
    development: {
      host: '127.0.0.1',  // Localhost (default: none)
      port: 8545,         // Standard Ethereum port (default: none)
      network_id: '*',    // Any network (default: none)
    },
    polygon_mumbai: {
      provider: () => new HDWalletProvider({
        mnemonic: { phrase: MNEMONIC },
        /**
         * More providers: https://chainlist.org/chain/80001
         */
        providerOrUrl: 'https://polygon-mumbai-bor.publicnode.com',
      }),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      chainId: 80001,
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "^0.8.17"
    },
  },
  db: {
    enabled: true,
  },
  api_keys: {
    polygonscan: POLYGON_API_KEY,
  },
  plugins: ['truffle-plugin-verify'],
};
