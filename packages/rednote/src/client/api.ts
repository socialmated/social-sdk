import { type PrivateHttpClient } from '@social-sdk/core/client';
import { createRednoteHttpClient, RednoteAPIEndpoints } from './http.js';
import { type RednoteCookieSession } from '@/auth/session.js';
import { type UserMe } from '@/types/user.js';
import { type ApiResponse } from '@/types/common.js';
import { type SearchRecommendResult } from '@/types/search.js';
import {
  type HomeFeedRequest,
  type FeedResult,
  type HomeFeedResult,
  type HomeFeedCategoryResult,
  type FeedRequest,
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
export class RednotePrivateAPIClient {
  /**
   * HTTP client instance for making requests to the v1 API endpoints.
   */
  private v1: PrivateHttpClient;

  /**
   * HTTP client instance for making requests to the v2 API endpoints.
   */
  private v2: PrivateHttpClient;

  /**
   * HTTP client instance for making requests to the IM API endpoints.
   */
  private im: PrivateHttpClient;

  /**
   * Creates a new instance of the API client.
   *
   * @param session - The Rednote cookie session used for authentication and request handling
   */
  constructor(session: RednoteCookieSession) {
    const http = createRednoteHttpClient(session);
    this.v1 = http.extend({ prefixUrl: RednoteAPIEndpoints.SnsWebV1 });
    this.v2 = http.extend({ prefixUrl: RednoteAPIEndpoints.SnsWebV2 });
    this.im = http.extend({ prefixUrl: RednoteAPIEndpoints.IM });
  }

  public async userMe(): Promise<UserMe> {
    const resp = await this.v2.get('user/me').json<ApiResponse<UserMe>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch user info: ${resp.msg}`);
    }

    return resp.data;
  }

  public async homefeedCategory(): Promise<HomeFeedCategoryResult> {
    const resp = await this.v1.get('homefeed/category').json<ApiResponse<HomeFeedCategoryResult>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch home feed categories: ${resp.msg}`);
    }

    return resp.data;
  }

  public async homefeed(category = 'homefeed_recommend', num = 35, cursor = ''): Promise<HomeFeedResult> {
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

    // FIXME: use pagination
    const resp = await this.v1.post('homefeed', { json: req }).json<ApiResponse<HomeFeedResult>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch home feed: ${resp.msg}`);
    }

    return resp.data;
  }

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

  public async commentPage(nodeId: string, xsecToken: string, cursor = ''): Promise<CommentPageResult> {
    const params = new URLSearchParams();
    params.set('node_id', nodeId);
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
}
