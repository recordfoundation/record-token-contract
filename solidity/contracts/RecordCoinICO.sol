pragma solidity ^0.4.17;

import './RecordCoin.sol';
import 'zeppelin-solidity/contracts/crowdsale/Crowdsale.sol';


contract JHPCoinCrowdsale is Crowdsale {

    // startTime : crowdSale 시작일
    // endTime :  종료일
    // rate : 이더-코인 교환비. 토큰 발행량 = 이더 x rate
    // wallet : crowdSale에 지급되는 이더를 받을 지갑
    function JHPCoinCrowdsale(uint256 _startTime, uint256 _endTime, uint256 _rate, address _wallet)
    Crowdsale(_startTime, _endTime, _rate, _wallet) {
    }

    // creates the token to be sold.
    // override this method to have crowdsale of a specific MintableToken token.
    function createTokenContract() internal returns (MintableToken) {
        return new JHPCoin();
    }
}
