import { ChangeEventHandler } from "react";

export default function Input({
  value,
  onChange,
  name,
  placeholder,
  fullWidth,
  type,
}: {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  name: string;
  placeholder?: string;
  fullWidth?: boolean;
  type?: string;
}) {
  return (
    <div
      className={`relative rounded-md shadow-sm ${fullWidth ? "w-full" : ""}`}
    >
      <input
        type={type ? type : "text"}
        name={name}
        className="text-gray-800 focus:ring-sky-500 focus:border-sky-500 block w-full pl-2 sm:text-sm border-gray-300 rounded-md"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />
    </div>
  );
}
