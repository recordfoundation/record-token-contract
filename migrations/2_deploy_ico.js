const RECORDICO = artifacts.require("./RECORDICO.sol");


module.exports = function(deployer, network, accounts) {
    deployer.deploy(
        RECORDICO,
        accounts[0], // Company
        accounts[1], // RECORD Fund
        accounts[2], // Ecosystem Fund
        accounts[3], // Investor Fund
        accounts[4], // Advisor Fund
        accounts[5], // Bounty Fund
        accounts[6], // Manager
    ).then(async () => {
        const instance = await RECORDICO.deployed();
        const RCDAdress = await instance.RCD.call();
        console.log('ICO Address', instance.address);
        console.log('Token Address', RCDAdress);

        console.log('latest time', web3.eth.getBlock('latest').timestamp);
        console.log('current time 1523452440'); // 180411 1:14PM GMT
        console.log('start time 1523750400');  // 2018.04.15.00:00 GMT
    });
};