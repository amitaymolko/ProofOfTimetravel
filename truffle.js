module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      // host: "localhost",
      host: "127.0.0.1",
      port: 7545,
      gas: 4700000,
      network_id: "*" // Match any network id
    },
    live: {
      host: "mainnet.infura.io/metamask",
      port: "80",
      gas: 4700000,
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
