pragma solidity ^0.4.21;

import './RECORDToken.sol';
import "zeppelin-solidity/contracts/math/SafeMath.sol";

/**
*  takes funds from users and issues tokens
*/
contract RECORDICO {
    // RCD - RECORD token contract
    RECORDToken public RCD = new RECORDToken();
    using SafeMath for uint256;

    // Token price parameters
    // These parametes can be changed only by manager of contract
    uint256 public Rate_Eth = 690; // Rate USD per ETH

    // Crowdfunding parameters
    uint256 public currentInitPart = 0;
    uint256 public constant RECORDPart = 18; // 18% of TotalSupply for Record Team
    uint256 public constant EcosystemPart = 15; // 15% of TotalSupply for Ecosystem
    uint256 public constant InvestorPart = 5; // 5% of TotalSupply for Investors
    uint256 public constant AdvisorPart = 8; // 8% of TotalSupply for Advisors & Ambassadors
    uint256 public constant BountyPart = 4; // 4% of TotalSupply for Bounty
    uint256 public constant icoPart = 50; // 50% of TotalSupply for PublicICO and PrivateOffer
    uint256 public constant PreSaleHardCap = 15000000 * 1e18;
    uint256 public constant RoundAHardCap = 45000000 * 1e18;
    uint256 public constant RoundBHardCap = 45000000 * 1e18;
    uint256 public constant RoundCHardCap = 45000000 * 1e18;
    uint256 public constant totalAmountOnICO = 300000000 * 1e18;

    uint256 public PreSaleSold = 0;
    uint256 public RoundASold = 0;
    uint256 public RoundBSold = 0;
    uint256 public RoundCSold = 0;
    uint256 public EthGet = 0;
    uint256 public RcdGet = 0;

    // Output ethereum addresses
    address Company;
    address Manager; // Manager controls contract

    uint256 public PreSaleStartTime;
    uint256 public PreSaleCloseTime;
    uint256 public IcoStartTime;
    uint256 public IcoCloseTime;

    // Allows execution by the contract manager only
    modifier managerOnly {
        require(msg.sender == Manager);
        _;
    }

    /**
     *   @dev Contract constructor function
     */
    function RECORDICO(
        address _Company,
        address _Manager,
        uint256 _PreSaleStartTime,
        uint256 _PreSaleCloseTime,
        uint256 _IcoStartTime,
        uint256 _IcoCloseTime
    )
    public {
        Company = _Company;
        Manager = _Manager;
        PreSaleStartTime = _PreSaleStartTime;
        PreSaleCloseTime = _PreSaleCloseTime;
        IcoStartTime = _IcoStartTime;
        IcoCloseTime = _IcoCloseTime;
        RCD.pause(); // ICO중에는 token transfer가 되어서는 안된다.
    }

    function getMinMaxInvest() public returns(uint256, uint256) {
        uint256 _min = 0;
        uint256 _max = 0;
        uint256 stage = getStage();
        if (stage == 1) {
            _min = 5000 * 1e18;
            _max = 10000000 * 1e18;
        } else if (stage == 3 || stage == 4 || stage == 5) {
            _min = 5000 * 1e18;
            _max = 50000000 * 1e18;
        }
        return (_min, _max);
    }
    function getRcdExchange(uint256 _ethValue) public returns(uint256, bool) {
        uint256 stage = getStage();
        uint256 _rcdValue = 0;
        uint256 _usdValue = _ethValue.mul(Rate_Eth);
        uint256 _rcdValue_Numerator = _usdValue.mul(1000);
        bool exchangeSuccess = false;
        if (stage == 1 || stage == 3 || stage == 4 || stage == 5 || stage == 6) {
            if (stage == 1) {
                _rcdValue = _rcdValue_Numerator.div(80);
            } else if (stage == 3) {
                _rcdValue = _rcdValue_Numerator.div(90);
            } else if (stage == 4) {
                _rcdValue = _rcdValue_Numerator.div(95);
            } else if (stage == 5) {
                _rcdValue = _rcdValue_Numerator.div(100);
            } else {
                _rcdValue = 0;
            }
        }
        if (_rcdValue > 0) {
            exchangeSuccess = true;
        }
        return (_rcdValue, exchangeSuccess);
    }
    function getStage() public returns(uint256) {
        // 0: 프리세일 전
        // 1: 프리세일 중
        // 2: 프리세일 끝 / ICO 전
        // 3: RoundA
        // 4: RoundB
        // 5: RoundC
        // 6: Finish
        // 0. 프리세일 기간 전
        if (now < PreSaleStartTime) {
            return 0;
        }
        // 1. 프리세일 기간 중
        if (PreSaleStartTime <= now && now <= PreSaleCloseTime) {
            if (PreSaleSold < PreSaleHardCap) {
                return 1;
            } else {
                return 2;
            }
        }
        // 2. 프리세일 기간 끝
        if (PreSaleCloseTime <= now && now <= IcoStartTime) {
            return 2;
        }
        // ICO 기간 중
        if (IcoStartTime <= now && now <= IcoCloseTime) {
            // 3. RoundA
            if (RoundASold < RoundAHardCap) {
                return 3;
            }
            // 4. RoundB
            else if (RoundAHardCap <= RoundASold && RoundBSold < RoundBHardCap) {
                return 4;
            }
            // 5. RoundC
            else if (RoundBHardCap <= RoundBSold && RoundCSold < RoundCHardCap) {
                return 5;
            }
            // 6. Finish
            else {
                return 6;
            }
        }
        // 6. ICO기간 끝
        if (IcoCloseTime < now) {
            return 6;
        }
        return 10;
    }

    /**
     *   @dev Set rate of ETH and update token price
     *   @param _RateEth       current ETH rate
     */
    function setRate(uint256 _RateEth) external managerOnly {
        Rate_Eth = _RateEth;
    }
    function setIcoCloseTime(uint256 _IcoCloseTime) external managerOnly {
        IcoCloseTime = _IcoCloseTime;
    }

    function lockAddress(address _adr) managerOnly external {
        RCD.lockAddress(_adr);
    }

    function unlockAddress(address _adr) managerOnly external {
        RCD.unlockAddress(_adr);
    }

    /**
     *   @dev Enable token transfers
     */
    function unfreeze() external managerOnly {
        RCD.unpause();
    }

    /**
     *   @dev Disable token transfers
     */
    function freeze() external managerOnly {
        RCD.pause();
    }

    /**
     *   @dev Fallback function calls buyTokens() function to buy tokens
     *        when investor sends ETH to address of ICO contract
     */
    function() external payable {
        buyTokens(msg.sender, msg.value);
    }
    /**
     *   @dev Issue tokens for investors who paid in ether
     *   @param _investor     address which the tokens will be issued to
     *   @param _ethValue     number of Ether
     */
    function buyTokens(address _investor, uint256 _ethValue) internal {
        uint256 _rcdValue;
        bool _rcdExchangeSuccess;
        uint256 _min;
        uint256 _max;

        (_rcdValue, _rcdExchangeSuccess) = getRcdExchange(_ethValue);
        (_min, _max) = getMinMaxInvest();
        require (
            _rcdExchangeSuccess == true &&
            _min <= _rcdValue &&
            _rcdValue <= _max
        );
        mintICOTokens(_investor, _rcdValue, _ethValue);
    }
    function mintICOTokens(address _investor, uint256 _rcdValue, uint256 _ethValue) internal{
        uint256 stage = getStage();
        require (
            stage == 1 ||
            stage == 3 ||
            stage == 4 ||
            stage == 5
        );
        if (stage == 1) {
            require(PreSaleSold.add(_rcdValue) <= PreSaleHardCap);
            PreSaleSold = PreSaleSold.add(_rcdValue);
        }
        if (stage == 3) {
            if (RoundASold.add(_rcdValue) <= RoundAHardCap) {
                RoundASold = RoundASold.add(_rcdValue);
            } else {
                RoundBSold = RoundASold.add(_rcdValue) - RoundAHardCap;
                RoundASold = RoundAHardCap;
            }
        }
        if (stage == 4) {
            if (RoundBSold.add(_rcdValue) <= RoundBHardCap) {
                RoundBSold = RoundBSold.add(_rcdValue);
            } else {
                RoundCSold = RoundBSold.add(_rcdValue) - RoundBHardCap;
                RoundBSold = RoundBHardCap;
            }
        }
        if (stage == 5) {
            require(RoundCSold.add(_rcdValue) <= RoundCHardCap);
            RoundCSold = RoundCSold.add(_rcdValue);
        }
        RCD.mint(_investor, _rcdValue);
        RcdGet = RcdGet.add(_rcdValue);
        EthGet = EthGet.add(_ethValue);
    }

    function mintICOTokensFromExternal(address _investor, uint256 _rcdValue) external managerOnly{
        mintICOTokens(_investor, _rcdValue, 0);
    }

    /*
     *   @dev Allows Company withdraw investments when round is over
    */
    function withdrawEther() external managerOnly{
        Company.transfer(address(this).balance);
    }

    function mintInitialTokens(address _adr, uint256 rate) external managerOnly {
        require (currentInitPart.add(rate) <= 50);
        RCD.mint(_adr, rate.mul(totalAmountOnICO).div(100));
        currentInitPart = currentInitPart.add(rate);
    }

    function transferOwnership(address newOwner) external managerOnly{
        RCD.transferOwnership(newOwner);
    }
}

