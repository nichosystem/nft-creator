// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "./NFTCollection.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTFactory is Ownable {
    struct Collection {
        address addr;
        address owner;
    }

    event Deployed(address indexed addr, address indexed owner);

    address[] public addresses;
    address public signer;
    uint256 public royalty;
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

    function transferOwner(address addr, address newOwner) external {
        require(collections[addr].owner == msg.sender, "Caller is not owner");
        collections[addr].owner = newOwner;
        return;
    }

    // ============ VIEW FUNCTIONS ============

    function getOwnedCollections(address user)
        external
        view
        returns (address[] memory)
    {
        uint256 j;
        address[] memory ownedCollections;
        for (uint256 i = 0; i < addresses.length; i++) {
            if (collections[addresses[i]].owner == user) {
                ownedCollections[j] = addresses[i];
                j++;
            }
        }
        return ownedCollections;
    }

    function ownerOf(address addr) external view returns (address) {
        return collections[addr].owner;
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

    function updateFactory(
        uint256 _price,
        uint256 _royalty,
        address _signer
    ) external onlyOwner {
        price = _price;
        royalty = _royalty;
        signer = _signer;
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
        collections[addr] = Collection(addr, _owner);
        emit Deployed(addr, _owner);
    }
}
