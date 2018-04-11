pragma solidity ^0.4.21;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "zeppelin-solidity/contracts/token/ERC20/BurnableToken.sol";
import "zeppelin-solidity/contracts/token/ERC20/PausableToken.sol";


/**
 *   RECORD token contract
 */
contract RECORDToken is MintableToken, BurnableToken, PausableToken {
    using SafeMath for uint256;
    string public name = "RECORD";
    string public symbol = "RCD";
    uint256 public decimals = 18;
}