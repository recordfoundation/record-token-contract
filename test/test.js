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
    var AppicsFundAddress =  accounts[1];
    var EcosystemFundAddress = accounts[2];
    var SteemitFundAddress = accounts[3];
    var BountyFundAddress = accounts[4];
    var ManagerAddress = accounts[6];
    var ControllerAddress = accounts[7];
    var OracleAddress = accounts[8];
    var EthInvestorAddress1 = accounts[9];
    var EthInvestorAddress2 = accounts[11];
    var EthInvestorAddress3 = accounts[12];
    var EthInvestorAddress4 = accounts[13];
    var EthInvestorAddress5 = accounts[14];
    var EthInvestorAddressPreSale = accounts[15];
    var EthInvestorAddressPreSale1 = accounts[16];
    var OtherCryptoInvestorAddress = accounts[10];
    var ContractAddress;
    var XAP;
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
                return ContractAddress.Rate_Eth.call();
            })
            .then(function(rate) {
                assert.equal(JSON.parse(rate), random_int, "Rate_Eth isn't correct");
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

    it("(PRE-SALE ROUND)should get bonus correctly", function() {
        var random_int = randomInteger(1, 10000000);
        var bonus = Math.floor(random_int * 20 / 100);
        return RECORDICO.deployed()
            .then(
                function(instance) {
                    ContractAddress = instance;
                    return ContractAddress.getBonus(random_int);
                })
            .then(function(result) {
                result = JSON.parse(result);
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
                return ContractAddress.Rate_Eth.call();
            })
            .then(function(rate) {
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
                        from: EthInvestorAddressPreSale1,
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
                        from: EthInvestorAddressPreSale,
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
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.transfer(
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
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                var XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress1);
            })
            .then(function(balance) {
                console.log(JSON.parse(balance));
                return XAP.transfer(
                    EthInvestorAddress5,
                    1e+23,
                    {
                        from: EthInvestorAddressPreSale
                    }
                );
            });
    });


    it("(PRE-SALE ROUND)should allow tokens transfer(transfer from EthInvestorAddress2 to EthInvestorAddress5)", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress2);
            })
            .then(function(balance) {
                return XAP.transfer(
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
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress3);
            })
            .then(function(balance) {
                return XAP.transfer(
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
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress4);
            })
            .then(function(balance) {
                return XAP.transfer(
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
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(OtherCryptoInvestorAddress);
            })
            .then(function(balance) {
                return XAP.transfer(
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
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.transfer(
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

    /*
    ===================================================================================================
    ROUND A TESTING
    ===================================================================================================
     */



    it("(ROUND A)should set rate correctly", function() {
        var random_int = randomInteger(1, 1000);
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.setRate(random_int, {
                    from: OracleAddress
                });
            })
            .then(function(tx) {
                return ContractAddress.Rate_Eth.call();
            })
            .then(function(rate) {
                assert.equal(JSON.parse(rate), random_int, "Rate_Eth isn't correct");
            })
    });

    it("(ROUND A)shouldn't buy tokens, when investor sends ether to contract", function() {
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

    it("(ROUND A)shouldn't buy tokens for investor who paid in other cryptos", function() {
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

    it("(ROUND A)should start  round A", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.startRoundA({
                    from: ManagerAddress
                });
            })
            .then(function(tx) {
                assert(tx.receipt.status == 1, "Pre-Sale wasn't started");
            })
    });

    it("(ROUND A)should get bonus correctly", function() {
        var random_int = randomInteger(1, 10000000);
        var bonus = Math.floor(random_int * 15 / 100);
        return RECORDICO.deployed()
            .then(
                function(instance) {
                    ContractAddress = instance;
                    return ContractAddress.getBonus(random_int);
                })
            .then(function(result) {
                result = JSON.parse(result);
                assert.equal(result, bonus, "Bonus isn't correct");
            })
    });

    it("(ROUND A)should set rate 1 to checking correctly of rounding", function() {
        var random_int = 1;
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.setRate(random_int, {
                    from: OracleAddress
                });
            })
            .then(function(tx) {
                return ContractAddress.Rate_Eth.call();
            })
            .then(function(rate) {
                assert.equal(JSON.parse(rate), random_int, "Rate_Eth isn't correct");
            })
    });

    it("(ROUND A)should round tokens amount correctly, when remainder is 0", function() {
        var etherAmount = 30;
        var withOutBonus = Math.floor(etherAmount* 20 / 3);
        var correctBalance = withOutBonus + Math.floor(withOutBonus * 15 / 100);
        return RECORDICO.deployed()
            .then(
                function(instance) {
                    ContractAddress = instance;
                    return ContractAddress.sendTransaction({
                        from: EthInvestorAddress1,
                        value: etherAmount
                    });
                })
            .then(function() {
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress1);
            })
            .then(function(balance) {
                var balance = JSON.parse(balance);
                assert.equal(balance , correctBalance, "Tokens amount rounding isn't correct");
            })
    });

    it("(ROUND A)should round tokens amount correctly, when remainder is 1", function() {
        var etherAmount = 31;
        var withOutBonus = Math.floor(etherAmount * 20 / 3);
        var correctBalance = withOutBonus + Math.floor(withOutBonus * 15 / 100);
        return RECORDICO.deployed()
            .then(
                function(instance) {
                    ContractAddress = instance;
                    return ContractAddress.sendTransaction({
                        from: EthInvestorAddress2,
                        value: etherAmount
                    });
                })
            .then(function() {
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress2);
            })
            .then(function(balance) {
                var balance = JSON.parse(balance);
                assert.equal(balance , correctBalance, "Tokens amount rounding isn't correct");
            })
    });

    it("(ROUND A)should round tokens amount correctly, when remainder is 2", function() {
        var etherAmount = 32;
        var withOutBonus = Math.floor(etherAmount * 20 / 3);
        var correctBalance = withOutBonus + Math.floor(withOutBonus * 15 / 100);
        return RECORDICO.deployed()
            .then(
                function(instance) {
                    ContractAddress = instance;
                    return ContractAddress.sendTransaction({
                        from: EthInvestorAddress3,
                        value: etherAmount
                    });
                })
            .then(function() {
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress3);
            })
            .then(function(balance) {
                var balance = JSON.parse(balance);
                assert.equal(balance , correctBalance, "Tokens amount rounding isn't correct");
            })
    });

    it("(ROUND A)shouldn't withdraw Ether when round isn't finished", function() {
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

    it("(ROUND A)shouldn't allow tokens transfer when, round isn't finished", function() {
        return RECORDICO.deployed()
            .then(function() {
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.transfer(
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

    it("(ROUND A)should pause round A", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.pauseRoundA({
                    from: ManagerAddress
                });
            })
            .then(function(tx) {
                assert(tx.receipt.status == 1, "Pre-Sale wasn't paused");
            })
    });

    it("(ROUND A)shouldn't buy tokens, when investor sends ether to contract", function() {
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

    it("(ROUND A)shouldn't buy tokens for investor who paid in other cryptos", function() {
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


    it("(ROUND A)should start  round A", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.startRoundA({
                    from: ManagerAddress
                });
            })
            .then(function(tx) {
                assert(tx.receipt.status == 1, "Pre-Sale wasn't started");
            })
    });

    it("(ROUND A)should buy tokens, when investor sends ether to contract", function() {
        var etherAmount = randomInteger(1, 1000);
        var withOutBonus = Math.floor(etherAmount * 20 / 3);
        var correctBalance = withOutBonus + Math.floor(withOutBonus * 15 / 100);
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.sendTransaction({
                    from: EthInvestorAddress4,
                    value: etherAmount
                });
            })
            .then(function() {
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress4);
            })
            .then(function(balance) {
                var balance = JSON.parse(balance);
                assert.equal(balance , correctBalance, "balance isn't correct");
            })
    });

    it("(ROUND A)should buy tokens for investor who paid in other cryptos", function() {
        var tokensAmount = randomInteger(1, 1000);
        var correctBalance = tokensAmount + Math.floor(tokensAmount * 15 / 100);
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
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(OtherCryptoInvestorAddress);
            })
            .then(function(balance) {
                var balance = JSON.parse(balance);
                assert.equal(balance , correctBalance, "balance isn't correct");
            })
    });

    it("(ROUND A)should finish  round A", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.finishRoundA({
                    from: ManagerAddress
                });
            })
            .then(function(tx) {
                assert(tx.receipt.status == 1, "Pre-Sale wasn't finished");
            })
    });

    it("(ROUND A)shouldn't buy tokens, when investor sends ether to contract", function() {
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

    it("(ROUND A)shouldn't buy tokens for investor who paid in other cryptos", function() {
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


    it("(ROUND A)should enable token transfers", function() {
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

    it("(ROUND A)should withdraw Ether when round is finished", function() {
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


    it("(ROUND A)should allow tokens transfer(transfer from EthInvestorAddress1 to EthInvestorAddress5)", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                var XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress1);
            })
            .then(function(balance) {
                return XAP.transfer(
                    EthInvestorAddress5,
                    JSON.parse(balance),
                    {
                        from: EthInvestorAddress1
                    }
                );
            });
    });


    it("(ROUND A)should allow tokens transfer(transfer from EthInvestorAddress2 to EthInvestorAddress5)", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress2);
            })
            .then(function(balance) {
                return XAP.transfer(
                    EthInvestorAddress5,
                    JSON.parse(balance),
                    {
                        from: EthInvestorAddress2
                    }
                );
            });
    });

    it("(ROUND A)should allow tokens transfer(transfer from EthInvestorAddress3 to EthInvestorAddress5)", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress3);
            })
            .then(function(balance) {
                return XAP.transfer(
                    EthInvestorAddress5,
                    JSON.parse(balance),
                    {
                        from: EthInvestorAddress3
                    }
                );
            });
    });

    it("(ROUND A)should allow tokens transfer(transfer from EthInvestorAddress4 to EthInvestorAddress5)", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress4);
            })
            .then(function(balance) {
                return XAP.transfer(
                    EthInvestorAddress5,
                    JSON.parse(balance),
                    {
                        from: EthInvestorAddress4
                    }
                );
            });
    });

    it("(ROUND A)should allow tokens transfer(transfer from OtherCryptoInvestorAddress to EthInvestorAddress5)", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(OtherCryptoInvestorAddress);
            })
            .then(function(balance) {
                return XAP.transfer(
                    EthInvestorAddress5,
                    JSON.parse(balance),
                    {
                        from: OtherCryptoInvestorAddress
                    }
                );
            });
    });

    it("(ROUND A)should disable token transfers", function() {
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

    it("(ROUND A)shouldn't allow tokens transfer when token are frozen", function() {
        return RECORDICO.deployed()
            .then(function() {
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.transfer(
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


    /*
    ===================================================================================================
    ROUND B TESTING
    ===================================================================================================
     */





    it("(ROUND B)should set rate correctly", function() {
        var random_int = randomInteger(1, 1000);
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.setRate(random_int, {
                    from: OracleAddress
                });
            })
            .then(function(tx) {
                return ContractAddress.Rate_Eth.call();
            })
            .then(function(rate) {
                assert.equal(JSON.parse(rate), random_int, "Rate_Eth isn't correct");
            })
    });

    it("(ROUND B)shouldn't buy tokens, when investor sends ether to contract", function() {
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

    it("(ROUND B)shouldn't buy tokens for investor who paid in other cryptos", function() {
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

    it("(ROUND B)should start  round B", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.startRoundB({
                    from: ManagerAddress
                });
            })
            .then(function(tx) {
                assert(tx.receipt.status == 1, "Round B wasn't started");
            })
    });

    it("(ROUND B)should get bonus correctly", function() {
        var random_int = randomInteger(1, 10000000);
        var bonus = Math.floor(random_int * 10 / 100);
        return RECORDICO.deployed()
            .then(
                function(instance) {
                    ContractAddress = instance;
                    return ContractAddress.getBonus(random_int);
                })
            .then(function(result) {
                result = JSON.parse(result);
                assert.equal(result, bonus, "Bonus isn't correct");
            })
    });

    it("(ROUND B)should set rate 1 to checking correctly of rounding", function() {
        var random_int = 1;
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.setRate(random_int, {
                    from: OracleAddress
                });
            })
            .then(function(tx) {
                return ContractAddress.Rate_Eth.call();
            })
            .then(function(rate) {
                assert.equal(JSON.parse(rate), random_int, "Rate_Eth isn't correct");
            })
    });

    it("(ROUND B)should round tokens amount correctly, when remainder is 0", function() {
        var etherAmount = 30;
        var withOutBonus = Math.floor(etherAmount* 20 / 3);
        var correctBalance = withOutBonus + Math.floor(withOutBonus * 10 / 100);
        return RECORDICO.deployed()
            .then(
                function(instance) {
                    ContractAddress = instance;
                    return ContractAddress.sendTransaction({
                        from: EthInvestorAddress1,
                        value: etherAmount
                    });
                })
            .then(function() {
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress1);
            })
            .then(function(balance) {
                var balance = JSON.parse(balance);
                assert.equal(balance , correctBalance, "Tokens amount rounding isn't correct");
            })
    });

    it("(ROUND B)should round tokens amount correctly, when remainder is 1", function() {
        var etherAmount = 31;
        var withOutBonus = Math.floor(etherAmount * 20 / 3);
        var correctBalance = withOutBonus + Math.floor(withOutBonus * 10 / 100);
        return RECORDICO.deployed()
            .then(
                function(instance) {
                    ContractAddress = instance;
                    return ContractAddress.sendTransaction({
                        from: EthInvestorAddress2,
                        value: etherAmount
                    });
                })
            .then(function() {
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress2);
            })
            .then(function(balance) {
                var balance = JSON.parse(balance);
                assert.equal(balance , correctBalance, "Tokens amount rounding isn't correct");
            })
    });

    it("(ROUND B)should round tokens amount correctly, when remainder is 2", function() {
        var etherAmount = 32;
        var withOutBonus = Math.floor(etherAmount * 20 / 3);
        var correctBalance = withOutBonus + Math.floor(withOutBonus * 10 / 100);
        return RECORDICO.deployed()
            .then(
                function(instance) {
                    ContractAddress = instance;
                    return ContractAddress.sendTransaction({
                        from: EthInvestorAddress3,
                        value: etherAmount
                    });
                })
            .then(function() {
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress3);
            })
            .then(function(balance) {
                var balance = JSON.parse(balance);
                assert.equal(balance , correctBalance, "Tokens amount rounding isn't correct");
            })
    });

    it("(ROUND B)shouldn't withdraw Ether when round isn't finished", function() {
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

    it("(ROUND B)shouldn't allow tokens transfer when, round isn't finished", function() {
        return RECORDICO.deployed()
            .then(function() {
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.transfer(
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

    it("(ROUND B)should pause round B", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.pauseRoundB({
                    from: ManagerAddress
                });
            })
            .then(function(tx) {
                assert(tx.receipt.status == 1, "Round B wasn't paused");
            })
    });

    it("(ROUND B)shouldn't buy tokens, when investor sends ether to contract", function() {
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

    it("(ROUND B)shouldn't buy tokens for investor who paid in other cryptos", function() {
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


    it("(ROUND B)should start  round B", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.startRoundB({
                    from: ManagerAddress
                });
            })
            .then(function(tx) {
                assert(tx.receipt.status == 1, "Round B wasn't started");
            })
    });

    it("(ROUND B)should buy tokens, when investor sends ether to contract", function() {
        var etherAmount = randomInteger(1, 1000);
        var withOutBonus = Math.floor(etherAmount * 20 / 3);
        var correctBalance = withOutBonus + Math.floor(withOutBonus * 10 / 100);
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.sendTransaction({
                    from: EthInvestorAddress4,
                    value: etherAmount
                });
            })
            .then(function() {
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress4);
            })
            .then(function(balance) {
                var balance = JSON.parse(balance);
                assert.equal(balance , correctBalance, "balance isn't correct");
            })
    });

    it("(ROUND B)should buy tokens for investor who paid in other cryptos", function() {
        var tokensAmount = randomInteger(1, 1000);
        var correctBalance = tokensAmount + Math.floor(tokensAmount * 10 / 100);
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
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(OtherCryptoInvestorAddress);
            })
            .then(function(balance) {
                var balance = JSON.parse(balance);
                assert.equal(balance , correctBalance, "balance isn't correct");
            })
    });

    it("(ROUND B)should finish  round B", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.finishRoundB({
                    from: ManagerAddress
                });
            })
            .then(function(tx) {
                assert(tx.receipt.status == 1, "Round B wasn't finished");
            })
    });

    it("(ROUND B)shouldn't buy tokens, when investor sends ether to contract", function() {
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

    it("(ROUND B)shouldn't buy tokens for investor who paid in other cryptos", function() {
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


    it("(ROUND B)should enable token transfers", function() {
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

    it("(ROUND B)should withdraw Ether when round is finished", function() {
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


    it("(ROUND B)should allow tokens transfer(transfer from EthInvestorAddress1 to EthInvestorAddress5)", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                var XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress1);
            })
            .then(function(balance) {
                return XAP.transfer(
                    EthInvestorAddress5,
                    JSON.parse(balance),
                    {
                        from: EthInvestorAddress1
                    }
                );
            });
    });


    it("(ROUND B)should allow tokens transfer(transfer from EthInvestorAddress2 to EthInvestorAddress5)", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress2);
            })
            .then(function(balance) {
                return XAP.transfer(
                    EthInvestorAddress5,
                    JSON.parse(balance),
                    {
                        from: EthInvestorAddress2
                    }
                );
            });
    });

    it("(ROUND B)should allow tokens transfer(transfer from EthInvestorAddress3 to EthInvestorAddress5)", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress3);
            })
            .then(function(balance) {
                return XAP.transfer(
                    EthInvestorAddress5,
                    JSON.parse(balance),
                    {
                        from: EthInvestorAddress3
                    }
                );
            });
    });

    it("(ROUND B)should allow tokens transfer(transfer from EthInvestorAddress4 to EthInvestorAddress5)", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress4);
            })
            .then(function(balance) {
                return XAP.transfer(
                    EthInvestorAddress5,
                    JSON.parse(balance),
                    {
                        from: EthInvestorAddress4
                    }
                );
            });
    });

    it("(ROUND B)should allow tokens transfer(transfer from OtherCryptoInvestorAddress to EthInvestorAddress5)", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(OtherCryptoInvestorAddress);
            })
            .then(function(balance) {
                return XAP.transfer(
                    EthInvestorAddress5,
                    JSON.parse(balance),
                    {
                        from: OtherCryptoInvestorAddress
                    }
                );
            });
    });

    it("(ROUND B)should disable token transfers", function() {
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

    it("(ROUND B)shouldn't allow tokens transfer when token are frozen", function() {
        return RECORDICO.deployed()
            .then(function() {
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.transfer(
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


    /*
    ===================================================================================================
    ROUND C TESTING
    ===================================================================================================
     */





    it("(ROUND B)should set rate correctly", function() {
        var random_int = randomInteger(1, 1000);
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.setRate(random_int, {
                    from: OracleAddress
                });
            })
            .then(function(tx) {
                return ContractAddress.Rate_Eth.call();
            })
            .then(function(rate) {
                assert.equal(JSON.parse(rate), random_int, "Rate_Eth isn't correct");
            })
    });

    it("(ROUND C)shouldn't buy tokens, when investor sends ether to contract", function() {
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

    it("(ROUND C)shouldn't buy tokens for investor who paid in other cryptos", function() {
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

    it("(ROUND C)should start  round C", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.startRoundC({
                    from: ManagerAddress
                });
            })
            .then(function(tx) {
                assert(tx.receipt.status == 1, "Round C wasn't started");
            })
    });

    it("(ROUND C)should get bonus correctly", function() {
        var random_int = randomInteger(1, 10000000);
        var bonus = Math.floor(random_int * 5 / 100);
        return RECORDICO.deployed()
            .then(
                function(instance) {
                    ContractAddress = instance;
                    return ContractAddress.getBonus(random_int);
                })
            .then(function(result) {
                result = JSON.parse(result);
                assert.equal(result, bonus, "Bonus isn't correct");
            })
    });

    it("(ROUND C)should set rate 1 to checking correctly of rounding", function() {
        var random_int = 1;
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.setRate(random_int, {
                    from: OracleAddress
                });
            })
            .then(function(tx) {
                return ContractAddress.Rate_Eth.call();
            })
            .then(function(rate) {
                assert.equal(JSON.parse(rate), random_int, "Rate_Eth isn't correct");
            })
    });

    it("(ROUND C)should round tokens amount correctly, when remainder is 0", function() {
        var etherAmount = 30;
        var withOutBonus = Math.floor(etherAmount* 20 / 3);
        var correctBalance = withOutBonus + Math.floor(withOutBonus * 5 / 100);
        return RECORDICO.deployed()
            .then(
                function(instance) {
                    ContractAddress = instance;
                    return ContractAddress.sendTransaction({
                        from: EthInvestorAddress1,
                        value: etherAmount
                    });
                })
            .then(function() {
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress1);
            })
            .then(function(balance) {
                var balance = JSON.parse(balance);
                assert.equal(balance , correctBalance, "Tokens amount rounding isn't correct");
            })
    });

    it("(ROUND C)should round tokens amount correctly, when remainder is 1", function() {
        var etherAmount = 31;
        var withOutBonus = Math.floor(etherAmount * 20 / 3);
        var correctBalance = withOutBonus + Math.floor(withOutBonus * 5 / 100);
        return RECORDICO.deployed()
            .then(
                function(instance) {
                    ContractAddress = instance;
                    return ContractAddress.sendTransaction({
                        from: EthInvestorAddress2,
                        value: etherAmount
                    });
                })
            .then(function() {
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress2);
            })
            .then(function(balance) {
                var balance = JSON.parse(balance);
                assert.equal(balance , correctBalance, "Tokens amount rounding isn't correct");
            })
    });

    it("(ROUND C)should round tokens amount correctly, when remainder is 2", function() {
        var etherAmount = 32;
        var withOutBonus = Math.floor(etherAmount * 20 / 3);
        var correctBalance = withOutBonus + Math.floor(withOutBonus * 5 / 100);
        return RECORDICO.deployed()
            .then(
                function(instance) {
                    ContractAddress = instance;
                    return ContractAddress.sendTransaction({
                        from: EthInvestorAddress3,
                        value: etherAmount
                    });
                })
            .then(function() {
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress3);
            })
            .then(function(balance) {
                var balance = JSON.parse(balance);
                assert.equal(balance , correctBalance, "Tokens amount rounding isn't correct");
            })
    });

    it("(ROUND C)shouldn't withdraw Ether when round isn't finished", function() {
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

    it("(ROUND C)shouldn't allow tokens transfer when, round isn't finished", function() {
        return RECORDICO.deployed()
            .then(function() {
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.transfer(
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

    it("(ROUND C)should pause round C", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.pauseRoundC({
                    from: ManagerAddress
                });
            })
            .then(function(tx) {
                assert(tx.receipt.status == 1, "Round C wasn't paused");
            })
    });

    it("(ROUND C)shouldn't buy tokens, when investor sends ether to contract", function() {
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

    it("(ROUND C)shouldn't buy tokens for investor who paid in other cryptos", function() {
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


    it("(ROUND C)should start  round C", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.startRoundC({
                    from: ManagerAddress
                });
            })
            .then(function(tx) {
                assert(tx.receipt.status == 1, "Round C wasn't started");
            })
    });

    it("(ROUND C)should buy tokens, when investor sends ether to contract", function() {
        var etherAmount = randomInteger(1, 1000);
        var withOutBonus = Math.floor(etherAmount * 20 / 3);
        var correctBalance = withOutBonus + Math.floor(withOutBonus * 5 / 100);
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.sendTransaction({
                    from: EthInvestorAddress4,
                    value: etherAmount
                });
            })
            .then(function() {
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress4);
            })
            .then(function(balance) {
                var balance = JSON.parse(balance);
                assert.equal(balance , correctBalance, "balance isn't correct");
            })
    });

    it("(ROUND C)should buy tokens for investor who paid in other cryptos", function() {
        var tokensAmount = randomInteger(1, 1000);
        var correctBalance = tokensAmount + Math.floor(tokensAmount * 5 / 100);
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
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(OtherCryptoInvestorAddress);
            })
            .then(function(balance) {
                var balance = JSON.parse(balance);
                assert.equal(balance , correctBalance, "balance isn't correct");
            })
    });

    it("(ROUND C)should finish  round C", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.finishRoundC({
                    from: ManagerAddress
                });
            })
            .then(function(tx) {
                assert(tx.receipt.status == 1, "Round B wasn't finished");
            })
    });

    it("(ROUND C)shouldn't buy tokens, when investor sends ether to contract", function() {
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

    it("(ROUND C)shouldn't buy tokens for investor who paid in other cryptos", function() {
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


    it("(ROUND C)should enable token transfers", function() {
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

    it("(ROUND C)should withdraw Ether when round is finished", function() {
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


    it("(ROUND C)should allow tokens transfer(transfer from EthInvestorAddress1 to EthInvestorAddress5)", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                var XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress1);
            })
            .then(function(balance) {
                return XAP.transfer(
                    EthInvestorAddress5,
                    JSON.parse(balance),
                    {
                        from: EthInvestorAddress1
                    }
                );
            });
    });


    it("(ROUND C)should allow tokens transfer(transfer from EthInvestorAddress2 to EthInvestorAddress5)", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress2);
            })
            .then(function(balance) {
                return XAP.transfer(
                    EthInvestorAddress5,
                    JSON.parse(balance),
                    {
                        from: EthInvestorAddress2
                    }
                );
            });
    });

    it("(ROUND C)should allow tokens transfer(transfer from EthInvestorAddress3 to EthInvestorAddress5)", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress3);
            })
            .then(function(balance) {
                return XAP.transfer(
                    EthInvestorAddress5,
                    JSON.parse(balance),
                    {
                        from: EthInvestorAddress3
                    }
                );
            });
    });

    it("(ROUND C)should allow tokens transfer(transfer from EthInvestorAddress4 to EthInvestorAddress5)", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress4);
            })
            .then(function(balance) {
                return XAP.transfer(
                    EthInvestorAddress5,
                    JSON.parse(balance),
                    {
                        from: EthInvestorAddress4
                    }
                );
            });
    });

    it("(ROUND C)should allow tokens transfer(transfer from OtherCryptoInvestorAddress to EthInvestorAddress5)", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(OtherCryptoInvestorAddress);
            })
            .then(function(balance) {
                return XAP.transfer(
                    EthInvestorAddress5,
                    JSON.parse(balance),
                    {
                        from: OtherCryptoInvestorAddress
                    }
                );
            });
    });

    it("(ROUND C)should disable token transfers", function() {
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

    it("(ROUND C)shouldn't allow tokens transfer when token are frozen", function() {
        return RECORDICO.deployed()
            .then(function() {
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.transfer(
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



    /*
    ===================================================================================================
    ROUND D TESTING
    ===================================================================================================
     */





    it("(ROUND D)should set rate correctly", function() {
        var random_int = randomInteger(1, 1000);
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.setRate(random_int, {
                    from: OracleAddress
                });
            })
            .then(function(tx) {
                return ContractAddress.Rate_Eth.call();
            })
            .then(function(rate) {
                assert.equal(JSON.parse(rate), random_int, "Rate_Eth isn't correct");
            })
    });

    it("(ROUND D)shouldn't buy tokens, when investor sends ether to contract", function() {
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

    it("(ROUND D)shouldn't buy tokens for investor who paid in other cryptos", function() {
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

    it("(ROUND D)should start  round D", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.startRoundD({
                    from: ManagerAddress
                });
            })
            .then(function(tx) {
                assert(tx.receipt.status == 1, "Round D wasn't started");
            })
    });

    it("(ROUND D)should get bonus correctly", function() {
        var random_int = randomInteger(1, 10000000);
        var bonus = Math.floor(random_int * 0 / 100);
        return RECORDICO.deployed()
            .then(
                function(instance) {
                    ContractAddress = instance;
                    return ContractAddress.getBonus(random_int);
                })
            .then(function(result) {
                result = JSON.parse(result);
                assert.equal(result, bonus, "Bonus isn't correct");
            })
    });

    it("(ROUND D)should set rate 1 to checking correctly of rounding", function() {
        var random_int = 1;
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.setRate(random_int, {
                    from: OracleAddress
                });
            })
            .then(function(tx) {
                return ContractAddress.Rate_Eth.call();
            })
            .then(function(rate) {
                assert.equal(JSON.parse(rate), random_int, "Rate_Eth isn't correct");
            })
    });

    it("(ROUND D)should round tokens amount correctly, when remainder is 0", function() {
        var etherAmount = 30;
        var withOutBonus = Math.floor(etherAmount* 20 / 3);
        var correctBalance = withOutBonus + Math.floor(withOutBonus * 0 / 100);
        return RECORDICO.deployed()
            .then(
                function(instance) {
                    ContractAddress = instance;
                    return ContractAddress.sendTransaction({
                        from: EthInvestorAddress1,
                        value: etherAmount
                    });
                })
            .then(function() {
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress1);
            })
            .then(function(balance) {
                var balance = JSON.parse(balance);
                assert.equal(balance , correctBalance, "Tokens amount rounding isn't correct");
            })
    });

    it("(ROUND D)should round tokens amount correctly, when remainder is 1", function() {
        var etherAmount = 31;
        var withOutBonus = Math.floor(etherAmount * 20 / 3);
        var correctBalance = withOutBonus + Math.floor(withOutBonus * 0 / 100);
        return RECORDICO.deployed()
            .then(
                function(instance) {
                    ContractAddress = instance;
                    return ContractAddress.sendTransaction({
                        from: EthInvestorAddress2,
                        value: etherAmount
                    });
                })
            .then(function() {
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress2);
            })
            .then(function(balance) {
                var balance = JSON.parse(balance);
                assert.equal(balance , correctBalance, "Tokens amount rounding isn't correct");
            })
    });

    it("(ROUND D)should round tokens amount correctly, when remainder is 2", function() {
        var etherAmount = 32;
        var withOutBonus = Math.floor(etherAmount * 20 / 3);
        var correctBalance = withOutBonus + Math.floor(withOutBonus * 0 / 100);
        return RECORDICO.deployed()
            .then(
                function(instance) {
                    ContractAddress = instance;
                    return ContractAddress.sendTransaction({
                        from: EthInvestorAddress3,
                        value: etherAmount
                    });
                })
            .then(function() {
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress3);
            })
            .then(function(balance) {
                var balance = JSON.parse(balance);
                assert.equal(balance , correctBalance, "Tokens amount rounding isn't correct");
            })
    });

    it("(ROUND D)shouldn't withdraw Ether when round isn't finished", function() {
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

    it("(ROUND D)shouldn't allow tokens transfer when, round isn't finished", function() {
        return RECORDICO.deployed()
            .then(function() {
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.transfer(
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

    it("(ROUND D)should pause round D", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.pauseRoundD({
                    from: ManagerAddress
                });
            })
            .then(function(tx) {
                assert(tx.receipt.status == 1, "Round C wasn't paused");
            })
    });

    it("(ROUND D)shouldn't buy tokens, when investor sends ether to contract", function() {
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

    it("(ROUND D)shouldn't buy tokens for investor who paid in other cryptos", function() {
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


    it("(ROUND D)should start  round D", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.startRoundD({
                    from: ManagerAddress
                });
            })
            .then(function(tx) {
                assert(tx.receipt.status == 1, "Round D wasn't started");
            })
    });

    it("(ROUND D)should buy tokens, when investor sends ether to contract", function() {
        var etherAmount = randomInteger(1, 1000);
        //var etherAmount = web3.toWei("1", "ether");
        var withOutBonus = Math.floor(etherAmount * 20 / 3);
        var correctBalance = withOutBonus + Math.floor(withOutBonus * 0 / 100);
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.sendTransaction({
                    from: EthInvestorAddress4,
                    value: etherAmount
                });
            })
            .then(function() {
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress4);
            })
            .then(function(balance) {
                var balance = JSON.parse(balance);
                assert.equal(balance , correctBalance, "balance isn't correct");
            })
    });

    it("(ROUND D)should buy tokens for investor who paid in other cryptos", function() {
        var tokensAmount = randomInteger(1, 1000);
        var correctBalance = tokensAmount + Math.floor(tokensAmount * 0 / 100);
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
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(OtherCryptoInvestorAddress);
            })
            .then(function(balance) {
                var balance = JSON.parse(balance);
                assert.equal(balance , correctBalance, "balance isn't correct");
            })
    });

    it("(ROUND D)should finish  round D", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.finishRoundD({
                    from: ManagerAddress
                });
            })
            .then(function(tx) {
                assert(tx.receipt.status == 1, "Round B wasn't finished");
            })
    });

    it("(ROUND D)shouldn't buy tokens, when investor sends ether to contract", function() {
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

    it("(ROUND D)shouldn't buy tokens for investor who paid in other cryptos", function() {
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


    it("(ROUND D)should enable token transfers", function() {
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




    it("(ROUND D)should withdraw Ether when round is finished", function() {
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




    it("(ROUND D)should allow tokens transfer(transfer from EthInvestorAddress1 to EthInvestorAddress5)", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                var XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress1);
            })
            .then(function(balance) {
                return XAP.transfer(
                    EthInvestorAddress5,
                    JSON.parse(balance),
                    {
                        from: EthInvestorAddress1
                    }
                );
            });
    });


    it("(ROUND D)should allow tokens transfer(transfer from EthInvestorAddress2 to EthInvestorAddress5)", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress2);
            })
            .then(function(balance) {
                return XAP.transfer(
                    EthInvestorAddress5,
                    JSON.parse(balance),
                    {
                        from: EthInvestorAddress2
                    }
                );
            });
    });

    it("(ROUND D)should allow tokens transfer(transfer from EthInvestorAddress3 to EthInvestorAddress5)", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress3);
            })
            .then(function(balance) {
                return XAP.transfer(
                    EthInvestorAddress5,
                    JSON.parse(balance),
                    {
                        from: EthInvestorAddress3
                    }
                );
            });
    });

    it("(ROUND D)should allow tokens transfer(transfer from EthInvestorAddress4 to EthInvestorAddress5)", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(EthInvestorAddress4);
            })
            .then(function(balance) {
                return XAP.transfer(
                    EthInvestorAddress5,
                    JSON.parse(balance),
                    {
                        from: EthInvestorAddress4
                    }
                );
            });
    });

    it("(ROUND D)should allow tokens transfer(transfer from OtherCryptoInvestorAddress to EthInvestorAddress5)", function() {
        return RECORDICO.deployed()
            .then(function(instance) {
                ContractAddress = instance;
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.balanceOf.call(OtherCryptoInvestorAddress);
            })
            .then(function(balance) {
                return XAP.transfer(
                    EthInvestorAddress5,
                    JSON.parse(balance),
                    {
                        from: OtherCryptoInvestorAddress
                    }
                );
            });
    });

    it("(ROUND D)should disable token transfers", function() {
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

    it("(ROUND D)shouldn't allow tokens transfer when token are frozen", function() {
        return RECORDICO.deployed()
            .then(function() {
                return ContractAddress.XAP.call();
            })
            .then(function(address) {
                XAP = RCDToken.at(address);
                return XAP.transfer(
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