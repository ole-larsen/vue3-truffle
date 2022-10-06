// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// https://github.com/OpenZeppelin
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
// https://docs.soliditylang.org/en/v0.8.17/units-and-global-variables.html
contract ContractToken is IERC20{

    using SafeMath for uint256;

    uint256 totalSupply_;

    string public name = "RK Token";
    string public symbol = "RKT";
    string public version = "RK Token v1.0";

    bool public mintingFinished = false;

    // transfer event
    // event Transfer(address indexed _from, address indexed _to, uint256 _value);
    // event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    event Mint(address indexed _to, uint256 _value);
    event MintFinished();

    mapping(address => mapping(address => uint256)) public allowed;
    mapping(address => uint256) public balances;


    constructor(uint256 _initialSupply) {
        totalSupply_ = totalSupply_.add(_initialSupply);
        balances[msg.sender] = balances[msg.sender].add(_initialSupply);
    }

    /**
    * @dev total number of tokens in existence
    */
    function totalSupply() public view returns (uint256) {
        return totalSupply_;
    }

    /**
    * @dev transfer token for a specified address
    * @param _to The address to transfer to.
    * @param _value The amount to be transferred.
    */
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(_to != address(0), "Only allow send to other");
        require(balances[msg.sender] >= _value, "Insufficient fund");

        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);

        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    /**
    * @dev Gets the balance of the specified address.
    * @param _owner The address to query the the balance of.
    * @return An uint256 representing the amount owned by the passed address.
    */
    function balanceOf(address _owner) public view returns (uint256) {
        return balances[_owner];
    }

    // implement approve
    /**
     * @dev Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
     *
     * Beware that changing an allowance with this method brings the risk that someone may use both the old
     * and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this
     * race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     * @param _spender The address which will spend the funds.
     * @param _value The amount of tokens to be spent.
    */
    function approve(address _spender, uint256 _value) public returns (bool success) {

        allowed[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    /**
     * @dev Transfer tokens from one address to another
     * @param _from address The address which you want to send tokens from
     * @param _to address The address which you want to transfer to
     * @param _value uint256 the amount of tokens to be transferred
   */
    // implement transferFrom
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_to != address(0));
        require(_value <= balances[_from]);
        require(_value <= allowed[_from][msg.sender]);

        // change the balance
        balances[_from] = balances[_from].sub(_value);
        balances[_to] = balances[_to].add(_value);
        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);

        emit Transfer(_from, _to, _value);
        return true;
    }

    /**
     * @dev Function to check the amount of tokens that an owner allowed to a spender.
     * @param _owner address The address which owns the funds.
     * @param _spender address The address which will spend the funds.
     * @return A uint256 specifying the amount of tokens still available for the spender.
   */
    function allowance(address _owner, address _spender) public view returns (uint256) {
        return allowed[_owner][_spender];
    }

    /**
     * @dev Fix for the ERC20 short address attack.
   */
    modifier onlyPayloadSize(uint _size) {
        require(msg.data.length < _size + 4);
        _;
    }
}
