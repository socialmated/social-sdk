import { type ItemResult, type Timeline, type TimelineResult } from './timeline.js';
import { type Tweet } from './tweet.js';
import { type UserResults } from './user.js';

interface ErrorResponse {
  message: string;
  locations: Location[];
  path: (string | number)[];
  extensions: ErrorExtensions;
  code: number;
  kind: string;
  name: string;
  source: string;
  retry_after?: number;
  tracing: Tracing;
}

interface Location {
  line: number;
  column: number;
}

interface ErrorExtensions {
  name: string;
  source: string;
  retry_after?: number;
  code: number;
  kind: string;
  tracing: Tracing;
}

interface Tracing {
  trace_id: string;
}

interface UserResponseData {
  user?: UserResults;
}

interface UserResponse {
  data: UserResponseData;
  errors?: ErrorResponse[];
}

interface UsersResponseData {
  users?: UserResults[];
}

interface UsersResponse {
  data: UsersResponseData;
  errors?: ErrorResponse[];
}

interface UserTweetsResponse {
  data: UserTweetsData;
  errors?: ErrorResponse[];
}

interface UserTweetsData {
  user?: UserTweetsUser;
}

interface UserTweetsUser {
  result: UserTweetsResultV1;
}

interface UserTweetsResultV1 {
  __typename: 'User';
  timeline: TimelineResult;
}

interface UserTweetsResultV2 {
  __typename: 'User';
  timeline_v2: TimelineResult;
}

interface UserHighlightsTweetsResponse {
  data: UserHighlightsTweetsData;
  errors?: ErrorResponse[];
}

interface UserHighlightsTweetsData {
  user?: UserHighlightsTweetsUser;
}

interface UserHighlightsTweetsUser {
  result: UserHighlightsTweetsResult;
}

interface UserHighlightsTweetsResult {
  __typename: 'User';
  timeline: UserHighlightsTweetsTimeline;
}

interface UserHighlightsTweetsTimeline {
  timeline: Timeline;
}

interface TweetDetailResponse {
  data: TweetDetailResponseData;
  errors?: ErrorResponse[];
}
interface TweetDetailResponseData {
  threaded_conversation_with_injections_v2?: Timeline;
}

interface TweetResultByRestIdResponse {
  data: TweetResultByRestIdData;
  errors?: ErrorResponse[];
}

interface TweetResultByRestIdData {
  tweetResult?: ItemResult;
}

interface TweetFavoritersResponse {
  data: TweetFavoritersResponseData;
  errors?: ErrorResponse[];
}

interface TweetFavoritersResponseData {
  favoriters_timeline?: TimelineResult;
}

interface TweetRetweetersResponse {
  data: TweetRetweetersResponseData;
  errors?: ErrorResponse[];
}

interface TweetRetweetersResponseData {
  retweeters_timeline?: TimelineResult;
}

interface TimelineResponse {
  data: HomeTimelineResponseData;
  errors?: ErrorResponse[];
}

interface HomeTimelineResponseData {
  home: HomeTimelineHome;
}

interface HomeTimelineHome {
  home_timeline_urt: Timeline;
}

interface ListLatestTweetsTimelineResponse {
  data: ListTweetsTimelineData;
  errors?: ErrorResponse[];
}

interface ListTweetsTimelineData {
  list: ListTweetsTimelineList;
}

interface ListTweetsTimelineList {
  tweets_timeline: TimelineResult;
}

interface SearchTimelineResponse {
  data: SearchTimelineData;
  errors?: ErrorResponse[];
}

interface SearchTimelineData {
  search_by_raw_query: SearchByRawQuery;
}

interface SearchByRawQuery {
  search_timeline: SearchTimeline;
}

interface SearchTimeline {
  timeline: Timeline;
}

interface CommunityTweetsTimelineResponse {
  data: RankedCommunityTweetData;
  errors?: ErrorResponse[];
}

interface RankedCommunityTweetData {
  communityResults: RankedCommunityResults;
}

interface RankedCommunityResults {
  result: RankedCommunityResult;
}

interface RankedCommunityResult {
  __typename: 'Community';
  ranked_community_timeline: TimelineResult;
}

interface CommunityMediaTimelineResponse {
  data: MediaCommunityTweetData;
  errors?: ErrorResponse[];
}

interface MediaCommunityTweetData {
  __typename: 'Community';
  communityResults: MediaCommunityResults;
}

interface MediaCommunityResults {
  result: MediaCommunityResult;
}

interface MediaCommunityResult {
  __typename: 'Community';
  community_media_timeline: TimelineResult;
}

interface CommunityAboutTimelineResponse {
  data: AboutCommunityTweetData;
  errors?: ErrorResponse[];
}

interface AboutCommunityTweetData {
  communityResults: AboutCommunityResults;
}

interface AboutCommunityResults {
  result: AboutCommunityResult;
}

interface AboutCommunityResult {
  __typename: 'Community';
  about_timeline: TimelineResult;
}

interface NotificationsTimelineResponse {
  data: NotificationsTimelineData;
  errors?: ErrorResponse[];
}

interface NotificationsTimelineData {
  viewer_v2: NotificationsViewerV2;
}

interface NotificationsViewerV2 {
  user_results: NotificationsUserResults;
}

interface NotificationsUserResults {
  result: NotificationsResult;
}

interface NotificationsResult {
  __typename: 'User';
  rest_id: string;
  notification_timeline: TimelineResult;
}

interface ProfileResponse {
  data: ProfileResponseData;
  errors?: ErrorResponse[];
}

interface ProfileResponseData {
  user_result_by_screen_name?: UserResultByScreenName;
}

interface UserResultByScreenName {
  id: string;
  result: UserResultByScreenNameResult;
}

interface UserResultByScreenNameResult {
  __typename: 'User';
  id: string;
  legacy: UserResultByScreenNameLegacy;
  profilemodules: Record<string, unknown>;
  rest_id: string;
}

interface UserResultByScreenNameLegacy {
  blocking?: boolean;
  blocked_by?: boolean;
  protected?: boolean;
  following?: boolean;
  followed_by?: boolean;
  name?: string;
  screen_name?: string;
}

interface FavoriteTweetResponse {
  data: FavoriteTweet;
  errors?: ErrorResponse[];
}

interface FavoriteTweet {
  favorite_tweet: string;
}

interface UnfavoriteTweetResponse {
  data: UnfavoriteTweet;
  errors?: ErrorResponse[];
}

interface UnfavoriteTweet {
  unfavorite_tweet: string;
}

interface CreateRetweetResponse {
  data: CreateRetweetResponseData;
  errors?: ErrorResponse[];
}

interface CreateRetweetResponseData {
  create_retweet: CreateRetweetResponseResult;
}

interface CreateRetweetResponseResult {
  retweet_results: CreateRetweet;
}

interface CreateRetweet {
  result: Retweet;
}

interface Retweet {
  rest_id: string;
  legacy: {
    full_text: string;
  };
}

interface DeleteRetweetResponse {
  data: DeleteRetweetResponseData;
  errors?: ErrorResponse[];
}

interface DeleteRetweetResponseData {
  create_retweet?: DeleteRetweetResponseResult;
}

interface DeleteRetweetResponseResult {
  retweet_results: DeleteRetweet;
}

interface DeleteRetweet {
  result: Retweet;
}

interface CreateTweetResponse {
  data: CreateTweetResponseData;
  errors?: ErrorResponse[];
}

interface CreateTweetResponseData {
  create_tweet: CreateTweetResponseResult;
}

interface CreateTweetResponseResult {
  tweet_results: CreateTweet;
}

interface CreateTweet {
  result: Tweet;
}

interface DeleteTweetResponse {
  data: DeleteTweetResponseData;
  errors?: ErrorResponse[];
}

interface DeleteTweetResponseData {
  delete_retweet: DeleteTweetResponseResult;
}

interface DeleteTweetResponseResult {
  tweet_results: Record<string, unknown>;
}

interface CreateBookmarkResponse {
  data: CreateBookmarkResponseData;
  errors?: ErrorResponse[];
}

interface CreateBookmarkResponseData {
  tweet_bookmark_put: string;
}

interface DeleteBookmarkResponse {
  data: DeleteBookmarkResponseData;
  errors?: ErrorResponse[];
}

interface DeleteBookmarkResponseData {
  tweet_bookmark_delete: string;
}

interface FollowResponse {
  data: FollowResponseData;
  errors?: ErrorResponse[];
}

interface FollowResponseData {
  user?: FollowResponseUser;
}

interface FollowResponseUser {
  result: FollowResponseResult;
}

interface FollowResponseResult {
  __typename: 'User';
  timeline: FollowTimeline;
}

interface FollowTimeline {
  timeline: Timeline;
}

interface BookmarksResponse {
  data: BookmarksResponseData;
  errors?: ErrorResponse[];
}

interface BookmarksResponseData {
  bookmark_timeline_v2: BookmarksTimeline;
}

interface BookmarksTimeline {
  timeline: Timeline;
}

export type {
  ErrorResponse,
  Location,
  ErrorExtensions,
  Tracing,
  UserResponseData,
  UserResponse,
  UsersResponseData,
  UsersResponse,
  UserTweetsResponse,
  UserTweetsData,
  UserTweetsUser,
  UserTweetsResultV1,
  UserTweetsResultV2,
  UserHighlightsTweetsResponse,
  UserHighlightsTweetsData,
  UserHighlightsTweetsUser,
  UserHighlightsTweetsResult,
  UserHighlightsTweetsTimeline,
  TweetDetailResponse,
  TweetDetailResponseData,
  TweetResultByRestIdResponse,
  TweetResultByRestIdData,
  TweetFavoritersResponse,
  TweetFavoritersResponseData,
  TweetRetweetersResponse,
  TweetRetweetersResponseData,
  TimelineResponse,
  HomeTimelineResponseData,
  HomeTimelineHome,
  ListLatestTweetsTimelineResponse,
  ListTweetsTimelineData,
  ListTweetsTimelineList,
  SearchTimelineResponse,
  SearchTimelineData,
  SearchByRawQuery,
  SearchTimeline,
  CommunityTweetsTimelineResponse,
  RankedCommunityTweetData,
  RankedCommunityResults,
  RankedCommunityResult,
  MediaCommunityTweetData,
  MediaCommunityResults,
  MediaCommunityResult,
  CommunityMediaTimelineResponse,
  CommunityAboutTimelineResponse,
  AboutCommunityTweetData,
  AboutCommunityResults,
  AboutCommunityResult,
  NotificationsTimelineResponse,
  NotificationsTimelineData,
  NotificationsViewerV2,
  NotificationsUserResults,
  NotificationsResult,
  ProfileResponse,
  ProfileResponseData,
  UserResultByScreenName,
  UserResultByScreenNameResult,
  UserResultByScreenNameLegacy,
  FavoriteTweetResponse,
  FavoriteTweet,
  UnfavoriteTweetResponse,
  UnfavoriteTweet,
  CreateRetweetResponse,
  CreateRetweetResponseData,
  CreateRetweetResponseResult,
  CreateRetweet,
  Retweet,
  DeleteRetweetResponse,
  DeleteRetweetResponseData,
  DeleteRetweetResponseResult,
  DeleteRetweet,
  CreateTweetResponse,
  CreateTweetResponseData,
  CreateTweetResponseResult,
  CreateTweet,
  DeleteTweetResponse,
  DeleteTweetResponseData,
  DeleteTweetResponseResult,
  CreateBookmarkResponse,
  CreateBookmarkResponseData,
  DeleteBookmarkResponse,
  DeleteBookmarkResponseData,
  FollowResponse,
  FollowResponseData,
  FollowResponseUser,
  FollowResponseResult,
  FollowTimeline,
  BookmarksResponse,
  BookmarksResponseData,
  BookmarksTimeline,
};
