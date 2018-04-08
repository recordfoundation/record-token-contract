module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

    networks: {
        development: {
            from: "77293f02b7d7c442078bee2e319ed8d75d75ad7f",
            host: "localhost",
            port: 8123,
            network_id: "*", // Match any network id
            gas: 4712388, //Gas limit used for deploys. Default is 4712388.
            gasPrice: 100000000000 //Gas price used for deploys. Default is 100000000000 (100 Shannon).
        }
    }
};
