const RECORDICO = artifacts.require("./RECORDICO.sol");


module.exports = function(deployer, network, accounts) {
    var currentTime = web3.eth.getBlock('latest').timestamp;
    var PreSaleStartTime = currentTime;
    var PreSaleCloseTime = currentTime + this.seconds(60) * 20;
    var IcoStartTime = currentTime + this.seconds(60) * 30;
    var IcoCloseTime = currentTime + this.seconds(60) * 60;
    /*var PreSaleStartTime = 1523750400; // 2018.04.15.00:00 GMT
    var PreSaleCloseTime = 1524441600; // 2018.04.23.00:00 GMT
    var IcoStartTime = 1525046400; // 2018.04.30.00:00 GMT
    var IcoCloseTime = 1530403200; // 2018.07.1.00:00 GMT*/
    deployer.deploy(
        RECORDICO,
        accounts[0], // Company
        accounts[1], // RECORD Fund
        accounts[2], // Ecosystem Fund
        accounts[3], // Investor Fund
        accounts[4], // Advisor Fund
        accounts[5], // Bounty Fund
        accounts[6], // Manager
        PreSaleStartTime,
        PreSaleCloseTime,
        IcoStartTime,
        IcoCloseTime
    ).then(async () => {
        const instance = await RECORDICO.deployed();
        const RCDAdress = await instance.RCD.call();
        console.log('ICO Address', instance.address);
        console.log('Token Address', RCDAdress);
    });
};