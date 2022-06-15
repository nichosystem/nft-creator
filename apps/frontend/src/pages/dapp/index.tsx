import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import {
  ChangeEvent,
  ChangeEventHandler,
  ReactEventHandler,
  useEffect,
  useState,
} from "react";
import { useAccount, useProvider, useSigner } from "wagmi";
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

const Manager: NextPage = () => {
  const provider = useProvider();
  const { data: account } = useAccount();
  const [collections, setCollections] = useState<string[]>([]);
  const [activeCollection, setActiveCollection] = useState<string>("");
  const [collectionDetails, setCollectionDetails] =
    useState<CollectionDetails>();
  const [inputs, setInputs] = useState({
    baseURI: "",
    batchSupply: "",
    gifts: "",
    presaleLive: "",
    price: "",
    saleLive: "",
    transferOwner: "",
  });

  // Get owned collections
  useEffect(() => {
    const f = async () => {
      if (!provider || !account?.address) return;
      const c = await getOwnedCollections(provider, account.address);
      if (c) {
        setCollections(c);
        setActiveCollection(c[0]);
      }
    };
    f();
  }, [provider, account?.address]);

  // Get collection details for active collection
  useEffect(() => {
    const f = async () => {
      if (activeCollection) {
        const d = await getCollectionDetails(provider, activeCollection);
        if (d) setCollectionDetails(d);
      }
    };
    f();
  }, [provider, activeCollection]);

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
      {collectionDetails && (
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
            <Button value="Toggle Sale" onClick={() => toggleSale()} />
          </div>
          <div>
            <div>Current Price: {collectionDetails.price.toString()}</div>
            <Input
              value={inputs.price}
              name="price"
              onChange={handleChange}
              placeholder="0.5"
            />
            <Button value="Set Price" onClick={() => setPrice()} />
          </div>
          <div>
            <div>Current Batch Supply: {collectionDetails.batchSupply}</div>
            <Input
              value={inputs.batchSupply}
              name="batchSupply"
              onChange={handleChange}
              placeholder="10000"
            />
            <Button value="Set Batch Supply" onClick={() => setBatchSupply()} />
          </div>
          <div>
            <p>Current: {collectionDetails.baseURI}</p>
            <Input
              value={inputs.baseURI}
              name="baseURI"
              onChange={handleChange}
              placeholder="ipfs://abcdefghijklmnopqrstuvwxyz/"
            />
            <Button value="Set Base URI" onClick={() => setBaseURI()} />
          </div>
          <div>
            <Input
              value={inputs.gifts}
              name="gifts"
              onChange={handleChange}
              placeholder="0x12345567890,0x12345567890"
            />
            <div>Total Gifted: {collectionDetails.giftedAmount}</div>
            <Button value="Send Gifts" onClick={() => gift()} />
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
              onClick={() => transferOwner()}
            />
          </div>
          <Button value="Renounce ownership" onClick={() => renounceOwner()} />
          <Button value="Withdraw funds" onClick={() => withdraw()} />
        </div>
      )}
    </>
  );
};

export default Manager;
