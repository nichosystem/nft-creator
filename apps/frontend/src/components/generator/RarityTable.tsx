import React, { Dispatch, SetStateAction } from "react";
import { Trait, Attribute } from "../../types/metadata";
import RarityTrait from "./RarityTrait";

const RarityTable = ({
  traits,
  setTraits,
}: {
  traits: Trait[];
  setTraits: Dispatch<SetStateAction<Trait[]>>;
}) => {
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

  const removeAttribute = (trait: Trait, attribute: Attribute) => {
    setTraits([
      ...traits.filter((t) => t !== trait),
      {
        ...trait,
        attributes: trait.attributes.filter((a) => a !== attribute),
      },
    ]);
  };

  const removeTrait = (trait: Trait) => {
    setTraits(traits.filter((t) => t !== trait));
  };

  const updateAttributeImage = (
    trait: Trait,
    attribute: Attribute,
    file: File
  ) => {
    if (!file || (file.type && !file.type.startsWith("image/"))) return;
    setTraits([
      ...traits.filter((t) => t !== trait),
      {
        ...trait,
        attributes: [
          ...trait.attributes.filter((a) => a !== attribute),
          {
            ...attribute,
            imageUrl: URL.createObjectURL(file),
            imageName: file.name,
          },
        ],
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

  const updateTraitName = (trait: Trait, name: string) => {
    setTraits([
      ...traits.filter((t) => t !== trait),
      {
        ...trait,
        name,
      },
    ]);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                <div className="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-nowrap">
                  <div className="ml-4 mt-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Rarity Table
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Create attributes under traits. Assign weights to make
                      each attribute more or less rare.
                    </p>
                  </div>
                  <div className="ml-4 mt-4 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => addTrait()}
                      className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                    >
                      Create New Trait
                    </button>
                  </div>
                </div>
              </div>
              <div className="min-w-full">
                <div className="bg-white shadow overflow-hidden">
                  <ul role="list" className="divide-y divide-gray-200">
                    {traits
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((trait, i) => (
                        <RarityTrait
                          key={`${trait.name}-${i}`}
                          trait={trait}
                          removeTrait={removeTrait}
                          updateTraitName={updateTraitName}
                          addAttribute={addAttribute}
                          removeAttribute={removeAttribute}
                          updateAttributeImage={updateAttributeImage}
                          updateAttributeName={updateAttributeName}
                          updateAttributeWeight={updateAttributeWeight}
                        />
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RarityTable;
