import cv from "@techstark/opencv-js";
import { createWorker } from "tesseract.js";

export default function useImage() {
  // preprocessImage using OpenCV
  const processImage = (imageUrl) => {
    return new Promise((resolve) => {
      // create destination matrix
      let dst = new cv.Mat();

      // convert to greyscale
      cv.cvtColor(mat, dst, cv.COLOR_BGR2GRAY);

      // adjust contrast and brightness to enhance the text
      dst.convertTo(dst, -1, 1.4, 40);

      return dst;
    });
  };

  const tesseractRecognize = async (jobObj) => {
    const worker = await createWorker("eng");
    return new Promise((resolve) => {
      worker.recognize(imageUrl).then(({ data: { text } }) => {
        // logic to process the text

        resolve(text);
      });
    });
  };
}
