import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { MetadataToken, Trait } from "../../types/metadata";
import Code from "../Code";
import Button from "../button/Button";
import { generateArt } from "../../utils/generate-art";

const Uploader = ({
  metadataJSON,
  traits,
  height,
  width,
}: {
  metadataJSON: MetadataToken[];
  traits: Trait[];
  height: number;
  width: number;
}) => {
  const saveZip = async () => {
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
      dir.file(`${i + 1}.png`, blob, { base64: true });
    });
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "images.zip");
    });
  };

  return (
    <>
      {metadataJSON.length > 0 && (
        <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:py-12 lg:px-8">
          <div className="mt-10 mb-6">
            <h2 className="text-2xl pb-2 font-medium text-slate-100">
              Download Images
            </h2>
            <Button value="Download Images" onClick={() => saveZip()} />
          </div>

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

export default Uploader;
