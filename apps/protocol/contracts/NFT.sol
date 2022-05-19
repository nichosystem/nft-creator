// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFT is ERC721Enumerable, Ownable, ReentrancyGuard {
    using Strings for uint256;
    using ECDSA for bytes32;

    event Mint(address indexed _to, uint256 indexed _id);
    event ToggleSale(bool saleLive, bool presaleLive);

    uint256 public immutable maxSupply;
    uint256 public immutable txLimit;

    address public signer;
    uint256 public supply;
    uint256 public price;
    uint256 public batchSupply;
    uint256 public giftedAmount;
    bool public saleLive;
    bool public protectedSaleLive;
    string public baseURI;

    address private openSeaProxyRegistryAddress;

    mapping(address => uint256) public protectedMints;
    mapping(address => mapping(uint256 => bool)) public usedNonces;

    // ============ MODIFIERS ============

    modifier canMint(uint256 tokenQuantity) {
        require(tokenQuantity <= txLimit, "Exceeds transaction limit");
        require(tokenQuantity > 0, "No tokens issued");
        require(
            supply + tokenQuantity <= batchSupply &&
                supply + tokenQuantity <= maxSupply,
            "Exceeds max supply"
        );
        _;
    }

    modifier isCorrectPayment(uint256 tokenQuantity) {
        require(price * tokenQuantity == msg.value, "Incorrect ETH value sent");
        _;
    }

    modifier saleOpen(bool isProtected) {
        if (isProtected) {
            require(protectedSaleLive, "Sale closed");
        } else {
            require(saleLive, "Sale closed");
        }
        _;
    }

    modifier validSignature(
        bytes32 hash,
        bytes memory signature,
        uint256 nonce,
        uint256 tokenQuantity
    ) {
        require(_matchSigner(hash, signature), "No direct mint");
        require(!usedNonces[msg.sender][nonce], "Hash used");
        require(
            _hashTransaction(msg.sender, tokenQuantity, nonce) == hash,
            "Hash fail"
        );
        _;
    }

    constructor(
        string memory name,
        string memory symbol,
        uint256 _maxSupply,
        uint256 _txLimit
    ) ERC721(name, symbol) {
        maxSupply = _maxSupply;
        txLimit = _txLimit;
    }

    // ============ PUBLIC FUNCTIONS ============

    function mint(uint256 tokenQuantity)
        external
        payable
        canMint(tokenQuantity)
        isCorrectPayment(tokenQuantity)
        saleOpen(false)
        nonReentrant
    {
        uint256 _supply = supply;
        supply += tokenQuantity;
        for (uint256 i = 1; i <= tokenQuantity; i++) {
            _safeMint(msg.sender, _supply + 1);
        }
    }

    function protectedMint(
        bytes32 hash,
        bytes memory signature,
        uint256 nonce,
        uint256 tokenQuantity
    )
        external
        payable
        canMint(tokenQuantity)
        isCorrectPayment(tokenQuantity)
        saleOpen(true)
        validSignature(hash, signature, nonce, tokenQuantity)
        nonReentrant
    {
        protectedMints[msg.sender] += tokenQuantity;
        usedNonces[msg.sender][nonce] = true;
        uint256 _supply = supply;
        supply += tokenQuantity;
        for (uint256 i = 1; i <= tokenQuantity; i++) {
            _safeMint(msg.sender, _supply + 1);
        }
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721)
        returns (string memory)
    {
        require(_exists(tokenId), "Token does not exist");
        return string(abi.encodePacked(baseURI, tokenId.toString()));
    }

    // ============ OWNER-ONLY FUNCTIONS ============

    function toggleSale(bool _saleLive, bool _protectedSaleLive)
        external
        onlyOwner
    {
        saleLive = _saleLive;
        protectedSaleLive = _protectedSaleLive;
        emit ToggleSale(_saleLive, _protectedSaleLive);
    }

    function setupBatch(uint256 _price, uint256 _batchSupply)
        external
        onlyOwner
    {
        price = _price;
        batchSupply = _batchSupply;
    }

    function gift(address[] calldata recipients) external onlyOwner {
        require(supply + recipients.length <= maxSupply, "Exceeds max supply");
        uint256 _supply = supply;
        giftedAmount += recipients.length;
        supply += recipients.length;
        // zero-index i for recipients array
        for (uint256 i = 0; i < recipients.length; i++) {
            emit Mint(recipients[i], _supply + i + 1); // increment by 1 for token IDs
        }
    }

    function withdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function setBaseURI(string calldata URI) external onlyOwner {
        baseURI = URI;
    }

    // ============ INTERNAL FUNCTIONS ============

    function _hashTransaction(
        address sender,
        uint256 qty,
        uint256 nonce
    ) private pure returns (bytes32) {
        return
            keccak256(abi.encodePacked(sender, qty, nonce))
                .toEthSignedMessageHash();
    }

    function _matchSigner(bytes32 hash, bytes memory signature)
        private
        view
        returns (bool)
    {
        return signer == hash.recover(signature);
    }
}
