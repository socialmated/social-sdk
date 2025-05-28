interface Scripting {
  data: string;
  secPoisonId: string;
}

interface SbtSource {
  signVersion: string;
  xhsTokenUrl: string;
  extraInfo: string;
  url: string;
  commonPatch: string[];
  signUrl: string;
  reportUrl: string;
  desVersion: string;
  validate: boolean;
}

export type { Scripting, SbtSource };
