module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  // truffle.cmd compile을 하면 정상적으로 실행됨
    networks: {
        development: {
            from: "77293f02b7d7c442078bee2e319ed8d75d75ad7f",
            host: "localhost",
            port: 8123,
            network_id: "*" // Match any network id
        }
    }
};
