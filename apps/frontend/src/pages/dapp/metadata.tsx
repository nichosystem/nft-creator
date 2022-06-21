import {
  ChevronDownIcon,
  ChevronUpIcon,
  PencilIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import type { NextPage } from "next";
import Head from "next/head";
import React, { ForwardedRef, ReactNode, useRef, useState } from "react";
import Button from "../../components/button/Button";

type Attribute = {
  name: string;
  weight: number;
  dependency: string;
  exclusion: string;
};

type Trait = {
  name: string;
  attributes: Attribute[];
};

const SmallButton = ({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}) => {
  return (
    <button
      className={`inline-flex items-center px-2 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const ContentEditable = ({
  value,
  setValue,
  forwardedRef,
  className,
}: {
  value: string;
  setValue: (value: string) => void;
  forwardedRef?: ForwardedRef<HTMLSpanElement>;
  className?: string;
}) => {
  return (
    <span
      contentEditable={true}
      suppressContentEditableWarning={true}
      className={`block w-min px-1 pt-1 border-b-2 border-transparent focus:border-b-gray-200 box-content group-hover:bg-gray-50 focus:!bg-gray-100 focus:outline-none ${className}`}
      ref={forwardedRef}
      onBlur={(e) => setValue(e.target.innerText)}
      onKeyDown={(e: React.KeyboardEvent<HTMLSpanElement>) => {
        // Keyboard shortcuts to finish editing
        if (e.key == "Enter" || e.key == "Tab" || e.key == "Escape") {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
      onFocus={(e) => {
        // Move cursor to end of text
        const selection = window.getSelection();
        if (!selection) return;
        const range = selection.getRangeAt(0);
        range.setStart(e.target, 1);
        range.setEnd(e.target, 1);
        selection.removeAllRanges();
        selection.addRange(range);
      }}
    >
      {value}
    </span>
  );
};

const WrappedContentEditable = React.forwardRef(
  (
    {
      value,
      setValue,
      className,
    }: {
      value: string;
      setValue: (value: string) => void;
      className?: string;
    },
    ref: ForwardedRef<HTMLSpanElement | null>
  ) => {
    return (
      <ContentEditable
        value={value}
        setValue={setValue}
        className={className}
        forwardedRef={ref}
      />
    );
  }
);

const Attribute = ({
  trait,
  attribute,
  getWeights,
  updateAttributeName,
  updateAttributeWeight,
  removeAttribute,
}: {
  trait: Trait;
  attribute: Attribute;
  updateAttributeName: (
    trait: Trait,
    attribute: Attribute,
    name: string
  ) => void;
  updateAttributeWeight: (
    trait: Trait,
    attribute: Attribute,
    weight: number
  ) => void;
  getWeights: (trait: Trait) => number;
  removeAttribute: (trait: Trait, attribute: Attribute) => void;
}) => {
  const nameRef = useRef<HTMLSpanElement | null>(null);

  return (
    <tr className={`border-gray-200 border-t group hover:bg-gray-50`}>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
        <div className="flex items-center">
          <WrappedContentEditable
            value={attribute.name}
            setValue={(value) => updateAttributeName(trait, attribute, value)}
            ref={nameRef}
          />
          <div className="relative pl-1 h-4">
            <div className="absolute hidden group-hover:inline-block cursor-pointer">
              <PencilIcon
                className="h-4"
                onClick={() => {
                  if (nameRef.current) nameRef.current.focus();
                }}
              />
            </div>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 flex items-center">
        <ContentEditable
          value={attribute.weight.toString()}
          setValue={(value) =>
            updateAttributeWeight(trait, attribute, Number(value))
          }
        />
        <div className="relative pl-2 h-4 -translate-y-1/2">
          <div className="absolute hidden group-hover:flex flex-col">
            <button
              onClick={() =>
                updateAttributeWeight(
                  trait,
                  attribute,
                  Number(attribute.weight + 1)
                )
              }
            >
              <ChevronUpIcon className="h-4" />
            </button>
            <button
              onClick={() =>
                updateAttributeWeight(
                  trait,
                  attribute,
                  Number(attribute.weight - 1)
                )
              }
            >
              <ChevronDownIcon className="h-4" />
            </button>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {((attribute.weight / getWeights(trait)) * 100).toFixed(2)}%
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {attribute.dependency}
      </td>
      <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <div className="w-10 block group-hover:hidden">
          {/* Maintain width while icon is not visible */}
        </div>
        <div className="hidden group-hover:block">
          <SmallButton onClick={() => removeAttribute(trait, attribute)}>
            <TrashIcon className="h-4 hover:text-red-800" />
          </SmallButton>
        </div>
      </td>
    </tr>
  );
};

const Trait = ({
  trait,
  removeTrait,
  updateTraitName,
  addAttribute,
  removeAttribute,
  updateAttributeName,
  updateAttributeWeight,
}: {
  trait: Trait;
  removeTrait: (trait: Trait) => void;
  updateTraitName: (trait: Trait, name: string) => void;
  addAttribute: (trait: Trait) => void;
  removeAttribute: (trait: Trait, attribute: Attribute) => void;
  updateAttributeName: (
    trait: Trait,
    attribute: Attribute,
    name: string
  ) => void;
  updateAttributeWeight: (
    trait: Trait,
    attribute: Attribute,
    weight: number
  ) => void;
}) => {
  const nameRef = useRef<HTMLSpanElement | null>(null);
  const getWeights = (trait: Trait) => {
    return trait.attributes.reduce((sum, cur) => sum + cur.weight, 0);
  };

  return (
    <>
      {/* Trait heaeder */}
      <tr className="border-t border-gray-200 group">
        <th
          scope="colgroup"
          className="bg-gray-50 px-4 py-2 text-left text-sm font-semibold text-gray-900 sm:px-6"
        >
          <div className="flex items-center">
            <WrappedContentEditable
              value={trait.name}
              setValue={(value) => updateTraitName(trait, value)}
              ref={nameRef}
            />
            <div className="relative pl-1 h-4">
              <div className="absolute hidden group-hover:inline-block cursor-pointer">
                <PencilIcon
                  className="h-4"
                  onClick={() => {
                    if (nameRef.current) nameRef.current.focus();
                  }}
                />
              </div>
            </div>
          </div>
        </th>
        <th
          colSpan={2}
          scope="colgroup"
          className="bg-gray-50 px-3 py-2 text-left text-sm font-semibold text-gray-900"
        >
          {getWeights(trait)}
        </th>
        <th
          colSpan={2}
          scope="colgroup"
          className="pl-3 pr-4 sm:pr-6 py-2 text-right bg-gray-50 text-sm font-semibold text-gray-900"
        >
          <SmallButton
            className="mr-1 hidden group-hover:inline-flex"
            onClick={() => removeTrait(trait)}
          >
            <TrashIcon className="h-4 hover:text-red-800" />
          </SmallButton>
          <SmallButton onClick={() => addAttribute(trait)}>
            <PlusCircleIcon className="h-4" />
          </SmallButton>
        </th>
      </tr>
      {/* Attributes */}
      {trait.attributes
        .sort((a, b) => b.weight - a.weight)
        .map((attribute, j) => (
          <Attribute
            key={`${trait.name}-${attribute.name}-${j}`}
            attribute={attribute}
            trait={trait}
            updateAttributeName={updateAttributeName}
            updateAttributeWeight={updateAttributeWeight}
            getWeights={getWeights}
            removeAttribute={removeAttribute}
          />
        ))}
    </>
  );
};

const Metadata: NextPage = () => {
  const [traits, setTraits] = useState<Trait[]>([
    {
      name: "Background",
      attributes: [
        {
          name: "None",
          weight: 5,
          dependency: "",
          exclusion: "",
        },
        {
          name: "Blue",
          weight: 2,
          dependency: "",
          exclusion: "",
        },
        {
          name: "Pink",
          weight: 3,
          dependency: "",
          exclusion: "",
        },
      ],
    },
  ]);

  const addTrait = () => {
    setTraits([
      ...traits,
      {
        name: `Trait ${traits.length + 1}`,
        attributes: [
          { name: `Attribute 1`, weight: 1, dependency: "", exclusion: "" },
        ],
      },
    ]);
  };

  const removeTrait = (trait: Trait) => {
    setTraits(traits.filter((t) => t !== trait));
  };

  const addAttribute = (trait: Trait) => {
    setTraits([
      ...traits.filter((t) => t !== trait),
      {
        ...trait,
        attributes: [
          ...trait.attributes,
          {
            name: `Attribute ${trait.attributes.length + 1}`,
            weight: 1,
            dependency: "",
            exclusion: "",
          },
        ],
      },
    ]);
  };

  const updateTraitName = (trait: Trait, name: string) => {
    setTraits([
      ...traits.filter((t) => t !== trait),
      {
        ...trait,
        name,
      },
    ]);
  };

  const removeAttribute = (trait: Trait, attribute: Attribute) => {
    setTraits([
      ...traits.filter((t) => t !== trait),
      {
        ...trait,
        attributes: trait.attributes.filter((a) => a !== attribute),
      },
    ]);
  };

  const updateAttributeName = (
    trait: Trait,
    attribute: Attribute,
    name: string
  ) => {
    setTraits([
      ...traits.filter((t) => t !== trait),
      {
        ...trait,
        attributes: [
          ...trait.attributes.filter((a) => a !== attribute),
          { ...attribute, name },
        ],
      },
    ]);
  };
  const updateAttributeWeight = (
    trait: Trait,
    attribute: Attribute,
    weight: number
  ) => {
    if (weight < 0) return;
    setTraits([
      ...traits.filter((t) => t !== trait),
      {
        ...trait,
        attributes: [
          ...trait.attributes.filter((a) => a !== attribute),
          { ...attribute, weight },
        ],
      },
    ]);
  };

  return (
    <>
      <Head>
        <title>Metadata Builder - NFT Tools</title>
        <meta name="description" content="" />
      </Head>

      <div className="px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl font-semibold text-slate-100">Rarity Table</h1>
        <p className="mt-2 text-sm text-slate-300">
          A list of all the traits, attributes, and rarities for each possible
          attribute.
        </p>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full">
                  <thead className="bg-white">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Attribute
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Weight
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        % Chance
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Dependency
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {traits
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((trait, i) => (
                        <Trait
                          key={`${trait.name}-${i}`}
                          trait={trait}
                          removeTrait={removeTrait}
                          updateTraitName={updateTraitName}
                          addAttribute={addAttribute}
                          removeAttribute={removeAttribute}
                          updateAttributeName={updateAttributeName}
                          updateAttributeWeight={updateAttributeWeight}
                        />
                      ))}
                  </tbody>
                </table>
                <nav
                  className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
                  aria-label="Pagination"
                >
                  <div className="flex-1 flex justify-between sm:justify-start">
                    <Button
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      value="Add Trait"
                      onClick={() => addTrait()}
                    />
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Metadata;
