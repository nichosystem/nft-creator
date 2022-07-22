---
title: Getting started
pageTitle: NFT Creator Docs
description: Create an NFT collection in minutes. Generate art, deploy smart contracts, and manage on-chain operations all through one simple interface.
---

Learn how to use the NFT Creator tools to deploy your collection. {% .lead %}

{% quick-links %}

{% quick-link title="One-Click Contract Deploys" icon="installation" href="/docs/deploy-contract" description="Learn to easily deploy and modify a smart contract to fit your collection." /%}

{% quick-link title="Minting Web App" icon="presets" href="/docs/create-minting-dapp" description="Learn how the minter works to create your own minting web app." /%}

{% quick-link title="Snapshot & Airdrop" icon="plugins" href="/docs/airdrops" description="Take a snapshot of an existing collection to airdrop holders or create an allowlist." /%}

{% quick-link title="Art Generator" icon="theming" href="/docs/generate-art" description="Step-by-step guide creating a rarity table to generate art and metadata. " /%}

{% /quick-links %}

NFT Creator has everything you need to deploy your own NFT project. Check out some of the quick links above to get started learning how to use the tools at your disposal.

---

## Quick start

If you're looking to test drive the NFT Creator tools, the first thing you'll want to do is deploy your NFT's smart contract to a test network.

### Deploying an NFT smart contract

Start by connecting your web3 wallet to the dApp. Once your wallet is connected, change the network to the Goerli testnet. Go to the [Alchemy Faucet](https://goerlifaucet.com) if you need some testnet ETH.

Once connected, go to the [Deployer](/deployer) and fill out the form.

- Enter your collection's name and a symbol for the token. These will show up on some wallets and on etherscan.
- Set the max supply to the absolute maximum amount of tokens that can be minted.
- Lastly, set the max mint per transaction to limit how many tokens can be minted in a single transaction.

Click deploy to submit your transaction. Once the transaction is completed, you'll have deployed your collection's smart contract.

{% callout type="note" title="Which contract specification will I have?" %}
You may have heard of other ERC specifications, like ERC20 (fungible) or ERC1155 (semi-fungible tokens). We currently only support ERC721 tokens, which should be a good fit for nearly all NFT collections.
{% /callout %}

---

## Next Steps

Once you have a smart contract deployed, you may want to check out the Collection Manager or Art Generator to make your collection come to life.

In order to have art to show up for your NFTs, you'll need to create some metadata. You can use use the [Generator](/generator) to create metadata and generate your art. Then you can download the images and the individual metadata files to upload to an IPFS provider, such as [Pinata](https://pinata.cloud).

Once you have your metadata uploaded, you can use the [Manager](/manager) to set the base URI. This is how your NFT's metadata and image data is surfaced on marketplaces like Opensea. Read more about [managing your collection](/docs/manage-collection) to see everything the smart contract allows you to do.

---

## Getting help

If you run into any issues, we'd love to chat. You can DM us on Twitter or open an issue on Github.

### Submit an issue

Visit the [Github repository](https://github.com/nichosystem/nft-creator) to submit new issues.

### Join the community

Follow us on [Twitter](https://twitter.com/nichosystem).
