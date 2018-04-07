pragma solidity ^0.4.21;

import './RecordCoin.sol';
import 'zeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol';
import 'zeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol';
import "zeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";

contract RecordCoinCrowdsale is MintedCrowdsale, TimedCrowdsale, CappedCrowdsale {

    function RecordCoinCrowdsale (
        uint256 _startTime, // crowdSale 시작일
        uint256 _endTime, // 종료일
        uint256 _rate, // 이더-코인 교환비. 토큰 발행량 = 이더 x rate
        address _wallet, // crowdSale에 지급되는 이더를 받을 지갑
        uint256 _cap,
        MintableToken _token // ?
    )
    public
    Crowdsale(_rate, _wallet, _token)
    CappedCrowdsale(_cap)
    TimedCrowdsale(_startTime, _endTime)
    {

    }
}
