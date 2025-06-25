interface PageCredential {
  userId: string;
  userAccessToken: string;
}

interface ClientCredential {
  appId: string;
  clientToken: string;
}

export type { PageCredential, ClientCredential };
