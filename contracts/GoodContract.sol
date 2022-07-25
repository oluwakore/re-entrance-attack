// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract GoodContract {

  mapping(address => uint) public balances;

  function addBalance() public payable {
    balances[msg.sender] += msg.value;
  }
  // faulty withdraw function
  // function withdraw() public {
  //   require(balances[msg.sender] > 0);

  //   (bool sent, ) = msg.sender.call{value: balances[msg.sender]}("");
  //   require(sent, "Failed to send ether");

  //   balances[msg.sender] = 0;
  // }


  //Attack-proof withdraw function
  function withdraw() public {
    require(balances[msg.sender] > 0);

    uint value = balances[msg.sender];
    balances[msg.sender] = 0;
    (bool sent, ) = msg.sender.call{value: value}("");
    require(sent, "Failed to send ether");
  }
}


// Alternatively, OpenZeppelin has a ReentrancyGuard library that provides a modifier named nonReentrant which blocks re-entrancy in functions you apply it to. It basically works like the following:

// modifier nonReentrant() {
//     require(!locked, "No re-entrancy");
//     locked = true;
//     _;
//     locked = false;
// }