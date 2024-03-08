import Tesseract, { createWorker } from "tesseract.js";
import cv, { Mat } from "@techstark/opencv-js";
import Fuse from "fuse.js";
import { ExtractedText } from "../types";

type Dictionary = { [index: string]: RegExp };

export default function useImgProcessing() {
  const states = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

  const licenseRule: Dictionary = {
    Alabama: /[0-9]{7,8}/g,
    Alaska: /[0-9]{7}/g,
    Arizona: /(?:[A-Z]{1}[0-9]{8}|[0-9]{9})/g,
    Arkansas: /[0-9]{9}/g,
    California: /[A-Z]{1}[0-9]{7}/g,
    Colorado: /[0-9]{2}-[0-9]{3}-[0-9]{4}/g,
    Connecticut: /[0-9]{9}/g,
    Delaware: /[0-9]{7}/g,
    Florida: /[A-Z]{1}[0-9]{3}-[0-9]{3}-[0-9]{2}-[0-9]{3}-[0-9]/g,
    Georgia: /[0-9]{7,9}/g,
    Hawaii: /[A-Z]{1}[0-9]{8}/g,
    Idaho: /(?:[A-Z]{2}[0-9]{6}[A-Z]{1}|[0-9]{9})/g,
    Illinois: /[A-Z]{1}[0-9]{11}/g,
    Indiana: /[0-9]{4}-[0-9]{2}-[0-9]{4}/g,
    Iowa: /[0-9]{9}/g,
    Kansas: /(?:[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}|[0-9]{9})/g,
    Kentucky: /[A-Z]{1}[0-9]{8,9}/g,
    Louisiana: /[0-9]{1,9}/g,
    Maine: /[0-9]{7}/g,
    Maryland: /[A-Z]{1}[0-9]{12}/g,
    Massachusetts: /(?:[A-Z]{1}[0-9]{8}|[0-9]{9})/g,
    Michigan: /[A-Z]{1}[0-9]{12}/g,
    Minnesota: /[A-Z]{1}[0-9]{12}/g,
    Mississippi: /[0-9]{9}/g,
    Missouri: /(?:[A-Z]{1}[0-9]{5,9}|[0-9]{9}[A-Z]{0,1})/g,
    Montana: /[0-9]{13}/g,
    Nebraska: /[A-Z]{1}[0-9]{6,8}/g,
    Nevada: /[0-9]{9,10}/g,
    "New Hampshire": /[0-9]{2}[A-Z]{3}[0-9]{5}/g,
    "New Jersey": /[A-Z]{1}[0-9]{14}/g,
    "New Mexico": /[0-9]{8,9}/g,
    "New York": /(?:[A-Z]{1}[0-9]{7}|[A-Z]{1}[0-9]{18}|[0-9]{8,9}|[0-9]{16})/g,
    "North Carolina": /[0-9]{1,12}/g,
    "North Dakota": /(?:[A-Z]{3}[0-9]{6}|[0-9]{9})/g,
    Ohio: /(?:[A-Z]{2}[0-9]{6}|[0-9]{8})/g,
    Oklahoma: /[A-Z]{1}[0-9]{9}/g,
    Oregon: /[0-9]{1,9}/g,
    Pennsylvania: /[0-9]{8}/g,
    "Rhode Island": /(?:[0-9]{7}|[A-Z]{1}[0-9]{6})/g,
    "South Carolina": /[0-9]{5,11}/g,
    "South Dakota": /[0-9]{6,10}/g,
    Tennessee: /[0-9]{7,9}/g,
    Texas: /[0-9]{7,8}/g,
    Utah: /[0-9]{4,10}/g,
    Vermont: /(?:[0-9]{8}|[A-Z]{1}[0-9]{6})/g,
    Virginia: /(?:[A-Z]{1}[0-9]{8,11}|[0-9]{9})/g,
    Washington: /(?:[A-Z]{1,7}[A-Z0-9]{0,4}[0-9]{2}[A-Z]{0,3})/g,
    "West Virginia": /(?:[A-Z]{1,2}[0-9]{5,6})/g,
    Wisconsin: /[A-Z]{1}[0-9]{13}/g,
    Wyoming: /[0-9]{9,10}/g,
  };

  /* preprocessImage using OpenCV */
  const openCVProcessing = (mat: Mat): Mat => {
    let dst = new cv.Mat();

    // convert to greyscale
    cv.cvtColor(mat, dst, cv.COLOR_BGR2GRAY);

    // adjust contrast and brightness
    dst.convertTo(dst, -1, 1.35, 25);

    // sharpen
    let sharpened = new cv.Mat();
    cv.GaussianBlur(dst, sharpened, new cv.Size(0, 0), 3);
    cv.addWeighted(dst, 1.5, sharpened, -0.5, 0, sharpened);

    return sharpened;
  };

  const extractText = async (imageUrl: string) => {
    const worker = await createWorker("eng");

    return new Promise<ExtractedText>((resolve, reject) => {
      worker.recognize(imageUrl).then((res) => {
        try {
          resolve(_fuzzyMatchFields(res));
        } catch (error) {
          reject(error);
        }
      });
    });
  };

  /* Extracted Text Post Processing */
  const _fuzzyMatchFields = (recognitionRes: Tesseract.RecognizeResult) => {
    const {
      data: { lines, words },
    } = recognitionRes;

    // Preprocessing, replacing characters that Tesseract often gets wrong
    let linesProcessed = lines.map((obj) => {
      return (
        obj.text
          .replace(/[ÀÁÂÃÄÅàáâãäåΑАа]/gi, "A")
          .replace(/[ΒВвß]/gi, "B")
          .replace(/[ÇçĆćĈĉĊċČčΧχСс]/gi, "C")
          .replace(/[ĎďĐđÐðΔДд]/gi, "D")
          .replace(/[ÈÉÊËèéêëΕЕе]/gi, "E")
          .replace(/[ƑƒϜϝҒғ]/gi, "F")
          .replace(/[ĜĝĞğĠġĢģΓГг]/gi, "G")
          .replace(/[ĤĥĦħΗНн]/gi, "H")
          .replace(/[ÌÍÎÏìíîïΙІіЇї]/gi, "I")
          .replace(/[ĴĵЈј]/gi, "J")
          .replace(/[ĶķΚКк]/gi, "K")
          .replace(/[ĹĺĻļĽľĿŀŁłΛЛл|]/gi, "L")
          .replace(/[ΜМм]/gi, "M")
          .replace(/[ÑñŃńŅņŇňΝНн]/gi, "N")
          .replace(/[ÒÓÔÕÖØòóôõöøΟОоΩω]/gi, "O")
          .replace(/[ΡРрϷϸ]/gi, "P")
          // Q has no replacements
          .replace(/[ŔŕŖŗŘřΡРр]/gi, "R")
          .replace(/[ŚśŜŝŞşŠšЅѕ]/gi, "S")
          .replace(/[ŢţŤťŦŧΤТт]/gi, "T")
          .replace(/[ÙÚÛÜùúûüΥυУу]/gi, "U")
          .replace(/[Ѵѵ]/gi, "V")
          .replace(/[Ŵŵ]/gi, "W")
          .replace(/[ΧχХх]/gi, "X")
          .replace(/[ÝýÿŶŷŸΥΫϒУу¥]/gi, "Y")
          .replace(/[ŹźŻżŽžΖЗз]/gi, "Z")
          .trim()
      );
    });

    // Get States of the drivers license by reverse-fuzzy search states on the processedText
    const fuse = new Fuse(linesProcessed, { includeScore: true });
    // Loop thru all the state and search one by one
    let matchedState = null;
    for (let state of states) {
      const result = fuse.search(`${state}|'${state}`);
      if (result.length > 0) {
        matchedState = state;
      }
    }

    // Now knowing which state the license is from, we can parse DL accordingly from the `words`
    // We still need to preprocess the words too
    let wordsProcessed = words.map((obj) => {
      return (
        obj.text
          .replace(/[ÀÁÂÃÄÅàáâãäåΑАа]/gi, "A")
          .replace(/[ΒВвß]/gi, "B")
          .replace(/[ÇçĆćĈĉĊċČčΧχСс]/gi, "C")
          .replace(/[ĎďĐđÐðΔДд]/gi, "D")
          .replace(/[ÈÉÊËèéêëΕЕе]/gi, "E")
          .replace(/[ƑƒϜϝҒғ]/gi, "F")
          .replace(/[ĜĝĞğĠġĢģΓГг]/gi, "G")
          .replace(/[ĤĥĦħΗНн]/gi, "H")
          .replace(/[ÌÍÎÏìíîïΙІіЇї]/gi, "I")
          .replace(/[ĴĵЈј]/gi, "J")
          .replace(/[ĶķΚКк]/gi, "K")
          .replace(/[ĹĺĻļĽľĿŀŁłΛЛл]/gi, "L")
          .replace(/[ΜМм]/gi, "M")
          .replace(/[ÑñŃńŅņŇňΝНн]/gi, "N")
          .replace(/[ÒÓÔÕÖØòóôõöøΟОоΩω]/gi, "O")
          .replace(/[ΡРрϷϸ]/gi, "P")
          // Q has no replacements
          .replace(/[ŔŕŖŗŘřΡРр]/gi, "R")
          .replace(/[ŚśŜŝŞşŠšЅѕ]/gi, "S")
          .replace(/[ŢţŤťŦŧΤТт]/gi, "T")
          .replace(/[ÙÚÛÜùúûüΥυУу]/gi, "U")
          .replace(/[Ѵѵ]/gi, "V")
          .replace(/[Ŵŵ]/gi, "W")
          .replace(/[ΧχХх]/gi, "X")
          .replace(/[ÝýÿŶŷŸΥΫϒУу¥]/gi, "Y")
          .replace(/[ŹźŻżŽžΖЗз]/gi, "Z")
      );
    });

    let matchedDLN = null;
    if (matchedState) {
      for (let w of wordsProcessed) {
        const matches = w.match(licenseRule[matchedState]);
        if (matches) matchedDLN = matches[0];
      }
    }

    // DOB
    let matchedDOB = null;
    for (let dobStr of linesProcessed) {
      const matches = dobStr.match(
        /(\b[a-zA-Z]?o[a-zA-Z]\b)\s[0-9]{2}\/[0-9]{2}\/[0-9]{4}/i,
      );
      if (matches) matchedDOB = matches[0].split(" ").slice(-1)[0];
    }

    // EXP
    let matchedEXP = null;
    const expSearch = fuse.search(`exp`);
    if (expSearch.length > 0) {
      for (let expStr of expSearch) {
        const matches = expStr.item.match(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/);
        if (matches) matchedEXP = matches[0];
      }
    }

    // LN
    let matchedLN = null;
    for (let lnStr of linesProcessed) {
      const matches = lnStr.match(/LN\s+[A-Z\-]+/i);
      if (matches) {
        matchedLN = matches[0].split(" ").slice(-1)[0];
      }
    }

    // FN
    let matchedFN = null;
    for (let fnStr of linesProcessed) {
      const matches = fnStr.match(/(FN|rn)\s+[A-Z\-]+/i);
      if (matches) {
        matchedFN = matches[0].split(" ").slice(-1)[0];
      }
    }

    // Address line 1
    let matchedAddr1 = null;
    for (let addrStr of linesProcessed) {
      const matches = addrStr.match(/\b\d{1,6}\s(\b\w*\b\s){1,7}\w*\.?$/i);
      if (matches) {
        // here we take the whole line
        matchedAddr1 = matches[0];
      }
    }

    // Address line 2 (city, state, zip)
    let matchedAddr2 = null;
    for (let addrStr of linesProcessed) {
      const matches = addrStr.match(/[A-Z\s]+,\s[A-Z]{2}\s\d{5}(-\d{4})?/);
      if (matches) {
        matchedAddr2 = matches[0];
      }
    }

    // Issue date
    let matchedISS = null;
    for (let issStr of wordsProcessed) {
      const matches = issStr.match(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/);
      if (matches) {
        matchedISS = matches[0];
      }
    }

    const toReturn: ExtractedText = {
      matchedState,
      matchedDLN,
      matchedDOB,
      matchedEXP,
      matchedAddr1,
      matchedAddr2,
      matchedLN,
      matchedFN,
      matchedISS,
    };

    return toReturn;
  };

  return { openCVProcessing, extractText };
}
