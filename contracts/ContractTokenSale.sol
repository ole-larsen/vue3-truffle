pragma solidity >=0.4.22 <0.9.0;

import "./ContractToken.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract ContractTokenSale {
    ContractToken public tokenContract;
    using SafeMath for uint256;
    address admin;
    uint256 public tokenPrice;
    uint256 public sold;

    event Sell(address buyer, uint256 amount);

    constructor(ContractToken _tokenContract, uint256 _tokenPrice) {
        admin = payable(msg.sender);
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function buy(uint256 _numberOfTokens) public payable {
        // require value is equal to tokens
        require(msg.value == _numberOfTokens.mul(tokenPrice));

        // require contract has enough tokens
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);

        // require successful transfer
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        // track token sold
        sold += _numberOfTokens;
        emit Sell(msg.sender, _numberOfTokens);
    }

    // end of sale
    function end() public {
        // require admin
        require(msg.sender == admin);
        // transfer remaining tokens to admin
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
        // destroy contract
        // Consider using Open Zeppelin Pausable.sol instead.
        tokenPrice = 0;
        selfdestruct(payable(msg.sender));
    }
}
