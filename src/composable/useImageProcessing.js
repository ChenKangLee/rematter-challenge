import { Image } from "image-js";

export default function useImgProcessing() {
  const preprocessImage = async (imageUrl) => {
    return new Promise((resolve) => {
      Image.load(imageUrl).then((image) => {
        const imgGreyScale = image.grey();
        let mask = imgGreyScale.mask({
          algorithm: "shanbhag",
        });
        resolve(mask.toDataURL("image/png"));
      });
    });
  };

  return { preprocessImage };
}
