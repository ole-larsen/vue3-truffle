pragma solidity >=0.4.22 <0.9.0;

contract Owned {
    address public owner;

    event SetOwner(address indexed _previousOwner, address indexed _newOwner);

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function setOwner(address _newOwner) public onlyOwner {
        emit SetOwner(owner, _newOwner);
        owner = _newOwner;
    }
}
