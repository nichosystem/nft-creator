// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "./NFTCollection.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTFactory is Ownable {
    event Deployed(address indexed addr, address indexed owner);

    address public signer;
    uint256 public price;
    uint256 public royalty;

    // List of all deployed collections
    address[] public collections;

    // Mapping from collection address to owner address
    mapping(address => address) public ownerOf;

    constructor() {}

    receive() external payable {}

    fallback() external payable {}

    // ============ EXTERNAL FUNCTIONS ============

    function deploy(
        address _owner,
        string calldata name,
        string calldata symbol,
        uint256 maxSupply,
        uint256 txLimit
    ) external payable {
        if (msg.value < price) revert InsufficientETH();
        newCollection(name, symbol, _owner, maxSupply, txLimit);
    }

    function transferOwner(address addr, address newOwner) external {
        if (msg.sender != ownerOf[addr]) revert Unauthorized();
        ownerOf[addr] = newOwner;
        return;
    }

    // ============ VIEW FUNCTIONS ============

    function getOwnedCollections(address user)
        external
        view
        returns (address[] memory)
    {
        uint256 count;
        for (uint256 i = 0; i < collections.length; i++) {
            if (ownerOf[collections[i]] == user) count++;
        }
        address[] memory ownedCollections = new address[](count);
        uint256 j;
        for (uint256 i = 0; i < collections.length; i++) {
            if (ownerOf[collections[i]] == user) {
                ownedCollections[j] = collections[i];
                j++;
            }
        }
        return ownedCollections;
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

    // ============ PRIVATE FUNCTIONS ============

    function newCollection(
        string calldata name,
        string calldata symbol,
        address _owner,
        uint256 maxSupply,
        uint256 txLimit
    ) private {
        address addr = address(
            new NFTCollection(name, symbol, payable(this), maxSupply, txLimit)
        );
        collections.push(addr);
        ownerOf[addr] = _owner;
        emit Deployed(addr, _owner);
    }
}
