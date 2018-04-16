var Migrations = artifacts.require("./Migrations.sol");

module.exports = (deployer, network, accounts) => {
    console.log(accounts);
    deployer.deploy(Migrations);
};
