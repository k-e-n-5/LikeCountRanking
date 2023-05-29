// SPDX-License-Identifier: JS
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract JSToken is ERC20 {

    constructor() ERC20("JSToken", "JPA") {}

    function mint(address account, uint256 amount) public {
        _mint(account, amount);
    }

}
