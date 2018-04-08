const RECORDICO = artifacts.require("./RECORDICO.sol");
const Web3 = require('web3');
const TruffleConfig = require('../truffle');

module.exports = function(deployer, network, accounts) {
    console.log(accounts);
    deployer.deploy(
        RECORDICO,
        accounts[0], // Company
        accounts[1], // RECORD Fund
        accounts[2], // Ecosystem Fund
        accounts[3], // Investor Fund
        accounts[4], // Advisor Fund
        accounts[5], // Bounty Fund
        accounts[6], // Manager
        accounts[7], // Controller_Address1
        accounts[7], // Controller_Address2
        accounts[7], // Controller_Address3
        accounts[8] // Oracle
    );
};