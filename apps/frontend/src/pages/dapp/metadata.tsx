import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import RarityTable from "../../components/RarityTable";
import { Trait } from "../../types/metadata";

const Metadata: NextPage = () => {
  const [supply, setSupply] = useState(100);
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

  return (
    <>
      <Head>
        <title>Metadata Builder - NFT Tools</title>
        <meta name="description" content="" />
      </Head>

      <RarityTable traits={traits} setTraits={setTraits} />

      <div className="flex flex-col items-center mx-auto max-w-lg mt-24">
        <label className="mb-1">Total Supply</label>
        <Input
          placeholder="Total Supply"
          type="number"
          name="supply"
          value={`${supply}`}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSupply(Number(e.target.value))
          }
        />
        <Button
          value="Generate"
          onClick={() => console.log("metadata generated")}
          className="uppercase font-bold text-4xl mt-2"
        />
      </div>
    </>
  );
};

export default Metadata;
