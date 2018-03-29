pragma solidity ^0.4.18;

import './RecordCoin.sol';
import 'zeppelin-solidity/contracts/crowdsale/Crowdsale.sol';


contract RecordCoinCrowdsale is Crowdsale {

    function RecordCoinCrowdsale
    (
        uint256 _startTime, // crowdSale 시작일
        uint256 _endTime, // 종료일
        uint256 _rate, // 이더-코인 교환비. 토큰 발행량 = 이더 x rate
        address _wallet // crowdSale에 지급되는 이더를 받을 지갑
    )

    public
    Crowdsale(_rate, _wallet, _token)
    TimedCrowdsale(_openingTime, _closingTime) {

    }
}
