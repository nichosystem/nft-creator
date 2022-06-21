export type Attribute = {
  name: string;
  weight: number;
  dependency: string;
  exclusion: string;
};

export type Trait = {
  name: string;
  attributes: Attribute[];
};
