pragma solidity ^0.4.21;

import './RECORDToken.sol';
import './library.sol';

/**
*  takes funds from users and issues tokens
*/
contract RECORDICO {
    // RCD - RECORD token contract
    RECORDToken public RCD = new RECORDToken(this);
    using SafeMath for uint256;
    mapping (address => string) public  keys;

    // Token price parameters
    // These parametes can be changed only by manager of contract
    uint256 public Rate_Eth = 392; // Rate USD per ETH

    uint256 public Tokens_Per_Dollar_Numerator = 10;// RECORD token = 0.1$ // 분자
    uint256 public Tokens_Per_Dollar_Denominator = 1;// RECORD token = 0.1$ // 분모

    // Crowdfunding parameters
    uint256 constant RECORDPart = 18; // 18% of TotalSupply for Record Team
    uint256 constant EcosystemPart = 15; // 15% of TotalSupply for Ecosystem
    uint256 constant InvestorPart = 5; // 5% of TotalSupply for Investors
    uint256 constant AdvisorPart = 8; // 8% of TotalSupply for Advisors & Ambassadors
    uint256 constant BountyPart = 4; // 4% of TotalSupply for Bounty
    uint256 constant icoPart = 50; // 50% of TotalSupply for PublicICO and PrivateOffer
    uint256 constant PreSaleHardCap = 15000000 * 1e18;
    uint256 constant RoundAHardCap = 45000000 * 1e18;
    uint256 constant RoundBHardCap = 45000000 * 1e18;
    uint256 constant RoundCHardCap = 45000000 * 1e18;
    uint256 public PreSaleSold = 0;
    uint256 public RoundASold = 0;
    uint256 public RoundBSold = 0;
    uint256 public RoundCSold = 0;
    uint256 constant PreSaleBonusRate = 20;
    uint256 constant RoundABonusRate = 10;
    uint256 constant RoundBBonusRate = 5;
    uint256 constant RoundCBonusRate = 0;
    uint256 constant TENTHOUSENDLIMIT = 66666666666666666666666;
    // Output ethereum addresses
    address public Company;
    address public RECORDFund;
    address public EcosystemFund;
    address public InvestorFund;
    address public AdvisorFund;
    address public BountyFund;
    address public Manager; // Manager controls contract
    address public Controller_Address1; // First address that is used to buy tokens for other cryptos
    address public Controller_Address2; // Second address that is used to buy tokens for other cryptos
    address public Controller_Address3; // Third address that is used to buy tokens for other cryptos
    address public Oracle; // Oracle address

    // Possible ICO statuses
    enum StatusICO {
        Created,
        PreSaleStarted,
        PreSalePaused,
        PreSaleFinished,
        RoundAStarted,
        RoundAPaused,
        RoundAFinished,
        RoundBStarted,
        RoundBPaused,
        RoundBFinished,
        RoundCStarted,
        RoundCPaused,
        RoundCFinished
    }

    StatusICO statusICO = StatusICO.Created;

    // Events Log
    event LogStartPreSaleRound();
    event LogPausePreSaleRound();
    event LogFinishPreSaleRound(
        address RECORDFund,
        address EcosystemFund,
        address InvestorFund,
        address AdvisorFund,
        address BountyFund
    );
    event LogStartRoundA();
    event LogPauseRoundA();
    event LogFinishRoundA(
        address RECORDFund,
        address EcosystemFund,
        address InvestorFund,
        address AdvisorFund,
        address BountyFund
    );
    event LogStartRoundB();
    event LogPauseRoundB();
    event LogFinishRoundB(
        address RECORDFund,
        address EcosystemFund,
        address InvestorFund,
        address AdvisorFund,
        address BountyFund
    );
    event LogStartRoundC();
    event LogPauseRoundC();
    event LogFinishRoundC(
        address RECORDFund,
        address EcosystemFund,
        address InvestorFund,
        address AdvisorFund,
        address BountyFund
    );
    event LogBuyForInvestor(address investor, uint256 aidValue, string txHash);
    event LogRegister(address investor, string key);

    // Modifiers
    // Allows execution by the oracle only
    modifier oracleOnly {
        require(msg.sender == Oracle);
        _;
    }
    // Allows execution by the contract manager only
    modifier managerOnly {
        require(msg.sender == Manager);
        _;
    }
    // Allows execution by the one of controllers only
    modifier controllersOnly {
        require(
            (msg.sender == Controller_Address1) ||
            (msg.sender == Controller_Address2) ||
            (msg.sender == Controller_Address3)
        );
        _;
    }
    // Allows execution if the any round started only
    modifier startedOnly {
        require(
            (statusICO == StatusICO.PreSaleStarted) ||
            (statusICO == StatusICO.RoundAStarted) ||
            (statusICO == StatusICO.RoundBStarted) ||
            (statusICO == StatusICO.RoundCStarted)
        );
        _;
    }
    // Allows execution if the any round finished only
    modifier finishedOnly {
        require(
            (statusICO == StatusICO.PreSaleFinished) ||
            (statusICO == StatusICO.RoundAFinished) ||
            (statusICO == StatusICO.RoundBFinished) ||
            (statusICO == StatusICO.RoundCFinished)
        );
        _;
    }


    /**
     *   @dev Contract constructor function
     */
    function RECORDICO(
        address _Company,
        address _RECORDFund,
        address _EcosystemFund,
        address _InvestorFund,
        address _AdvisorFund,
        address _BountyFund,
        address _Manager,
        address _Controller_Address1,
        address _Controller_Address2,
        address _Controller_Address3,
        address _Oracle
    )
    public {
        Company = _Company;
        RECORDFund = _RECORDFund;
        EcosystemFund = _EcosystemFund;
        InvestorFund = _InvestorFund;
        AdvisorFund = _AdvisorFund;
        BountyFund = _BountyFund;
        Manager = _Manager;
        Controller_Address1 = _Controller_Address1;
        Controller_Address2 = _Controller_Address2;
        Controller_Address3 = _Controller_Address3;
        Oracle = _Oracle;
    }

    /**
     *   @dev Set rate of ETH and update token price
     *   @param _RateEth       current ETH rate
     */
    function setRate(uint256 _RateEth) external oracleOnly {
        Rate_Eth = _RateEth;
    }

    /**
     *   @dev Start Pre-Sale
     *   Set ICO status to PreSaleStarted
     */
    function startPreSaleRound() external managerOnly {
        require(statusICO == StatusICO.Created || statusICO == StatusICO.PreSalePaused);
        statusICO = StatusICO.PreSaleStarted;
        emit LogStartPreSaleRound();
    }

    /**
     *   @dev Pause Pre-Sale
     *   Set Ico status to PreSalePaused
     */
    function pausePreSaleRound() external managerOnly {
        require(statusICO == StatusICO.PreSaleStarted);
        statusICO = StatusICO.PreSalePaused;
        emit LogPausePreSaleRound();
    }

    /**
     *   @dev Finish Pre-Sale and mint tokens for RECORDFund, EcosystemFund
     *   and BountyFund
     *   Set Ico status to PreSaleFinished
     */
    function finishPreSaleRound() external managerOnly {
        require(statusICO == StatusICO.PreSaleStarted || statusICO == StatusICO.PreSalePaused);
        uint256 totalAmount = PreSaleSold.mul(100).div(icoPart);
        RCD.mintTokens(RECORDFund, RECORDPart.mul(totalAmount).div(100));
        RCD.mintTokens(EcosystemFund, EcosystemPart.mul(totalAmount).div(100));
        RCD.mintTokens(InvestorFund, InvestorPart.mul(totalAmount).div(100));
        RCD.mintTokens(AdvisorFund, AdvisorPart.mul(totalAmount).div(100));
        RCD.mintTokens(BountyFund, BountyPart.mul(totalAmount).div(100));
        statusICO = StatusICO.PreSaleFinished;
        emit LogFinishPreSaleRound(RECORDFund, EcosystemFund, InvestorFund, AdvisorFund, BountyFund);

    }

    /**
     *   @dev Start Round A
     *   Set ICO status to RoundAStarted
     */
    function startRoundA() external managerOnly {
        require(statusICO == StatusICO.PreSaleFinished || statusICO == StatusICO.RoundAPaused);
        statusICO = StatusICO.RoundAStarted;
        emit LogStartRoundA();
    }

    /**
     *   @dev Pause Round A
     *   Set Ico status to RoundAPaused
     */
    function pauseRoundA() external managerOnly {
        require(statusICO == StatusICO.RoundAStarted);
        statusICO = StatusICO.RoundAPaused;
        emit LogPauseRoundA();
    }


    /**
     *   @dev Finish Round A and mint tokens RECORDFund, EcosystemFund, InvestorFund, AdvisorFund
     *   and BountyFund
     *   Set Ico status to RoundAFinished
     */
    function finishRoundA() external managerOnly {
        require(statusICO == StatusICO.RoundAStarted || statusICO == StatusICO.RoundAPaused);
        uint256 totalAmount = RoundASold.mul(100).div(icoPart);
        RCD.mintTokens(RECORDFund, RECORDPart.mul(totalAmount).div(100));
        RCD.mintTokens(EcosystemFund, EcosystemPart.mul(totalAmount).div(100));
        RCD.mintTokens(InvestorFund, InvestorPart.mul(totalAmount).div(100));
        RCD.mintTokens(AdvisorFund, AdvisorPart.mul(totalAmount).div(100));
        RCD.mintTokens(BountyFund, BountyPart.mul(totalAmount).div(100));
        statusICO = StatusICO.RoundAFinished;
        emit LogFinishRoundA(RECORDFund, EcosystemFund, InvestorFund, AdvisorFund, BountyFund);
    }

    /**
     *   @dev Start Round B
     *   Set ICO status to RoundBStarted
     */
    function startRoundB() external managerOnly {
        require(statusICO == StatusICO.RoundAFinished || statusICO == StatusICO.RoundBPaused);
        statusICO = StatusICO.RoundBStarted;
        emit LogStartRoundB();
    }

    /**
     *   @dev Pause Round B
     *   Set Ico status to RoundBPaused
     */
    function pauseRoundB() external managerOnly {
        require(statusICO == StatusICO.RoundBStarted);
        statusICO = StatusICO.RoundBPaused;
        emit LogPauseRoundB();
    }


    /**
     *   @dev Finish Round B and mint tokens RECORDFund, EcosystemFund, InvestorFund, AdvisorFund
     *   and BountyFund
     *   Set Ico status to RoundBFinished
     */
    function finishRoundB() external managerOnly {
        require(statusICO == StatusICO.RoundBStarted || statusICO == StatusICO.RoundBPaused);
        uint256 totalAmount = RoundBSold.mul(100).div(icoPart);
        RCD.mintTokens(RECORDFund, RECORDPart.mul(totalAmount).div(100));
        RCD.mintTokens(EcosystemFund, EcosystemPart.mul(totalAmount).div(100));
        RCD.mintTokens(InvestorFund, InvestorPart.mul(totalAmount).div(100));
        RCD.mintTokens(AdvisorFund, AdvisorPart.mul(totalAmount).div(100));
        RCD.mintTokens(BountyFund, BountyPart.mul(totalAmount).div(100));
        statusICO = StatusICO.RoundBFinished;
        emit LogFinishRoundB(RECORDFund, EcosystemFund, InvestorFund, AdvisorFund, BountyFund);
    }

    /**
     *   @dev Start Round C
     *   Set ICO status to RoundCStarted
     */
    function startRoundC() external managerOnly {
        require(statusICO == StatusICO.RoundBFinished || statusICO == StatusICO.RoundCPaused);
        statusICO = StatusICO.RoundCStarted;
        emit LogStartRoundC();
    }

    /**
     *   @dev Pause Round C
     *   Set Ico status to RoundCPaused
     */
    function pauseRoundC() external managerOnly {
        require(statusICO == StatusICO.RoundCStarted);
        statusICO = StatusICO.RoundCPaused;
        emit LogPauseRoundC();
    }


    /**
     *   @dev Finish Round C and mint tokens RECORDFund, EcosystemFund, InvestorFund, AdvisorFund
     *   and BountyFund
     *   Set Ico status to RoundCStarted
     */
    function finishRoundC() external managerOnly {
        require(statusICO == StatusICO.RoundCStarted || statusICO == StatusICO.RoundCPaused);
        uint256 totalAmount = RoundCSold.mul(100).div(icoPart);
        RCD.mintTokens(RECORDFund, RECORDPart.mul(totalAmount).div(100));
        RCD.mintTokens(EcosystemFund, EcosystemPart.mul(totalAmount).div(100));
        RCD.mintTokens(InvestorFund, InvestorPart.mul(totalAmount).div(100));
        RCD.mintTokens(AdvisorFund, AdvisorPart.mul(totalAmount).div(100));
        RCD.mintTokens(BountyFund, BountyPart.mul(totalAmount).div(100));
        statusICO = StatusICO.RoundCFinished;
        emit LogFinishRoundC(RECORDFund, EcosystemFund, InvestorFund, AdvisorFund, BountyFund);
    }
    /**
     *   @dev Enable token transfers
     */
    function unfreeze() external managerOnly {
        RCD.defrostTokens();
    }

    /**
     *   @dev Disable token transfers
     */
    function freeze() external managerOnly {
        RCD.frostTokens();
    }

    /**
     *   @dev Fallback function calls buyTokens() function to buy tokens
     *        when investor sends ETH to address of ICO contract
     */
    function() external payable {
        uint256 tokens;
        tokens = msg.value.mul(Tokens_Per_Dollar_Numerator).mul(Rate_Eth);
        // rounding tokens amount:
        tokens = tokens.div(Tokens_Per_Dollar_Denominator);
        buyTokens(msg.sender, tokens);
    }

    /**
     *   @dev Issues tokens for users who made purchases in other cryptocurrencies
     *   @param _investor     address the tokens will be issued to
     *   @param _rcdValue     number of RECORD tokens
     *   @param _txHash       transaction hash of investor's payment
     */
    function buyForInvestor(
        address _investor,
        uint256 _rcdValue,
        string _txHash
    )
    external
    controllersOnly
    startedOnly {
        buyTokens(_investor, _rcdValue);
        emit LogBuyForInvestor(_investor, _rcdValue, _txHash);
    }


    /**
     *   @dev Issue tokens for investors who paid in ether
     *   @param _investor     address which the tokens will be issued to
     *   @param _rcdValue     number of RECORD tokens
     */
    function buyTokens(address _investor, uint256 _rcdValue) internal startedOnly {
        require(_rcdValue > 0);
        uint256 bonus = getBonus(_rcdValue);
        uint256 total = _rcdValue.add(bonus);
        if (statusICO == StatusICO.PreSaleStarted) {
            require (PreSaleSold.add(total) <= PreSaleHardCap);
            require(_rcdValue > TENTHOUSENDLIMIT);
            PreSaleSold = PreSaleSold.add(total);
        }
        if (statusICO == StatusICO.RoundAStarted) {
            require (RoundASold.add(total) <= RoundAHardCap);
            RoundASold = RoundASold.add(total);
        }
        if (statusICO == StatusICO.RoundBStarted) {
            require (RoundBSold.add(total) <= RoundBHardCap);
            RoundBSold = RoundBSold.add(total);
        }
        if (statusICO == StatusICO.RoundCStarted) {
            require (RoundCSold.add(total) <= RoundCHardCap);
            RoundCSold = RoundCSold.add(total);
        }
        RCD.mintTokens(_investor, total);
    }

    /**
     *   @dev Calculates bonus
     *   @param _value        amount of tokens
     *   @return              bonus value
     */
    function getBonus(uint256 _value)
    public
    constant
    returns(uint256)
    {
        uint256 bonus = 0;
        if (statusICO == StatusICO.PreSaleStarted) {
            bonus = _value.mul(PreSaleBonusRate).div(100);
        }
        if (statusICO == StatusICO.RoundAStarted) {
            bonus = _value.mul(RoundABonusRate).div(100);
        }
        if (statusICO == StatusICO.RoundBStarted) {
            bonus = _value.mul(RoundBBonusRate).div(100);
        }
        if (statusICO == StatusICO.RoundCStarted) {
            bonus = _value.mul(RoundCBonusRate).div(100);
        }
        return bonus;
    }

    function register(string _key) public {
        keys[msg.sender] = _key;
        emit LogRegister(msg.sender, _key);
    }


    /*
     *   @dev Allows Company withdraw investments when round is over

    function withdrawEther() external managerOnly finishedOnly{
        //Company.transfer(this.balance);
    }*/

}

