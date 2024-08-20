// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

import "hardhat/console.sol";

contract Greeter {
    string private _greeting;

    event SetGreeting(address caller, string greeting);

    error ExactGreetingError();

    constructor(string memory greeting) {
        console.log("Deploying a Greeter with greeting:", _greeting);
        _greeting = greeting;
        emit SetGreeting(msg.sender, greeting);
    }

    function getGreeting() public view returns (string memory) {
        return _greeting;
    }

    function setGreeting(string memory greeting) public {
        console.log("Changing greeting from '%s' to '%s'", _greeting, greeting);
        if (
            keccak256(abi.encodePacked(_greeting)) ==
            keccak256(abi.encodePacked(greeting))
        ) {
            revert ExactGreetingError();
        }
        _greeting = greeting;
        emit SetGreeting(msg.sender, greeting);
    }
}
