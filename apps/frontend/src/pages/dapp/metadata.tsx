import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import RarityTable from "../../components/RarityTable";
import { Trait } from "../../types/metadata";
import { generateMetadata } from "../../utils/generate-metadata";

const Metadata: NextPage = () => {
  const [supply, setSupply] = useState(10);
  const [isUnique, setIsUnique] = useState(false);
  const [traits, setTraits] = useState<Trait[]>([
    {
      name: "Background",
      attributes: [
        {
          name: "None",
          weight: 5,
          dependency: "",
          exclusion: "",
        },
        {
          name: "Blue",
          weight: 2,
          dependency: "",
          exclusion: "",
        },
        {
          name: "Pink",
          weight: 3,
          dependency: "",
          exclusion: "",
        },
      ],
    },
  ]);

  const generate = () => {
    const g = generateMetadata(traits, supply, isUnique);
    console.log(g);
  };

  return (
    <>
      <Head>
        <title>Metadata Builder - NFT Tools</title>
        <meta name="description" content="" />
      </Head>

      <RarityTable traits={traits} setTraits={setTraits} />

      <div className="flex flex-col items-center mx-auto max-w-lg mt-24">
        <label className="mb-1 text-xl">Total Supply</label>
        <Input
          placeholder="Total Supply"
          type="number"
          name="supply"
          value={`${supply}`}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSupply(Number(e.target.value))
          }
        />
        <fieldset className="mt-2">
          <div className="relative flex items-center">
            <div className="flex items-center h-5">
              <input
                id="comments"
                name="comments"
                type="checkbox"
                className="focus:ring-sky-500 h-4 w-4 text-sky-500 border-gray-300 rounded"
                checked={isUnique}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setIsUnique(!isUnique)
                }
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="comments" className="font-medium text-slate-100">
                Prevent Duplicates
              </label>
              {/* <p className="text-slate-300">
                Prevent duplicate metadata from being generated.
              </p> */}
            </div>
          </div>
        </fieldset>
        <Button
          value="Generate"
          onClick={() => generate()}
          className="uppercase font-bold text-4xl mt-2"
        />
      </div>
    </>
  );
};

export default Metadata;
