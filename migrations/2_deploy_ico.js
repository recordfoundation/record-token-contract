const RECORDICO = artifacts.require("./RECORDICO.sol");
const RCD = artifacts.require("./RECORDToken.sol");

module.exports = function(deployer, network, accounts) {
    deployer.deploy(
        RECORDICO,
        accounts[8], // Company
        accounts[1], // RECORD Fund
        accounts[2], // Ecosystem Fund
        accounts[3], // Investor Fund
        accounts[4], // Advisor Fund
        accounts[5], // Bounty Fund
        accounts[6], // Manager
        accounts[7], // Controller_Address1
        accounts[7], // Controller_Address2
        accounts[7] // Controller_Address3
    );
};