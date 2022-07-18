import type { NextPage } from "next";
import Head from "next/head";
import Input from "../components/Input";
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  FormEventHandler,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { erc721ABI, useProvider } from "wagmi";
import { ethers } from "ethers";
import Button from "../components/button/Button";

function Prompt({
  collection,
  setCollection,
  onSubmit,
}: {
  collection: string;
  setCollection: Dispatch<SetStateAction<string>>;
  onSubmit: FormEventHandler;
}) {
  return (
    <div className="max-w-lg mx-auto">
      <div>
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-slate-400"
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
          <h2 className="mt-2 text-lg font-medium text-slate-100">
            Token Holder Snapshot
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Add a collection&apos;s contract address to get a list of every
            token holder and which tokens they own.
          </p>
        </div>
        <form className="mt-6 flex" onSubmit={onSubmit}>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <Input
            value={collection}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setCollection(e.target.value)
            }
            name="address"
            placeholder="0xf39Fd6e51aad88F6F4Fb92266"
            fullWidth={true}
          />
          <Button value="Take snapshot" onClick={onSubmit} className="ml-4" />
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
  tokens: string[];
}) {
  const pageLength = 25;
  const [curPage, setCurPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [displayTokens, setDisplayTokens] = useState<{ [key: number]: string }>(
    {}
  );

  useEffect(
    () => setMaxPage(Math.ceil(totalSupply / pageLength)),
    [totalSupply]
  );

  useEffect(() => {
    const start = (curPage - 1) * pageLength + 1;
    const end =
      curPage * pageLength < totalSupply ? curPage * pageLength : totalSupply;
    const tokenObj: { [key: number]: string } = {};
    tokens.slice(start, end + 1).map((owner: string, i: number) => {
      tokenObj[start + i] = owner;
    });
    setDisplayTokens(tokenObj);
  }, [curPage, tokens, totalSupply]);

  const nextPage = () => {
    if (curPage < maxPage) setCurPage(curPage + 1);
  };

  const prevPage = () => {
    if (curPage > 1) setCurPage(curPage - 1);
  };

  const download = () => {
    const csv = tokens
      .map((owner: string, id: number) => `${id},${owner}`)
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
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
    <div className="px-4 sm:px-6 lg:px-8 pb-10">
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
            Export as CSV
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
                  {displayTokens &&
                    Object.keys(displayTokens).map((tokenID: string) => (
                      <tr key={tokenID}>
                        <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                          {tokenID}
                        </td>
                        <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
                          {displayTokens[Number(tokenID)]}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {/* Pagination */}
              <nav
                className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
                aria-label="Pagination"
              >
                <div className="hidden sm:block">
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(curPage - 1) * pageLength + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {curPage * pageLength < totalSupply
                        ? curPage * pageLength
                        : totalSupply}
                    </span>{" "}
                    of <span className="font-medium">{totalSupply}</span>{" "}
                    results
                  </p>
                </div>
                <div className="flex-1 flex justify-between sm:justify-end">
                  <button
                    onClick={() => prevPage()}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => nextPage()}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </nav>
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
  const [loading, setLoading] = useState(-1); // -1 is complete state
  const [tokens, setTokens] = useState<string[]>([]);

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
      const supply = Number(await contract.totalSupply());
      setTotalSupply(supply);
      getTokens(contract, supply);
    } catch (e) {
      console.log(e);
      setError("Could not get contract info");
      return;
    }
  };

  const getTokens = async (contract: ethers.Contract, supply: number) => {
    const owners = [];
    // Start with 0 in case token IDs are zero-indexed
    for (let i = 0; i <= supply; i++) {
      try {
        owners[i] = await contract.ownerOf(i);
        setLoading(i);
      } catch (e) {
        console.log(e);
      }
    }
    setTokens(owners);
    setLoading(-1);
  };

  return (
    <>
      <Head>
        <title>Snapshot - NFT Creator</title>
        <meta name="description" content="" />
      </Head>
      <Prompt
        collection={collection}
        setCollection={setCollection}
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          getCollectionInfo();
        }}
      />
      <div className="mt-8">
        {error ? (
          <p className="mx-auto text-center">{error}</p>
        ) : loading !== -1 ? (
          totalSupply != 0 && (
            // Loading bar
            <div className="w-72 bg-gray-300 rounded-full mx-auto">
              <div
                className="bg-indigo-600 text-xs font-medium text-indigo-100 text-center p-1 leading-none rounded-l-full"
                style={{ width: `${(loading / totalSupply) * 100}%` }}
              >
                {((loading / totalSupply) * 100).toFixed(2)}%
              </div>
            </div>
          )
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
