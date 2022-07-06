import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import Button from "../components/button/Button";
import Code from "../components/Code";
import Input from "../components/input/Input";
import RarityTable from "../components/rarity-table/RarityTable";
import { MetadataToken, Trait } from "../types/metadata";
import { generateArt } from "../utils/generate-art";
import { generateMetadata } from "../utils/generate-metadata";

import { HeartIcon } from "@heroicons/react/outline";
import {
  ViewGridIcon as ViewGridIconSolid,
  ViewListIcon,
} from "@heroicons/react/solid";

const tabs = ["Rarity Table", "Image Gallery", "IPFS Uploader"];

const Metadata: NextPage = () => {
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
  const [activeTab, setActiveTab] = useState(0);
  const [images, setImages] = useState<HTMLCanvasElement[]>([]);

  const generate = (isUnique: boolean, supply: number) => {
    if (
      isUnique &&
      traits.reduce((prod, trait) => prod * trait.attributes.length, 1) < supply
    )
      return;
    const metadata = generateMetadata(traits, supply, isUnique);
    setMetadataJSON(metadata);
    const art = generateArt(metadata, traits, 250, 250);
    setImages(art);
  };

  return (
    <>
      <Head>
        <title>Metadata Builder - NFT Creator</title>
        <meta name="description" content="" />
      </Head>

      <div className="h-full flex">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex items-stretch overflow-hidden">
            <main className="flex-1 overflow-y-auto">
              <div className="pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-slate-100">
                  NFT Art Generator
                </h1>

                {/* Tabs */}
                <div className="mt-3 sm:mt-2">
                  <div className="flex items-center border-b border-gray-200">
                    <nav
                      className="flex-1 -mb-px flex space-x-6 xl:space-x-8"
                      aria-label="Tabs"
                    >
                      {tabs.map((tab, i) => (
                        <button
                          key={tab}
                          aria-current={activeTab === i ? "page" : undefined}
                          className={`
                          ${
                            activeTab == i
                              ? "border-sky-500 text-sky-600"
                              : "border-transparent text-gray-300 hover:text-gray-400 hover:border-gray-300"
                          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                          onClick={() => setActiveTab(i)}
                        >
                          {tab}
                        </button>
                      ))}
                    </nav>
                    <div className="hidden ml-6 bg-gray-100 p-0.5 rounded-lg items-center sm:flex">
                      <button
                        type="button"
                        className="p-1.5 rounded-md text-gray-400 hover:bg-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500"
                      >
                        <ViewListIcon className="h-5 w-5" aria-hidden="true" />
                        <span className="sr-only">Use list view</span>
                      </button>
                      <button
                        type="button"
                        className="ml-0.5 bg-white p-1.5 rounded-md shadow-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500"
                      >
                        <ViewGridIconSolid
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                        <span className="sr-only">Use grid view</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                {activeTab === 0 ? (
                  <>
                    <RarityTable traits={traits} setTraits={setTraits} />
                    <GenerateForm traits={traits} generate={generate} />
                  </>
                ) : activeTab === 1 ? (
                  <Gallery images={images} />
                ) : activeTab === 2 ? (
                  <MetadataUploader metadataJSON={metadataJSON} />
                ) : null}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Metadata;

const GenerateForm = ({
  traits,
  generate,
}: {
  traits: Trait[];
  generate: (isUnique: boolean, supply: number) => void;
}) => {
  const [supply, setSupply] = useState(10);
  const [isUnique, setIsUnique] = useState(false);

  return (
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
        onClick={() => generate(isUnique, supply)}
        className="uppercase font-bold text-4xl mt-2"
      />
    </div>
  );
};

const Gallery = ({ images }: { images: HTMLCanvasElement[] }) => {
  const files = [
    {
      name: "IMG_4985.HEIC",
      size: "3.9 MB",
      source:
        "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
      current: true,
    },
  ];

  return (
    <>
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

      <section className="mt-8 pb-16" aria-labelledby="gallery-heading">
        <h2 id="gallery-heading" className="sr-only">
          Recently viewed
        </h2>
        <ul
          role="list"
          className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
        >
          {files.map((file) => (
            <li key={file.name} className="relative">
              <div
                className={`${
                  file.current
                    ? "ring-2 ring-offset-2 ring-sky-500"
                    : "focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-sky-500"
                } group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 overflow-hidden`}
              >
                <img
                  src={file.source}
                  alt=""
                  className={`${
                    file.current ? "" : "group-hover:opacity-75"
                  } object-cover pointer-events-none`}
                />
                <button
                  type="button"
                  className="absolute inset-0 focus:outline-none"
                >
                  <span className="sr-only">View details for {file.name}</span>
                </button>
              </div>
              <p className="mt-2 block text-sm font-medium text-gray-100 truncate pointer-events-none">
                {file.name}
              </p>
              <p className="block text-sm font-medium text-gray-500 pointer-events-none">
                {file.size}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

const Sidebar = () => {
  const currentFile = {
    name: "IMG_4985.HEIC",
    size: "3.9 MB",
    source:
      "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
    information: {
      "Uploaded by": "Marie Culver",
      Created: "June 8, 2020",
      "Last modified": "June 8, 2020",
      Dimensions: "4032 x 3024",
      Resolution: "72 x 72",
    },
  };

  return (
    <aside className="hidden w-96 bg-slate-900 p-8 border-l border-gray-200 overflow-y-auto lg:block">
      <div className="pb-16 space-y-6">
        <div>
          <div className="block w-full aspect-w-10 aspect-h-7 rounded-lg overflow-hidden">
            <img src={currentFile.source} alt="" className="object-cover" />
          </div>
          <div className="mt-4 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-100">
                <span className="sr-only">Details for </span>
                {currentFile.name}
              </h2>
              <p className="text-sm font-medium text-gray-400">
                {currentFile.size}
              </p>
            </div>
            <button
              type="button"
              className="ml-4 bg-slate-900 rounded-full h-8 w-8 flex items-center justify-center text-gray-400 hover:bg-slate-800 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <HeartIcon className="h-6 w-6" aria-hidden="true" />
              <span className="sr-only">Favorite</span>
            </button>
          </div>
        </div>
        <div>
          <h3 className="font-medium text-gray-100">Information</h3>
          <dl className="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
            {Object.keys(currentFile.information).map((key) => (
              <div
                key={key}
                className="py-3 flex justify-between text-sm font-medium"
              >
                <dt className="text-gray-400">{key}</dt>
                {/* <dd className="text-gray-100">
                  {currentFile.information[key]}
                </dd> */}
              </div>
            ))}
          </dl>
        </div>
        <div className="flex">
          <button
            type="button"
            className="flex-1 bg-sky-500 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            Download
          </button>
          <button
            type="button"
            className="flex-1 ml-3 bg-slate-900 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            Delete
          </button>
        </div>
      </div>
    </aside>
  );
};

const MetadataUploader = ({
  metadataJSON,
}: {
  metadataJSON: MetadataToken[];
}) => {
  return (
    <>
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
    </>
  );
};
