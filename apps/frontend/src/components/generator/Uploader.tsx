import JSZip from "jszip";
import { saveAs } from "file-saver";
import { MetadataToken, Trait } from "../../types/metadata";
import Code from "../Code";
import Button from "../button/Button";
import { generateArt } from "../../utils/generate-art";
import { useState } from "react";

const Uploader = ({
  metadataJSON,
  setMetadataJSON,
  traits,
  height,
  width,
}: {
  metadataJSON: MetadataToken[];
  setMetadataJSON: (metadataJSON: MetadataToken[]) => void;
  traits: Trait[];
  height: number;
  width: number;
}) => {
  const [addPng, setAddPng] = useState(false);

  const updateImageUrl = (imageUrl: string) => {
    // Update imageURL for all metadataJSON
    const metadata = metadataJSON.map((metadata, i) => {
      return {
        ...metadata,
        image_url: `${imageUrl}${i}`,
      };
    });
    setMetadataJSON(metadata);
  };

  const saveImagesZip = async () => {
    // Generate all images
    const canvases = await generateArt(metadataJSON, traits, height, width);
    // Download the zip file
    const zip = new JSZip();
    const dir = zip.folder("images");
    if (!dir) return;
    const blobs = await Promise.all<Promise<Blob | null>[]>(
      canvases.map(async (canvas) => {
        return new Promise((r) => canvas.toBlob(r));
      })
    );
    blobs.forEach((blob, i) => {
      if (!blob) return;
      dir.file(`${i + 1}${addPng ? ".png" : ""}`, blob, { base64: true });
    });
    zip
      .generateAsync({ type: "blob" })
      .then((content) => saveAs(content, "images.zip"));
  };

  const saveMetadataZip = async () => {
    const zip = new JSZip();
    const dir = zip.folder("metadata");
    if (!dir) return;
    metadataJSON.forEach((token, i) => {
      dir.file(`${i + 1}`, JSON.stringify(token));
    });
    zip
      .generateAsync({ type: "blob" })
      .then((content) => saveAs(content, "metadata.zip"));
  };

  return (
    <>
      {metadataJSON.length > 0 && (
        <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:py-12 lg:px-8">
          <div className="mt-10 mb-6">
            <h2 className="text-2xl pb-2 font-medium text-slate-100">
              Download All Images
            </h2>
            <fieldset className="flex flex-col mb-2">
              <div className="relative flex items-center">
                <div className="flex items-center h-5">
                  <input
                    id="comments"
                    name="comments"
                    type="checkbox"
                    className="focus:ring-sky-500 h-4 w-4 text-sky-500 border-gray-300 rounded"
                    checked={addPng}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setAddPng(!addPng)
                    }
                    title="Add .png extension"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="comments" className="font-medium">
                    Add .png extension (for previewing images only)
                  </label>
                </div>
              </div>
            </fieldset>
            <Button value="Download Images" onClick={() => saveImagesZip()} />
          </div>

          <div className="mt-10 text-sm border-t-2 border-slate-200">
            <div className="mt-10 mb-6">
              <h2 className="text-2xl font-medium text-slate-100">
                Download Metadata Folder
              </h2>
              <p className="mt-3 mb-1">Set Image URL</p>
              <input
                className="pl-2 py-2 text-gray-800 focus:ring-sky-500 focus:border-sky-500 block w-full border-gray-300 rounded-md"
                name="image_url"
                placeholder="ipfs://qrpvhehnzmdwt2p6c1iuzsft7mzq/"
                onChange={(e) => updateImageUrl(e.target.value)}
              />
              <Button
                value="Download Metadata"
                onClick={() => saveMetadataZip()}
                className="mt-4"
              />
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

export default Uploader;
