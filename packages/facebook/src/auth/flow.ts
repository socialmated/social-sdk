import { type AuthFlow } from '@social-sdk/auth/flow';
import { type PageCredential } from './credential.js';
import { type Page } from '@/types/page.js';

export class PageCredentialFlow implements AuthFlow<PageCredential, Page[]> {
  constructor(private readonly credential?: PageCredential) {}

  public async authenticate(credential?: PageCredential): Promise<Page[]> {
    const cred = credential ?? this.credential;
    if (!cred) {
      throw new Error('No credential provided for PageCredentialFlow');
    }

    const url = new URL(`https://graph.facebook.com/v23.0/${cred.userId}/accounts`);
    url.searchParams.set('access_token', cred.userAccessToken);

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch pages: ${res.statusText}`);
    }

    const data = (await res.json()) as Page[];

    return data;
  }
}
