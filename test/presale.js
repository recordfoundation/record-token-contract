'use strict';
const RECORDToken = artifacts.require("RECORDToken.sol");
const RECORDICO = artifacts.require("RECORDICO.sol");

contract('RECORDICO', (accounts) => {
    console.log(accounts);

    function randomInteger(min, max) {
        var randonNumber = min - 0.5 + Math.random() * (max - min + 1)
        randonNumber = Math.round(randonNumber);
        return randonNumber;
    };

    const CompanyAddress =  accounts[0];
    const RECORDFundAddress =  accounts[1];
    const EcosystemFundAddress = accounts[2];
    const InvestorFundAddress = accounts[3];
    const AdvisorFundAddress = accounts[4];
    const BountyFundAddress = accounts[5];
    const ManagerAddress = accounts[6];
    const EthInvestorAddressPreSale1 = accounts[7];
    const EthInvestorAddressPreSale2 = accounts[8];

    var ICO;
    var RCD;

    it("0. Connected...", async () => {
        ICO = await RECORDICO.deployed();
        console.log("ContractAddress: ", ICO.address);
        const RCDAddress = await ICO.RCD.call();
        RCD = RECORDToken.at(RCDAddress);
        console.log('Token Address', RCDAddress);
    });

    /*
    ===================================================================================================
    PRE-SALE ROUND TESTING
    ===================================================================================================
     */
    it("1. (PRE-SALE ROUND) should set rate correctly", async () => {
        console.log("1. (PRE-SALE ROUND) should set rate correctly");
        var random_int = randomInteger(1, 1000);
        await ICO.setRate(random_int, {
            from: ManagerAddress
        });
        assert.equal(JSON.parse(await ICO.Rate_Eth.call()), random_int, "Rate_Eth isn't correct");
    });


    it("2. (PRE-SALE ROUND)shouldn't buy tokens, when investor3 sends ether to contract", async () => {
        console.log("2. (PRE-SALE ROUND)shouldn't buy tokens, when investor3 sends ether to contract");
        var etherAmount = web3.toWei('1', 'ether');
        var tx = await ICO.sendTransaction({
            from: EthInvestorAddressPreSale1,
            value: etherAmount
        });
        assert(false, "shouldn't send tokens when ico isn't started");
    });

    it("3. (PRE-SALE ROUND)should start Pre-Sale round", async () => {
        console.log("3. (PRE-SALE ROUND)should start Pre-Sale round");
        var tx = await ICO.startPreSaleRound({
            from: ManagerAddress
        });
        console.log(tx);
        assert(tx.receipt.status == 1, "Pre-Sale wasn't started");
    });

    it("4. (PRE-SALE ROUND)should set rate 390", async () => {
        console.log("4. (PRE-SALE ROUND)should set rate 390");
        var random_int = 390;
        var tx = await ICO.setRate(random_int, {
            from: ManagerAddress
        });
        assert.equal(JSON.parse(await ICO.Rate_Eth.call()), random_int, "Rate_Eth isn't correct");
    });


    it("5. (PRE-SALE ROUND)shouldn't buy, when instment is less then 5000 RCD", async () => {
        console.log("5. (PRE-SALE ROUND)shouldn't buy, when instment is less then 5000 RCD");
        var etherAmount = web3.toWei('1', 'ether');
        var tx = await ICO.sendTransaction({
            from: EthInvestorAddressPreSale1,
            value: etherAmount
        });
        console.log(tx);
        assert(false, "shouldn't buy, when instment is less then 5000 RCD");
    });





    it("6. (PRE-SALE ROUND)shouldn't buy, when instment is more then 10000000 RCD", async () => {
        console.log("6. (PRE-SALE ROUND)shouldn't buy, when instment is more then 10000000 RCD");
        // !!!!!!!!!! 개발 필요!
        var etherAmount = web3.toWei('1', 'ether');
        var tx = await ICO.sendTransaction({
            from: EthInvestorAddressPreSale1,
            value: etherAmount
        });
        console.log(tx);
        assert(false, "shouldn't buy, when instment is more then 10000000 RCD");
    });



    it("7. (PRE-SALE ROUND)shouldn't withdraw Ether when round isn't finished", async () => {
        console.log("7. (PRE-SALE ROUND)shouldn't withdraw Ether when round isn't finished");
        var tx = await ICO.withdrawEther({
            from: ManagerAddress
        });
        console.log(tx);
        assert(false, "shouldn't withdraw Ether when Round isn't finished");
    });

    it("8. (PRE-SALE ROUND)shouldn't allow tokens transfer when, round isn't finished", async () => {
        console.log("8. (PRE-SALE ROUND)shouldn't allow tokens transfer when, round isn't finished");
        var tx = await RCD.transfer(
            EthInvestorAddressPreSale2,
            100,
            {
                from: EthInvestorAddressPreSale1
            }
        );
        console.log(tx);
        assert(false, "shouldn't allow tokens transfer");
    });

    it("9. (PRE-SALE ROUND)should pause Pre-Sale round", async () => {
        console.log("9. (PRE-SALE ROUND)should pause Pre-Sale round");
        var tx = await ICO.pausePreSaleRound({
            from: ManagerAddress
        });
        console.log(tx);
        assert(tx.receipt.status == 1, "Pre-Sale wasn't paused");
    });

    it("10. (PRE-SALE ROUND)shouldn't buy tokens, when investor sends ether to contract", async () => {
        console.log("10. (PRE-SALE ROUND)shouldn't buy tokens, when investor sends ether to contract");
        var etherAmount = web3.toWei('1', 'ether');
        var tx = await ICO.sendTransaction({
            from: EthInvestorAddressPreSale1,
            value: etherAmount
        });
        console.log(tx);
        assert(false, "shouldn't send tokens when ico isn't started");
    });


    it("11. (PRE-SALE ROUND)should start Pre-Sale round", async () => {
        console.log("11. (PRE-SALE ROUND)should start Pre-Sale round");
        var tx = await ICO.startPreSaleRound({
            from: ManagerAddress
        });
        console.log(tx);
        assert(tx.receipt.status == 1, "Pre-Sale wasn't started");
    });




    it("12. (PRE-SALE ROUND)should finish Pre-Sale round", async () => {
        console.log("12. (PRE-SALE ROUND)should finish Pre-Sale round");
        var tx = await ICO.finishPreSaleRound({
            from: ManagerAddress
        });
        console.log(tx);
        assert(tx.receipt.status == 1, "Pre-Sale wasn't finished");
    });

    it("13. (PRE-SALE ROUND)shouldn't buy tokens, when investor sends ether to contract", async () => {
        console.log("13. (PRE-SALE ROUND)shouldn't buy tokens, when investor sends ether to contract");
        var etherAmount = web3.toWei('1', 'ether');
        var tx = await ICO.sendTransaction({
            from: EthInvestorAddressPreSale1,
            value: etherAmount
        });
        console.log(tx);
        assert(false, "shouldn't send tokens when ico isn't started");
    });

    it("14. (PRE-SALE ROUND)should enable token transfers", async () => {
        console.log("14. (PRE-SALE ROUND)should enable token transfers");
        var tx = await ICO.unfreeze({
            from: ManagerAddress
        });
        console.log(tx);
        assert(tx.receipt.status == 1, "Token transfers wasn't enabled");
    });


    it("15. (PRE-SALE ROUND)should withdraw Ether when round is finished", async () => {
        console.log("15. (PRE-SALE ROUND)should withdraw Ether when round is finished");
        var tx = await ICO.withdrawEther({
            from: ManagerAddress
        });
        var balance = web3.eth.getBalance(ICO.address);
        assert.equal(balance, 0, "Ether wasn't withdrawed")
    });

    it("16. (PRE-SALE ROUND)should allow tokens transfer(transfer from EthInvestorAddress1 to EthInvestorAddress2)", async () => {
        console.log("16. (PRE-SALE ROUND)should allow tokens transfer(transfer from EthInvestorAddress1 to EthInvestorAddress2)");
        var tx = await RCD.transfer(
            EthInvestorAddressPreSale2,
            150,
            {
                from: EthInvestorAddressPreSale1
            }
        );
        console.log(tx);
    });

    it("17. (PRE-SALE ROUND)should disable token transfers", async () => {
        console.log("17. (PRE-SALE ROUND) should disable token transfers");
        var tx = await ICO.freeze({
            from: ManagerAddress
        });
        console.log(tx);
        assert(tx.receipt.status == 1, "Token transfers was freezed");
    });

    it("18. (PRE-SALE ROUND)shouldn't allow tokens transfer when token are frozen", async () => {
        console.log("18. (PRE-SALE ROUND)shouldn't allow tokens transfer when token are frozen");
        var tx = await RCD.transfer(
            EthInvestorAddressPreSale2,
            150,
            {
                from: EthInvestorAddressPreSale1
            }
        );
        console.log(tx);
        assert(false, "shouldn't allow tokens transfer when freezed");
    });

    // 19. Check RECORD token accounts
    it("19. (PRE-SALE ROUND) RCD balances", async () => {
        console.log("19. (PRE-SALE ROUND) RCD balances");
        console.log("RCD balance for RECORDFundAddress: ", JSON.parse(await RCD.balanceOf.call(RECORDFundAddress)));
        console.log("RCD balance for EcosystemFundAddress: ", JSON.parse(await RCD.balanceOf.call(EcosystemFundAddress)));
        console.log("RCD balance for InvestorFundAddress: ", JSON.parse(await RCD.balanceOf.call(InvestorFundAddress)));
        console.log("RCD balance for AdvisorFundAddress: ", JSON.parse(await RCD.balanceOf.call(AdvisorFundAddress)));
        console.log("RCD balance for BountyFundAddress: ", JSON.parse(await RCD.balanceOf.call(BountyFundAddress)));
        console.log("RCD balance for CompanyAddress: ", JSON.parse(await RCD.balanceOf.call(CompanyAddress)));
        console.log("RCD balance for EthInvestorAddressPreSale1: ", JSON.parse(await RCD.balanceOf.call(EthInvestorAddressPreSale1)));
        assert(false, "RCD balances");
    });

});
