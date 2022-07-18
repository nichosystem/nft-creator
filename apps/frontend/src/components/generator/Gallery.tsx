import { HeartIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { MetadataToken, Trait } from "../../types/metadata";
import { generateArt } from "../../utils/generate-art";

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

  useEffect(() => {
    const updateImages = async (page: MetadataToken[]) => {
      const art = await generateArt(page, traits, height, width);
      setImages(art.map((image) => image.toDataURL()));
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
      {currentImage !== -1 && (
        <Sidebar
          image={images[currentImage]}
          metadata={metadata[currentImage]}
          name={`Token #${(curPage - 1) * pageLength + currentImage + 1}`}
        />
      )}
    </>
  );
};

export default Gallery;

const Sidebar = ({
  image,
  metadata,
  name,
}: {
  image: string;
  metadata: MetadataToken;
  name: string;
}) => {
  return (
    <aside className="hidden w-96 bg-slate-900 p-8 border-l border-gray-200 overflow-y-auto lg:block">
      <div className="pb-16 space-y-6">
        <div>
          <div className="block w-full aspect-w-10 aspect-h-7 rounded-lg overflow-hidden">
            <img src={image} alt="" className="object-cover" />
          </div>
          <div className="mt-4 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-100">
                <span className="sr-only">Details for </span>
                {name}
              </h2>
              <p className="text-sm font-medium text-gray-400">
                {(image.length / Math.pow(1024, 2)).toFixed(2)} MB
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
            {metadata.attributes.map((trait, i) => (
              <div
                key={i}
                className="py-3 flex justify-between text-sm font-medium"
              >
                <dt className="text-gray-400">{trait.trait_type}</dt>
                <dd className="text-gray-100">{trait.value}</dd>
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
