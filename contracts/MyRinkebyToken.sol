pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";

contract MyRinkebyToken is ERC721Full {
    constructor(string memory name, string memory symbol) public ERC721Full(name, symbol) {

    }

    function mint(uint256 _tokenId) public
    {
        _mint(msg.sender, _tokenId);
    }

    function depositToGateway(address _gateway, uint256 _tokenId) public {
        safeTransferFrom(msg.sender, _gateway, _tokenId);
    }
}