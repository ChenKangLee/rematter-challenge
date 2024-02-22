import { Image } from "image-js";
var ndarray = require("ndarray");

export default function useImgProcessing() {
  const preprocessImage = async (imageUrl) => {
    return new Promise((resolve) => {
      Image.load(imageUrl).then((image) => {
        const imgGreyScale = image.grey();

        let img2DArray = ndarray(imgGreyScale.data, [1280, 720]);

        imgGreyScale.data = require("distance-transform")(img2DArray);

        let opened = imgGreyScale.open();

        let mask = opened.mask({
          algorithm: "intermodes",
          invert: true,
        });

        resolve(imgGreyScale.toDataURL("image/png"));
      });
    });
  };

  return { preprocessImage };
}
