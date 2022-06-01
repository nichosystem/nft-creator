// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "./NFTFactory.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTCollection is ERC721Enumerable, ReentrancyGuard {
    using Strings for uint256;
    using ECDSA for bytes32;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );
    event ToggleSale(bool saleLive, bool presaleLive);

    address payable public immutable factory;
    uint256 public immutable maxSupply;
    uint256 public immutable txLimit;

    bool public saleLive;
    bool public protectedSaleLive;
    uint256 public batchSupply;
    uint256 public giftedAmount;
    uint256 public price;
    string public baseURI;

    mapping(address => uint256) public protectedMints;
    mapping(address => mapping(uint256 => bool)) public usedNonces;

    // ============ MODIFIERS ============

    modifier canMint(uint256 tokenQuantity) {
        require(tokenQuantity > 0, "No tokens issued");
        require(tokenQuantity <= txLimit, "Exceeds transaction limit");
        uint256 supply = totalSupply();
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

    modifier onlyOwner() {
        require(
            NFTFactory(factory).ownerOf(address(this)) == msg.sender,
            "caller is not the owner"
        );
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
        address payable _factory,
        uint256 _maxSupply,
        uint256 _txLimit
    ) ERC721(name, symbol) {
        factory = _factory;
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
        uint256 _supply = totalSupply();
        for (uint256 i = 1; i <= tokenQuantity; i++) {
            _safeMint(msg.sender, _supply + i);
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
        uint256 _supply = totalSupply();
        for (uint256 i = 1; i <= tokenQuantity; i++) {
            _safeMint(msg.sender, _supply + i);
        }
    }

    // ============ VIEW FUNCTIONS ============

    function owner() public view virtual returns (address) {
        return NFTFactory(factory).ownerOf(address(this));
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

    function gift(address[] calldata recipients) external onlyOwner {
        uint256 _supply = totalSupply();
        require(_supply + recipients.length <= maxSupply, "Exceeds max supply");
        giftedAmount += recipients.length;
        // zero-index i for recipients array
        for (uint256 i = 0; i < recipients.length; i++) {
            _safeMint(recipients[i], _supply + i + 1); // increment by 1 for token IDs
        }
    }

    function setBaseURI(string calldata URI) external onlyOwner {
        baseURI = URI;
    }

    function setupBatch(uint256 _price, uint256 _batchSupply)
        external
        onlyOwner
    {
        price = _price;
        batchSupply = _batchSupply;
    }

    function toggleSale(bool _saleLive, bool _protectedSaleLive)
        external
        onlyOwner
    {
        saleLive = _saleLive;
        protectedSaleLive = _protectedSaleLive;
        emit ToggleSale(_saleLive, _protectedSaleLive);
    }

    function renounceOwnership() public onlyOwner {
        _transferOwnership(address(0));
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "new owner is the zero address");
        _transferOwnership(newOwner);
    }

    function withdraw() external onlyOwner nonReentrant {
        // Send royalty to NFTFactory
        uint256 royalty = NFTFactory(factory).royalty();
        (bool success1, ) = payable(factory).call{
            value: address(this).balance * royalty
        }("");
        require(success1);
        // Withdraw all remaining funds to owner
        (bool success2, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(success2);
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
        return NFTFactory(factory).signer() == hash.recover(signature);
    }

    function _transferOwnership(address newOwner) internal {
        address oldOwner = NFTFactory(factory).ownerOf(address(this));
        NFTFactory(factory).transferOwner(address(this), newOwner);
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}
