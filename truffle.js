module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  // truffle.cmd compile을 하면 정상적으로 실행됨
    networks: {
        development: {
            host: "localhost",
            port: 8123,
            network_id: "*", // Match any network id
            gas: 4712388
        },
        live: {
            host: "localhost",
            port: 80,
            network_id: "1", // Ethereum public network
            //gas: 4712388, //Gas limit used for deploys. Default is 4712388.
            //gasPrice: 100000000000 //Gas price used for deploys. Default is 100000000000 (100 Shannon).
            from: "77293f02b7d7c442078bee2e319ed8d75d75ad7f", //From address used during migrations. Defaults to the first available account provided by your Ethereum client.
            // provider: //Default web3 provider using host and port options: new Web3.providers.HttpProvider("http://<host>:<port>")
        }
    },
    solc: {
        optimizer: {
            enabled: true,
            runs: 200
        }
    },
};
