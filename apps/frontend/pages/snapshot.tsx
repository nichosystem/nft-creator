import type { NextPage } from "next";
import Head from "next/head";
import NetworkAddressInput from "../components/input/Input";
import { useState } from "react";
import { erc721ABI, useProvider } from "wagmi";
import { ethers } from "ethers";

function Prompt({ collection, setCollection, onSubmit }: any) {
  return (
    <div className="max-w-lg mx-auto">
      <div>
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <h2 className="mt-2 text-lg font-medium text-gray-900">
            Token Holder Snapshot
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Add a collection&apos;s contract address to get a list of every
            token holder and which tokens they own.
          </p>
        </div>
        <form className="mt-6 flex" onSubmit={onSubmit}>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <NetworkAddressInput
            value={collection}
            onChange={(e: any) => setCollection(e.target.value)}
            fullWidth={true}
          />
          <button
            type="submit"
            className="ml-4 flex-shrink-0 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Take snapshot
          </button>
        </form>
      </div>
    </div>
  );
}

function Results({
  collection,
  name,
  totalSupply,
  tokens,
}: {
  collection: string;
  name: string;
  totalSupply: number;
  tokens: any;
}) {
  const download = () => {
    const blob = new Blob([JSON.stringify(tokens)], { type: "text/csv" });
    const a = document.createElement("a");
    a.download = "snapshot.csv";
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">{name}</h1>
          <p className="mt-2 text-sm text-gray-700">
            {totalSupply.toString()} total supply
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => download()}
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Export
          </button>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Token ID
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Owner
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {tokens.map((owner: string, id: any) => (
                    <tr key={id}>
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                        {id}
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
                        {owner}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Snapshot: NextPage = () => {
  const provider = useProvider();
  const [collection, setCollection] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [totalSupply, setTotalSupply] = useState(0);
  const [loading, setLoading]: [any, any] = useState("Complete");
  const [tokens, setTokens]: [any, any] = useState([]);

  const getCollectionInfo = async () => {
    if (collection.length !== 42) {
      setError("Invalid contract address");
      return;
    }
    const contract = new ethers.Contract(collection, erc721ABI, provider);
    setError("");
    setName("");
    setLoading(0);
    try {
      setName(await contract.name());
      setTotalSupply(Number(await contract.totalSupply()));
    } catch (e: any) {
      console.log(e);
      setError("Could not get contract info");
      return;
    }
    getTokens(contract);
  };

  const getTokens = async (contract: ethers.Contract) => {
    const owners = [];
    // Start with 0 in case token IDs are zero-indexed
    for (let i = 0; i <= 10; i++) {
      try {
        owners[i] = await contract.ownerOf(i);
        setLoading(i);
      } catch (e) {
        console.log(e);
      }
    }
    setTokens(owners);
    setLoading("Complete");
  };

  return (
    <>
      <Head>
        <title>Snapshot - NFT Tools</title>
        <meta name="description" content="" />
      </Head>
      <Prompt
        collection={collection}
        setCollection={setCollection}
        onSubmit={(e: any) => {
          e.preventDefault();
          getCollectionInfo();
        }}
      />
      <div className="mt-8">
        {error ? (
          <p className="mx-auto text-center">{error}</p>
        ) : loading !== "Complete" ? (
          <div className="w-72 bg-gray-300 rounded-full mx-auto">
            <div
              className="bg-indigo-600 text-xs font-medium text-indigo-100 text-center p-1 leading-none rounded-l-full"
              style={{ width: `${(loading / totalSupply) * 100}%` }}
            >
              {((loading / totalSupply) * 100).toFixed(2)}%
            </div>
          </div>
        ) : name ? (
          <Results
            collection={collection}
            name={name}
            totalSupply={totalSupply}
            tokens={tokens}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Snapshot;

/* TODO
1. Pagination
2. Transform exported JSON to CSV
3. Sort by top token holders: owners.map((val) => (data[val] ? data[val]++ : (data[val] = 1)))
*/
