interface ClientConfig {
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

enum XAPIEndpoints {
  /**
   * The base URL for X's v1.1 API endpoints.
   */
  V11 = 'https://x.com/i/api/1.1/',

  /**
   * The base URL for X's GraphQL API endpoints.
   */
  GraphQL = 'https://x.com/i/api/graphql/',
}

export { XAPIEndpoints };
export type { ClientConfig };
