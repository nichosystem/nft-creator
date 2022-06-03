import { ChangeEventHandler } from "react";

export default function Input({
  value,
  onChange,
  fullWidth,
}: {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  fullWidth: boolean;
}) {
  return (
    <div
      className={`relative rounded-md shadow-sm ${fullWidth ? "w-full" : ""}`}
    >
      <input
        type="text"
        name="address"
        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-2 sm:text-sm border-gray-300 rounded-md"
        placeholder="0x12345567890"
        onChange={onChange}
        value={value}
      />
    </div>
  );
}
