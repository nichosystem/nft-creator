import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";
import { getOwnedCollections } from "../../provider/factory";
import {
  CollectionDetails,
  getCollectionDetails,
  gift,
  renounceOwner,
  setBaseURI,
  setBatchSupply,
  setPrice,
  toggleSale,
  transferOwner,
  withdraw,
} from "../../provider/collection";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import { NFTCollection, NFTCollection__factory } from "../../types/contracts";

const Manager: NextPage = () => {
  const { data: signer } = useSigner();
  const { data: account } = useAccount();
  const [collections, setCollections] = useState<string[]>([]);
  const [contract, setContract] = useState<NFTCollection>();
  const [collectionDetails, setCollectionDetails] =
    useState<CollectionDetails>();
  const [inputs, setInputs] = useState({
    baseURI: "",
    batchSupply: "",
    gifts: "",
    protectedSaleLive: "",
    price: "",
    saleLive: "",
    transferOwner: "",
  });

  // Get owned collections
  useEffect(() => {
    const f = async () => {
      if (!signer || !account?.address) return;
      const c = await getOwnedCollections(signer, account.address);
      if (c) {
        setCollections(c);
        setContract(NFTCollection__factory.connect(c[0], signer));
      }
    };
    f();
  }, [signer, account?.address]);

  // Get collection details for active collection
  useEffect(() => {
    const f = async () => {
      if (contract) {
        const d = await getCollectionDetails(contract);
        if (d) setCollectionDetails(d);
      }
    };
    f();
  }, [contract]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  return (
    <>
      <Head>
        <title>Manager - NFT Tools</title>
        <meta name="description" content="" />
      </Head>

      {collections.length < 1 ? (
        <div>
          <h1>No Collections Found</h1>
          <Link href="/dapp/deployer">Go To Deployer</Link>
        </div>
      ) : (
        <div>
          <h1>Total collections: {collections.length}</h1>
          {collections.map((c, i) => (
            <div key={i}>{c}</div>
          ))}
        </div>
      )}
      {collectionDetails && contract && (
        <div>
          <h1>
            {collectionDetails.name} {collectionDetails.symbol}
          </h1>
          <div>
            {collectionDetails.totalSupply} / {collectionDetails.maxSupply}{" "}
            minted
          </div>
          <div>
            <div>Sale live: {collectionDetails.saleLive}</div>
            <div>
              Protected Sale Live: {collectionDetails.protectedSaleLive}
            </div>
            <Input
              value={inputs.saleLive}
              name="saleLive"
              onChange={handleChange}
              placeholder="false"
            />
            <Input
              value={inputs.protectedSaleLive}
              name="protectedSaleLive"
              onChange={handleChange}
              placeholder="false"
            />
            <Button
              value="Toggle Sale"
              onClick={() =>
                toggleSale(contract, inputs.saleLive, inputs.protectedSaleLive)
              }
            />
          </div>
          <div>
            <div>Current Price: {collectionDetails.price.toString()}</div>
            <Input
              value={inputs.price}
              name="price"
              onChange={handleChange}
              placeholder="0.5"
            />
            <Button
              value="Set Price"
              onClick={() => setPrice(contract, inputs.price)}
            />
          </div>
          <div>
            <div>Current Batch Supply: {collectionDetails.batchSupply}</div>
            <Input
              value={inputs.batchSupply}
              name="batchSupply"
              onChange={handleChange}
              placeholder="10000"
            />
            <Button
              value="Set Batch Supply"
              onClick={() => setBatchSupply(contract, inputs.batchSupply)}
            />
          </div>
          <div>
            <p>Current: {collectionDetails.baseURI}</p>
            <Input
              value={inputs.baseURI}
              name="baseURI"
              onChange={handleChange}
              placeholder="ipfs://abcdefghijklmnopqrstuvwxyz/"
            />
            <Button
              value="Set Base URI"
              onClick={() => setBaseURI(contract, inputs.baseURI)}
            />
          </div>
          <div>
            <Input
              value={inputs.gifts}
              name="gifts"
              onChange={handleChange}
              placeholder="0x12345567890,0x12345567890"
            />
            <div>Total Gifted: {collectionDetails.giftedAmount}</div>
            <Button
              value="Send Gifts"
              onClick={() => gift(contract, inputs.gifts)}
            />
          </div>
          <div>
            <Input
              value={inputs.transferOwner}
              name="transferOwner"
              onChange={handleChange}
              placeholder="0x12345567890"
            />
            <Button
              value="Transfer ownership"
              onClick={() => transferOwner(contract, inputs.transferOwner)}
            />
          </div>
          <Button
            value="Renounce ownership"
            onClick={() => renounceOwner(contract)}
          />
          <Button value="Withdraw funds" onClick={() => withdraw(contract)} />
        </div>
      )}
    </>
  );
};

export default Manager;
