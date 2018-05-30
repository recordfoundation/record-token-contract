const RECORDICO = artifacts.require("./RECORDICO.sol");


module.exports = function(deployer, network, accounts) {
    console.log(accounts);
    var PreSaleStartTime = 1523750400; // 2018.04.15.00:00 GMT
    var PreSaleCloseTime = 1524441600; // 2018.04.23.00:00 GMT
    var IcoStartTime = 1525046400; // 2018.04.30.00:00 GMT
    var IcoCloseTime = 1530403200; // 2018.07.1.00:00 GMT
    console.log('PreSaleStartTime', PreSaleStartTime);
    console.log('PreSaleCloseTime', PreSaleCloseTime);
    console.log('IcoStartTime', IcoStartTime);
    console.log('IcoCloseTime', IcoCloseTime);
    deployer.deploy(
        RECORDICO,
        "", // Company
        "", // Manager
        PreSaleStartTime,
        PreSaleCloseTime,
        IcoStartTime,
        IcoCloseTime
    );
};