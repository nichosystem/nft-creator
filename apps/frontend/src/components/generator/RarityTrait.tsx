import { ChevronDownIcon, PencilIcon } from "@heroicons/react/outline";
import { PuzzleIcon } from "@heroicons/react/solid";
import { useRef, useState } from "react";
import { Attribute, Trait } from "../../types/metadata";
import Button from "../button/Button";
import WrappedContentEditable from "../ContentEditable";
import RarityRow from "./RarityAttribute";

const RarityTrait = ({
  trait,
  removeTrait,
  updateTraitName,
  addAttribute,
  removeAttribute,
  updateAttributeImage,
  updateAttributeName,
  updateAttributeWeight,
}: {
  trait: Trait;
  removeTrait: (trait: Trait) => void;
  updateTraitName: (trait: Trait, name: string) => void;
  addAttribute: (trait: Trait) => void;
  removeAttribute: (trait: Trait, attribute: Attribute) => void;
  updateAttributeImage: (
    trait: Trait,
    attribute: Attribute,
    file: File
  ) => void;
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
  const [hideAttributes, setHideAttributes] = useState(true);
  const nameRef = useRef<HTMLSpanElement | null>(null);
  const getWeights = (trait: Trait) => {
    return trait.attributes.reduce((sum, cur) => sum + cur.weight, 0);
  };

  return (
    <li className="block hover:bg-gray-50 cursor-pointer">
      <div
        className="px-4 py-4 flex items-center sm:px-6"
        onClick={() => setHideAttributes(!hideAttributes)}
      >
        <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
          <div className="group">
            <div className="flex items-center relative">
              <WrappedContentEditable
                value={trait.name}
                setValue={(value) => updateTraitName(trait, value)}
                ref={nameRef}
                className="group-hover:bg-gray-100 text-sky-500 font-semibold"
              />
              <div className="relative pl-1 h-4">
                <div className="absolute hidden group-hover:inline-block cursor-pointer">
                  <PencilIcon
                    className="h-4 z-10 text-gray-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (nameRef.current) nameRef.current.focus();
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-2 flex">
              <div className="flex items-center text-sm text-gray-500">
                <PuzzleIcon
                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <p>{trait.attributes.length} attributes</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
            <div className="flex overflow-hidden -space-x-1">
              {trait.attributes.map((attribute, i) => {
                return (
                  attribute.imageUrl && (
                    <img
                      key={i}
                      className="h-6 w-6 inline-block rounded-full ring-2 ring-white bg-gray-50"
                      height="24px"
                      width="24px"
                      src={attribute.imageUrl}
                      alt=""
                    />
                  )
                );
              })}
            </div>
          </div>
        </div>
        <div className="ml-5 flex-shrink-0">
          <ChevronDownIcon
            className={`h-5 w-5 text-gray-400 transition ${
              hideAttributes ? "-rotate-90" : ""
            }`}
          />
        </div>
      </div>
      {!hideAttributes && (
        <>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul
              role="list"
              className="divide-y divide-gray-200 border-t border-gray-200"
            >
              {trait.attributes
                .sort((a, b) => b.weight - a.weight)
                .map((attribute, j) => (
                  <RarityRow
                    key={`${trait.name}-${attribute.name}-${j}`}
                    attribute={attribute}
                    trait={trait}
                    updateAttributeImage={updateAttributeImage}
                    updateAttributeName={updateAttributeName}
                    updateAttributeWeight={updateAttributeWeight}
                    getWeights={getWeights}
                    removeAttribute={removeAttribute}
                  />
                ))}
            </ul>
          </div>
          <nav
            className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
            aria-label="Pagination"
          >
            <div className="flex justify-start space-x-4">
              <Button
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                value="Add Attribute"
                onClick={() => addAttribute(trait)}
              />
              <Button
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                value="Delete Trait"
                onClick={() => removeTrait(trait)}
              />
            </div>
          </nav>
        </>
      )}
    </li>
  );
};

export default RarityTrait;
