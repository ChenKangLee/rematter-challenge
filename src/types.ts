export type CapturedInfo = {
  date: string;
  imgOriginal: string;
  imgProcessed: string;
};

export type Job = CapturedInfo & {
  id: number | null;
  status: string;
  name: string;
  text: ExtractedText;
};

export type ExtractedText = {
  matchedState?: string | null;
  matchedDLN?: string | null;
  matchedDOB?: string | null;
  matchedEXP?: string | null;
  matchedAddr1?: string | null;
  matchedAddr2?: string | null;
  matchedLN?: string | null;
  matchedFN?: string | null;
  matchedISS?: string | null;
  error?: string | null;
};
