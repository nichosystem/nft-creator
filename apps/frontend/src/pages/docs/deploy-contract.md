---
title: Deploying NFT Smart Contracts
description: Use a one-click deployer to deploy an ERC721 NFT smart contract.
---

Learn how to use the one-click deployer to deploy an ERC721 NFT smart contract.

---

## Using the Deployer

Start by connecting your web3 wallet to the dApp. Once your wallet is connected, change the network to the Goerli testnet. Go to the [Alchemy Faucet](https://goerlifaucet.com) if you need some testnet ETH.

Once connected, go to the [Deployer](/deployer) and fill out the form.

- Enter your collection's name and a symbol for the token. These will show up on some wallets and on etherscan.
- Set the max supply to the absolute maximum amount of tokens that can be minted.
- Lastly, set the max mint per transaction to limit how many tokens can be minted in a single transaction.

Click deploy to submit your transaction. Once the transaction is completed, you'll have deployed your collection's smart contract.

{% callout type="note" title="Which contract specification will I have?" %}
You may have heard of other ERC specifications, like ERC20 (fungible) or ERC1155 (semi-fungible tokens). We currently only support ERC721 tokens, which should be a good fit for nearly all NFT collections.
{% /callout %}
