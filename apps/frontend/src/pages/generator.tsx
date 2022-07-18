import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import RarityTable from "../components/generator/RarityTable";
import { MetadataToken, Trait } from "../types/metadata";
import { generateArt } from "../utils/generate-art";
import { generateMetadata } from "../utils/generate-metadata";
import GenerateForm from "../components/generator/GenerateForm";
import Gallery from "../components/generator/Gallery";

import {
  ViewGridIcon as ViewGridIconSolid,
  ViewListIcon,
} from "@heroicons/react/solid";
import Uploader from "../components/generator/Uploader";
import { useLocalStorage } from "../hooks/use-local-storage";

const tabs = ["Rarity Table", "Image Gallery", "IPFS Uploader"];
const defaultTraits = [
  {
    name: "Background",
    attributes: [
      {
        name: "None",
        weight: 5,
      },
      {
        name: "Green",
        weight: 3,
      },
      {
        name: "Blue",
        weight: 2,
      },
    ],
  },
  {
    name: "Eye Color",
    attributes: [
      {
        name: "Blue",
        weight: 49,
      },
      {
        name: "Brown",
        weight: 49,
      },
      {
        name: "Red",
        weight: 2,
      },
    ],
  },
];

const Generator: NextPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [height, setHeight] = useState(500);
  const [width, setWidth] = useState(500);
  const [traits, setTraits] = useLocalStorage<Trait[]>("traits", defaultTraits);
  const [metadataJSON, setMetadataJSON] = useLocalStorage<MetadataToken[]>(
    "metadataJSON",
    []
  );

  const generate = (
    isUnique: boolean,
    supply: number,
    seed: string,
    h: number,
    w: number
  ) => {
    if (
      isUnique &&
      traits.reduce((prod, trait) => prod * trait.attributes.length, 1) < supply
    )
      return;
    setHeight(h);
    setWidth(w);
    const metadata = generateMetadata(traits, supply, isUnique, seed);
    setMetadataJSON(metadata);
    setActiveTab(1);
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
                              ? "border-sky-500 text-sky-500"
                              : "border-transparent text-gray-300 hover:text-gray-200 hover:border-gray-300"
                          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                          onClick={() => setActiveTab(i)}
                        >
                          {tab}
                        </button>
                      ))}
                    </nav>
                    {activeTab === 1 && (
                      <div className="hidden ml-6 bg-gray-100 p-0.5 rounded-lg items-center sm:flex">
                        <button
                          type="button"
                          className="p-1.5 rounded-md text-gray-400 hover:bg-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500"
                        >
                          <ViewListIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
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
                    )}
                  </div>
                </div>

                {/* Content */}
                {activeTab === 0 ? (
                  <>
                    <RarityTable traits={traits} setTraits={setTraits} />
                    <GenerateForm traits={traits} generate={generate} />
                  </>
                ) : activeTab === 1 ? (
                  <Gallery
                    metadata={metadataJSON}
                    traits={traits}
                    height={height}
                    width={width}
                  />
                ) : activeTab === 2 ? (
                  <Uploader metadataJSON={metadataJSON} />
                ) : null}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Generator;
