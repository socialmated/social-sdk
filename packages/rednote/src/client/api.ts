import { type HttpClient } from '@social-sdk/core/client';
import { createRednoteHttpClient, RednoteAPIEndpoints } from './http.js';
import { type RednoteCookieSession } from '@/auth/session.js';
import { type UserMe } from '@/types/user.js';
import { type ApiResponse } from '@/types/common.js';
import { type SearchRecommendResult } from '@/types/search.js';
import { type FeedResult, type HomeFeedResult } from '@/types/feed.js';
import { type CommentPageResult } from '@/types/note.js';

/**
 * A client for interacting with the Rednote Private API.
 *
 * This class provides methods to access various Rednote API endpoints including
 * user information, feeds, comments, and search functionality. All requests are
 * authenticated using a provided cookie session.
 *
 * @example
 * ```typescript
 * const session = new RednoteCookieSession(cookies);
 * const client = new RednoteAPIClient(session);
 *
 * // Get current user information
 * const user = await client.me();
 * console.log(user);
 * ```
 */
export class RednotePrivateAPIClient {
  /**
   * HTTP client instance for making requests to the v1 API endpoints.
   */
  private v1: HttpClient;

  /**
   * HTTP client instance for making requests to the v2 API endpoints.
   */
  private v2: HttpClient;

  /**
   * Creates a new instance of the API client.
   *
   * @param session - The Rednote cookie session used for authentication and request handling
   */
  constructor(session: RednoteCookieSession) {
    const http = createRednoteHttpClient(session);
    this.v1 = http.extend({ prefixUrl: RednoteAPIEndpoints.SnsWebV1 });
    this.v2 = http.extend({ prefixUrl: RednoteAPIEndpoints.SnsWebV2 });
  }

  public async me(): Promise<UserMe> {
    const resp = await this.v2.get('user/me').json<ApiResponse<UserMe>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch user info: ${resp.msg}`);
    }
    return resp.data;
  }

  public async homefeed(): Promise<HomeFeedResult> {
    const resp = await this.v2.post('homefeed').json<ApiResponse<HomeFeedResult>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch home feed: ${resp.msg}`);
    }
    return resp.data;
  }

  public async feed(): Promise<FeedResult> {
    const resp = await this.v1.post('feed').json<ApiResponse<FeedResult>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch feed: ${resp.msg}`);
    }
    return resp.data;
  }

  public async commentPage(): Promise<CommentPageResult> {
    const resp = await this.v2.get('comment/page').json<ApiResponse<CommentPageResult>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch comment page: ${resp.msg}`);
    }
    return resp.data;
  }

  public async searchRecommend(keyword: string): Promise<SearchRecommendResult> {
    const resp = await this.v1
      .get('search/recommend', {
        searchParams: {
          keyword,
        },
      })
      .json<ApiResponse<SearchRecommendResult>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch search recommendations: ${resp.msg}`);
    }
    return resp.data;
  }
}
