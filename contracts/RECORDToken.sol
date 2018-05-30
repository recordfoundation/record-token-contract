pragma solidity ^0.4.21;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "zeppelin-solidity/contracts/token/ERC20/BurnableToken.sol";
import "zeppelin-solidity/contracts/lifecycle/Pausable.sol";


/**
 *   RECORD token contract
 */
contract RECORDToken is MintableToken, BurnableToken, Pausable {
    using SafeMath for uint256;
    string public name = "RECORD";
    string public symbol = "RCD";
    uint256 public decimals = 18;

    mapping (address => bool) public lockedAddresses;

    function isAddressLocked(address _adr) internal returns (bool) {
        if (lockedAddresses[_adr] == true) {
            return true;
        } else {
            return false;
        }
    }
    function lockAddress(address _adr) onlyOwner public {
        lockedAddresses[_adr] = true;
    }
    function unlockAddress(address _adr) onlyOwner public {
        delete lockedAddresses[_adr];
    }
    function mint(address _to, uint256 _amount) onlyOwner canMint public returns (bool) {
        lockAddress(_to);
        return super.mint(_to, _amount);
    }

    function transfer(address _to, uint256 _value) public whenNotPaused returns (bool) {
        require(isAddressLocked(_to) == false);
        return super.transfer(_to, _value);
    }

    function transferFrom(address _from, address _to, uint256 _value) public whenNotPaused returns (bool) {
        require(isAddressLocked(_from) == false);
        require(isAddressLocked(_to) == false);
        return super.transferFrom(_from, _to, _value);
    }

    function approve(address _spender, uint256 _value) public whenNotPaused returns (bool) {
        require(isAddressLocked(_spender) == false);
        return super.approve(_spender, _value);
    }

    function increaseApproval(address _spender, uint _addedValue) public whenNotPaused returns (bool success) {
        require(isAddressLocked(_spender) == false);
        return super.increaseApproval(_spender, _addedValue);
    }

    function decreaseApproval(address _spender, uint _subtractedValue) public whenNotPaused returns (bool success) {
        require(isAddressLocked(_spender) == false);
        return super.decreaseApproval(_spender, _subtractedValue);
    }
}