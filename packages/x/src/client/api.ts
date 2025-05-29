import { type HttpClient } from '@social-sdk/core/client';
import { XAPIEndpoints, createXHttpClient, useGraphQLHttpClient, type GraphQLHttpClient } from './http.js';
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
class XPrivateAPIClient {
  /**
   * The http client for the v1.1 API endpoint.
   */
  private v11: HttpClient;

  /**
   * The http client for the v2 API endpoint.
   */
  private v2: HttpClient;

  /**
   * The GraphQL http client for the GraphQL API endpoint.
   */
  private graphql: GraphQLHttpClient;

  /**
   * Creates a new instance of the API client with authenticated HTTP clients for different API versions.
   *
   * @param session - The X (Twitter) cookie session used for authentication across all API endpoints
   */
  constructor(session: XCookieSession) {
    this.v11 = createXHttpClient(XAPIEndpoints.V11, session);
    this.v2 = createXHttpClient(XAPIEndpoints.V2, session);
    this.graphql = useGraphQLHttpClient(createXHttpClient(XAPIEndpoints.GRAPHQL, session));
  }

  public async listFriendsFollowing(): Promise<unknown> {
    return this.v11.get('friends/following/list.json').json();
  }

  public async typeaheadSearch(): Promise<unknown> {
    return this.v11.get('search/typeahead.json').json();
  }

  public async createFriendships(): Promise<unknown> {
    return this.v11.post('friendships/create.json').json();
  }

  public async destroyFriendships(): Promise<unknown> {
    return this.v11.post('friendships/destroy.json').json();
  }

  /**
   * Fetches hashflags data from the X (Twitter) API.
   *
   * Hashflags are custom emoji that appear next to specific hashtags
   * on Twitter.
   *
   * @example
   * ```typescript
   * const hashflags = await client.hashflags();
   * console.log(hashflags);
   * ```
   *
   * @returns A promise that resolves to the hashflags data as an unknown type.
   */
  public async hashflags(): Promise<unknown> {
    return this.v11.get('hashflags.json').json();
  }

  public async adaptiveSearch(): Promise<unknown> {
    return this.v2.get('search/adaptive.json').json();
  }

  public async badgeCount(): Promise<unknown> {
    return this.v2.get('badge_count/badge_count.json').json();
  }

  /**
   * Fetches user information from the X (Twitter) API based on the provided screen name.
   *
   * @param screenName - The screen name (username) of the user to retrieve information for.
   * @returns A promise that resolves to a `UserResponse` object containing the user's details.
   *
   * @example
   * ```typescript
   * const user = await client.userByScreenName('elonmusk');
   * console.log(user);
   * ```
   *
   * @see {@link userByRestId} for fetching user information by REST ID (User ID).
   */
  public async userByScreenName(screenName: string): Promise<UserResponse> {
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

    return this.graphql.query('1VOOyvKkiI3FMmkeDNxM9A', 'UserByScreenName', variables, features, fieldToggles).json();
  }

  /**
   * Fetches user information from the X (Twitter) API based on the provided REST ID.
   *
   * REST ID is a unique identifier for a user on the X platform.
   *
   * @param restId - The REST ID of the user to retrieve information for.
   * @returns A promise that resolves to a `UserResponse` object containing the user's details.
   *
   * @example
   * ```typescript
   * const user = await client.userByRestId('44196397');
   * console.log(user);
   * ```
   *
   * @see {@link usersByRestIds} for batch fetching of user information.
   * @see {@link userByScreenName} for fetching user information by screen name.
   */
  public async userByRestId(restId: string): Promise<UserResponse> {
    const variables = {
      userId: restId,
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

    return this.graphql.query('tD8zKvQzwY3kdx5yz6YmOw', 'UserByRestId', variables, features).json();
  }

  /**
   * Fetches user information from the X (Twitter) API based on the provided REST IDs.
   *
   * @param restIds - An array of REST IDs of the users to retrieve information for.
   * @returns A promise that resolves to a `UsersResponse` object containing the users' details.
   *
   * @example
   * ```typescript
   * const users = await client.usersByRestIds(['44196397', '12']);
   * console.log(users);
   * ```
   *
   * @see {@link userByRestId} for fetching user information by a single REST ID.
   */
  public async usersByRestIds(restIds: string[]): Promise<UsersResponse> {
    const variables = {
      userIds: restIds,
    };
    const features = {
      profile_label_improvements_pcf_label_in_post_enabled: true,
      rweb_tipjar_consumption_enabled: true,
      verified_phone_label_enabled: false,
      responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
      responsive_web_graphql_timeline_navigation_enabled: true,
    };

    return this.graphql.query('XArUHrueMW0KQdZUdqidrA', 'UsersByRestIds', variables, features).json();
  }

  /**
   * Retrieves the curated "For You" timeline feed from Twitter.
   *
   * This feed suggests tweets based on the user's individual interactions and preferences.
   *
   * @param count - The number of tweets to retrieve.
   * @param cursor - (Optional) A pagination cursor to fetch the next set of tweets.
   * @param seenTweetIds - (Optional) An array of tweet IDs that have already been seen by the user.
   * @returns A promise that resolves to the response containing the timeline feed data.
   *
   * @example
   * ```typescript
   * const timeline = await client.homeTimeline(20);
   * console.log(timeline);
   * ```
   *
   * @see {@link homeLatestTimeline} for fetching the "Following" timeline.
   */
  public async homeTimeline(count: number, cursor?: string, seenTweetIds: string[] = []): Promise<TimelineResponse> {
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

    // TODO: use paginate
    return this.graphql.query('c-CzHF1LboFilMpsx4ZCrQ', 'HomeTimeline', variables, features).json();
  }

  /**
   * Fetches the latest tweets for the "Following" feed on Twitter.
   *
   * This method retrieves a timeline of tweets from accounts the user follows.
   *
   * @param count - The number of tweets to fetch.
   * @param cursor - (Optional) A pagination cursor to fetch the next set of tweets.
   * @param seenTweetIds - (Optional) An array of tweet IDs that have already been seen.
   * @returns A promise that resolves to the fetched timeline data.
   *
   * @example
   * ```typescript
   * const latestTimeline = await client.homeLatestTimeline(20);
   * console.log(latestTimeline);
   * ```
   *
   * @see {@link homeTimeline} for fetching the "For You" timeline.
   */
  public async homeLatestTimeline(
    count: number,
    cursor?: string,
    seenTweetIds: string[] = [],
  ): Promise<TimelineResponse> {
    const variables = {
      count,
      includePromotedContent: true,
      latestControlAvailable: true,
      requestContext: 'launch',
      seenTweetIds,
      cursor,
    };
    const features = defaultTweetFeatures;

    // TODO: use paginate
    return this.graphql.query('BKB7oi212Fi7kQtCBGE4zA', 'HomeLatestTimeline', variables, features).json();
  }

  public async listLatestTweetsTimeline(
    listId: string,
    count: number,
    cursor?: string,
  ): Promise<ListLatestTweetsTimelineResponse> {
    const variables = {
      listId,
      count,
      cursor,
    };
    const features = defaultTweetFeatures;

    return this.graphql.query('RlZzktZY_9wJynoepm8ZsA', 'ListLatestTweetsTimeline', variables, features).json();
  }

  public async searchTimeline(
    rawQuery: string,
    count: number,
    product?: 'Top' | 'Latest' | 'People' | 'Photos' | 'Videos',
  ): Promise<SearchTimelineResponse> {
    const variables = {
      rawQuery,
      count,
      querySource: 'typed_query',
      product,
    };
    const features = defaultTweetFeatures;

    return this.graphql.query('VhUd6vHVmLBcw0uX-6jMLA', 'SearchTimeline', variables, features).json();
  }

  public async userTweets(userId: string, count: number, cursor?: string): Promise<UserTweetsResponse> {
    const variables = {
      userId,
      count,
      cursor,
      includePromotedContent: true,
      withQuickPromoteEligibilityTweetFields: true,
      withVoice: true,
    };
    const features = defaultTweetFeatures;

    return this.graphql.query('q6xj5bs0hapm9309hexA_g', 'UserTweets', variables, features).json();
  }

  public async userTweetsAndReplies(userId: string, count: number, cursor?: string): Promise<UserTweetsResponse> {
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

    return this.graphql
      .query('6hvhmQQ9zPIR8RZWHFAm4w', 'UserTweetsAndReplies', variables, features, fieldToggles)
      .json();
  }

  public async userHighlightsTweets(
    userId: string,
    count: number,
    cursor?: string,
  ): Promise<UserHighlightsTweetsResponse> {
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

    return this.graphql
      .query('70Yf8aSyhGOXaKRLJdVA2A', 'UserHighlightsTweets', variables, features, fieldToggles)
      .json();
  }

  public async userMedia(): Promise<UserTweetsResponse> {
    return this.graphql.query('1H9ibIdchWO0_vz3wJLDTA', 'UserMedia').json();
  }

  public async likes(): Promise<UserTweetsResponse> {
    return this.graphql.query('lIDpu_NWL7_VhimGGt0o6A', 'Likes').json();
  }

  public async tweetDetail(): Promise<TweetDetailResponse> {
    return this.graphql.query('xd_EMdYvB9hfZsZ6Idri0w', 'TweetDetail').json();
  }

  public async tweetResultByRestId(): Promise<TweetResultByRestIdResponse> {
    return this.graphql.query('7xflPyRiUxGVbJd4uWmbfg', 'TweetResultByRestId').json();
  }

  public async favoriters(): Promise<TweetFavoritersResponse> {
    return this.graphql.query('G27_CXbgIP3G9Fod_2RMUA', 'Favoriters').json();
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
    const queryId = '2neUNDqrrFzbLui8yallcQ';
    return this.graphql.get(`${queryId}/Bookmarks`).json();
  }

  public async createBookmark(): Promise<CreateBookmarkResponse> {
    const queryId = 'aoDbu3RHznuiSkQ9aNM67Q';
    return this.graphql.post(`${queryId}/CreateBookmark`).json();
  }

  public async deleteBookmark(): Promise<DeleteBookmarkResponse> {
    const queryId = 'Wlmlj2-xzyS1GN3a6cj-mQ';
    return this.graphql.post(`${queryId}/DeleteBookmark`).json();
  }

  public async following(): Promise<FollowResponse> {
    const queryId = 'zx6e-TLzRkeDO_a7p4b3JQ';
    return this.graphql.get(`${queryId}/Following`).json();
  }

  public async followers(): Promise<FollowResponse> {
    const queryId = 'GQ1yZjbfSiPfi_5gznKMPw';
    return this.graphql.get(`${queryId}/Followers`).json();
  }

  public async followersYouKnow(): Promise<FollowResponse> {
    const queryId = 'pNK460VRQKGuLfDcesjNEQ';
    return this.graphql.get(`${queryId}/FollowersYouKnow`).json();
  }

  public async blueVerifiedFollowers(): Promise<FollowResponse> {
    const queryId = 'GQ1yZjbfSiPfi_5gznKMPw';
    return this.graphql.get(`${queryId}/BlueVerifiedFollowers`).json();
  }
}

export { XPrivateAPIClient };
