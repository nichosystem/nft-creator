const CONTRACT_CODE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "./NFTFactory.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error ExceedsSupply();
error HashFail();
error HashUsed();
error InsufficientETH();
error InvalidQuantity();
error InvalidSignature();
error SaleClosed();
error Unauthorized();

contract NFTCollection is ERC721Enumerable, ReentrancyGuard {
    using Strings for uint256;
    using ECDSA for bytes32;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );
    event ToggleSale(bool saleLive, bool presaleLive);

    address payable public immutable FACTORY;
    uint256 public immutable MAX_SUPPLY;
    uint256 public immutable TX_LIMIT;

    bool public saleLive;
    bool public protectedSaleLive;
    string public baseURI;
    uint256 public batchSupply;
    uint256 public giftedAmount;
    uint256 public price;

    mapping(address => uint256) public protectedMints;
    mapping(address => mapping(uint256 => bool)) public usedNonces;

    // ============ MODIFIERS ============

    modifier canMint(uint256 tokenQuantity) {
        if (tokenQuantity == 0 || tokenQuantity > TX_LIMIT)
            revert InvalidQuantity();
        uint256 supply = totalSupply();
        if (
            supply + tokenQuantity > batchSupply ||
            supply + tokenQuantity > MAX_SUPPLY
        ) revert ExceedsSupply();
        _;
    }

    modifier isCorrectPayment(uint256 tokenQuantity) {
        if (msg.value != price * tokenQuantity) revert InsufficientETH();
        _;
    }

    modifier onlyOwner() {
        if (msg.sender != NFTFactory(FACTORY).ownerOf(address(this)))
            revert Unauthorized();
        _;
    }

    modifier saleOpen(bool isProtected) {
        if ((isProtected && !protectedSaleLive) || (!isProtected && !saleLive))
            revert SaleClosed();
        _;
    }

    modifier validSignature(
        bytes32 hash,
        bytes memory signature,
        uint256 nonce,
        uint256 tokenQuantity
    ) {
        if (!_matchSigner(hash, signature)) revert InvalidSignature();
        if (usedNonces[msg.sender][nonce]) revert HashUsed();
        if (hash != _hashTransaction(msg.sender, tokenQuantity, nonce))
            revert HashFail();
        _;
    }

    constructor(
        string memory name,
        string memory symbol,
        address payable _factory,
        uint256 maxSupply,
        uint256 txLimit
    ) ERC721(name, symbol) {
        FACTORY = _factory;
        MAX_SUPPLY = maxSupply;
        TX_LIMIT = txLimit;
    }

    // ============ EXTERNAL FUNCTIONS ============

    function mint(uint256 tokenQuantity)
        external
        payable
        canMint(tokenQuantity)
        isCorrectPayment(tokenQuantity)
        saleOpen(false)
        nonReentrant
    {
        uint256 supply = totalSupply();
        for (uint256 i = 1; i <= tokenQuantity; i++) {
            _safeMint(msg.sender, supply + i);
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
        uint256 supply = totalSupply();
        for (uint256 i = 1; i <= tokenQuantity; i++) {
            _safeMint(msg.sender, supply + i);
        }
    }

    // ============ VIEW FUNCTIONS ============

    function owner() public view virtual returns (address) {
        return NFTFactory(FACTORY).ownerOf(address(this));
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
        if (_supply + recipients.length > MAX_SUPPLY) revert ExceedsSupply();
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
        if (newOwner == address(0)) revert Unauthorized();
        _transferOwnership(newOwner);
    }

    function withdraw() external onlyOwner nonReentrant {
        uint256 royalty = NFTFactory(FACTORY).royalty();
        (bool success1, ) = payable(FACTORY).call{
            value: (address(this).balance * royalty) / 100
        }("");
        require(success1);
        (bool success2, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(success2);
    }

    // ============ PRIVATE FUNCTIONS ============

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
        return NFTFactory(FACTORY).signer() == hash.recover(signature);
    }

    function _transferOwnership(address newOwner) private {
        address oldOwner = NFTFactory(FACTORY).ownerOf(address(this));
        NFTFactory(FACTORY).transferOwner(address(this), newOwner);
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}
`;
export default CONTRACT_CODE;
