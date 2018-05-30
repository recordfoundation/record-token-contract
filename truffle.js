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
            /*provider: () => {
                return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/" + infura_apikey);
            },*/
            host: "localhost",
            port: 8545,
            network_id: "3",
            gas: 4700036,
            gasPrice: 100000000000,
        },
        live: { // 5000000 넣고 한번에 끝내야 한다. 시도만 해도, 가스 소모됩니다.
            provider: function() {
                return new HDWalletProvider(mnemonic, "https://mainnet.infura.io/" + infura_apikey)
            },
            network_id: 1, // Ethereum public network
            gas: 5000000, //Gas limit used for deploys. Default is 4712388.
            gasPrice: 100000000000, //Gas price used for deploys. Default is 100000000000 (100 Shannon).
            //from: "0x5b41ca530Bfc4F3D00D3f6547C20D50382c70644", //From address used during migrations. Defaults to the first available account provided by your Ethereum client.
        }
    }
};
