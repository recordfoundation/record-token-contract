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
    mapping (address => string) public keys;

    // Token price parameters
    // These parametes can be changed only by manager of contract
    uint256 public Rate_Eth = 392; // Rate USD per ETH

    uint256 public Tokens_Per_Dollar_Numerator = 1000; // RECORD token = 0.1$ // 분자
    uint256 public Tokens_Per_Dollar_Denominator_PreSale = 80; // RECORD token = 0.08$ // 분모
    uint256 public Tokens_Per_Dollar_Denominator_RoundA = 90; // RECORD token = 0.09$ // 분모
    uint256 public Tokens_Per_Dollar_Denominator_RoundB = 95; // RECORD token = 0.095$ // 분모
    uint256 public Tokens_Per_Dollar_Denominator_RoundC = 100; // RECORD token = 0.1$ // 분모

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
    uint256 constant totalAmountOnICO = 300000000 * 1e18;
    uint256 public PreSaleSold = 0;
    uint256 public RoundASold = 0;
    uint256 public RoundBSold = 0;
    uint256 public RoundCSold = 0;
    uint256 constant PreSaleMinimum = 5000;
    uint256 constant PreSaleMaximum = 10000000;
    uint256 constant IcoMinimum = 5000;
    uint256 constant IcoMaximum = 50000000;
    // Output ethereum addresses
    address public Company;
    address public RECORDFund;
    address public EcosystemFund;
    address public InvestorFund;
    address public AdvisorFund;
    address public BountyFund;
    address public Manager; // Manager controls contract

    uint256 public PreSaleStartTime;
    uint256 public PreSaleCloseTime;
    uint256 public IcoStartTime;
    uint256 public IcoCloseTime;

    // Possible ICO statuses
    enum StatusICO {
        Created,
        PreSaleStarted,
        PreSaleFinished,
        RoundAStarted,
        RoundBStarted,
        RoundCStarted,
        IcoPaused,
        IcoFinished
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
    event LogRegister(address investor, string key);

    // Allows execution by the contract manager only
    modifier managerOnly {
        require(msg.sender == Manager);
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
            (statusICO == StatusICO.IcoFinished)
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
        address _Manager
    )
    public {
        Company = _Company;
        RECORDFund = _RECORDFund;
        EcosystemFund = _EcosystemFund;
        InvestorFund = _InvestorFund;
        AdvisorFund = _AdvisorFund;
        BountyFund = _BountyFund;
        Manager = _Manager;
    }

    /**
     *   @dev Set rate of ETH and update token price
     *   @param _RateEth       current ETH rate
     */
    function setRate(uint256 _RateEth) external managerOnly {
        Rate_Eth = _RateEth;
    }

    /**
     *   @dev Start Pre-Sale
     *   Set ICO status to PreSaleStarted
     */
    function startPreSaleRound() external managerOnly {
        require(statusICO == StatusICO.Created || statusICO == StatusICO.IcoPaused);
        require(PreSaleSold < PreSaleHardCap);
        statusICO = StatusICO.PreSaleStarted;
    }

    /**
     *   @dev Pause Pre-Sale
     *   Set Ico status to PreSalePaused
     */
    function pauseIco() external managerOnly, startedOnly {
        statusICO = StatusICO.IcoPaused;
    }

    /**
     *   @dev Finish Pre-Sale and mint tokens for RECORDFund, EcosystemFund
     *   and BountyFund
     *   Set Ico status to PreSaleFinished
     */
    function finishPreSaleRound() external managerOnly {
        require(statusICO == StatusICO.PreSaleStarted || statusICO == StatusICO.PreSalePaused);
        statusICO = StatusICO.PreSaleFinished;
        withdrawEther();
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
     *   @dev Start Round B
     *   Set ICO status to RoundBStarted
     */
    function startRoundB() external managerOnly {
        require(statusICO == StatusICO.RoundAStarted || statusICO == StatusICO.RoundAFinished || statusICO == StatusICO.RoundBPaused);
        statusICO = StatusICO.RoundAFinished;
        withdrawEther();
        statusICO = StatusICO.RoundBStarted;
        emit LogStartRoundB();
    }
    /**
     *   @dev Start Round C
     *   Set ICO status to RoundCStarted
     */
    function startRoundC() external managerOnly {
        require(statusICO == StatusICO.RoundBStarted || statusICO == StatusICO.RoundBFinished || statusICO == StatusICO.RoundCPaused);
        statusICO = StatusICO.RoundBFinished;
        withdrawEther();
        statusICO = StatusICO.RoundCStarted;
        emit LogStartRoundC();
    }

    /**
     *   @dev Finish Round C and mint tokens RECORDFund, EcosystemFund, InvestorFund, AdvisorFund
     *   and BountyFund
     *   Set Ico status to RoundCStarted
     */
    function finishIco() external managerOnly {
        require(statusICO == StatusICO.RoundCStarted || statusICO == StatusICO.RoundCPaused);
        RCD.mint(RECORDFund, RECORDPart.mul(totalAmountOnICO).div(100));
        RCD.mint(EcosystemFund, EcosystemPart.mul(totalAmountOnICO).div(100));
        RCD.mint(InvestorFund, InvestorPart.mul(totalAmountOnICO).div(100));
        RCD.mint(AdvisorFund, AdvisorPart.mul(totalAmountOnICO).div(100));
        RCD.mint(BountyFund, BountyPart.mul(totalAmountOnICO).div(100));
        statusICO = StatusICO.RoundCFinished;
        emit LogFinishRoundC(RECORDFund, EcosystemFund, InvestorFund, AdvisorFund, BountyFund);
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
    function buyTokens(address _investor, uint256 _ethValue) internal startedOnly {
        require(_ethValue > 0);
        uint256 _rcdValue;
        _rcdValue = _ethValue.mul(Tokens_Per_Dollar_Numerator).mul(Rate_Eth);
        require ((PreSaleStartTime < now && PreSaleCloseTime > now) || (IcoStartTime < now && IcoCloseTime > now));

        // hardcap: 15,000,000 RCD
        // minimun: 5,000 RCD
        // maximum: 10,000,000 RCD
        if (statusICO == StatusICO.PreSaleStarted) {
            _rcdValue = _rcdValue.div(Tokens_Per_Dollar_Denominator_PreSale);
            require (PreSaleSold.add(_rcdValue) <= PreSaleHardCap);
            require (_rcdValue >= PreSaleMinimum);
            require (_rcdValue <= PreSaleMaximum);
            PreSaleSold = PreSaleSold.add(_rcdValue);
        }

        // hardcap: 45,000,000 RCD
        // minimun: 5,000 RCD
        // maximum: 50,000,000 RCD
        if (statusICO == StatusICO.RoundAStarted) {
            _rcdValue = _rcdValue.div(Tokens_Per_Dollar_Denominator_RoundA);
            require (RoundASold.add(_rcdValue) <= RoundAHardCap);
            require (_rcdValue >= IcoMinimum);
            require (_rcdValue <= IcoMaximum);
            RoundASold = RoundASold.add(_rcdValue);
        }
        if (statusICO == StatusICO.RoundBStarted) {
            _rcdValue = _rcdValue.div(Tokens_Per_Dollar_Denominator_RoundB);
            require (RoundBSold.add(_rcdValue) <= RoundBHardCap);
            require (_rcdValue >= IcoMinimum);
            require (_rcdValue <= IcoMaximum);
            RoundBSold = RoundBSold.add(_rcdValue);
        }
        if (statusICO == StatusICO.RoundCStarted) {
            _rcdValue = _rcdValue.div(Tokens_Per_Dollar_Denominator_RoundC);
            require (RoundCSold.add(_rcdValue) <= RoundCHardCap);
            require (_rcdValue >= IcoMinimum);
            require (_rcdValue <= IcoMaximum);
            RoundCSold = RoundCSold.add(_rcdValue);
        }
        RCD.mint(_investor, _rcdValue);
    }

    function register(string _key) public {
        keys[msg.sender] = _key;
        emit LogRegister(msg.sender, _key);
    }

    /*
     *   @dev Allows Company withdraw investments when round is over
    */
    function withdrawEther() external managerOnly finishedOnly{
        Company.transfer(address(this).balance);
    }
}

