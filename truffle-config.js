const path = require("path");
const HDWalletProvider = require("truffle-hdwallet-provider");
const MNEMONIC = "night cute tiger next include wave high any problem turkey retreat swamp";
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: 5777
    },
  
  ropsten: {
    provider: function() {
      return new HDWalletProvider(MNEMONIC, "https://ropsten.infura.io/v3/e6e79387b8034415b82c86f43650a635")
    },
    network_id: 3,
  }
}
};
