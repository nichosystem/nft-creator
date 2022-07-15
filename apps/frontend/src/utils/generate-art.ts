import { MetadataToken, Trait } from "../types/metadata";

export const generateArt = (
  metadata: MetadataToken[],
  traits: Trait[],
  height: number,
  width: number
): HTMLCanvasElement[] => {
  const images: HTMLCanvasElement[] = [];
  // Loop through all metadata that was generated
  for (let i = 0; i < metadata.length; i++) {
    const token = metadata[i];
    const layers: string[] = [];

    // Get each attribute's image in the correct layer order
    traits.forEach((trait) => {
      // Get the token's attribute for this trait
      const metadataTrait = metadata[i].attributes.find(
        (metadataTrait) => metadataTrait.trait_type == trait.name
      );
      // Get the corresponding image for this attribute
      const attribute = trait.attributes.find(
        (attr) => attr.name == metadataTrait?.value
      );
      if (attribute?.imageSrc) layers.push(attribute.imageSrc);
    });

    // Generate the art by layering each image
    const canvas = document.createElement("canvas");
    canvas.height = height;
    canvas.width = width;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get canvas context");
    layers.forEach((image) => {
      const img = document.createElement("img");
      img.src = image;
      ctx.drawImage(img, 0, 0, width, height);
    });
    images.push(canvas);
  }
  return images;
};
