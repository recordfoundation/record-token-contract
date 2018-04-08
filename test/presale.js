'use strict';
const RCDToken = artifacts.require("RECORDToken.sol");
const RECORDICO = artifacts.require("RECORDICO.sol");


contract('RECORDICO', function(accounts) {
    function randomInteger(min, max) {
        var randonNumber = min - 0.5 + Math.random() * (max - min + 1)
        randonNumber = Math.round(randonNumber);
        return randonNumber;
    };
    var CompanyAddress =  accounts[0];
    var RECORDFundAddress =  accounts[1];
    var EcosystemFundAddress = accounts[2];
    var BountyFundAddress = accounts[5];
    var ManagerAddress = accounts[6];
    var ControllerAddress = accounts[7];
    var OracleAddress = accounts[8];
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
                    from: OracleAddress
                });
            })
            .then(function(tx) {
                console.log('tx', tx);
                return ContractAddress.Rate_Eth.call();
            })
            .then(function(rate) {
                console.log('rate', JSON.parse(rate), random_int);
                assert.equal(JSON.parse(rate), random_int, "Rate_Eth isn't correct");
            })
    });

    it("(PRE-SALE ROUND)shouldn't buy tokens, when investor3 sends ether to contract", function() {
        var etherAmount = web3.toWei('1', 'ether');
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.sendTransaction({
                    from: EthInvestorAddress3,
                    value: etherAmount
                });
            })
            .then(function(tx) {
                console.log(tx);
                assert(false, "shouldn't send tokens when ico isn't started");
            })
            .catch(function(e) {
                console.log(e);
            });
    });

    it("(PRE-SALE ROUND)shouldn't buy tokens for investor who paid in other cryptos", function() {
        var tokensAmount = 100;
        var tx_Hash = "someHash";
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.buyForInvestor(
                    OtherCryptoInvestorAddress,
                    tokensAmount,
                    tx_Hash,
                    {
                        from: ControllerAddress
                    });
            })
            .then(function(tx) {
                console.log(tx);
                assert(false, "shouldn't send tokens when ico isn't started");
            })
            .catch(function(e) {
                console.log(e);
            });
    });

    it("(PRE-SALE ROUND)should start Pre-Sale round", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.startPreSaleRound({
                    from: ManagerAddress
                });
            })
            .then(function(tx) {
                console.log(tx);
                assert(tx.receipt.status == 1, "Pre-Sale wasn't started");
            })
    });

    it("(PRE-SALE ROUND)should get bonus correctly", function() {
        var random_int = randomInteger(1, 10000000);
        var bonus = Math.floor(random_int * 20 / 100);
        console.log(random_int, bonus);
        return RECORDICO.deployed()
            .then(
                function(instance) {
                    ContractAddress = instance;
                    return ContractAddress.getBonus(random_int);
                })
            .then(function(result) {
                result = JSON.parse(result);
                console.log("Bonus: ", result, " : ", bonus);
                assert.equal(result, bonus, "Bonus isn't correct");
            })
    });

    it("(PRE-SALE ROUND)should set rate 700", function() {
        var random_int = 700;
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.setRate(random_int, {
                    from: OracleAddress
                });
            })
            .then(function(tx) {
                console.log(tx);
                return ContractAddress.Rate_Eth.call();
            })
            .then(function(rate) {
                console.log(rate);
                assert.equal(JSON.parse(rate), random_int, "Rate_Eth isn't correct");
            })
    });


    it("(PRE-SALE ROUND)shouldn't buy, when instment is less then 10000$", function() {
        var etherAmount = web3.toWei("1", "ether");
        return RECORDICO.deployed()
            .then(
                function(instance) {
                    ContractAddress = instance;
                    return ContractAddress.sendTransaction({
                        from: EthInvestorAddressPreSale2,
                        value: etherAmount
                    });
                })
            .then(function(){
                assert(false, "shouldn't buy, when instment is less then 10000$");
            })
            .catch(function(e) {

            })
    });





    it("(PRE-SALE ROUND)should buy, when instment is more then 10000$", function() {
        var etherAmount = web3.toWei("20", "ether");
        return RECORDICO.deployed()
            .then(
                function(instance) {
                    ContractAddress = instance;
                    return ContractAddress.sendTransaction({
                        from: EthInvestorAddressPreSale1,
                        value: etherAmount
                    });
                })
    });



    it("(PRE-SALE ROUND)shouldn't withdraw Ether when round isn't finished", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.withdrawEther({
                    from: ManagerAddress
                });
            })
            .then(function(tx) {
                assert(false, "shouldn't withdraw Ether when Round isn't finished");
            })
            .catch(function(e) {
            })
    });

    it("(PRE-SALE ROUND)shouldn't allow tokens transfer when, round isn't finished", function() {
        return RECORDICO.deployed()
            .then(function() {
                return ContractAddress.RCD.call();
            })
            .then(function(address) {
                RCD = RCDToken.at(address);
                return RCD.transfer(
                    EthInvestorAddress3,
                    100,
                    {
                        from: EthInvestorAddress1
                    }
                );
            })
            .then(function() {
                assert(false, "shouldn't allow tokens transfer");
            })
            .catch(function(e) {
            })
    });

    it("(PRE-SALE ROUND)should pause Pre-Sale round", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.pausePreSaleRound({
                    from: ManagerAddress
                });
            })
            .then(function(tx) {
                assert(tx.receipt.status == 1, "Pre-Sale wasn't paused");
            })
    });

    it("(PRE-SALE ROUND)shouldn't buy tokens, when investor sends ether to contract", function() {
        var etherAmount = web3.toWei('1', 'ether');
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.sendTransaction({
                    from: EthInvestorAddress4,
                    value: etherAmount
                });
            })
            .then(function(tx) {
                assert(false, "shouldn't send tokens when ico isn't started");
            })
            .catch(function(e) {
            });
    });

    it("(PRE-SALE ROUND)shouldn't buy tokens for investor who paid in other cryptos", function() {
        var tokensAmount = 100;
        var tx_Hash = "someHash";
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.buyForInvestor(
                    OtherCryptoInvestorAddress,
                    tokensAmount,
                    tx_Hash,
                    {
                        from: ControllerAddress
                    });
            })
            .then(function() {
                assert(false, "shouldn't send tokens when ico isn't started");
            })
            .catch(function(e) {
            });
    });


    it("(PRE-SALE ROUND)should start Pre-Sale round", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.startPreSaleRound({
                    from: ManagerAddress
                });
            })
            .then(function(tx) {
                assert(tx.receipt.status == 1, "Pre-Sale wasn't started");
            })
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
                assert(tx.receipt.status == 1, "Pre-Sale wasn't finished");
            })
    });

    it("(PRE-SALE ROUND)shouldn't buy tokens, when investor sends ether to contract", function() {
        var etherAmount = web3.toWei('1', 'ether');
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.sendTransaction({
                    from: EthInvestorAddress4,
                    value: etherAmount
                });
            })
            .then(function(tx) {
                assert(false, "shouldn't send tokens when ico isn't started");
            })
            .catch(function(e) {
            });
    });

    it("(PRE-SALE ROUND)shouldn't buy tokens for investor who paid in other cryptos", function() {
        var tokensAmount = 100;
        var tx_Hash = "someHash";
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.buyForInvestor(
                    OtherCryptoInvestorAddress,
                    tokensAmount,
                    tx_Hash,
                    {
                        from: ControllerAddress
                    });
            })
            .then(function() {
                assert(false, "shouldn't send tokens when ico isn't started");
            })
            .catch(function(e) {
            });
    });


    it("(PRE-SALE ROUND)should enable token transfers", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.unfreeze({
                    from: ManagerAddress
                });
            })
            .then(function(tx) {
                assert(tx.receipt.status == 1, "Token transfers wasn't enabled");
            })
    });


    it("(PRE-SALE ROUND)should withdraw Ether when round is finished", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.withdrawEther({
                    from: ManagerAddress
                });
            })
            .then(function() {
                balance = web3.eth.getBalance(ContractAddress.address);
                assert.equal(balance, 0, "Ether wasn't withdrawed")
            })
    });

    it("(PRE-SALE ROUND)should allow tokens transfer(transfer from EthInvestorAddress1 to EthInvestorAddress5)", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.RCD.call();
            })
            .then(function(address) {
                var RCD = RCDToken.at(address);
                return RCD.balanceOf.call(EthInvestorAddress1);
            })
            .then(function(balance) {
                console.log(JSON.parse(balance));
                return RCD.transfer(
                    EthInvestorAddress5,
                    1e+23,
                    {
                        from: EthInvestorAddressPreSale1
                    }
                );
            });
    });


    it("(PRE-SALE ROUND)should allow tokens transfer(transfer from EthInvestorAddress2 to EthInvestorAddress5)", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.RCD.call();
            })
            .then(function(address) {
                RCD = RCDToken.at(address);
                return RCD.balanceOf.call(EthInvestorAddress2);
            })
            .then(function(balance) {
                return RCD.transfer(
                    EthInvestorAddress5,
                    JSON.parse(balance),
                    {
                        from: EthInvestorAddress2
                    }
                );
            });
    });

    it("(PRE-SALE ROUND)should allow tokens transfer(transfer from EthInvestorAddress3 to EthInvestorAddress5)", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.RCD.call();
            })
            .then(function(address) {
                RCD = RCDToken.at(address);
                return RCD.balanceOf.call(EthInvestorAddress3);
            })
            .then(function(balance) {
                return RCD.transfer(
                    EthInvestorAddress5,
                    JSON.parse(balance),
                    {
                        from: EthInvestorAddress3
                    }
                );
            });
    });

    it("(PRE-SALE ROUND)should allow tokens transfer(transfer from EthInvestorAddress4 to EthInvestorAddress5)", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.RCD.call();
            })
            .then(function(address) {
                RCD = RCDToken.at(address);
                return RCD.balanceOf.call(EthInvestorAddress4);
            })
            .then(function(balance) {
                return RCD.transfer(
                    EthInvestorAddress5,
                    JSON.parse(balance),
                    {
                        from: EthInvestorAddress4
                    }
                );
            });
    });


    it("(PRE-SALE ROUND)should allow tokens transfer(transfer from OtherCryptoInvestorAddress to EthInvestorAddress5)", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.RCD.call();
            })
            .then(function(address) {
                RCD = RCDToken.at(address);
                return RCD.balanceOf.call(OtherCryptoInvestorAddress);
            })
            .then(function(balance) {
                return RCD.transfer(
                    EthInvestorAddress5,
                    JSON.parse(balance),
                    {
                        from: OtherCryptoInvestorAddress
                    }
                );
            });
    });

    it("(PRE-SALE ROUND)should disable token transfers", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.freeze({
                    from: ManagerAddress
                });
            })
            .then(function(tx) {
                assert(tx.receipt.status == 1, "Token transfers wasn't enabled");
            })
    });

    it("(PRE-SALE ROUND)shouldn't allow tokens transfer when token are frozen", function() {
        return RECORDICO.deployed()
            .then(function() {
                return ContractAddress.RCD.call();
            })
            .then(function(address) {
                RCD = RCDToken.at(address);
                return RCD.transfer(
                    EthInvestorAddress3,
                    100,
                    {
                        from: EthInvestorAddress5
                    }
                );
            })
            .then(function() {
                assert(false, "shouldn't allow tokens transfer");
            })
            .catch(function(e) {
            })
    });
});