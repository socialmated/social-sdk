import { type OptionsInit, type PaginateData, type HttpClient } from '@social-sdk/client/http';
import { PrivateAPIClient } from '@social-sdk/client/api';
import { createRednoteHttpClient, RednoteAPIEndpoints } from './http.js';
import { type RednoteCookieSession } from '@/auth/session.js';
import {
  type SelfUserInfo,
  type FollowUserRequest,
  type FollowUserResult,
  type OtherUserInfo,
  type UserMe,
  type UserSession,
} from '@/types/user.js';
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
import {
  type DislikeResult,
  type LikeRequest,
  type LikeResult,
  type CommentPageResult,
  type UncollectNoteRequest,
  type NotePageResult,
} from '@/types/note.js';
import { type QRCodeStatus, type CreateLoginQRCodeRequest, type QRCode } from '@/types/login.js';
import { type RedmojiVersion } from '@/types/redmoji.js';

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
   * HTTP client instance for making requests to the report API endpoints.
   */
  private report: HttpClient;

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
    this.report = http.extend({ prefixUrl: RednoteAPIEndpoints.Report });
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

  /**
   * Retrieves a paginated list of sub-comments for a specific root comment.
   *
   * @param noteId - The unique identifier of the note containing the comment
   * @param rootCommentId - The unique identifier of the root comment to fetch sub-comments for
   * @param xsecToken - Security token required for authentication
   * @param num - Number of sub-comments to fetch per page (default: 10)
   * @param cursor - Optional pagination cursor for fetching next page of sub-comments
   * @returns Promise that resolves to the comment page result containing sub-comments and pagination info
   *
   * @example
   * ```typescript
   * const subComments = await client.subCommentPage('note123', 'root_comment_id', 'xsec_token_value');
   * console.log(subComments);
   * ```
   */
  public async subCommentPage(
    noteId: string,
    rootCommentId: string,
    xsecToken: string,
    num = 10,
    cursor = '',
  ): Promise<CommentPageResult> {
    const params = new URLSearchParams();
    params.set('note_id', noteId);
    params.set('root_comment_id', rootCommentId);
    params.set('num', num.toString());
    params.set('cursor', cursor);
    params.set('image_formats', 'jpg,webp,avif');
    params.set('top_comment_id', '');
    params.set('xsec_token', xsecToken);

    const resp = await this.v2.get('comment/sub/page').json<ApiResponse<CommentPageResult>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch comment sub page: ${resp.msg}`);
    }

    return resp.data;
  }

  /**
   * Creates a login QR code for user authentication.
   *
   * @param qrType - The type of QR code to create (default: 1)
   * @returns A promise that resolves to the created QR code data
   */
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

  /**
   * Retrieves the status of a login QR code.
   *
   * @param qrId - The unique identifier of the QR code
   * @param code - The code associated with the QR code
   * @returns A promise that resolves to the QR code status
   */
  public async QRCodeStatus(qrId: string, code: string): Promise<QRCodeStatus> {
    const params = new URLSearchParams();
    params.set('qr_id', qrId);
    params.set('code', code);

    const resp = await this.v1.get('login/qrcode/status', { searchParams: params }).json<ApiResponse<QRCodeStatus>>();
    if (!resp.success) {
      throw new Error(`Failed to get QR code status: ${resp.msg}`);
    }

    return resp.data;
  }

  /**
   * Activates the login session.
   *
   * @returns A promise that resolves to the user session after activating login
   *
   * @example
   * ```typescript
   * const session = await client.activateLogin();
   * console.log(session);
   * ```
   */
  public async activateLogin(): Promise<UserSession> {
    const resp = await this.v1.post('login/activate').json<ApiResponse<UserSession>>();
    if (!resp.success) {
      throw new Error(`Failed to activate login: ${resp.msg}`);
    }

    return resp.data;
  }

  /**
   * Logs out the current user from the Rednote platform.
   *
   * @returns A promise that resolves when the user is logged out successfully
   *
   * @example
   * ```typescript
   * await client.logoutLogin();
   * ```
   */
  public async logoutLogin(): Promise<void> {
    const resp = await this.v1.post('login/logout').json<ApiResponse<void>>();
    if (!resp.success) {
      throw new Error(`Failed to logout: ${resp.msg}`);
    }

    return resp.data;
  }

  public async checkLoginCode(phone: string, zone: string, code: string): Promise<unknown> {
    const params = new URLSearchParams();
    params.set('phone', phone);
    params.set('zone', zone);
    params.set('code', code);

    const resp = await this.v1.get('login/check_code').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to check login code: ${resp.msg}`);
    }

    return resp.data;
  }

  /**
   * Sends a login code to the specified phone number.
   *
   * @param phone - The phone number to send the login code to
   * @param zone - The country code or zone for the phone number
   * @returns A promise that resolves when the code is sent successfully
   *
   * @example
   * ```typescript
   * await client.sendLoginCode('1234567890', '1');
   * ```
   */
  public async sendLoginCode(phone: string, zone: string): Promise<void> {
    const params = new URLSearchParams();
    params.set('phone', phone);
    params.set('zone', zone);
    params.set('type', 'login');

    const resp = await this.v2.post('login/send_code').json<ApiResponse<void>>();
    if (!resp.success) {
      throw new Error(`Failed to send login code: ${resp.msg}`);
    }

    return resp.data;
  }

  public async codeLogin(): Promise<unknown> {
    const resp = await this.v2.post('login/code').json<ApiResponse<unknown>>();
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

  /**
   * Uncollects a note by its unique identifier.
   *
   * @param noteId - The unique identifier of the note to uncollect
   * @returns A promise that resolves when the note is successfully uncollected
   *
   * @example
   * ```typescript
   * await client.uncollectNote('note123');
   * ```
   */
  public async uncollectNote(noteId: string): Promise<void> {
    const req: UncollectNoteRequest = {
      note_ids: noteId,
    };

    const resp = await this.v1.post('note/uncollect', { json: req }).json<ApiResponse<void>>();
    if (!resp.success) {
      throw new Error(`Failed to uncollect note: ${resp.msg}`);
    }

    return resp.data;
  }

  /**
   * Collects a note by its unique identifier.
   *
   * @param noteId - The unique identifier of the note to collect
   * @returns A promise that resolves when the note is successfully collected
   *
   * @example
   * ```typescript
   * await client.collectNote('note123');
   * ```
   */
  public async collectNote(noteId: string): Promise<void> {
    const req: UncollectNoteRequest = {
      note_ids: noteId,
    };

    const resp = await this.v1.post('note/collect', { json: req }).json<ApiResponse<void>>();
    if (!resp.success) {
      throw new Error(`Failed to collect note: ${resp.msg}`);
    }

    return resp.data;
  }

  /**
   * Likes a note by its unique identifier.
   *
   * @param noteId - The unique identifier of the note to like
   * @returns A promise that resolves to the result of the like operation
   *
   * @example
   * ```typescript
   * const result = await client.likeNote('note123');
   * console.log(result);
   * ```
   */
  public async likeNote(noteId: string): Promise<LikeResult> {
    const req: LikeRequest = {
      note_oid: noteId,
    };

    const resp = await this.v1.post('note/like', { json: req }).json<ApiResponse<LikeResult>>();
    if (!resp.success) {
      throw new Error(`Failed to like note: ${resp.msg}`);
    }

    return resp.data;
  }

  /**
   * Dislikes a note by its unique identifier.
   *
   * @param noteId - The unique identifier of the note to dislike
   * @returns A promise that resolves to the result of the dislike operation
   *
   * @example
   * ```typescript
   * const result = await client.dislikeNote('note123');
   * console.log(result);
   * ```
   */
  public async dislikeNote(noteId: string): Promise<DislikeResult> {
    const req: LikeRequest = {
      note_oid: noteId,
    };

    const resp = await this.v1.post('note/dislike', { json: req }).json<ApiResponse<DislikeResult>>();
    if (!resp.success) {
      throw new Error(`Failed to dislike note: ${resp.msg}`);
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

  /**
   * Follows a user by their unique identifier.
   *
   * @param userId - The unique identifier of the user to follow
   * @returns A promise that resolves to the result of the follow operation
   *
   * @example
   * ```typescript
   * const result = await client.followUser('user123');
   * console.log(result);
   * ```
   */
  public async followUser(userId: string): Promise<FollowUserResult> {
    const req: FollowUserRequest = {
      target_user_id: userId,
    };

    const resp = await this.v1.post('user/follow', { json: req }).json<ApiResponse<FollowUserResult>>();
    if (!resp.success) {
      throw new Error(`Failed to follow user: ${resp.msg}`);
    }

    return resp.data;
  }

  /**
   * Unfollows a user by their unique identifier.
   *
   * @param userId - The unique identifier of the user to unfollow
   * @returns A promise that resolves to the result of the unfollow operation
   *
   * @example
   * ```typescript
   * const result = await client.unfollowUser('user123');
   * console.log(result);
   * ```
   */
  public async unfollowUser(userId: string): Promise<FollowUserResult> {
    const req: FollowUserRequest = {
      target_user_id: userId,
    };

    const resp = await this.v1.post('user/unfollow', { json: req }).json<ApiResponse<FollowUserResult>>();
    if (!resp.success) {
      throw new Error(`Failed to unfollow user: ${resp.msg}`);
    }

    return resp.data;
  }

  /**
   * Retrieves the current user's self information.
   *
   * @returns A promise that resolves to the current user's self information
   *
   * @example
   * ```typescript
   * const selfInfo = await client.selfUserInfo();
   * console.log(selfInfo);
   * ```
   */
  public async selfUserInfo(): Promise<SelfUserInfo> {
    const resp = await this.v1.get('user/selfinfo').json<ApiResponse<SelfUserInfo>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch self user info: ${resp.msg}`);
    }

    return resp.data;
  }

  public async editUserInfo(): Promise<unknown> {
    const resp = await this.v1.post('user/info').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch user info: ${resp.msg}`);
    }
    return resp.data;
  }

  /**
   * Retrieves information about another user by their unique identifier.
   *
   * @param userId - The unique identifier of the user to fetch information for
   * @returns A promise that resolves to the other user's information
   *
   * @example
   * ```typescript
   * const otherUser = await client.otherUserInfo('user123');
   * console.log(otherUser);
   * ```
   */
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

  /**
   * Retrieves a paginated list of notes posted by a specific user.
   *
   * @param userId - The unique identifier of the user whose posted notes to fetch
   * @param num - Number of notes to fetch per page (default: 30)
   * @param cursor - Optional pagination cursor for fetching next page of notes
   * @returns A promise that resolves to the result containing notes posted by the user
   *
   * @example
   * ```typescript
   * const postedNotes = await client.userPosted('user123');
   * console.log(postedNotes);
   * ```
   */
  public async notePostPage(userId: string, num = 30, cursor = ''): Promise<NotePageResult> {
    const params = new URLSearchParams();
    params.set('num', num.toString());
    params.set('cursor', cursor);
    params.set('user_id', userId);
    params.set('image_formats', 'jpg,webp,avif');
    params.set('xsec_token', '');
    params.set('xsec_source', '');

    const resp = await this.v2.get('user_posted', { searchParams: params }).json<ApiResponse<NotePageResult>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch user posted: ${resp.msg}`);
    }

    return resp.data;
  }

  /**
   * Retrieves a paginated list of notes collected by a specific user.
   *
   * @param userId - The unique identifier of the user whose collected notes to fetch
   * @param num - Number of notes to fetch per page (default: 30)
   * @param cursor - Optional pagination cursor for fetching next page of notes
   * @returns A promise that resolves to the result containing collected notes by the user
   *
   * @example
   * ```typescript
   * const collectedNotes = await client.noteCollectPage('user123');
   * console.log(collectedNotes);
   * ```
   */
  public async noteCollectPage(userId: string, num = 30, cursor = ''): Promise<NotePageResult> {
    const params = new URLSearchParams();
    params.set('num', num.toString());
    params.set('cursor', cursor);
    params.set('user_id', userId);
    params.set('image_formats', 'jpg,webp,avif');
    params.set('xsec_token', '');
    params.set('xsec_source', '');

    const resp = await this.v2.get('note/collect/page').json<ApiResponse<NotePageResult>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch note collect page: ${resp.msg}`);
    }

    return resp.data;
  }

  /**
   * Retrieves a paginated list of notes liked by a specific user.
   *
   * @param userId - The unique identifier of the user whose liked notes to fetch
   * @param num - Number of notes to fetch per page (default: 30)
   * @param cursor - Optional pagination cursor for fetching next page of notes
   * @returns A promise that resolves to the result containing liked notes by the user
   *
   * @example
   * ```typescript
   * const likedNotes = await client.noteLikePage('user123');
   * console.log(likedNotes);
   * ```
   */
  public async noteLikePage(userId: string, num = 30, cursor = ''): Promise<NotePageResult> {
    const params = new URLSearchParams();
    params.set('num', num.toString());
    params.set('cursor', cursor);
    params.set('user_id', userId);
    params.set('image_formats', 'jpg,webp,avif');
    params.set('xsec_token', '');
    params.set('xsec_source', '');

    const resp = await this.v1.get('note/like/page').json<ApiResponse<NotePageResult>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch note like page: ${resp.msg}`);
    }

    return resp.data;
  }

  /**
   * Recommends search suggestions based on a given keyword.
   *
   * @param keyword - The keyword to search for recommendations
   * @returns A promise that resolves to the search recommendation result
   *
   * @example
   * ```typescript
   * const recommendations = await client.searchRecommend('example keyword');
   * console.log(recommendations);
   * ```
   */
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

  public async searchUserSearch(): Promise<unknown> {
    const resp = await this.v1.post('search/usersearch').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to search user: ${resp.msg}`);
    }
    return resp.data;
  }

  public async searchOnebox(): Promise<unknown> {
    const resp = await this.v1.post('search/onebox').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch search onebox: ${resp.msg}`);
    }
    return resp.data;
  }

  public async searchFilter(): Promise<unknown> {
    const resp = await this.v1.get('search/filter').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch search filter: ${resp.msg}`);
    }
    return resp.data;
  }

  public async loginRecommendTag(): Promise<unknown> {
    const resp = await this.v1.get('tag/login_recommend').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch login recommend tag: ${resp.msg}`);
    }
    return resp.data;
  }

  public async followTag(): Promise<unknown> {
    const resp = await this.v1.post('tag/follow').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to follow tag: ${resp.msg}`);
    }
    return resp.data;
  }

  public async listReport(): Promise<unknown> {
    const resp = await this.report.post('list').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch report list: ${resp.msg}`);
    }
    return resp.data;
  }

  public async submitReport(): Promise<void> {
    const resp = await this.report.post('submit').json<ApiResponse<void>>();
    if (!resp.success) {
      throw new Error(`Failed to submit report: ${resp.msg}`);
    }
    return resp.data;
  }

  /**
   * Retrieves the Redmoji version information.
   * @returns A promise that resolves to the Redmoji version information
   *
   * @example
   * ```typescript
   * const version = await client.redmojiVersion();
   * console.log(version);
   * ```
   */
  public async redmojiVersion(): Promise<RedmojiVersion> {
    const resp = await this.im.get('redmoji/version').json<ApiResponse<RedmojiVersion>>();
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
}
