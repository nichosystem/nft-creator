import { useEffect, useState } from "react";
import { MetadataToken, Trait } from "../../types/metadata";
import { generateArt } from "../../utils/generate-art";
import GallerySidebar from "./GallerySidebar";

const Gallery = ({
  metadata,
  traits,
  height,
  width,
}: {
  metadata: MetadataToken[];
  traits: Trait[];
  height: number;
  width: number;
}) => {
  const pageLength = 16;
  const [currentImage, setCurrentImage] = useState(-1);
  const [curPage, setCurPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [images, setImages] = useState<string[]>([]);

  useEffect(
    () => setMaxPage(Math.ceil(metadata.length / pageLength)),
    [metadata]
  );

  // Generate images on page changes
  useEffect(() => {
    const updateImages = async (page: MetadataToken[]) => {
      const canvases = await generateArt(page, traits, height, width);
      setImages(canvases.map((canvas) => canvas.toDataURL()));
    };
    const start = (curPage - 1) * pageLength;
    const end =
      curPage * pageLength < metadata.length
        ? curPage * pageLength
        : metadata.length;
    const page = metadata.slice(start, end);
    updateImages(page);
  }, [curPage, metadata, traits, height, width]);

  const nextPage = () => {
    if (curPage < maxPage) setCurPage(curPage + 1);
  };

  const prevPage = () => {
    if (curPage > 1) setCurPage(curPage - 1);
  };

  return (
    <>
      <section className="mt-8 pb-16" aria-labelledby="gallery-heading">
        <ul
          role="list"
          className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
        >
          {images.map((image, i) => (
            <li key={i} className="relative">
              <div
                className={`${
                  currentImage === i
                    ? "ring-2 ring-offset-2 ring-sky-500"
                    : "focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-sky-500"
                } group block w-full rounded-lg overflow-hidden`}
                onClick={() => setCurrentImage(i)}
              >
                <img
                  src={image}
                  alt=""
                  className={`${
                    currentImage === i ? "" : "group-hover:opacity-75"
                  } object-cover pointer-events-none`}
                />
                <button
                  type="button"
                  className="absolute inset-0 focus:outline-none"
                >
                  <span className="sr-only">
                    View details for Token #{(curPage - 1) * pageLength + i + 1}
                  </span>
                </button>
              </div>
              <p className="mt-2 block text-sm font-medium text-gray-100 truncate pointer-events-none">
                Token #{(curPage - 1) * pageLength + i + 1}
              </p>
              <p className="block text-sm font-medium text-gray-500 pointer-events-none">
                {(image.length / Math.pow(1024, 2)).toFixed(2)} MB
              </p>
            </li>
          ))}
        </ul>
        {/* Pagination */}
        <nav
          className="px-4 py-3 mt-14 flex items-center justify-between border-t border-gray-200 sm:px-6"
          aria-label="Pagination"
        >
          <div className="hidden sm:block">
            <p className="text-sm text-gray-300">
              Showing{" "}
              <span className="font-medium">
                {(curPage - 1) * pageLength + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {curPage * pageLength < metadata.length
                  ? curPage * pageLength
                  : metadata.length}
              </span>{" "}
              of <span className="font-medium">{metadata.length}</span> results
            </p>
          </div>
          <div className="flex-1 flex justify-between sm:justify-end">
            <button
              onClick={() => prevPage()}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => nextPage()}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </nav>
      </section>
      <GallerySidebar
        index={currentImage}
        setIndex={setCurrentImage}
        image={images[currentImage]}
        metadata={metadata[(curPage - 1) * pageLength + currentImage]}
        name={`${(curPage - 1) * pageLength + currentImage + 1}.png`}
      />
    </>
  );
};

export default Gallery;
