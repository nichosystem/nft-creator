import { HeartIcon } from "@heroicons/react/outline";

const Gallery = ({ images }: { images: HTMLCanvasElement[] }) => {
  const files = [
    {
      name: "IMG_4985.HEIC",
      size: "3.9 MB",
      source:
        "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
      current: true,
    },
  ];

  return (
    <>
      {images.length > 0 && (
        <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:py-12 lg:px-8">
          <div className="mt-10 text-sm border-t-2 border-slate-200">
            <div className="mt-10 mb-6">
              <h2 className="text-xl font-medium text-slate-100">All Images</h2>
              <div className="mt-1 text-sm text-slate-500">
                The images that were generated.
              </div>
            </div>
            <div className="flex flex-wrap">
              {images.map((image, index) => (
                <div key={index} className="w-full sm:w-1/2 md:w-1/3">
                  <img
                    src={image.toDataURL()}
                    alt="Metadata"
                    className="max-w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <section className="mt-8 pb-16" aria-labelledby="gallery-heading">
        <h2 id="gallery-heading" className="sr-only">
          Recently viewed
        </h2>
        <ul
          role="list"
          className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
        >
          {files.map((file) => (
            <li key={file.name} className="relative">
              <div
                className={`${
                  file.current
                    ? "ring-2 ring-offset-2 ring-sky-500"
                    : "focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-sky-500"
                } group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 overflow-hidden`}
              >
                <img
                  src={file.source}
                  alt=""
                  className={`${
                    file.current ? "" : "group-hover:opacity-75"
                  } object-cover pointer-events-none`}
                />
                <button
                  type="button"
                  className="absolute inset-0 focus:outline-none"
                >
                  <span className="sr-only">View details for {file.name}</span>
                </button>
              </div>
              <p className="mt-2 block text-sm font-medium text-gray-100 truncate pointer-events-none">
                {file.name}
              </p>
              <p className="block text-sm font-medium text-gray-500 pointer-events-none">
                {file.size}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default Gallery;

const Sidebar = () => {
  const currentFile = {
    name: "IMG_4985.HEIC",
    size: "3.9 MB",
    source:
      "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
    information: {
      "Uploaded by": "Marie Culver",
      Created: "June 8, 2020",
      "Last modified": "June 8, 2020",
      Dimensions: "4032 x 3024",
      Resolution: "72 x 72",
    },
  };

  return (
    <aside className="hidden w-96 bg-slate-900 p-8 border-l border-gray-200 overflow-y-auto lg:block">
      <div className="pb-16 space-y-6">
        <div>
          <div className="block w-full aspect-w-10 aspect-h-7 rounded-lg overflow-hidden">
            <img src={currentFile.source} alt="" className="object-cover" />
          </div>
          <div className="mt-4 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-100">
                <span className="sr-only">Details for </span>
                {currentFile.name}
              </h2>
              <p className="text-sm font-medium text-gray-400">
                {currentFile.size}
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
            {Object.keys(currentFile.information).map((key) => (
              <div
                key={key}
                className="py-3 flex justify-between text-sm font-medium"
              >
                <dt className="text-gray-400">{key}</dt>
                {/* <dd className="text-gray-100">
                    {currentFile.information[key]}
                  </dd> */}
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
