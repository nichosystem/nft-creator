// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "./NFTCollection.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTFactory is Ownable {
    struct Collection {
        address addr;
        address owner;
        address signer;
        uint256 royalty;
    }

    address[] public addresses;
    address public defaultSigner;
    uint256 public defaultRoyalty;
    uint256 public price;

    mapping(address => Collection) public collections;

    constructor() {}

    receive() external payable {}

    fallback() external payable {}

    // ============ PUBLIC FUNCTIONS ============

    function deploy(
        address _owner,
        string calldata name,
        string calldata symbol,
        uint256 maxSupply,
        uint256 txLimit
    ) external payable {
        require(price == msg.value, "Incorrect ETH sent");
        newCollection(name, symbol, _owner, maxSupply, txLimit);
    }

    function getOwnedCollections(address user)
        external
        view
        returns (address[] memory)
    {
        address[] storage ownedCollections;
        for (uint256 i = 0; i < addresses.length; i++) {
            if (collections[addresses[i]].owner == user)
                ownedCollections.push(addresses[i]);
        }
        return ownedCollections;
    }

    function ownerOf(address addr) external view returns (address) {
        return collections[addr].owner;
    }

    function royaltyOf(address addr) external view returns (uint256) {
        return collections[addr].royalty;
    }

    function signerOf(address addr) external view returns (address) {
        return collections[addr].signer;
    }

    function transferOwner(address addr, address newOwner) external {
        require(collections[addr].owner == msg.sender, "Caller is not owner");
        collections[addr].owner = newOwner;
        return;
    }

    // ============ OWNER-ONLY FUNCTIONS ============

    function ownerDeploy(
        string calldata name,
        string calldata symbol,
        address _owner,
        uint256 maxSupply,
        uint256 txLimit
    ) external onlyOwner {
        newCollection(name, symbol, _owner, maxSupply, txLimit);
    }

    function setFactoryDefaults(
        uint256 _price,
        uint256 _royalty,
        address _signer
    ) external onlyOwner {
        price = _price;
        defaultRoyalty = _royalty;
        defaultSigner = _signer;
    }

    function setCollection(
        address addr,
        uint256 _royalty,
        address _signer
    ) external onlyOwner {
        collections[addr].royalty = _royalty;
        collections[addr].signer = _signer;
    }

    function withdraw() external onlyOwner {
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(success);
    }

    // ============ INTERNAL FUNCTIONS ============

    function newCollection(
        string calldata name,
        string calldata symbol,
        address _owner,
        uint256 maxSupply,
        uint256 txLimit
    ) internal {
        address addr = address(
            new NFTCollection(name, symbol, payable(this), maxSupply, txLimit)
        );
        addresses.push(addr);
        collections[addr] = Collection(
            addr,
            _owner,
            defaultSigner,
            defaultRoyalty
        );
    }
}
