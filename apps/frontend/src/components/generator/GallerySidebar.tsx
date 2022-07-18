import { HeartIcon } from "@heroicons/react/outline";
import { MetadataToken } from "../../types/metadata";

const GallerySidebar = ({
  index,
  setIndex,
  image,
  metadata,
  name,
}: {
  index: number;
  setIndex: (index: number) => void;
  image: string;
  metadata: MetadataToken;
  name: string;
}) => {
  return (
    <>
      {/* Blurred backdrop */}
      <div
        className={`bg-gray-900/50 backdrop-blur-[2px] fixed top-0 left-0 h-screen w-screen transition-all ${
          index === -1 ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        onClick={() => setIndex(-1)}
      ></div>
      {/* Sidebar */}
      <aside
        className={`z-10 fixed top-0 right-0 h-screen w-96 bg-slate-900 p-8 border-l border-gray-200 overflow-y-auto transition-all ${
          index === -1 ? "translate-x-full" : "translate-x-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {index !== -1 && (
          <div className="pb-16 space-y-6">
            <div>
              <div className="block w-full rounded-lg overflow-hidden">
                <img src={image} alt="" />
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
              <h3 className="font-medium text-gray-100">Metadata</h3>
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
              <a
                href={image}
                download={name}
                className="flex-1 text-center bg-sky-500 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                Download
              </a>
              <button
                type="button"
                className="flex-1 ml-3 bg-slate-900 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                Update
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default GallerySidebar;
