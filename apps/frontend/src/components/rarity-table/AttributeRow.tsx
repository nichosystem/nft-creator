import {
  ChevronRightIcon,
  CubeTransparentIcon,
  PencilIcon,
  ScaleIcon,
  TrashIcon,
  UploadIcon,
} from "@heroicons/react/outline";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import Image from "next/image";
import { useRef, useState } from "react";
import { Attribute, Trait } from "../../types/metadata";
import SmallButton from "../button/SmallButton";
import WrappedContentEditable, { ContentEditable } from "../ContentEditable";

const AttributeRow = ({
  trait,
  attribute,
  getWeights,
  updateAttributeImage,
  updateAttributeName,
  updateAttributeWeight,
  removeAttribute,
}: {
  trait: Trait;
  attribute: Attribute;
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
  getWeights: (trait: Trait) => number;
  removeAttribute: (trait: Trait, attribute: Attribute) => void;
}) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLSpanElement | null>(null);

  return (
    <div className="block bg-white hover:bg-gray-50">
      <div className="flex items-center px-4 py-4 sm:px-6">
        <div className="min-w-0 flex-1 flex items-center">
          {/* Image and image uploader */}
          <div className="flex-shrink-0">
            <div
              className="h-12 w-12 rounded-xl border-2 border-gray-600 flex justify-center items-center group relative"
              onClick={() => fileInput.current?.click()}
            >
              <div className="hidden group-hover:block absolute z-10 rounded-lg bg-black bg-opacity-50 w-full h-full">
                <UploadIcon className="h-8 w-8 text-gray-100 mx-auto translate-y-1/4" />
              </div>
              <input
                type="file"
                ref={fileInput}
                onChange={(e) => {
                  if (e.target.files)
                    updateAttributeImage(trait, attribute, e.target.files[0]);
                }}
                className="hidden"
              />
              {attribute.imageUrl ? (
                <Image
                  className="rounded-lg"
                  src={attribute.imageUrl}
                  height="48px"
                  width="48px"
                  alt=""
                />
              ) : (
                <CubeTransparentIcon className="h-8 w-8 text-gray-600" />
              )}
            </div>
          </div>
          <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4 group">
            {/* Attribute name and image filename */}
            <div>
              <div className="flex items-center">
                <WrappedContentEditable
                  value={attribute.name}
                  setValue={(value) =>
                    updateAttributeName(trait, attribute, value)
                  }
                  ref={nameRef}
                  className="text-sky-500 group-hover:bg-gray-100"
                />
                <div className="relative pl-1 h-4">
                  <div className="absolute hidden group-hover:inline-block cursor-pointer">
                    <PencilIcon
                      className="h-4 text-gray-500"
                      onClick={() => {
                        if (nameRef.current) nameRef.current.focus();
                      }}
                    />
                  </div>
                </div>
              </div>
              <p className="flex items-center text-sm italic text-gray-400">
                {attribute.imageName || "no image"}
              </p>
            </div>
            {/* Weights / relative chance */}
            <div>
              <div className="flex items-center text-sm text-gray-500">
                <ScaleIcon
                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <ContentEditable
                  value={attribute.weight.toString()}
                  setValue={(value) =>
                    updateAttributeWeight(trait, attribute, Number(value))
                  }
                  className="group-hover:bg-gray-100"
                />
                <div className="relative pl-1 h-4 -translate-y-1/2 mb-[0.75px]">
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
                      <ChevronUpIcon className="h-4 -m-1 mt-1" />
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
                      <ChevronDownIcon className="h-4 -m-1 mt-[0.5px]" />
                    </button>
                  </div>
                </div>
              </div>
              <p className="mt-1 flex items-center text-sm text-gray-400">
                {((attribute.weight / getWeights(trait)) * 100).toFixed(2)}%
                chance
              </p>
            </div>
          </div>
        </div>
        <div>
          <SmallButton
            onClick={() => removeAttribute(trait, attribute)}
            tooltip="Delete Attribute"
          >
            <TrashIcon className="h-5 w-4 text-gray-600 hover:text-red-800" />
          </SmallButton>
        </div>
      </div>
    </div>
  );
};

export default AttributeRow;
