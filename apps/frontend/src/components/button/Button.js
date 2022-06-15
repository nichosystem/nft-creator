export default function Button({ value, onClick }) {
  return (
    <button
      className="ml-4 flex-shrink-0 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
      onClick={onClick}
    >
      {value}
    </button>
  );
}
