/* This example requires Tailwind CSS v2.0+ */
import { Dispatch, Fragment, SetStateAction } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

export type SelectItem = {
  primary: string;
  secondary: string;
};

export default function SelectMenu({
  label,
  list,
  selected,
  setSelected,
}: {
  label: string;
  list: SelectItem[];
  selected: SelectItem;
  setSelected: Dispatch<SetStateAction<SelectItem | undefined>>;
}) {
  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium text-gray-200">
            {label}
          </Listbox.Label>
          <div className="mt-1 relative">
            <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <span className="w-full inline-flex truncate">
                <span className="truncate text-gray-800">
                  {selected.primary}
                </span>
                <span className="ml-2 truncate text-gray-400">
                  {selected.secondary}
                </span>
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {list.map((item) => (
                  <Listbox.Option
                    key={item.primary}
                    className={({ active }) =>
                      `${
                        active ? "text-white bg-indigo-600" : "text-gray-900"
                      } cursor-default select-none relative py-2 pl-3 pr-9`
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex">
                          <span
                            className={`${
                              selected ? "font-semibold" : "font-normal"
                            } truncate`}
                          >
                            {item.primary}
                          </span>
                          <span
                            className={`${
                              active ? "text-indigo-200" : "text-gray-500"
                            } ml-2 truncate`}
                          >
                            {item.secondary}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={`${
                              active ? "text-white" : "text-indigo-600"
                            } absolute inset-y-0 right-0 flex items-center pr-4`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
