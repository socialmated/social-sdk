interface Hashflag {
  hashtag: string;
  starting_timestamp_ms: number;
  ending_timestamp_ms: number;
  asset_url: string;
  is_hashfetti_enabled: boolean;
}

type HashflagResponse = Hashflag[];

export type { Hashflag, HashflagResponse };
