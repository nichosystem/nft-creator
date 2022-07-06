import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import Button from "../../components/button/Button";
import Code from "../../components/Code";
import Input from "../../components/input/Input";
import RarityTable from "../../components/rarity-table/RarityTable";
import { MetadataToken, Trait } from "../../types/metadata";
import { generateArt } from "../../utils/generate-art";
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
        },
        {
          name: "Blue",
          weight: 2,
        },
        {
          name: "Pink",
          weight: 3,
        },
      ],
    },
  ]);
  const [metadataJSON, setMetadataJSON] = useState<MetadataToken[]>([]);
  const [images, setImages] = useState<HTMLCanvasElement[]>([]);

  const generate = () => {
    if (
      isUnique &&
      traits.reduce((prod, trait) => prod * trait.attributes.length, 1) < supply
    )
      return;
    const metadata = generateMetadata(traits, supply, isUnique);
    setMetadataJSON(metadata);
    const art = generateArt(metadata, traits, 250, 250);
    setImages(art);
    console.log(art);
  };

  return (
    <>
      <Head>
        <title>Metadata Builder - NFT Creator</title>
        <meta name="description" content="" />
      </Head>

      <RarityTable traits={traits} setTraits={setTraits} />

      {/* Form to begin generation */}
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
        <label className="mb-1 text-xl">Seed</label>
        <Input
          placeholder="Seed"
          type="number"
          name="supply"
          value={`${supply}`}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSupply(Number(e.target.value))
          }
        />
        <label className="mb-1 text-xl">Height</label>
        <Input
          placeholder="Seed"
          type="number"
          name="supply"
          value={`${supply}`}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSupply(Number(e.target.value))
          }
        />
        <label className="mb-1 text-xl">Width</label>
        <Input
          placeholder="Seed"
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

      {/* Display all metadata */}
      {metadataJSON.length > 0 && (
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
            <Code
              language="json"
              content={JSON.stringify(metadataJSON, null, 4)}
            />
          </div>
        </div>
      )}

      {/* Display images */}
      {images.length > 0 && (
        <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:py-12 lg:px-8">
          <div className="mt-10 text-sm border-t-2 border-slate-200">
            <div className="mt-10 mb-6">
              <h2 className="text-xl font-medium text-slate-100">All Images</h2>
              <div className="mt-1 text-sm text-slate-500">
                The images that were generated.
              </div>
            </div>
            <div className="flex flex-wrap">
              {images.map((image, index) => (
                <div key={index} className="w-full sm:w-1/2 md:w-1/3">
                  <img
                    src={image.toDataURL()}
                    alt="Metadata"
                    className="max-w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Metadata;
