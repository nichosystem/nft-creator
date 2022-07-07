import { ChangeEvent, useState } from "react";
import { Trait } from "../../types/metadata";
import Button from "../button/Button";
import Input from "../input/Input";

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
    label: "Seed",
    type: "text",
    placeholder: "Seed",
  },
  {
    name: Inputs.Width,
    label: "Width",
    type: "number",
    placeholder: "Width",
  },
  {
    name: Inputs.Height,
    label: "Height",
    type: "number",
    placeholder: "Height",
  },
];

const GenerateForm = ({
  traits,
  generate,
}: {
  traits: Trait[];
  generate: (
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
    <form className="space-y-8">
      <div className="pt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
        <div className="sm:col-span-3">
          {formInputs.map((input, i) => (
            <>
              <label
                htmlFor={input.name}
                className="block text-base font-medium text-slate-100 mb-1"
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
            </>
          ))}
        </div>
      </div>
      <fieldset className="mt-2 flex flex-col items-center">
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
            <label htmlFor="comments" className="font-medium text-slate-100">
              Prevent Duplicates
            </label>
          </div>
        </div>
        {traits.reduce((prod, trait) => prod * trait.attributes.length, 1) <
          Number(inputs.supply) &&
          isUnique && (
            <p className="text-rose-500 text-sm">
              Insufficient traits to generate unique metadata
            </p>
          )}
      </fieldset>
      <Button
        value="Generate"
        onClick={() =>
          generate(
            isUnique,
            Number(inputs.supply),
            inputs.seed,
            Number(inputs.width),
            Number(inputs.height)
          )
        }
        className="uppercase font-bold text-4xl mt-2 px-16"
      />
    </form>
  );
};

export default GenerateForm;
