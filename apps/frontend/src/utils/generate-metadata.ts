import chooser from "random-seed-weighted-chooser";
import SparkMD5 from "spark-md5";
import seedrandom from "seedrandom";
import { Attribute, Trait } from "../types/metadata";

// Choose only from the passed array
const chooseFromList = (
  attributes: Attribute[],
  random: seedrandom.PRNG
): Attribute | undefined => {
  const a = chooser.chooseWeightedObject(attributes, "weight", 1, random());
  if (a) return a as Attribute;
  return;
};

// Exclude attributes and choose from the remaining
const chooseAndExclude = (
  trait: Trait,
  exclusions: Attribute[],
  random: seedrandom.PRNG
) => {
  return chooseFromList(
    trait.attributes.filter((a) => !exclusions.includes(a)),
    random
  );
};

export const generateMetadata = (
  traits: Trait[],
  supply: number,
  unique: boolean,
  seed?: string
): any[] => {
  const random = seedrandom(seed || "hello world");
  // Array of [supply] attributes
  var metadata: object[] = [];
  // Array of corresponding metadata[i] attributes stringified and hashed
  var hashes: string[] = [];

  for (let i = 0; i < supply; i++) {
    const attributes: any = {};

    // Choose an attribute for each trait
    traits.forEach((trait) => {
      attributes[trait.name] = chooseFromList(trait.attributes, random)?.name;
    });

    // Check if attribute combination is unique
    if (unique) {
      const hash = SparkMD5.hash(JSON.stringify(attributes));
      if (hashes.includes(hash)) {
        i--;
        continue;
      }
      hashes[i] = hash;
    }

    metadata[i] = attributes;
  }

  // Print stats
  console.log(
    "Combined hash of all metadata:",
    SparkMD5.hash(JSON.stringify(metadata))
  );

  return metadata.map((attributes, i) => {
    return {
      name: `Token #${i + 1}`,
      id: i + 1,
      image_url: `../images/${i + 1}`,
      ...attributes,
    };
  });
};
