import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import Button from "../../components/button/Button";
import Code from "../../components/Code";
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
  const [metadata, setMetadata] = useState<any[]>([]);

  const generate = () => {
    if (
      isUnique &&
      traits.reduce((prod, trait) => prod * trait.attributes.length, 1) < supply
    )
      return;
    const data = generateMetadata(traits, supply, isUnique);
    setMetadata(data);
  };

  return (
    <>
      <Head>
        <title>Metadata Builder - NFT Creator</title>
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
        <fieldset className="mt-2 flex flex-col items-center">
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
                title="Prevent duplicate metadata from being generated."
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="comments" className="font-medium text-slate-100">
                Prevent Duplicates
              </label>
            </div>
          </div>
          {traits.reduce((prod, trait) => prod * trait.attributes.length, 1) <
            supply &&
            isUnique && (
              <p className="text-rose-500 text-sm">
                Insufficient traits to generate unique metadata
              </p>
            )}
        </fieldset>
        <Button
          value="Generate"
          onClick={() => generate()}
          className="uppercase font-bold text-4xl mt-2"
        />
      </div>

      {metadata.length > 0 && (
        <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:py-12 lg:px-8">
          <div className="mt-10 text-sm border-t-2 border-slate-200">
            <div className="mt-10 mb-6">
              <h2 className="text-xl font-medium text-slate-100">
                All Metadata
              </h2>
              <div className="mt-1 text-sm text-slate-500">
                The JSON for all token metadata that was generated.
              </div>
            </div>
            <Code language="json" content={JSON.stringify(metadata, null, 4)} />
          </div>
        </div>
      )}
    </>
  );
};

export default Metadata;
