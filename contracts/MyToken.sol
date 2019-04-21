pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";

contract MyToken is ERC721Full {
    // Transfer Gateway contract address
    address public gateway;

    struct Hero {
        uint strength;
        uint defense;
        uint agility;
    }

    Hero[] heroes;

    constructor(address _gateway, string memory name, string memory symbol) public ERC721Full(name, symbol) {
        gateway = _gateway;
    }

    function mintToGateway(
        uint _strength,
        uint _defense,
        uint _agility
    )
        public
    {
        require(msg.sender == gateway, "only the gateway is allowed to mint");
        _mintHero(_strength, _defense, _agility);
    }

    function _mintHero(
        uint _strength,
        uint _defense,
        uint _agility
    )
        internal
        returns (uint)
    {
        Hero memory _hero = Hero({
            strength: _strength,
            defense: _defense,
            agility: _agility
        });

        uint256 newHeroId = heroes.push(_hero) - 1;

        _mint(gateway, newHeroId);

        return newHeroId;
    }

}