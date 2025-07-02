import { type OptionsInit, type PaginateData, type HttpClient } from '@social-sdk/client/http';
import { PrivateAPIClient } from '@social-sdk/client/api';
import { createRednoteHttpClient } from './http.js';
import { RednoteAPIEndpoints } from './config.js';
import { type RednoteCookieSession } from '@/auth/session.js';
import {
  type SelfUserInfo,
  type FollowUserRequest,
  type FollowUserResult,
  type OtherUserInfo,
  type UserMe,
  type UserSession,
  type IntimacyListSearchResult,
  type UserHoverCard,
} from '@/types/user.js';
import { type ApiResponse } from '@/types/common.js';
import {
  type SearchNotesRequest,
  type SearchFiltersResult,
  type SearchRecommendResult,
  type SearchNotesResult,
  type SearchOneboxRequest,
  type UserSearchResult,
  type SearchUserRequest,
  type SearchQueryTrendingResult,
} from '@/types/search.js';
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
  type LikedNumResult,
  type LikeCommentRequest,
  type PostCommentRequest,
  type DeleteCommentRequest,
} from '@/types/note.js';
import { type QRCodeStatus, type CreateLoginQRCodeRequest, type QRCode } from '@/types/login.js';
import { type RedmojiDetail, type RedmojiVersion } from '@/types/redmoji.js';
import { type SubmitReportRequest, type ListReportRequest, type ListReportResult } from '@/types/report.js';
import { createRequestId, createSearchId } from '@/security/token/token.js';

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
    const searchParams = new URLSearchParams();
    searchParams.set('note_id', noteId);
    searchParams.set('cursor', cursor);
    searchParams.set('top_comment_id', '');
    searchParams.set('image_formats', 'jpg,webp,avif');
    searchParams.set('xsec_token', xsecToken);

    const resp = await this.v2.get('comment/page', { searchParams }).json<ApiResponse<CommentPageResult>>();
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
    const searchParams = new URLSearchParams();
    searchParams.set('note_id', noteId);
    searchParams.set('root_comment_id', rootCommentId);
    searchParams.set('num', num.toString());
    searchParams.set('cursor', cursor);
    searchParams.set('image_formats', 'jpg,webp,avif');
    searchParams.set('top_comment_id', '');
    searchParams.set('xsec_token', xsecToken);

    const resp = await this.v2.get('comment/sub/page', { searchParams }).json<ApiResponse<CommentPageResult>>();
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
   *
   * @example
   * ```typescript
   * const qrCode = await client.createLoginQRCode();
   * console.log(qrCode);
   * ```
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
   *
   * @example
   * ```typescript
   * const status = await client.QRCodeStatus('qr123', 'code456');
   * console.log(status);
   * ```
   */
  public async QRCodeStatus(qrId: string, code: string): Promise<QRCodeStatus> {
    const searchParams = new URLSearchParams();
    searchParams.set('qr_id', qrId);
    searchParams.set('code', code);

    const resp = await this.v1.get('login/qrcode/status', { searchParams }).json<ApiResponse<QRCodeStatus>>();
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

  /**
   * Checks the login code for a specific phone number and zone.
   *
   * @param code - The login code to verify
   * @param phone - The phone number to check the login code for
   * @param zone - The country code or zone for the phone number (default: '86')
   * @returns A promise that resolves to the result of the login code check
   *
   * @example
   * ```typescript
   * const result = await client.checkLoginCode('123456', '1234567890', '86');
   * console.log(result);
   * ```
   */
  public async checkLoginCode(code: string, phone: string, zone = '86'): Promise<unknown> {
    const searchParams = new URLSearchParams();
    searchParams.set('phone', phone);
    searchParams.set('zone', zone);
    searchParams.set('code', code);

    const resp = await this.v1.get('login/check_code', { searchParams }).json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to check login code: ${resp.msg}`);
    }

    return resp.data;
  }

  /**
   * Sends a login code to the specified phone number.
   *
   * @param phone - The phone number to send the login code to
   * @param zone - The country code or zone for the phone number (default: '86')
   * @returns A promise that resolves when the code is sent successfully
   *
   * @example
   * ```typescript
   * await client.sendLoginCode('1234567890', '86');
   * ```
   */
  public async sendLoginCode(phone: string, zone = '86'): Promise<void> {
    const searchParams = new URLSearchParams();
    searchParams.set('phone', phone);
    searchParams.set('zone', zone);
    searchParams.set('type', 'login');

    const resp = await this.v2.post('login/send_code', { searchParams }).json<ApiResponse<void>>();
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

  /**
   * Retrieves the number of likes for the specified notes.
   *
   * @param noteIds - Array of note IDs to get like counts for
   * @returns Promise that resolves to the liked number result containing like counts for each note
   *
   * @example
   * ```typescript
   * const likedNum = await client.getLikedNum(['note123', 'note456']);
   * console.log(likedNum);
   * ```
   */
  public async getLikedNum(noteIds: string[]): Promise<LikedNumResult> {
    const searchParams = new URLSearchParams();
    searchParams.set('note_ids', noteIds.join(','));

    const resp = await this.v1.get('get_liked_num', { searchParams }).json<ApiResponse<LikedNumResult>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch liked number: ${resp.msg}`);
    }

    return resp.data;
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

  public async moveNote(): Promise<unknown> {
    const resp = await this.v1.post('note/move').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to move note: ${resp.msg}`);
    }
    return resp.data;
  }

  /**
   * Deletes a comment from a specific note.
   *
   * @param commentId - The unique identifier of the comment to delete
   * @param noteId - The unique identifier of the note containing the comment
   * @returns A promise that resolves when the comment is successfully deleted
   *
   * @example
   * ```typescript
   * await client.deleteComment('comment123', 'note456');
   * ```
   */
  public async deleteComment(commentId: string, noteId: string): Promise<void> {
    const req: DeleteCommentRequest = {
      comment_id: commentId,
      note_id: noteId,
    };

    const resp = await this.v1.post('comment/delete', { json: req }).json<ApiResponse<void>>();
    if (!resp.success) {
      throw new Error(`Failed to delete comment: ${resp.msg}`);
    }

    return resp.data;
  }

  /**
   * Posts a comment on a specific note.
   *
   * @param form - The request body containing the note ID and comment content
   * @returns A promise that resolves to the posted comment data
   *
   * @example
   * ```typescript
   * const comment = await client.postComment({ note_id: 'note123', content: 'Great note!' });
   * console.log(comment);
   * ```
   */
  public async postComment(form: PostCommentRequest): Promise<unknown> {
    const resp = await this.v1.post('comment/post', { json: form }).json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to post comment: ${resp.msg}`);
    }
    return resp.data;
  }

  /**
   * Likes a comment on a specific note.
   *
   * @param noteId - The unique identifier of the note containing the comment
   * @param commentId - The unique identifier of the comment to like
   * @returns A promise that resolves when the comment is successfully liked
   *
   * @example
   * ```typescript
   * await client.likeComment('note123', 'comment456');
   * ```
   */
  public async likeComment(noteId: string, commentId: string): Promise<void> {
    const req: LikeCommentRequest = {
      comment_id: commentId,
      note_id: noteId,
    };

    const resp = await this.v1.post('comment/like', { json: req }).json<ApiResponse<void>>();
    if (!resp.success) {
      throw new Error(`Failed to like comment: ${resp.msg}`);
    }

    return resp.data;
  }

  /**
   * Dislikes a comment on a specific note.
   *
   * @param noteId - The unique identifier of the note containing the comment
   * @param commentId - The unique identifier of the comment to dislike
   * @returns A promise that resolves when the comment is successfully disliked
   *
   * @example
   * ```typescript
   * await client.dislikeComment('note123', 'comment456');
   * ```
   */
  public async dislikeComment(noteId: string, commentId: string): Promise<void> {
    const req: LikeCommentRequest = {
      comment_id: commentId,
      note_id: noteId,
    };

    const resp = await this.v1.post('comment/dislike', { json: req }).json<ApiResponse<void>>();
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

  /**
   * Searches for intimacy lists based on a keyword.
   *
   * @param keyword - The keyword to search for in intimacy lists
   * @param page - The page number to retrieve (default: 1)
   * @param rows - The number of results per page (default: 30)
   * @returns A promise that resolves to the search result containing intimacy lists
   *
   * @example
   * ```typescript
   * const results = await client.searchIntimacyList('keyword');
   * console.log(results);
   * ```
   */
  public async searchIntimacyList(keyword: string, page = 1, rows = 30): Promise<IntimacyListSearchResult> {
    const searchParams = new URLSearchParams();
    searchParams.set('keyword', keyword);
    searchParams.set('page', page.toString());
    searchParams.set('rows', rows.toString());

    const resp = await this.v1
      .get('intimacy/intimacy_list/search', { searchParams })
      .json<ApiResponse<IntimacyListSearchResult>>();
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
   * Fetches the hover card information for a specified user.
   *
   * @param userId - The unique identifier of the target user.
   * @param xsecToken - The security token required for authentication.
   * @returns A promise that resolves to the user hover card data.
   *
   * @example
   * ```typescript
   * const hoverCard = await client.userHoverCard('user123', 'xsec_token_value');
   * console.log(hoverCard);
   * ```
   */
  public async userHoverCard(userId: string, xsecToken: string): Promise<UserHoverCard> {
    const searchParams = new URLSearchParams();
    searchParams.set('target_user_id', userId);
    searchParams.set('image_formats', 'jpg,webp,avif');
    searchParams.set('xsec_source', 'pc_comment'); // or 'pc_note'
    searchParams.set('xsec_token', xsecToken);

    const resp = await this.v1.get('user/hover_card').json<ApiResponse<UserHoverCard>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch user hover card: ${resp.msg}`);
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
    const searchParams = new URLSearchParams();
    searchParams.set('target_user_id', userId);

    const resp = await this.v1.get('user/otherinfo', { searchParams }).json<ApiResponse<OtherUserInfo>>();
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
    const searchParams = new URLSearchParams();
    searchParams.set('num', num.toString());
    searchParams.set('cursor', cursor);
    searchParams.set('user_id', userId);
    searchParams.set('image_formats', 'jpg,webp,avif');
    searchParams.set('xsec_token', '');
    searchParams.set('xsec_source', '');

    const resp = await this.v2.get('user_posted', { searchParams }).json<ApiResponse<NotePageResult>>();
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
    const searchParams = new URLSearchParams();
    searchParams.set('num', num.toString());
    searchParams.set('cursor', cursor);
    searchParams.set('user_id', userId);
    searchParams.set('image_formats', 'jpg,webp,avif');
    searchParams.set('xsec_token', '');
    searchParams.set('xsec_source', '');

    const resp = await this.v2.get('note/collect/page', { searchParams }).json<ApiResponse<NotePageResult>>();
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
    const searchParams = new URLSearchParams();
    searchParams.set('num', num.toString());
    searchParams.set('cursor', cursor);
    searchParams.set('user_id', userId);
    searchParams.set('image_formats', 'jpg,webp,avif');
    searchParams.set('xsec_token', '');
    searchParams.set('xsec_source', '');

    const resp = await this.v1.get('note/like/page', { searchParams }).json<ApiResponse<NotePageResult>>();
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
    const searchParams = new URLSearchParams();
    searchParams.set('keyword', keyword);

    const resp = await this.v1.get('search/recommend', { searchParams }).json<ApiResponse<SearchRecommendResult>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch search recommendations: ${resp.msg}`);
    }

    return resp.data;
  }

  /**
   * Searches for notes based on a keyword and optional filters.
   *
   * @param searchId - The unique identifier for the search session
   * @param keyword - The keyword to search for notes
   * @param noteType - The type of notes to filter by (default: 0)
   * @param sort - The sorting method for results (default: 'general')
   * @param page - The page number for pagination (default: 1)
   * @param pageSize - The number of results per page (default: 20)
   * @returns A promise that resolves to the search notes result
   *
   * @example
   * ```typescript
   * const notes = await client.searchNotes('example keyword');
   * console.log(notes);
   * ```
   */
  public async searchNotes(
    searchId: string,
    keyword: string,
    noteType = 0,
    sort: 'general' | 'time_descending' | 'popularity_descending' = 'general',
    page = 1,
    pageSize = 20,
  ): Promise<SearchNotesResult> {
    const req: SearchNotesRequest = {
      keyword,
      page,
      page_size: pageSize,
      search_id: page === 1 ? searchId : `${searchId}@${createSearchId()}`,
      sort,
      note_type: noteType,
      ext_flags: [],
      geo: '',
      image_formats: ['jpg', 'webp', 'avif'],
      filters: [
        {
          tags: ['general'],
          type: 'sort_type',
        },
        {
          tags: ['不限'],
          type: 'filter_note_type',
        },
        {
          tags: ['不限'],
          type: 'filter_note_time',
        },
        {
          tags: ['不限'],
          type: 'filter_note_range',
        },
        {
          tags: ['不限'],
          type: 'filter_pos_distance',
        },
      ],
    };

    const resp = await this.v1.post('search/notes', { json: req }).json<ApiResponse<SearchNotesResult>>();
    if (!resp.success) {
      throw new Error(`Failed to search notes: ${resp.msg}`);
    }

    return resp.data;
  }

  /**
   * Searches for trending queries based on a keyword.
   *
   * @param keyword - The keyword to search for trending queries
   * @returns A promise that resolves to the trending query result
   *
   * @example
   * ```typescript
   * const trendingQueries = await client.searchQueryTrending('example keyword');
   * console.log(trendingQueries);
   * ```
   */
  public async searchQueryTrending(
    keyword: string,
    situation: 'FIRST_ENTER' | 'BACK_WITH_DEL_WORD' = 'FIRST_ENTER',
    hintWordType = '',
    hintWordRequestId = '',
  ): Promise<SearchQueryTrendingResult> {
    const searchParams = new URLSearchParams();
    searchParams.set('source', 'Explore');
    searchParams.set('search_type', 'trend');
    searchParams.set('last_query', '');
    searchParams.set('last_query_time', '0');
    searchParams.set('word_request_situation', situation);
    searchParams.set('hint_word', keyword);
    searchParams.set('hint_word_type', hintWordType);
    searchParams.set('hint_word_request_id', hintWordRequestId);

    const resp = await this.v1
      .get('search/querytrending', { searchParams })
      .json<ApiResponse<SearchQueryTrendingResult>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch search query trending: ${resp.msg}`);
    }

    return resp.data;
  }

  /**
   * Searches for users based on a keyword and returns the results.
   *
   * @param searchId - The unique identifier for the search session
   * @param keyword - The keyword to search for users
   * @param page - The page number for pagination (default: 1)
   * @param pageSize - The number of results per page (default: 15)
   * @returns A promise that resolves to the user search result
   *
   * @example
   * ```typescript
   * const users = await client.searchUserSearch('search123', 'example keyword');
   * console.log(users);
   * ```
   */
  public async searchUserSearch(searchId: string, keyword: string, page = 1, pageSize = 15): Promise<UserSearchResult> {
    const req: SearchUserRequest = {
      search_user_request: {
        biz_type: 'web_search_user',
        keyword,
        page,
        page_size: pageSize,
        request_id: createRequestId(),
        search_id: searchId,
      },
    };

    const resp = await this.v1.post('search/usersearch', { json: req }).json<ApiResponse<UserSearchResult>>();
    if (!resp.success) {
      throw new Error(`Failed to search user: ${resp.msg}`);
    }

    return resp.data;
  }

  /**
   * Executes a search onebox for a given keyword.
   *
   * @param keyword - The keyword to search for onebox results
   * @param searchId - The unique identifier for the search session (default: generated)
   * @returns A promise that resolves when the search onebox is successfully executed
   *
   * @example
   * ```typescript
   * await client.searchOnebox('example keyword');
   * ```
   */
  public async searchOnebox(keyword: string, searchId = createSearchId()): Promise<void> {
    const req: SearchOneboxRequest = {
      keyword,
      search_id: searchId,
      biz_type: 'web_search_user',
      request_id: createRequestId(),
    };

    const resp = await this.v1.post('search/onebox', { json: req }).json<ApiResponse<void>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch search onebox: ${resp.msg}`);
    }

    return resp.data;
  }

  /**
   * Get search filters based on a keyword.
   *
   * @param searchId - The unique identifier for the search session
   * @param keyword - The keyword to search for filters
   * @returns A promise that resolves to the search filters result
   *
   * @example
   * ```typescript
   * const filters = await client.searchFilter('example keyword');
   * console.log(filters);
   * ```
   */
  public async searchFilter(searchId: string, keyword: string): Promise<SearchFiltersResult> {
    const searchParams = new URLSearchParams();
    searchParams.set('keyword', keyword);
    searchParams.set('search_id', searchId);

    const resp = await this.v1.get('search/filter', { searchParams }).json<ApiResponse<SearchFiltersResult>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch search filter: ${resp.msg}`);
    }

    return resp.data;
  }

  public async createBoard(): Promise<unknown> {
    const resp = await this.v1.post('board').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to create board: ${resp.msg}`);
    }
    return resp.data;
  }

  public async deleteBoard(): Promise<unknown> {
    const resp = await this.v1.delete('board').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to delete board: ${resp.msg}`);
    }
    return resp.data;
  }

  public async updateBoard(): Promise<unknown> {
    const resp = await this.v1.put('board').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to update board: ${resp.msg}`);
    }
    return resp.data;
  }

  public async board(boardId: string): Promise<unknown> {
    const resp = await this.v1.get(`board/${boardId}`).json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch board: ${resp.msg}`);
    }
    return resp.data;
  }

  public async boardUser(): Promise<unknown> {
    const resp = await this.v1.get('board/user').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch board user: ${resp.msg}`);
    }
    return resp.data;
  }

  public async boardNote(): Promise<unknown> {
    const resp = await this.v1.get('board/note').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch board note: ${resp.msg}`);
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

  /**
   * Retrieves a list of report options for a specific target.
   *
   * @param targetId - The unique identifier of the target to fetch reports for
   * @param scene - The scene code for the report
   * @returns A promise that resolves to the list of report options
   */
  public async listReport(targetId: string, scene: string): Promise<ListReportResult> {
    const req: ListReportRequest = {
      target_id: targetId,
      scene_code: scene,
    };

    const resp = await this.report.post('list', { json: req }).json<ApiResponse<ListReportResult>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch report list: ${resp.msg}`);
    }
    return resp.data;
  }

  /**
   * Submits a report for a specific target.
   *
   * @param form - The report submission request containing target ID and reason
   * @returns A promise that resolves when the report is successfully submitted
   */
  public async submitReport(form: SubmitReportRequest): Promise<void> {
    const resp = await this.report.post('submit', { json: form }).json<ApiResponse<void>>();
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

  /**
   * Retrieves Redmoji detail information.
   *
   * @returns A promise that resolves to the Redmoji detail information
   *
   * @example
   * ```typescript
   * const detail = await client.redmojiDetail();
   * console.log(detail);
   * ```
   */
  public async redmojiDetail(): Promise<RedmojiDetail> {
    const resp = await this.im.get('redmoji/detail').json<ApiResponse<RedmojiDetail>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch redmoji detail: ${resp.msg}`);
    }
    return resp.data;
  }

  public async connectionsNotification(): Promise<unknown> {
    const resp = await this.v1.get('you/connections').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch connections: ${resp.msg}`);
    }
    return resp.data;
  }

  public async mentionsNotification(): Promise<unknown> {
    const resp = await this.v1.get('you/mentions').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to mark connections as read: ${resp.msg}`);
    }
    return resp.data;
  }

  public async likesNotification(): Promise<unknown> {
    const resp = await this.v1.get('you/likes').json<ApiResponse<unknown>>();
    if (!resp.success) {
      throw new Error(`Failed to fetch likes: ${resp.msg}`);
    }
    return resp.data;
  }

  public async readMessage(): Promise<void> {
    const resp = await this.v1.post('message/read').json<ApiResponse<void>>();
    if (!resp.success) {
      throw new Error(`Failed to mark notifications as read: ${resp.msg}`);
    }
    return resp.data;
  }
}
