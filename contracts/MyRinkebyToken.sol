pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";

contract MyRinkebyToken is ERC721Full {

    struct Hero {
        uint strength;
        uint defense;
        uint agility;
    }

    Hero[] heroes;

    constructor(string memory name, string memory symbol) public ERC721Full(name, symbol) {

    }

    function depositToGateway(address _gateway, uint256 _tokenId) public {
        safeTransferFrom(msg.sender, _gateway, _tokenId);
    }

    function getHero(uint _tokenId) returns(
        uint strength,
        uint defense,
        uint agility
    ){
        Hero memory hero = heroes[_tokenId];

        strength = hero.strength;
        defense = hero.defense;
        agility = hero.agility;
    }

    function mint(
        uint _strength,
        uint _defense,
        uint _agility
    )
    public
    {
        _mintHero(_strength, _defense, _agility, msg.sender);
    }

    function _mintHero(
        uint _strength,
        uint _defense,
        uint _agility,
        address _owner
    )
        internal
        returns (uint)
    {
        Hero memory _hero = Hero({
            strength: _strength,
            defense: _defense,
            agility: _agility,
        });

        uint256 newHeroId = heroes.push(_hero) - 1;

        _mint(_owner, newHeroId);

        return newHeroId;
    }
}