pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";

contract MyToken is ERC721Full {
    // Transfer Gateway contract address
    address public gateway;

    constructor(address _gateway, string memory name, string memory symbol) public ERC721Full(name, symbol) {
        gateway = _gateway;
    }

    function mintToGateway(uint256 _tokenId) public
    {
        require(msg.sender == gateway, "only the gateway is allowed to mint");
        _mint(gateway, _tokenId);
    }
}