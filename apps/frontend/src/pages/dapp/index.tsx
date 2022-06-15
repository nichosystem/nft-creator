import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount, useProvider, useSigner } from "wagmi";
import { getOwnedCollections } from "../../provider/factory";
import {
  CollectionDetails,
  getCollectionDetails,
} from "../../provider/collection";

const Manager: NextPage = () => {
  const provider = useProvider();
  const { data: account } = useAccount();
  const [collections, setCollections] = useState<string[]>([]);
  const [activeCollection, setActiveCollection] = useState<string>("");
  const [collectionDetails, setCollectionDetails] =
    useState<CollectionDetails>();

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

  useEffect(() => {
    const f = async () => {
      if (activeCollection) {
        const d = await getCollectionDetails(provider, activeCollection);
        console.log(d);

        if (d) setCollectionDetails(d);
      }
    };
    f();
  }, [provider, activeCollection]);

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
    </>
  );
};

export default Manager;
