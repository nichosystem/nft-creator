import { ChangeEvent, useState } from "react";
import { Trait } from "../../types/metadata";
import Button from "../button/Button";
import Input from "../Input";

enum Inputs {
  Supply = "supply",
  Seed = "seed",
  Width = "width",
  Height = "height",
}

type FormInput = {
  name: Inputs;
  label: string;
  type: string;
  placeholder: string;
};

const formInputs: FormInput[] = [
  {
    name: Inputs.Supply,
    label: "Total Supply",
    type: "number",
    placeholder: "Total Supply",
  },
  {
    name: Inputs.Seed,
    label: "Random Seed",
    type: "text",
    placeholder: "Seed",
  },
  {
    name: Inputs.Width,
    label: "Width (px)",
    type: "number",
    placeholder: "Width",
  },
  {
    name: Inputs.Height,
    label: "Height (px)",
    type: "number",
    placeholder: "Height",
  },
];

const GenerateForm = ({
  traits,
  generateMetadata,
}: {
  traits: Trait[];
  generateMetadata: (
    isUnique: boolean,
    supply: number,
    seed: string,
    height: number,
    width: number
  ) => void;
}) => {
  const [isUnique, setIsUnique] = useState(false);
  const [inputs, setInputs] = useState<Record<Inputs, string>>({
    [Inputs.Supply]: "10",
    [Inputs.Seed]: "0x00000000000000000",
    [Inputs.Width]: "500",
    [Inputs.Height]: "500",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setInputs({ ...inputs, [e.target.name]: e.target.value });

  return (
    <form className="mt-24 mb-8 p-8 rounded-md max-w-4xl mx-auto bg-gray-50 text-gray-800">
      <h3 className="text-lg leading-6 font-medium text-gray-900">
        Generate Art &amp; Metadata
      </h3>
      <div className="pt-4 grid grid-cols-2 gap-x-6 gap-y-4">
        {formInputs.map((input, i) => (
          <div key={i}>
            <label
              htmlFor={input.name}
              className="block text-base font-medium mb-1"
            >
              {input.label}
            </label>
            <Input
              value={inputs[input.name]}
              name={input.name}
              type={input.type}
              onChange={handleChange}
              placeholder={input.placeholder}
            />
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between">
        <fieldset className="flex flex-col">
          <div className="relative flex items-center">
            <div className="flex items-center h-5">
              <input
                id="comments"
                name="comments"
                type="checkbox"
                className="focus:ring-sky-500 h-4 w-4 text-sky-500 border-gray-300 rounded"
                checked={isUnique}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setIsUnique(!isUnique)
                }
                title="Prevent duplicate metadata from being generated."
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="comments" className="font-medium">
                Prevent Duplicates
                <span className="text-gray-400">
                  {" ("}
                  {traits.reduce(
                    (prod, trait) => prod * trait.attributes?.length,
                    1
                  )}{" "}
                  combinations possible{")"}
                </span>
              </label>
            </div>
          </div>
          <p className="text-sm">
            {isUnique &&
              traits.reduce(
                (prod, trait) => prod * trait.attributes?.length,
                1
              ) < Number(inputs.supply) && (
                <span className="text-rose-500 text-sm">
                  Insufficient traits to generate {inputs.supply} unique tokens
                </span>
              )}
          </p>
        </fieldset>
        <Button
          value="Generate"
          onClick={(e) => {
            e.preventDefault();
            generateMetadata(
              isUnique,
              Number(inputs.supply),
              inputs.seed,
              Number(inputs.width),
              Number(inputs.height)
            );
          }}
          className="uppercase text-base px-6"
        />
      </div>
    </form>
  );
};

export default GenerateForm;
