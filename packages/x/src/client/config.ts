export interface ClientConfig {
  versions: {
    feature_switches: string;
    experiments: string;
    settings: string;
  };
  config: Record<string, { value: boolean | string | number }>;
  impressions: {
    key: string;
    bucket: string;
    version: number;
  }[];
  impression_pointers: Record<string, string[]>;
  [key: string]: unknown;
}
