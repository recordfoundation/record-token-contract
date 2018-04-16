var HDWalletProvider = require("truffle-hdwallet-provider");
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  // truffle.cmd compile을 하면 정상적으로 실행됨
    networks: {
        development: {
            host: "localhost",
            port: 8123,
            network_id: "*", // Match any network id
            gas: 4712388,
        },
        ropsten: {
            provider: () => {
                return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/" + infura_apikey);
            },
            network_id: "3",
            gas: 4712388,
            gasPrice: 180000000000,
        },
        live: {
            provider: new HDWalletProvider(mnemonic, "https://mainnet.infura.io/" + infura_apikey),
            network_id: "1", // Ethereum public network
            gas: 550000, //Gas limit used for deploys. Default is 4712388.
            //gasPrice: 100000000000, //Gas price used for deploys. Default is 100000000000 (100 Shannon).
            //from: "", //From address used during migrations. Defaults to the first available account provided by your Ethereum client.
        }
    }
};
