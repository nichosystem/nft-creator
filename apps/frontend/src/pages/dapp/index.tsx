import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import { useAccount, useProvider, useSigner } from "wagmi";
import { getOwnedCollections } from "../../provider/factory";
import {
  getCollectionDetails,
  gift,
  renounceOwner,
  setBaseURI,
  setBatchSupply,
  setPrice,
  setStatus,
  transferOwner,
  withdraw,
} from "../../provider/collection";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import { NFTCollection, NFTCollection__factory } from "../../types/contracts";
import SelectMenu, { SelectItem } from "../../components/SelectMenu";
import { CollectionDetails, Status } from "../../types/collections";

const Manager: NextPage = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();
  const { data: account } = useAccount();
  const [collections, setCollections] = useState<SelectItem[]>([]);
  const [contract, setContract] = useState<NFTCollection>();
  const [selectedCollection, setSelectedCollection] = useState<SelectItem>();
  const [collectionDetails, setCollectionDetails] =
    useState<CollectionDetails>();
  const [inputs, setInputs] = useState({
    baseURI: "",
    batchSupply: "",
    gifts: "",
    price: "",
    transferOwner: "",
  });

  // Get owned collections
  useEffect(() => {
    const f = async () => {
      if (!signer || !account?.address) return;
      const c = await getOwnedCollections(signer, account.address);
      if (c) {
        // Get the name of each collection
        const list = await Promise.all(
          c.map(async (addr): Promise<SelectItem> => {
            const collection = NFTCollection__factory.connect(addr, signer);
            return { primary: await collection.name(), secondary: addr };
          })
        );
        setCollections(list);
        setSelectedCollection(list[0]);
        setContract(NFTCollection__factory.connect(c[0], signer));
      }
    };
    f();
  }, [signer, account?.address]);

  // Get collection details for active collection
  useEffect(() => {
    const f = async () => {
      if (contract && provider) {
        const d = await getCollectionDetails(contract, provider);
        if (d) setCollectionDetails(d);
      }
    };
    f();
  }, [provider, contract]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setInputs({ ...inputs, [e.target.name]: e.target.value });

  return (
    <>
      <Head>
        <title>Manager - NFT Tools</title>
        <meta name="description" content="" />
      </Head>

      <>
        <div className="flex-1 xl:overflow-y-auto">
          <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:py-12 lg:px-8">
            <h1 className="text-3xl font-extrabold text-slate-100 pb-6">
              NFT Collection Manager
            </h1>

            {collections.length < 1 && (
              <div>
                <h2 className="text-xl font-medium text-slate-100">
                  No Collections Found
                </h2>
                <Link href="/dapp/deployer" passHref>
                  <button className="mt-2 flex-shrink-0 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                    Go To Deployer
                  </button>
                </Link>
              </div>
            )}

            {collectionDetails && contract && selectedCollection && (
              <>
                <SelectMenu
                  label="Your Collections"
                  list={collections}
                  selected={selectedCollection}
                  setSelected={setSelectedCollection}
                />

                <form className="mt-6 space-y-8 divide-y divide-y-slate-200 border-t-2 border-gray-200 pt-6">
                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                    <div className="sm:col-span-6">
                      <div className="flex w-full justify-between">
                        <h2 className="text-xl font-medium text-slate-100">
                          Mint Parameters
                        </h2>
                        <h2 className="text-xl font-semibold text-slate-200">
                          {collectionDetails.totalSupply} /{" "}
                          {collectionDetails.maxSupply} minted
                        </h2>
                      </div>
                      <p className="mt-1 text-sm text-slate-300">
                        Adjust the price, supply, and sale status for your
                        collection.
                      </p>
                    </div>
                    <div className="sm:col-span-6">
                      <div>
                        <label
                          htmlFor="saleStatus"
                          className="block text-base font-medium text-slate-100"
                        >
                          Sale Status
                        </label>
                        <p className="text-sm leading-5 text-slate-500">
                          Enable and restrict public minting.
                        </p>
                        <fieldset className="mt-2">
                          <legend className="sr-only">Sales Status</legend>
                          <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                            <div key="closed" className="flex items-center">
                              <input
                                id="closed"
                                name="status"
                                type="radio"
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-slate-300"
                                checked={
                                  collectionDetails.status == Status.Closed
                                }
                                onChange={() =>
                                  setStatus(contract, Status.Closed)
                                }
                              />
                              <label
                                htmlFor="closed"
                                className="ml-3 block text-sm font-medium text-slate-200"
                              >
                                Sales Closed
                              </label>
                            </div>
                            <div key="protected" className="flex items-center">
                              <input
                                id="protected"
                                name="status"
                                type="radio"
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-slate-300"
                                checked={
                                  collectionDetails.status == Status.Protected
                                }
                                onChange={() =>
                                  setStatus(contract, Status.Protected)
                                }
                              />
                              <label
                                htmlFor="protected"
                                className="ml-3 block text-sm font-medium text-slate-200"
                              >
                                Whitelist-Only
                              </label>
                            </div>
                            <div key="public" className="flex items-center">
                              <input
                                id="public"
                                name="status"
                                type="radio"
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-slate-300"
                                checked={
                                  collectionDetails.status == Status.Public
                                }
                                onChange={() =>
                                  setStatus(contract, Status.Public)
                                }
                              />
                              <label
                                htmlFor="public"
                                className="ml-3 block text-sm font-medium text-slate-200"
                              >
                                Public Sale Live
                              </label>
                            </div>
                          </div>
                        </fieldset>
                      </div>
                    </div>
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="price"
                        className="block text-base font-medium text-slate-100"
                      >
                        Mint Price
                        <span className="ml-4 text-sm text-slate-400">
                          Current Price: {collectionDetails.price} ETH
                        </span>
                      </label>
                      <div className="mt-1 flex items-center">
                        <Input
                          value={inputs.price}
                          name="price"
                          onChange={handleChange}
                          placeholder="0.1"
                        />
                        <div className="flex">
                          <Button
                            value="Update"
                            onClick={() => setPrice(contract, inputs.price)}
                            className="ml-4"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="batchSupply"
                        className="block text-base font-medium text-slate-100"
                      >
                        Batch Supply Limit
                        <span className="ml-4 text-sm text-slate-400">
                          Current Limit: {collectionDetails.batchSupply}
                        </span>
                      </label>
                      <div className="mt-1 flex items-center">
                        <Input
                          value={inputs.batchSupply}
                          name="batchSupply"
                          onChange={handleChange}
                          placeholder="100"
                        />
                        <Button
                          value="Update"
                          onClick={() =>
                            setBatchSupply(contract, inputs.batchSupply)
                          }
                          className="ml-4"
                        />
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        Set a soft ceiling on the supply. Set to the max supply
                        ({collectionDetails.maxSupply}) to mint the full
                        collection.
                      </p>
                    </div>
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="batchSupply"
                        className="block text-base font-medium text-slate-100"
                      >
                        Metadata Base URI
                        <span className="ml-4 text-sm text-slate-400">
                          Current:{" "}
                          {collectionDetails.baseURI
                            ? collectionDetails.baseURI
                            : "None"}
                        </span>
                      </label>
                      <div className="mt-1 flex items-center">
                        <Input
                          value={inputs.baseURI}
                          name="baseURI"
                          onChange={handleChange}
                          placeholder="ipfs://qrpvhehnzmdwt2p6c1iuzsft7mzq/"
                          fullWidth={true}
                        />
                        <Button
                          value="Update"
                          onClick={() => setBaseURI(contract, inputs.baseURI)}
                          className="ml-4"
                        />
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        Tokens append their Token ID to the Base URI to retrieve
                        metadata.
                      </p>
                    </div>
                  </div>

                  <div className="pt-8 grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                    <div className="sm:col-span-6">
                      <h2 className="text-xl font-medium text-slate-100">
                        Minting &amp; Whitelist
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        This section lets you mint, gift, and manage the
                        whitelist for your collection.
                      </p>
                    </div>
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="description"
                        className="block text-base font-medium text-slate-100"
                      >
                        Airdrop
                        <span className="ml-4 text-sm text-slate-400">
                          Gifts Sent: {`${collectionDetails.giftedAmount}`}
                        </span>
                      </label>
                      <div className="mt-1">
                        <textarea
                          value={inputs.gifts}
                          id="gifts"
                          name="gifts"
                          onChange={handleChange}
                          rows={4}
                          className="block w-full border border-slate-300 rounded-md shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                          placeholder="0xf39Fd6e51aad88F6F4ce6aB8827279c92266, 0xf39Fd6e51aad88F6F4ce6aB8827279c92266"
                        />
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        Mint NFTs for free directly to any wallet(s). Separate
                        addresses by commas.
                      </p>
                      <Button
                        value="Send Gifts"
                        onClick={() => gift(contract, inputs.gifts)}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="pt-8 grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                    <div className="sm:col-span-6">
                      <h2 className="text-xl font-medium text-slate-100">
                        Owner Functions
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Withdraw funds and transfer ownership.
                      </p>
                    </div>
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="description"
                        className="block text-base font-medium text-slate-100"
                      >
                        Withdraw Funds
                      </label>
                      <p className="text-sm text-slate-500">
                        Total Value: {collectionDetails.balance} ETH
                      </p>
                      <Button
                        value="Withdraw"
                        onClick={() => withdraw(contract)}
                        className="mt-2"
                      />
                    </div>
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="batchSupply"
                        className="block text-base font-medium text-slate-100"
                      >
                        Transfer Ownership
                      </label>
                      <p className="text-sm text-slate-500">
                        Give owner to another address.
                      </p>
                      <div className="mt-2 flex items-center">
                        <Input
                          value={inputs.transferOwner}
                          name="transferOwner"
                          onChange={handleChange}
                          placeholder="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
                          fullWidth={true}
                        />
                        <Button
                          value="Transfer"
                          onClick={() =>
                            transferOwner(contract, inputs.transferOwner)
                          }
                          className="ml-4"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="description"
                        className="block text-base font-medium text-slate-100"
                      >
                        Renounce Ownership
                      </label>
                      <p className="text-sm text-slate-500">
                        Only renounce ownership if you are sure you no longer
                        need it.
                      </p>
                      <Button
                        value="Renounce"
                        onClick={() => renounceOwner(contract)}
                        className="bg-rose-600 hover:bg-rose-700 mt-2"
                      />
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </>
    </>
  );
};

export default Manager;

// add to whitelist, remove from whitelist, public mint, protected mint
