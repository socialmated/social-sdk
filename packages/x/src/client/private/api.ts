import { type PaginateData, type HttpClient } from '@social-sdk/client/http';
import { type GraphQLHttpClient, useGraphQLHttpClient, type GraphQLOptionsInit } from '@social-sdk/client/graphql';
import { PrivateAPIClient } from '@social-sdk/client/api';
import { createXHttpClient } from './http.js';
import { defaultTweetFeatures } from '@/constants/features.js';
import { type XCookieSession } from '@/auth/session.js';
import {
  type SearchTimelineResponse,
  type UserTweetsResponse,
  type ListLatestTweetsTimelineResponse,
  type TimelineResponse,
  type UserHighlightsTweetsResponse,
  type TweetDetailResponse,
  type TweetResultByRestIdResponse,
  type TweetFavoritersResponse,
  type TweetRetweetersResponse,
  type ProfileResponse,
  type FavoriteTweetResponse,
  type UnfavoriteTweetResponse,
  type CreateTweetResponse,
  type DeleteRetweetResponse,
  type DeleteTweetResponse,
  type CreateBookmarkResponse,
  type DeleteBookmarkResponse,
  type FollowResponse,
  type BookmarksResponse,
  type UserResponse,
  type UsersResponse,
} from '@/types/response.js';
import { type TimelineAddEntry } from '@/types/timeline.js';
import { type UserUnion } from '@/types/user.js';
import { getCursor, getEntries } from '@/model/timeline.js';
import { type TweetUnion } from '@/types/tweet.js';

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

/**
 * A client for accessing X (Twitter) private API endpoints.
 *
 * This class provides methods to interact with X API endpoints using authenticated HTTP clients.
 * It supports operations for user management, timeline feeds, tweet interactions, and social features.
 *
 * @example
 * ```typescript
 * const session = new XCookieSession(cookies);
 * const client = new XPrivateAPIClient(session);
 *
 * const user = await client.userByScreenName('elonmusk');
 * console.log(user);
 * ```
 */
export class XPrivateAPIClient extends PrivateAPIClient<XCookieSession> {
  /**
   * The HTTP client for the v1.1 API endpoint.
   */
  private v11: HttpClient;

  /**
   * The GraphQL HTTP client for the GraphQL API endpoint.
   */
  private graphql: GraphQLHttpClient<HttpClient>;

  /**
   * Creates a new instance of the API client with authenticated HTTP clients for different API versions.
   *
   * @param session - The X (Twitter) cookie session used for authentication across all API endpoints
   */
  constructor(session: XCookieSession) {
    super(session);

    const http = createXHttpClient(session);
    this.v11 = http.extend({ prefixUrl: XAPIEndpoints.V11 });
    this.graphql = useGraphQLHttpClient(http.extend({ prefixUrl: XAPIEndpoints.GraphQL }));
  }

  public async incomingFriendships(): Promise<unknown> {
    return this.v11.get('friendships/incoming.json');
  }

  public async acceptFriendships(): Promise<unknown> {
    return this.v11.post('friendships/accept.json').json();
  }

  public async denyFriendships(): Promise<unknown> {
    return this.v11.post('friendships/deny.json').json();
  }

  public async createFriendships(): Promise<unknown> {
    return this.v11.post('friendships/create.json').json();
  }

  public async createAllFriendships(): Promise<unknown> {
    return this.v11.post('friendships/create_all.json').json();
  }

  public async destroyFriendships(): Promise<unknown> {
    return this.v11.post('friendships/destroy.json').json();
  }

  public async destroyAllFriendships(): Promise<unknown> {
    return this.v11.post('friendships/destroy_all.json').json();
  }

  public async cancelFriendships(): Promise<unknown> {
    return this.v11.post('friendships/cancel.json').json();
  }

  public async updateFriendships(): Promise<unknown> {
    return this.v11.post('friendships/update.json').json();
  }

  public async listFriendsFollowing(): Promise<unknown> {
    return this.v11.get('friends/following/list.json').json();
  }

  public async listFriends(): Promise<unknown> {
    return this.v11.get('friends/list.json').json();
  }

  public async typeaheadSearch(): Promise<unknown> {
    return this.v11.get('search/typeahead.json').json();
  }

  public async hashflags(): Promise<unknown> {
    return this.v11.get('hashflags.json').json();
  }

  /**
   * Fetches user information from the X (Twitter) API based on the provided screen name.
   *
   * @param screenName - The screen name (username) of the user to retrieve information for
   * @returns A promise that resolves to a `UserUnion` object containing the user's details
   *
   * @example
   * ```typescript
   * const user = await client.userByScreenName('elonmusk');
   * console.log(user);
   * ```
   *
   * @see {@link userByRestId} for fetching user information by REST ID (User ID)
   */
  public async userByScreenName(screenName: string): Promise<UserUnion> {
    const variables = {
      screen_name: screenName,
    };
    const features = {
      hidden_profile_subscriptions_enabled: true,
      profile_label_improvements_pcf_label_in_post_enabled: true,
      rweb_tipjar_consumption_enabled: true,
      verified_phone_label_enabled: false,
      subscriptions_verification_info_is_identity_verified_enabled: true,
      subscriptions_verification_info_verified_since_enabled: true,
      highlights_tweets_tab_ui_enabled: true,
      responsive_web_twitter_article_notes_tab_enabled: true,
      subscriptions_feature_can_gift_premium: true,
      creator_subscriptions_tweet_preview_api_enabled: true,
      responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
      responsive_web_graphql_timeline_navigation_enabled: true,
    };
    const fieldToggles = {
      withAuxiliaryUserLabels: true,
    };

    const resp = await this.graphql
      .query('1VOOyvKkiI3FMmkeDNxM9A', 'UserByScreenName', { variables, features, fieldToggles })
      .json<UserResponse>();

    if (!resp.data.user) {
      throw new Error(`User with screen name "${screenName}" not found.`);
    }
    return resp.data.user.result;
  }

  /**
   * Fetches user information from the X (Twitter) API based on the provided REST ID.
   *
   * REST ID is a unique identifier for a user on the X platform.
   *
   * @param userId - The REST ID of the user to retrieve information for
   * @returns A promise that resolves to a `UserUnion` object containing the user's details
   *
   * @example
   * ```typescript
   * const user = await client.userByRestId('44196397');
   * console.log(user);
   * ```
   *
   * @see {@link usersByRestIds} for batch fetching of user information
   * @see {@link userByScreenName} for fetching user information by screen name
   */
  public async userByRestId(userId: string): Promise<UserUnion> {
    const variables = {
      userId,
      withSafetyModeUserFields: true,
    };
    const features = {
      hidden_profile_likes_enabled: true,
      hidden_profile_subscriptions_enabled: true,
      responsive_web_graphql_exclude_directive_enabled: true,
      verified_phone_label_enabled: false,
      highlights_tweets_tab_ui_enabled: true,
      responsive_web_twitter_article_notes_tab_enabled: true,
      creator_subscriptions_tweet_preview_api_enabled: true,
      responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
      responsive_web_graphql_timeline_navigation_enabled: true,
    };

    const resp = await this.graphql
      .query('tD8zKvQzwY3kdx5yz6YmOw', 'UserByRestId', { variables, features })
      .json<UserResponse>();

    if (!resp.data.user) {
      throw new Error(`User with REST ID "${userId}" not found.`);
    }
    return resp.data.user.result;
  }

  /**
   * Fetches user information from the X (Twitter) API based on the provided REST IDs.
   *
   * @param userIds - An array of REST IDs of the users to retrieve information for
   * @returns A promise that resolves to a list of `UserUnion` objects containing the users' details
   *
   * @example
   * ```typescript
   * const users = await client.usersByRestIds(['44196397', '12']);
   * console.log(users);
   * ```
   *
   * @see {@link userByRestId} for fetching user information by a single REST ID
   */
  public async usersByRestIds(userIds: string[]): Promise<UserUnion[]> {
    const variables = {
      userIds,
    };
    const features = {
      profile_label_improvements_pcf_label_in_post_enabled: true,
      rweb_tipjar_consumption_enabled: true,
      verified_phone_label_enabled: false,
      responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
      responsive_web_graphql_timeline_navigation_enabled: true,
    };

    const resp = await this.graphql
      .query('XArUHrueMW0KQdZUdqidrA', 'UsersByRestIds', { variables, features })
      .json<UsersResponse>();

    if (!resp.data.users) {
      throw new Error(`Users with REST IDs "${userIds.join(', ')}" not found.`);
    }
    return resp.data.users.map((user) => user.result);
  }

  /**
   * Retrieves the curated "For You" timeline.
   *
   * This method fetches the user's personalized timeline based on their interests and interactions.
   *
   * @param count - The number of tweets to retrieve (default: 20)
   * @param seenTweetIds - An array of tweet IDs that have already been seen by the user
   * @param cursor - Optional cursor for pagination to continue from a specific point
   * @returns An async iterable iterator that yields timeline entry objects containing tweet data
   *
   * @example
   * ```typescript
   * for await (const entry of client.homeTimeline(20)) {
   *   console.log(entry);
   * }
   * ```
   *
   * @see {@link homeLatestTimeline} for fetching the "Following" timeline
   */
  public homeTimeline(
    count = 20,
    seenTweetIds: string[] = [],
    cursor?: string,
  ): AsyncIterableIterator<TimelineAddEntry> {
    const variables = {
      count,
      includePromotedContent: true,
      latestControlAvailable: true,
      requestContext: 'launch',
      seenTweetIds,
      withCommunity: true,
      cursor,
    };
    const features = defaultTweetFeatures;

    return this.graphql.paginate('c-CzHF1LboFilMpsx4ZCrQ', 'HomeTimeline', {
      variables,
      features,
      pagination: {
        transform: (resp) => {
          const json = JSON.parse(resp.body) as TimelineResponse;
          const instructions = json.data.home.home_timeline_urt.instructions;
          return instructions.flatMap(getEntries);
        },
        paginate: ({ currentItems }: PaginateData<string, TimelineAddEntry>): false | GraphQLOptionsInit => {
          const nextCursor = currentItems.map(getCursor).find((c) => c?.cursorType === 'Bottom');
          if (!nextCursor) {
            return false;
          }
          return {
            variables: { cursor: nextCursor },
          };
        },
      },
    });
  }

  /**
   * Fetches the latest tweets for the "Following" timeline.
   *
   * This method retrieves a timeline of tweets from accounts the user follows.
   *
   * @param count - The number of tweets to retrieve (default: 20)
   * @param seenTweetIds - An array of tweet IDs that have already been seen by the user
   * @param cursor - Optional cursor for pagination to continue from a specific point
   * @returns An async iterable iterator that yields timeline entry objects containing tweet data
   *
   * @example
   * ```typescript
   * for await (const entry of client.homeLatestTimeline(20)) {
   *   console.log(entry);
   * }
   * ```
   *
   * @see {@link homeTimeline} for fetching the "For You" timeline.
   */
  public homeLatestTimeline(
    count = 20,
    seenTweetIds: string[] = [],
    cursor?: string,
  ): AsyncIterableIterator<TimelineAddEntry> {
    const variables = {
      count,
      includePromotedContent: true,
      latestControlAvailable: true,
      requestContext: 'launch',
      seenTweetIds,
      cursor,
    };
    const features = defaultTweetFeatures;

    return this.graphql.paginate('BKB7oi212Fi7kQtCBGE4zA', 'HomeLatestTimeline', {
      variables,
      features,
      pagination: {
        transform: (resp) => {
          const json = JSON.parse(resp.body) as TimelineResponse;
          const instructions = json.data.home.home_timeline_urt.instructions;
          return instructions.flatMap(getEntries);
        },
        paginate: ({ currentItems }: PaginateData<string, TimelineAddEntry>): false | GraphQLOptionsInit => {
          const nextCursor = currentItems.map(getCursor).find((c) => c?.cursorType === 'Bottom');
          if (!nextCursor) {
            return false;
          }
          return {
            variables: { cursor: nextCursor },
          };
        },
      },
    });
  }

  /**
   * Retrieves the latest tweets from a specified list.
   *
   * @param listId - The ID of the list to fetch tweets from
   * @param count - The number of tweets to retrieve (default: 20)
   * @param cursor - Optional cursor for pagination to continue from a specific point
   * @returns An async iterable iterator that yields timeline entry objects containing tweet data
   *
   * @example
   * ```typescript
   * const listId = "123456789";
   * for await (const entry of client.listLatestTweetsTimeline(listId, 10)) {
   *   console.log(entry);
   * }
   * ```
   */
  public listLatestTweetsTimeline(
    listId: string,
    count = 20,
    cursor?: string,
  ): AsyncIterableIterator<TimelineAddEntry> {
    const variables = {
      listId,
      count,
      cursor,
    };
    const features = defaultTweetFeatures;

    return this.graphql.paginate('RlZzktZY_9wJynoepm8ZsA', 'ListLatestTweetsTimeline', {
      variables,
      features,
      pagination: {
        transform: (resp) => {
          const json = JSON.parse(resp.body) as ListLatestTweetsTimelineResponse;
          const instructions = json.data.list.tweets_timeline.timeline?.instructions ?? [];
          return instructions.flatMap(getEntries);
        },
        paginate: ({ currentItems }: PaginateData<string, TimelineAddEntry>): false | GraphQLOptionsInit => {
          const nextCursor = currentItems.map(getCursor).find((c) => c?.cursorType === 'Bottom');
          if (!nextCursor) {
            return false;
          }
          return {
            variables: { cursor: nextCursor },
          };
        },
      },
    });
  }

  /**
   * Searches the Twitter timeline for tweets matching the specified query.
   *
   * @param rawQuery - The search query string to find matching tweets
   * @param product - The type of search results to return (default: 'Top')
   * @param count - The number of results to return per request (default: 20)
   * @param cursor - Optional cursor for pagination to continue from a specific point
   *
   * @returns An async iterable iterator that yields timeline entries matching the search criteria
   *
   * @example
   * ```typescript
   * // Search for latest tweets containing "javascript"
   * const results = client.searchTimeline("javascript", 10, "Latest");
   * for await (const entry of results) {
   *   console.log(entry);
   * }
   * ```
   */
  public searchTimeline(
    rawQuery: string,
    product: 'Top' | 'Latest' | 'People' | 'Photos' | 'Videos' = 'Top',
    count = 20,
    cursor?: string,
  ): AsyncIterableIterator<TimelineAddEntry> {
    const variables = {
      rawQuery,
      count,
      cursor,
      querySource: 'typed_query',
      product,
    };
    const features = defaultTweetFeatures;

    return this.graphql.paginate('VhUd6vHVmLBcw0uX-6jMLA', 'SearchTimeline', {
      variables,
      features,
      pagination: {
        transform: (resp) => {
          const json = JSON.parse(resp.body) as SearchTimelineResponse;
          const instructions = json.data.search_by_raw_query.search_timeline.timeline.instructions;
          return instructions.flatMap(getEntries);
        },
        paginate: ({ currentItems }: PaginateData<string, TimelineAddEntry>): false | GraphQLOptionsInit => {
          const nextCursor = currentItems.map(getCursor).find((c) => c?.cursorType === 'Bottom');
          if (!nextCursor) {
            return false;
          }
          return {
            variables: { cursor: nextCursor },
          };
        },
      },
    });
  }

  /**
   * Retrieves tweets from a specific user's timeline.
   *
   * @param userId - The unique identifier of the user whose tweets to retrieve
   * @param count - The number of tweets to fetch per request (default: 40)
   * @param cursor - Optional cursor for pagination to continue from a specific point
   * @returns An async iterable iterator that yields timeline entry objects containing tweet data
   *
   * @example
   * ```typescript
   * // Get the first 20 tweets from a user
   * for await (const tweet of client.userTweets('123456789', 20)) {
   *   console.log(tweet);
   * }
   * ```
   */
  public userTweets(userId: string, count = 40, cursor?: string): AsyncIterableIterator<TimelineAddEntry> {
    const variables = {
      userId,
      count,
      cursor,
      includePromotedContent: true,
      withQuickPromoteEligibilityTweetFields: true,
      withVoice: true,
    };
    const features = defaultTweetFeatures;

    return this.graphql.paginate('q6xj5bs0hapm9309hexA_g', 'UserTweets', {
      variables,
      features,
      pagination: {
        transform: (resp) => {
          const json = JSON.parse(resp.body) as UserTweetsResponse;
          const instructions = json.data.user?.result.timeline.timeline?.instructions ?? [];
          return instructions.flatMap(getEntries);
        },
        paginate: ({ currentItems }: PaginateData<string, TimelineAddEntry>): false | GraphQLOptionsInit => {
          const nextCursor = currentItems.map(getCursor).find((c) => c?.cursorType === 'Bottom');
          if (!nextCursor) {
            return false;
          }
          return {
            variables: { cursor: nextCursor },
          };
        },
      },
    });
  }

  /**
   * Retrieves tweets and replies from a specific user's timeline.
   *
   * @param userId - The unique identifier of the user whose tweets and replies to fetch
   * @param count - The number of tweets to retrieve per page (default: 40)
   * @param cursor - Optional cursor for pagination to continue from a specific point
   * @returns An async iterable iterator that yields timeline entries containing tweets and replies
   *
   * @example
   * ```typescript
   * for await (const entry of client.userTweetsAndReplies('123456789')) {
   *   console.log(entry);
   * }
   * ```
   */
  public userTweetsAndReplies(userId: string, count = 40, cursor?: string): AsyncIterableIterator<TimelineAddEntry> {
    const variables = {
      userId,
      count,
      cursor,
      includePromotedContent: true,
      withCommunity: true,
      withVoice: true,
    };
    const features = defaultTweetFeatures;
    const fieldToggles = {
      withArticlePlainText: false,
    };

    return this.graphql.paginate('6hvhmQQ9zPIR8RZWHFAm4w', 'UserTweetsAndReplies', {
      variables,
      features,
      fieldToggles,
      pagination: {
        transform: (resp) => {
          const json = JSON.parse(resp.body) as UserTweetsResponse;
          const instructions = json.data.user?.result.timeline.timeline?.instructions ?? [];
          return instructions.flatMap(getEntries);
        },
        paginate: ({ currentItems }: PaginateData<string, TimelineAddEntry>): false | GraphQLOptionsInit => {
          const nextCursor = currentItems.map(getCursor).find((c) => c?.cursorType === 'Bottom');
          if (!nextCursor) {
            return false;
          }
          return {
            variables: { cursor: nextCursor },
          };
        },
      },
    });
  }

  /**
   * Retrieves highlighted tweets from a specific user's timeline.
   *
   * @param userId - The unique identifier of the user whose highlighted tweets to fetch
   * @param count - The number of tweets to retrieve per page (default: 40)
   * @param cursor - Optional cursor for pagination to continue from a specific point
   * @returns An async iterable iterator that yields timeline entries containing highlighted tweets
   *
   * @example
   * ```typescript
   * // Get first page of highlighted tweets
   * for await (const tweet of client.userHighlightsTweets('123456789')) {
   *   console.log(tweet);
   * }
   * ```
   */
  public userHighlightsTweets(userId: string, count = 40, cursor?: string): AsyncIterableIterator<TimelineAddEntry> {
    const variables = {
      userId,
      count,
      cursor,
      includePromotedContent: true,
      withVoice: true,
    };
    const features = defaultTweetFeatures;
    const fieldToggles = {
      withArticlePlainText: false,
    };

    return this.graphql.paginate('70Yf8aSyhGOXaKRLJdVA2A', 'UserHighlightsTweets', {
      variables,
      features,
      fieldToggles,
      pagination: {
        transform: (resp) => {
          const json = JSON.parse(resp.body) as UserHighlightsTweetsResponse;
          const instructions = json.data.user?.result.timeline.timeline.instructions ?? [];
          return instructions.flatMap(getEntries);
        },
        paginate: ({ currentItems }: PaginateData<string, TimelineAddEntry>): false | GraphQLOptionsInit => {
          const nextCursor = currentItems.map(getCursor).find((c) => c?.cursorType === 'Bottom');
          if (!nextCursor) {
            return false;
          }
          return {
            variables: { cursor: nextCursor },
          };
        },
      },
    });
  }

  /**
   * Retrieves media posts from a specific user's timeline.
   *
   * @param userId - The unique identifier of the user whose media to retrieve
   * @param count - The number of media items to fetch per request (default: 40)
   * @param cursor - Optional cursor for pagination to continue from a specific point
   * @returns An async iterable iterator that yields timeline entries containing media posts
   *
   * @example
   * ```typescript
   * const mediaIterator = client.userMedia('123456789', 20);
   * for await (const mediaPost of mediaIterator) {
   *   console.log(mediaPost);
   * }
   * ```
   */
  public userMedia(userId: string, count = 40, cursor?: string): AsyncIterableIterator<TimelineAddEntry> {
    const variables = {
      userId,
      count,
      cursor,
      includePromotedContent: false,
      withClientEventToken: false,
      withBirdwatchNotes: false,
      withVoice: true,
    };
    const features = defaultTweetFeatures;
    const fieldToggles = {
      withArticlePlainText: false,
    };

    return this.graphql.paginate('1H9ibIdchWO0_vz3wJLDTA', 'UserMedia', {
      variables,
      features,
      fieldToggles,
      pagination: {
        transform: (resp) => {
          const json = JSON.parse(resp.body) as UserTweetsResponse;
          const instructions = json.data.user?.result.timeline.timeline?.instructions ?? [];
          return instructions.flatMap(getEntries);
        },
        paginate: ({ currentItems }: PaginateData<string, TimelineAddEntry>): false | GraphQLOptionsInit => {
          const nextCursor = currentItems.map(getCursor).find((c) => c?.cursorType === 'Bottom');
          if (!nextCursor) {
            return false;
          }
          return {
            variables: { cursor: nextCursor },
          };
        },
      },
    });
  }

  /**
   * Retrieves the likes (favorites) of a specific user.
   *
   * @param userId - The unique identifier of the user whose likes to retrieve
   * @param count - The number of likes to fetch per request (default: 20)
   * @param cursor - Optional cursor for pagination to continue from a specific point
   * @returns An async iterable iterator that yields timeline entries containing liked tweets
   *
   * @example
   * ```typescript
   * const likesIterator = client.likes('123456789', 20);
   * for await (const like of likesIterator) {
   *   console.log(like);
   * }
   * ```
   */
  public likes(userId: string, count = 20, cursor?: string): AsyncIterableIterator<TimelineAddEntry> {
    const variables = {
      userId,
      count,
      cursor,
      includePromotedContent: false,
      withClientEventToken: false,
      withBirdwatchNotes: false,
      withVoice: true,
    };
    const features = defaultTweetFeatures;
    const fieldToggles = {
      withArticlePlainText: false,
    };

    return this.graphql.paginate('lIDpu_NWL7_VhimGGt0o6A', 'Likes', {
      variables,
      features,
      fieldToggles,
      pagination: {
        transform: (resp) => {
          const json = JSON.parse(resp.body) as UserTweetsResponse;
          const instructions = json.data.user?.result.timeline.timeline?.instructions ?? [];
          return instructions.flatMap(getEntries);
        },
        paginate: ({ currentItems }: PaginateData<string, TimelineAddEntry>): false | GraphQLOptionsInit => {
          const nextCursor = currentItems.map(getCursor).find((c) => c?.cursorType === 'Bottom');
          if (!nextCursor) {
            return false;
          }
          return {
            variables: { cursor: nextCursor },
          };
        },
      },
    });
  }

  /**
   * Retrieves detailed information about a specific tweet and its thread.
   *
   * @param tweetId - The unique identifier of the tweet to fetch details for
   * @param cursor - Optional pagination cursor for loading additional replies or thread content
   * @returns Promise that resolves to an array of timeline entries containing tweet details
   *
   * @example
   * ```typescript
   * const tweetDetails = await client.tweetDetail('1234567890');
   * console.log(tweetDetails);
   * ```
   */
  public async tweetDetail(tweetId: string, cursor?: string): Promise<TimelineAddEntry[]> {
    const variables = {
      focalTweetId: tweetId,
      cursor,
      referrer: 'home',
      with_rux_injections: false,
      rankingMode: 'Relevance',
      includePromotedContent: true,
      withCommunity: true,
      withQuickPromoteEligibilityTweetFields: true,
      withBirdwatchNotes: true,
      withVoice: true,
    };
    const features = defaultTweetFeatures;
    const fieldToggles = {
      withArticleRichContentState: true,
      withArticlePlainText: false,
      withGrokAnalyze: false,
      withDisallowedReplyControls: false,
    };

    const resp = await this.graphql
      .query('xd_EMdYvB9hfZsZ6Idri0w', 'TweetDetail', {
        variables,
        features,
        fieldToggles,
      })
      .json<TweetDetailResponse>();

    if (!resp.data.threaded_conversation_with_injections_v2) {
      throw new Error(`Tweet with ID "${tweetId}" not found.`);
    }
    return resp.data.threaded_conversation_with_injections_v2.instructions.flatMap(getEntries);
  }

  /**
   * Retrieves a tweet by its REST ID.
   *
   * @param tweetId - The unique identifier of the tweet to retrieve
   * @returns A promise that resolves to the tweet result object
   *
   * @example
   * ```typescript
   * const tweet = await client.tweetResultByRestId('1234567890');
   * console.log(tweet);
   * ```
   */
  public async tweetResultByRestId(tweetId: string): Promise<TweetUnion> {
    const variables = {
      tweetId,
      withCommunity: false,
      includePromotedContent: false,
      withVoice: false,
    };
    const features = defaultTweetFeatures;
    const fieldToggles = {
      withArticleRichContentState: true,
      withArticlePlainText: false,
    };

    const resp = await this.graphql
      .query('7xflPyRiUxGVbJd4uWmbfg', 'TweetResultByRestId', {
        variables,
        features,
        fieldToggles,
      })
      .json<TweetResultByRestIdResponse>();

    if (!resp.data.tweetResult?.result) {
      throw new Error(`Tweet with ID "${tweetId}" not found.`);
    }
    return resp.data.tweetResult.result;
  }

  public async favoriters(tweetId: string, count = 20, cursor?: string): Promise<TweetFavoritersResponse> {
    const variables = {
      tweetId,
      count,
      cursor,
      includePromotedContent: true,
    };
    const features = defaultTweetFeatures;
    const resp = await this.graphql
      .query('G27_CXbgIP3G9Fod_2RMUA', 'Favoriters', {
        variables,
        features,
      })
      .json<TweetFavoritersResponse>();

    return resp;
  }

  public async retweeters(): Promise<TweetRetweetersResponse> {
    return this.graphql.query('Mbs-2NiTvy32oHDerWtVhg', 'Retweeters').json();
  }

  public async profileSpotlights(): Promise<ProfileResponse> {
    return this.graphql.query('-0XdHI-mrHWBQd8-oLo1aA', 'ProfileSpotlightsQuery').json();
  }

  public async favoriteTweet(): Promise<FavoriteTweetResponse> {
    return this.graphql.mutation('lI07N6Otwv1PhnEgXILM7A', 'FavoriteTweet').json();
  }

  public async unfavoriteTweet(): Promise<UnfavoriteTweetResponse> {
    return this.graphql.mutation('ZYKSe-w7KEslx3JhSIk5LA', 'UnfavoriteTweet').json();
  }

  public async createRetweet(): Promise<CreateTweetResponse> {
    return this.graphql.mutation('ojPdsZsimiJrUGLR1sjUtA', 'CreateRetweet').json();
  }

  public async deleteRetweet(): Promise<DeleteRetweetResponse> {
    return this.graphql.mutation('iQtK4dl5hBmXewYZuEOKVw', 'DeleteRetweet').json();
  }

  public async createTweet(): Promise<CreateTweetResponse> {
    return this.graphql.mutation('IID9x6WsdMnTlXnzXGq8ng', 'CreateTweet').json();
  }

  public async deleteTweet(): Promise<DeleteTweetResponse> {
    return this.graphql.mutation('VaenaVgh5q5ih7kvyVjgtg', 'DeleteTweet').json();
  }

  public async bookmarks(): Promise<BookmarksResponse> {
    return this.graphql.query('2neUNDqrrFzbLui8yallcQ', 'Bookmarks').json();
  }

  public async createBookmark(): Promise<CreateBookmarkResponse> {
    return this.graphql.mutation('aoDbu3RHznuiSkQ9aNM67Q', 'CreateBookmark').json();
  }

  public async deleteBookmark(): Promise<DeleteBookmarkResponse> {
    return this.graphql.mutation('Wlmlj2-xzyS1GN3a6cj-mQ', 'DeleteBookmark').json();
  }

  public async following(): Promise<FollowResponse> {
    return this.graphql.query('zx6e-TLzRkeDO_a7p4b3JQ', 'Following').json();
  }

  public async followers(): Promise<FollowResponse> {
    return this.graphql.query('GQ1yZjbfSiPfi_5gznKMPw', 'Followers').json();
  }

  public async followersYouKnow(): Promise<FollowResponse> {
    return this.graphql.query('pNK460VRQKGuLfDcesjNEQ', 'FollowersYouKnow').json();
  }

  public async blueVerifiedFollowers(): Promise<FollowResponse> {
    return this.graphql.query('GQ1yZjbfSiPfi_5gznKMPw', 'BlueVerifiedFollowers').json();
  }
}
