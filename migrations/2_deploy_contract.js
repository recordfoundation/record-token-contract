const RecordCoinCrowdsale = artifacts.require("./RecordCoinCrowdsale.sol");
const RecordCoin = artifacts.require('./RecordCoin.sol');

module.exports = function(deployer, network, accounts) {
    const openingTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 5; // 계약 생성 후 5초뒤에 시작!
    const closingTime = startTime + (86400 * 20); // 20 days
    const rate = new web3.BigNumber(1000); // 이더 하나에 1000개의 토큰을 보냅니다.
    const wallet = accounts[0]; // 테스트넷의 계정 0 지갑 할당. 실제 ICO면 자기 지갑을 넣어야합니다.

    return deployer
        .then(function() {
            return deployer.deploy(RecordCoin);
        })
        .then(function() {
            return deployer.deploy(
                RecordCoinCrowdsale,
                openingTime,
                closingTime,
                rate,
                wallet,
                RecordCoin.address
            );
        });
};
