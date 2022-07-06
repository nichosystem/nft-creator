export type Attribute = {
  name: string;
  weight: number;
  dependency?: string;
  exclusion?: string;
  imageUrl?: string;
  imageName?: string;
};

export type Trait = {
  name: string;
  attributes: Attribute[];
};

export type MetadataToken = {
  name: string;
  id: number;
  image_url: string;
  attributes: MetadataTrait[];
};

export type MetadataTrait = {
  trait_type: string;
  value: string;
};
