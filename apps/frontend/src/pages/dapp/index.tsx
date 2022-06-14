import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount, useProvider, useSigner } from "wagmi";
import { getOwnedCollections } from "../../provider/factory";

const Manager: NextPage = () => {
  const provider = useProvider();
  const { data: account } = useAccount();
  const [collections, setCollections] = useState<string[]>([]);

  useEffect(() => {
    const f = async () => {
      if (!provider || !account?.address) return;
      const c = await getOwnedCollections(provider, account.address);
      if (c) setCollections(c);
    };
    f();
  }, [provider, account?.address]);

  return (
    <>
      <Head>
        <title>Manager - NFT Tools</title>
        <meta name="description" content="" />
      </Head>
      {collections.length > 0 ? (
        <div>
          <h1>Total collections: {collections.length}</h1>
          {collections.map((c, i) => (
            <>
              {i}. {c}
            </>
          ))}
        </div>
      ) : (
        <div>
          <h1>No Collections Found</h1>
          <Link href="/dapp/deployer">Go To Deployer</Link>
        </div>
      )}
    </>
  );
};

export default Manager;
