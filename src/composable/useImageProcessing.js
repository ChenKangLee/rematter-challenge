import { createWorker } from "tesseract.js";
import cv from "@techstark/opencv-js";

export default function useImgProcessing() {
  /* preprocessImage using OpenCV */
  const openCVProcessing = (mat) => {
    let dst = new cv.Mat();

    // convert to greyscale
    cv.cvtColor(mat, dst, cv.COLOR_BGR2GRAY);

    dst.convertTo(dst, -1, 1.35, 25);

    let sharpened = new cv.Mat();
    cv.GaussianBlur(dst, sharpened, new cv.Size(0, 0), 3);
    cv.addWeighted(dst, 1.5, sharpened, -0.5, 0, sharpened);

    // historgram equalization
    // cv.equalizeHist(dst, dst);

    // apply otsu thesholding
    // cv.threshold(dst, dst, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU);

    /*
    cv.adaptiveThreshold(
      dst,
      dst,
      255,
      cv.ADAPTIVE_THRESH_GAUSSIAN_C,
      cv.THRESH_BINARY_INV,
      5,
      4,
    );

    cv.distanceTransform(dst, dst, cv.DIST_L1, 3);
    cv.normalize(dst, dst, 0, 255, cv.NORM_MINMAX);
    dst.convertTo(dst, cv.CV_8U);

    // apply otsu thesholding
    cv.threshold(dst, dst, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU);

    const kernel_open = cv.getStructuringElement(
      cv.MORPH_ELLIPSE,
      new cv.Size(2, 3),
    );
    cv.morphologyEx(dst, dst, cv.MORPH_OPEN, kernel_open);

    const kernel_close = cv.getStructuringElement(
      cv.MORPH_RECT,
      new cv.Size(3, 3),
    );
    cv.morphologyEx(dst, dst, cv.MORPH_CLOSE, kernel_close);

    cv.bitwise_not(dst, dst);
  */
    return sharpened;
  };

  const processText = async (text) => {
    const worker = await createWorker("eng");

    return new Promise((resolve) => {
      worker.recognize(imageUrl).then(({ data: { text } }) => {
        resolve(text);
      });
    });
  };

  return { openCVProcessing, processText };
}
