import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { MetadataToken } from "../../types/metadata";
import Code from "../Code";

const Uploader = ({ metadataJSON }: { metadataJSON: MetadataToken[] }) => {
  const [canvases, setCanvases] = useState<HTMLCanvasElement[]>([]);

  const saveZip = async () => {
    const zip = new JSZip();
    const dir = zip.folder("images");
    if (!dir) return;
    const blobs = await Promise.all<Promise<Blob | null>[]>(
      canvases.map(async (canvas): Promise<Blob | null> => {
        return new Promise<Blob | null>((r) =>
          canvas.toBlob((blob) => r(blob))
        );
      })
    );
    blobs.forEach((blob, index) => {
      if (!blob) return;
      dir.file(`${index}.png`, blob, { base64: true });
    });
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "images.zip");
    });
  };

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

export default Uploader;
