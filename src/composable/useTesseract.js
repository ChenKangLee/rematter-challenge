import { createWorker } from "tesseract.js";

export default function useTesseract() {
  const recognize = async (imageUrl) => {
    const worker = await createWorker("eng");

    return new Promise((resolve) => {
      worker.recognize(imageUrl).then(({ data: { text } }) => {
        resolve(text);
      });
    });
  };

  return { recognize };
}
