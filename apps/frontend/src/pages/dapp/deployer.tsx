import type { NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, useState } from "react";
import { useSigner } from "wagmi";
import Button from "../../components/button/Button";
import Code from "../../components/Code";
import Input from "../../components/input/Input";
import CONTRACT_CODE from "../../assets/contract-code";
import { deploy } from "../../provider/factory";
import { ExternalLinkIcon } from "@heroicons/react/outline";
import { handleTransaction } from "../../utils/handle-transaction";

const Deployer: NextPage = () => {
  const { data: signer } = useSigner();
  const [inputs, setInputs] = useState({
    name: "",
    symbol: "",
    maxSupply: "",
    txLimit: "",
  });

  const sendDeployTx = async () => {
    if (!signer) return;
    const tx = await deploy(
      signer,
      inputs.name,
      inputs.symbol,
      Number(inputs.maxSupply),
      Number(inputs.txLimit)
    );
    if (!tx) return;
    handleTransaction(tx, "Deploying NFT Contract");
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setInputs({ ...inputs, [e.target.name]: e.target.value });

  return (
    <>
      <Head>
        <title>Deployer - NFT Tools</title>
        <meta name="description" content="" />
      </Head>
      <div className="flex-1 xl:overflow-y-auto">
        <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:py-12 lg:px-8">
          <h1 className="text-3xl font-extrabold text-slate-100">
            NFT Contract Deployer
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Deploy an ERC721 contract in seconds.
          </p>
          <form className="space-y-8 divide-y divide-y-slate-200">
            <div className="pt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="name"
                  className="block text-base font-medium text-slate-100 mb-1"
                >
                  Name
                </label>
                <Input
                  value={inputs.name}
                  name="name"
                  onChange={handleChange}
                  placeholder="MetaMask NFTs"
                />
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="symbol"
                  className="block text-base font-medium text-slate-100 mb-1"
                >
                  Symbol
                </label>
                <Input
                  value={inputs.symbol}
                  name="symbol"
                  onChange={handleChange}
                  placeholder="MMNFT"
                />
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="maxSupply"
                  className="block text-base font-medium text-slate-100 mb-1"
                >
                  Max Supply
                </label>
                <Input
                  value={inputs.maxSupply}
                  name="maxSupply"
                  onChange={handleChange}
                  placeholder="10000"
                />
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="txLimit"
                  className="block text-base font-medium text-slate-100 mb-1"
                >
                  Max Mint per Transaction
                </label>
                <Input
                  value={inputs.txLimit}
                  name="txLimit"
                  onChange={handleChange}
                  placeholder="20"
                />
              </div>
            </div>
            <Button
              value="Deploy"
              onClick={() => sendDeployTx()}
              className="w-full"
            />
          </form>
          <div className="mt-10 text-sm border-t-2 border-slate-200">
            <div className="mt-10 mb-6">
              <h2 className="text-xl font-medium text-slate-100">
                Contract Code (Read-Only)
              </h2>
              <div className="mt-1 text-sm text-slate-500">
                Read the full ERC721 code below, or view it on{" "}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://github.com/nichosystem/nft-tools/blob/master/apps/protocol/contracts/NFTCollection.sol"
                  className="underline hover:no-underline"
                >
                  Github
                  <ExternalLinkIcon className="ml-1 mb-1 h-5 inline-block" />
                </a>
              </div>
            </div>
            <Code content={CONTRACT_CODE} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Deployer;
