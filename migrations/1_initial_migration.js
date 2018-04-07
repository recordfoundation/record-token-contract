const Web3 = require('web3');
const TruffleConfig = require('../truffle');
var Migrations = artifacts.require("./Migrations.sol");

module.exports = (deployer, network, addresses) => {
    const config = TruffleConfig.networks[network];
    module.exports = (deployer, network, addresses) => {
        const config = TruffleConfig.networks[network];
        const web3 = new Web3(new Web3.providers.HttpProvider('http://' + config.host + ':' + config.port));
        web3.personal.unlockAccount(config.from, process.env.ACCOUNT_PASSWORD, 36000);

        deployer.deploy(Migrations);
    };

    deployer.deploy(Migrations);
};
