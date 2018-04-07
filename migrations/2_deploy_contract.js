const RecordCoinCrowdsale = artifacts.require("./RecordCoinCrowdsale.sol");
const RecordCoin = artifacts.require('./RecordCoin.sol');

module.exports = function(deployer, network, accounts) {
    return liveDeploy(deployer, accounts);
};
function latestTime() {
    return web3.eth.getBlock('latest').timestamp;
}
async function liveDeploy(deployer, accounts) {
    const BigNumber = web3.BigNumber;
    const RATE = new BigNumber(1);  // 이더 하나에 1개의 토큰을 보냅니다.
    const startTime = latestTime() + duration.weeks(1); // 지금부터 1주일 후 시작
    const endTime = startTime + duration.weeks(1); // start한 후 1주일 뒤 끝
    console.log([startTime, endTime, RATE, accounts[0]]);
    /*uint256 _startTime, // crowdSale 시작일
        uint256 _endTime, // 종료일
        uint256 _rate, // 이더-코인 교환비. 토큰 발행량 = 이더 x rate
        address _wallet // crowdSale에 지급되는 이더를 받을 지갑*/
    deployer.deploy(RecordCoinCrowdsale, startTime, endTime, RATE, accounts[0], 2).then(async () => {
        const instance = await RecordCoinCrowdsale.deployed();
        const token = await instance.token.call();
        console.log('Token Address: ', token);
    });
}