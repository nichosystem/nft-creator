import type { NextPage } from "next";
import Head from "next/head";
import Code from "../components/Code";

const Home: NextPage = () => {
  <Head>
    <title>Deployer - NFT Tools</title>
    <meta name="description" content="" />
  </Head>;
  return (
    <>
      <button
        className=""
        onClick={() => {
          console.log("deployed");
        }}
      >
        Deploy
      </button>
      <Code
        content={`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyToken is ERC721 {
    constructor() ERC721("MyToken", "MTK") {}
}`}
      />
    </>
  );
};

export default Home;
