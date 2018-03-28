const HDWalletProvider = require("truffle-hdwallet-provider-privkey");
require('dotenv').config()

const INFRA_ID = process.env.INFRA_ID
const PRIVATE_KEY = process.env.PRIVATE_KEY
const FROM_ADDRESS = process.env.FROM_ADDRESS

module.exports = {
  migrations_directory: "./migrations",
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  networks: {
    development: {
      // host: "localhost",
      host: "127.0.0.1",
      port: 7545,
      gas: 4700000,
      network_id: "*" // Match any network id
    },
    live: {
      provider: () => {
        return new HDWalletProvider(PRIVATE_KEY, `https://mainnet.infura.io/${INFRA_ID}`)
      },
      from: FROM_ADDRESS,
      gas: 4700000,
      gasPrice: 3000000000,
      network_id: "1"
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 500
    }
  } 
};
