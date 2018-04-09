'use strict';
const RECORDToken = artifacts.require("RECORDToken.sol");
const RECORDICO = artifacts.require("RECORDICO.sol");


contract('RECORDICO', function(accounts) {
    function randomInteger(min, max) {
        var randonNumber = min - 0.5 + Math.random() * (max - min + 1)
        randonNumber = Math.round(randonNumber);
        return randonNumber;
    };
    var CompanyAddress =  accounts[8];
    var RECORDFundAddress =  accounts[1];
    var EcosystemFundAddress = accounts[2];
    var InvestorFundAddress = accounts[3];
    var AdvisorFundAddress = accounts[4];
    var BountyFundAddress = accounts[5];
    var ManagerAddress = accounts[6];
    var ControllerAddress = accounts[7];
    var EthInvestorAddress1 = accounts[9];
    var EthInvestorAddress2 = accounts[11];
    var EthInvestorAddress3 = accounts[12];
    var EthInvestorAddressPreSale1 = accounts[13];
    var EthInvestorAddressPreSale2 = accounts[14];
    var OtherCryptoInvestorAddress = accounts[10];
    var ContractAddress;
    var RCD;
    /*
    ===================================================================================================
    PRE-SALE ROUND TESTING
    ===================================================================================================
     */
    it("(PRE-SALE ROUND)should set rate correctly", function() {
        var random_int = randomInteger(1, 1000);
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.setRate(random_int, {
                    from: ManagerAddress
                });
            })
            .then(function(tx) {
                return ContractAddress.Rate_Eth.call();
            })
            .then(function(rate) {
                console.log('rate', JSON.parse(rate), random_int);
                assert.equal(JSON.parse(rate), random_int, "Rate_Eth isn't correct");
            })
    });

    it("(PRE-SALE ROUND)should start Pre-Sale round", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                console.log("ManagerAddress: ", ManagerAddress);
                return ContractAddress.startPreSaleRound({
                    from: ManagerAddress
                });
            })
            .then(function(tx) {
                console.log("(PRE-SALE ROUND)should start Pre-Sale round");
                console.log(tx);
                //assert(tx.receipt.status == 1, "Pre-Sale wasn't started");
            })
            .catch(function(e) {
                console.warn(e);
            });
    });

    it("(PRE-SALE ROUND)should buy, when instment is more then 10000$", function() {
        var etherAmount = web3.toWei("10", "ether");
        console.log("etherAmount: ", etherAmount);
        return RECORDICO.deployed()
            .then(
                function(instance) {
                    ContractAddress = instance;
                    return ContractAddress.sendTransaction({
                        from: EthInvestorAddressPreSale1,
                        value: etherAmount
                    });
                })
            .then(function(tx) {
                console.log("(PRE-SALE ROUND)should buy, when instment is more then 10000$");
                console.log(tx);
            })
            .catch(function(e) {
                console.warn(e);
            });
    });

    it("(PRE-SALE ROUND)should finish Pre-Sale round", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.finishPreSaleRound({
                    from: ManagerAddress
                });
            })
            .then(function(tx) {
                console.log("(PRE-SALE ROUND)should finish Pre-Sale round");
                console.log(tx);
                return ContractAddress.RCD.call();
                //assert(tx.receipt.status == 1, "Pre-Sale wasn't finished");
            })
            .then(function(address) {
                console.log("RCD Address: ", RECORDToken);
                RCD = RECORDToken.at(address);
                RCD.balanceOf.call(RECORDFundAddress).then(function(balance) {
                    console.log("RCD balance for RECORDFundAddress: ", JSON.parse(balance));
                });
                RCD.balanceOf.call(InvestorFundAddress).then(function(balance) {
                    console.log("RCD balance for InvestorFundAddress: ", JSON.parse(balance));
                });
                RCD.balanceOf.call(AdvisorFundAddress).then(function(balance) {
                    console.log("RCD balance for AdvisorFundAddress: ", JSON.parse(balance));
                });
                RCD.balanceOf.call(BountyFundAddress).then(function(balance) {
                    console.log("RCD balance for BountyFundAddress: ", JSON.parse(balance));
                });
                RCD.balanceOf.call(CompanyAddress).then(function(balance) {
                    console.log("RCD balance for CompanyAddress: ", JSON.parse(balance));
                });
                RCD.balanceOf.call(EthInvestorAddressPreSale1).then(function(balance) {
                    console.log("RCD balance for EthInvestorAddressPreSale1: ", JSON.parse(balance));
                });
            })
    });
});
