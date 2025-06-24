import { type OptionsInit, type PaginateData, type HttpClient } from '@social-sdk/client/http';
import { PrivateAPIClient } from '@social-sdk/client/api';
import { createRednoteHttpClient, RednoteAPIEndpoints } from './http.js';
import { type RednoteCookieSession } from '@/auth/session.js';
import { type OtherUserInfo, type UserMe } from '@/types/user.js';
import { type ApiResponse } from '@/types/common.js';
import { type SearchRecommendResult } from '@/types/search.js';
import {
  type HomeFeedRequest,
  type FeedResult,
  type HomeFeedResult,
  type HomeFeedCategoryResult,
  type FeedRequest,
  type HomeFeedItem,
} from '@/types/feed.js';
import { type CommentPageResult } from '@/types/note.js';
import { type QRCodeStatus, type CreateLoginQRCodeRequest, type QRCode } from '@/types/login.js';

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
export class RednotePrivateAPIClient extends PrivateAPIClient<RednoteCookieSession> {
  /**
   * HTTP client instance for making requests to the v1 API endpoints.
   */
  private v1: HttpClient;

  /**
   * HTTP client instance for making requests to the v2 API endpoints.
   */
  private v2: HttpClient;

  /**
   * HTTP client instance for making requests to the IM API endpoints.
   */
  private im: HttpClient;

  /**
   * Creates a new instance of the API client.
   *
   * @param session - The Rednote cookie session used for authentication and request handling
   */
  constructor(session: RednoteCookieSession) {
    super(session);

    const http = createRednoteHttpClient(session);
    this.v1 = http.extend({ prefixUrl: RednoteAPIEndpoints.SnsWebV1 });
    this.v2 = http.extend({ prefixUrl: RednoteAPIEndpoints.SnsWebV2 });
    this.im = http.extend({ prefixUrl: RednoteAPIEndpoints.IM });
  }

  /**
   * Retrieves the current authenticated user's information.
   *
   * @returns A promise that resolves to the current user's data
   *
   * @example
   * ```typescript
   * const user = await client.userMe();
   * console.log(user);
   * ```
   */
  public async userMe(): Promise<UserMe> {
    const resp = await this.v2.get('user/me').json<ApiResponse<UserMe>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch user info: ${resp.msg}`);
    }

    return resp.data;
  }

  /**
   * Retrieves the available categories for the home feed.
   *
   * @returns A promise that resolves to the home feed category data
   *
   * @example
   * ```typescript
   * const categories = await client.homefeedCategory();
   * console.log(categories);
   * ```
   */
  public async homefeedCategory(): Promise<HomeFeedCategoryResult> {
    const resp = await this.v1.get('homefeed/category').json<ApiResponse<HomeFeedCategoryResult>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch home feed categories: ${resp.msg}`);
    }

    return resp.data;
  }

  /**
   * Fetches the home feed with recommended content as an async iterable.
   *
   * @param category - The feed category type (default: 'homefeed_recommend')
   * @param num - Number of items to fetch per page (default: 35)
   * @param cursor - Optional pagination cursor for starting position
   * @returns An async iterable that yields home feed items
   *
   * @example
   * ```typescript
   * for await (const item of client.homefeed('homefeed_recommend', 20, 'cursor123')) {
   *   console.log(item);
   * }
   * ```
   */
  public homefeed(category = 'homefeed_recommend', num = 35, cursor = ''): AsyncIterable<HomeFeedItem> {
    const columns = 5;
    const minRenderNotes = num - 3 * columns;
    const needNum = minRenderNotes - 2 * columns;
    const req: HomeFeedRequest = {
      cursor_score: cursor,
      num,
      refresh_type: 1,
      note_index: 0, // last result length
      unread_begin_note_id: '',
      unread_end_note_id: '',
      unread_note_count: 0,
      category,
      search_key: '',
      need_num: needNum > 0 ? needNum : num,
      image_formats: [],
      need_filter_image: false,
    };

    return this.v1.paginate('homefeed', {
      method: 'POST',
      json: req,
      pagination: {
        transform: (resp) => {
          const json = JSON.parse(resp.body) as ApiResponse<HomeFeedResult>;
          if (!json.success) {
            throw new Error(`Failed to fetch home feed: ${json.msg}`);
          }
          return json.data.items;
        },
        paginate: ({ currentItems, response }: PaginateData<string, HomeFeedItem>): false | OptionsInit => {
          const json = JSON.parse(response.body) as ApiResponse<HomeFeedResult>;
          if (!json.success) {
            throw new Error(`Failed to fetch home feed: ${json.msg}`);
          }
          if (currentItems.length < num) {
            // If we have less items than requested, stop pagination
            return false;
          }
          return {
            json: {
              cursor_score: json.data.cursor_score,
            },
          };
        },
      },
    });
  }

  /**
   * Fetches feed data for a specific note.
   *
   * @param noteId - The unique identifier of the source note
   * @param xsecToken - Security token for authentication
   * @returns A promise that resolves to the feed result data
   *
   * @example
   * ```typescript
   * const feedData = await client.feed('note123', 'xsec_token_value');
   * console.log(feedData);
   * ```
   */
  public async feed(noteId: string, xsecToken: string): Promise<FeedResult> {
    const req: FeedRequest = {
      source_note_id: noteId,
      xsec_token: xsecToken,
      image_formats: ['jpg', 'webp', 'avif'],
      xsec_source: 'pc_feed',
      extra: {
        need_body_topic: '1',
      },
    };

    const resp = await this.v1.post('feed', { json: req }).json<ApiResponse<FeedResult>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch feed: ${resp.msg}`);
    }

    return resp.data;
  }

  /**
   * Retrieves a paginated list of comments for a specific note.
   *
   * @param noteId - The unique identifier of the note to fetch comments for
   * @param xsecToken - Security token required for authentication
   * @param cursor - Optional pagination cursor for fetching next page of comments
   * @returns Promise that resolves to the comment page result containing comments and pagination info
   *
   * @example
   * ```typescript
   * const comments = await client.commentPage('note123', 'xsec_token_value', 'cursor123');
   * console.log(comments);
   * ```
   */
  public async commentPage(noteId: string, xsecToken: string, cursor = ''): Promise<CommentPageResult> {
    const params = new URLSearchParams();
    params.set('note_id', noteId);
    params.set('cursor', cursor);
    params.set('top_comment_id', '');
    params.set('image_formats', 'jpg,webp,avif');
    params.set('xsec_token', xsecToken);

    const resp = await this.v2.get('comment/page', { searchParams: params }).json<ApiResponse<CommentPageResult>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch comment page: ${resp.msg}`);
    }

    return resp.data;
  }

  public async subCommentPage(): Promise<unknown> {
    const resp = await this.v2.get('comment/sub/page').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch comment sub page: ${resp.msg}`);
    }
    return resp.data;
  }

  public async searchRecommend(keyword: string): Promise<SearchRecommendResult> {
    const params = new URLSearchParams();
    params.set('keyword', keyword);

    const resp = await this.v1
      .get('search/recommend', { searchParams: params })
      .json<ApiResponse<SearchRecommendResult>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch search recommendations: ${resp.msg}`);
    }

    return resp.data;
  }

  public async createLoginQRCode(qrType = 1): Promise<QRCode> {
    const req: CreateLoginQRCodeRequest = {
      qr_type: qrType,
    };

    const resp = await this.v1.post('login/qrcode/create', { json: req }).json<ApiResponse<QRCode>>();
    if (!resp.success) {
      throw new Error(`Failed to create login QR code: ${resp.msg}`);
    }

    return resp.data;
  }

  public async getQRCodeStatus(qrId: string, code: string): Promise<QRCodeStatus> {
    const params = new URLSearchParams();
    params.set('qr_id', qrId);
    params.set('code', code);

    const resp = await this.v1.get('login/qrcode/status', { searchParams: params }).json<ApiResponse<QRCodeStatus>>();
    if (!resp.success) {
      throw new Error(`Failed to get QR code status: ${resp.msg}`);
    }

    return resp.data;
  }

  public async activateLogin(): Promise<unknown> {
    const resp = await this.v1.post('login/activate').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to activate login: ${resp.msg}`);
    }
    return resp.data;
  }

  public async logoutLogin(): Promise<unknown> {
    const resp = await this.v1.post('login/logout').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to logout: ${resp.msg}`);
    }
    return resp.data;
  }

  public async checkLoginCode(): Promise<unknown> {
    const resp = await this.v1.get('login/check_code').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to check login code: ${resp.msg}`);
    }
    return resp.data;
  }

  public async sendLoginCode(): Promise<unknown> {
    const resp = await this.v1.post('login/send_code').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to send login code: ${resp.msg}`);
    }
    return resp.data;
  }

  public async codeLogin(): Promise<unknown> {
    const resp = await this.v1.post('login/code').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to login with code: ${resp.msg}`);
    }
    return resp.data;
  }

  public async getLikedNum(): Promise<number> {
    const resp = await this.v1.get('get_liked_num').json<ApiResponse<{ liked_num: number }>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch liked number: ${resp.msg}`);
    }
    return resp.data.liked_num;
  }

  public async uncollectNote(): Promise<unknown> {
    const resp = await this.v1.post('note/uncollect').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to uncollect note: ${resp.msg}`);
    }
    return resp.data;
  }

  public async collectNote(): Promise<unknown> {
    const resp = await this.v1.post('note/collect').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to collect note: ${resp.msg}`);
    }
    return resp.data;
  }

  public async likeNote(): Promise<unknown> {
    const resp = await this.v1.post('note/like').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to like note: ${resp.msg}`);
    }
    return resp.data;
  }

  public async dislikeNote(): Promise<unknown> {
    const resp = await this.v1.post('note/dislike').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to dislike note: ${resp.msg}`);
    }
    return resp.data;
  }

  public async redmojiVersion(): Promise<unknown> {
    const resp = await this.im.get('redmoji/version').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch redmoji version: ${resp.msg}`);
    }
    return resp.data;
  }

  public async redmojiDetail(): Promise<unknown> {
    const resp = await this.im.get('redmoji/detail').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch redmoji detail: ${resp.msg}`);
    }
    return resp.data;
  }

  public async deleteComment(): Promise<unknown> {
    const resp = await this.v1.post('comment/delete').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to delete comment: ${resp.msg}`);
    }
    return resp.data;
  }

  public async postComment(): Promise<unknown> {
    const resp = await this.v1.post('comment/post').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to post comment: ${resp.msg}`);
    }
    return resp.data;
  }

  public async likeComment(): Promise<unknown> {
    const resp = await this.v1.post('comment/like').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to like comment: ${resp.msg}`);
    }
    return resp.data;
  }

  public async dislikeComment(): Promise<unknown> {
    const resp = await this.v1.post('comment/dislike').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to dislike comment: ${resp.msg}`);
    }
    return resp.data;
  }

  public async intimacyList(): Promise<unknown> {
    const resp = await this.v1.get('intimacy/intimacy_list').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch intimacy list: ${resp.msg}`);
    }
    return resp.data;
  }

  public async searchIntimacyList(): Promise<unknown> {
    const resp = await this.v1.get('intimacy/intimacy_list/search').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to search intimacy list: ${resp.msg}`);
    }
    return resp.data;
  }

  public async followUser(): Promise<unknown> {
    const resp = await this.v1.post('user/follow').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to follow user: ${resp.msg}`);
    }
    return resp.data;
  }

  public async unfollowUser(): Promise<unknown> {
    const resp = await this.v1.post('user/unfollow').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to unfollow user: ${resp.msg}`);
    }
    return resp.data;
  }

  public async selfUserInfo(): Promise<unknown> {
    const resp = await this.v1.get('user/selfinfo').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch self user info: ${resp.msg}`);
    }
    return resp.data;
  }

  public async otherUserInfo(userId: string): Promise<OtherUserInfo> {
    const resp = await this.v1
      .get('user/otherinfo', {
        searchParams: {
          target_user_id: userId,
        },
      })
      .json<ApiResponse<OtherUserInfo>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch other user info: ${resp.msg}`);
    }
    return resp.data;
  }

  public async noteCollectPage(): Promise<unknown> {
    const resp = await this.v2.get('note/collect/page').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch note collect page: ${resp.msg}`);
    }
    return resp.data;
  }

  public async noteLikePage(): Promise<unknown> {
    const resp = await this.v1.get('note/like/page').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch note like page: ${resp.msg}`);
    }
    return resp.data;
  }

  public async searchNotes(): Promise<unknown> {
    const resp = await this.v1.get('search/notes').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to search notes: ${resp.msg}`);
    }
    return resp.data;
  }

  public async searchQueryTrending(): Promise<unknown> {
    const resp = await this.v1.get('search/querytrending').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch search query trending: ${resp.msg}`);
    }
    return resp.data;
  }
}
