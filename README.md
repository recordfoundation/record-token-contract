# Record ICO Contract

Please see below description of [Record ICO][record] smart contract developed by [RecordFoundation].

## Overview
Record Token smart-contract is structured upon [ERC20 standard](erc20).
One of distinctive features of the smart-contract is the fact that token price is fixed and pegged to USD instead of ETH which protects investors from volatility risks of ETH currency. This technical feature is made possible by usage of Oracle that updates ETH/USD actual exchange rate in the smart contract every 30 minutes. The token price is set to $0.15 apiece.


## The Crowdsale Specification
*	Record token is ERC-20 compliant.
*   Allocation of Appics tokens goes in the following way:
  *  Record 20 %
	*  Ecosystem 20 %
	*  Steemit 5 %
	*  Bounty 5 %
	*  PublicIco 50 %


## Code

#### RecordICO Functions

**Fallback function**
```cs
function() external payable
```
Fallback function calls function buyTokens(address _investor, uint256 _xapValue) to create tokens when investor sends ETH directly to ICO smart contract address.

**setRate**
```cs
function setRate(uint256 _RateEth) external oracleOnly
```
Set ETH/USD exchange rate and update token price.

**startPreSaleRound**
```cs
function startPreSaleRound() external managerOnly
```
Set ICO status to PreSaleStarted.

**pausePreSaleRound**
```cs
function pausePreSaleRound() external managerOnly
```
Set Ico status to PreSalePaused.

**finishPreSaleRound**
```cs
function finishPreSaleRound() external managerOnly
```
Set ICO status to PreSaleFinished.

**startRoundA**
```cs
function startRoundA() external managerOnly
```
Set ICO status to RoundAStarted.

**pauseRoundA**
```cs
function pauseRoundA() external managerOnly
```
Set ICO status to RoundAPaused.

**finishRoundA**
```cs
function finishRoundA() external managerOnly
```
Finish round A and allocate tokens for AppicsFund, EcosystemFund, SteemitFund, BountyFund.

**startRoundB**
```cs
function startRoundB() external managerOnly
```
Set ICO status to RoundBStarted.

**pauseRoundB**
```cs
function pauseRoundB() external managerOnly
```
Set ICO status to RoundBPaused.

**finishRoundB**
```cs
function finishRoundB() external managerOnly
```
Finish round B and allocate tokens for AppicsFund, EcosystemFund, SteemitFund, BountyFund.

**startRoundC**
```cs
function startRoundC() external managerOnly
```
Set ICO status to RoundCStarted.

**pauseRoundC**
```cs
function pauseRoundC() external managerOnly
```
Set ICO status to RoundCPaused.

**finishRoundC**
```cs
function finishRoundC() external managerOnly
```
Finish round C and allocate tokens for AppicsFund, EcosystemFund, SteemitFund, BountyFund.

**startRoundD**
```cs
function startRoundD() external managerOnly
```
Set ICO status to RoundDStarted.

**pauseRoundD**
```cs
function pauseRoundD() external managerOnly
```
Set ICO status to RoundDPaused.

**finishRoundD**
```cs
function finishRoundD() external managerOnly
```
Finish round D and allocate tokens for AppicsFund, EcosystemFund, SteemitFund, BountyFund.

**unfreeze**
```cs
function unfreeze() external managerOnly
```
Unfreezes tokens (enable token transfers).

**freeze**
```cs
function freeze() external managerOnly
```
freezes tokens.

**buyForInvestor**
```cs
function buyForInvestor(address _investor,uint256 _xapValue,string _txHash) external controllersOnly
```
buyForInvestor function is called by one of controllers. It uses buyTokens(address _investor, uint256 _xapValue) function to allocate tokens to investors who make a deposit in non-ETH currencies.

**buyTokens**
```cs
function buyTokens(address _investor, uint256 _xapValue) internal startedOnly
```
internal function that called by buyForInvestor and fallback functions

**getBonus**
```cs
function getBonus(uint256 _value) public constant returns(uint256)
```
get current bonus

**register**
```cs
function register(string _key) public
```
allows investors to add their public key of Appics blockchain

**withdrawEther**
```cs
function withdrawEther(uint256 _value) external managerOnly
```

#### AppicsIco Events

**LogStartPreSaleRound**
```cs
event LogStartPreSaleRound();
```
**LogPausePreSaleRound**
```cs
event LogPausePreSaleRound();
```
**LogFinishPreSaleRound**
```cs
event LogFinishPreSaleRound(
      address AppicsFund,
      address EcosystemFund,
      address SteemitFund,
      address BountyFund
);
```
**LogStartRoundA**
```cs
event LogStartRoundA();
```
**LogPauseRoundA**
```cs
event LogPauseRoundA();
```
**LogFinishRoundA**
```cs
event LogFinishRoundA(
      address AppicsFund,
      address EcosystemFund,
      address SteemitFund,
      address BountyFund
);
```
**LogStartRoundB**
```cs
event LogStartRoundB();
```
**LogPauseRoundB**
```cs
event LogPauseRoundB();
```
**LogFinishRoundB**
```cs
event LogFinishRoundB(
      address AppicsFund,
      address EcosystemFund,
      address SteemitFund,
      address BountyFund
);
```
**LogStartRoundC**
```cs
event LogStartRoundC();
```
**LogPauseRoundC**
```cs
event LogPauseRoundC();
```
**LogFinishRoundC**
```cs
event LogFinishRoundC(
      address AppicsFund,
      address EcosystemFund,
      address SteemitFund,
      address BountyFund
);
```
**LogStartRoundD**
```cs
event LogStartRoundD();
```
**LogPauseRoundD**
```cs
event LogPauseRoundD();
```
**LogFinishRoundD**
```cs
event LogFinishRoundD(
      address AppicsFund,
      address EcosystemFund,
      address SteemitFund,
      address BountyFund
);
```
**LogBuyForInvestor**
```cs
event LogBuyForInvestor(address investor, uint256 aidValue, string txHash);
```
**LogRegister**
```cs
event LogRegister(address investor, string key);
```


## Prerequisites
1. nodejs, and make sure it's version above 8.0.0
2. npm
3. truffle
4. testrpc

## Run tests
1. run `testrpc -a 20 -l 8000000` in terminal
2. run `truffle test` in another terminal to execute tests.

## Structure of tests
1. check that function setRate works properly
2. try to buy tokens before starting round(test gives an error that falls to .catch)
3. start round
4. check that function getBonus works properly
5. set RateETH = 1 to check that contract rounds numbers right(1$ = 20/3 XAP)
6. buy tokens for 30, 31, 32 Wei and watch how contract rounds numbers
7. check we can't withdraw ether(round isn't finished)
8. pause round
9. check that we cannot buy tokens
10. start round again
11. check that we can buy tokens after second start
12. finish round
13. check that we cannot buy tokens
14. unfreeze tokens
15. withdraw ether
16. check that tokens aren't frozen (send from one account to another)
17. freeze tokens
18. check that tokens are frozen (try to send from one account to another)

## Deploy contract with truffle to network

1. Change parameters of constructor in migrations/2_deploy_contracts.js
2. Add network to truffle.js:
    live: {
      host: "localhost",
      port: 8545, //port where node is running
      network_id: "1" ,// Match any network id. 1- live network, 2 - ropsten, 3 - rinkeby
      gas: 7721975 //optional
    }
3. In console in ico-smartcontract-appics then run: truffle compile
4. In geth console unlock wallet which will be used for deploy
5. Then use command: truffle migrate --network live

   More information about deploy with truffle [here][truffle]
   


[record]: http://recordfoundation.org/
[recordfarm]: https://www.recordfarm.com/
[erc20]: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md
