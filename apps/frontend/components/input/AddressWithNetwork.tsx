export default function NetworkAddressInput({
  value,
  onChange,
  fullWidth,
}: any) {
  return (
    <div
      className={`relative rounded-md shadow-sm ${fullWidth ? "w-full" : ""}`}
    >
      <div className="absolute inset-y-0 left-0 flex items-center">
        <label htmlFor="network" className="sr-only">
          Network
        </label>
        <select
          name="network"
          className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-3 pr-6 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
        >
          <option>Mainnet</option>
          <option>Polygon</option>
          <option>Rinkeby</option>
          <option>Ropsten</option>
          <option>Mumbai</option>
        </select>
      </div>
      <input
        type="text"
        name="address"
        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-24 sm:text-sm border-gray-300 rounded-md"
        placeholder="0x12345567890"
        onChange={onChange}
        value={value}
      />
    </div>
  );
}
