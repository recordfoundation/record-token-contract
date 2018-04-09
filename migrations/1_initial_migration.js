var Migrations = artifacts.require("./Migrations.sol");

module.exports = (deployer, network, addresses) => {
    deployer.deploy(Migrations);
};
