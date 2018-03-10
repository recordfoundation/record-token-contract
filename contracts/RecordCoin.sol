pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/token/ERC20/MintableToken.sol';

contract RecordCoin is MintableToken {
    string public name = "Record Coin"; // 설명
    string public symbol = "RCD"; // 코인 심벌
    uint8 public decimals = 18; // 자리수

} // end of contract -------------------------------------------