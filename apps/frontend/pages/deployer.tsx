import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Code from "../components/Code";
import CONTRACT_CODE from "../data/contract-code";

const Home: NextPage = () => {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [maxSupply, setMaxSupply] = useState("");
  const [txLimit, setTxLimit] = useState("");

  const deploy = () => {
    console.log("deployed");
  };

  return (
    <>
      <Head>
        <title>Deployer - NFT Tools</title>
        <meta name="description" content="" />
      </Head>
      <div className="flex flex-row">
        <div className="w-1/2">
          <div className={`relative rounded-md shadow-sm`}>
            <input
              type="text"
              name="name"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-2 sm:text-sm border-gray-300 rounded-md"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <input
              type="text"
              name="symbol"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-2 sm:text-sm border-gray-300 rounded-md"
              placeholder="Symbol"
              onChange={(e) => setSymbol(e.target.value)}
              value={symbol}
            />
            <input
              type="number"
              name="supply"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-2 sm:text-sm border-gray-300 rounded-md"
              placeholder="Max Supply"
              onChange={(e) => setMaxSupply(e.target.value)}
              value={maxSupply}
            />
            <input
              type="number"
              name="txLimit"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-2 sm:text-sm border-gray-300 rounded-md"
              placeholder="Transaction Limit"
              onChange={(e) => setTxLimit(e.target.value)}
              value={txLimit}
            />
          </div>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => deploy()}
          >
            Deploy
          </button>
        </div>
        <div className="w-1/2 max-h-96 rounded-lg text-sm">
          <Code content={CONTRACT_CODE} />
        </div>
      </div>
    </>
  );
};

export default Home;
