import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState } from "react";
import DropdownButton from "../../components/button/DropdownButton";

const Generator: NextPage = () => {
  const fileInput = useRef<HTMLInputElement>(null);
  const directoryInput = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>([]);

  const handleFiles = (files: FileList) => {
    const image: string[] = [];
    for (let i = 0, f; (f = files[i]); i++) {
      if (f.type && !f.type.startsWith("image/")) return;
      image.push(URL.createObjectURL(f));
    }
    setImages(image);
  };

  return (
    <>
      <Head>
        <title>Generator - NFT Creator</title>
        <meta name="description" content="" />
      </Head>

      <div className="flex justify-center items-center flex-col h-full">
        <input
          type="file"
          ref={fileInput}
          multiple
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
          }}
          className="hidden"
        />
        <input
          type="file"
          ref={directoryInput}
          //@ts-ignore
          webkitdirectory="true"
          directory="true"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
          }}
          className="hidden"
        />
        <DropdownButton
          value="Upload Images"
          items={[
            {
              name: "Upload Images",
              onClick: () => fileInput.current?.click(),
            },
            {
              name: "Upload Folder",
              onClick: () => directoryInput.current?.click(),
            },
          ]}
          onClick={() => fileInput.current?.click()}
        />
        {images.length > 0 && <div>{images.length} images</div>}
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, i) => (
            <div
              className="border-2 border-sky-500 rounded-lg hover:shadow-sky-600 hover:shadow-md cursor-pointer"
              key={i}
            >
              <Image src={image} width="250px" height="250px" alt="" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Generator;
