import { type CommunityRelationship, type AuthorCommunityRelationship, type CommunityData } from './community.js';
import { type UserResultCore, type UserResults } from './user.js';

type TweetUnion = Tweet | TweetWithVisibilityResults | TweetTombstone | TweetUnavailable | TweetPreviewDisplay;

interface TweetWithVisibilityResults {
  __typename: 'TweetWithVisibilityResults';
  tweet: Tweet;
  limitedActionResults?: Record<string, unknown>;
  tweetInterstitial?: TweetInterstitial;
  mediaVisibilityResults?: MediaVisibilityResults;
}

interface TweetInterstitial {
  __typename: 'ContextualTweetInterstitial';
  displayType: 'NonCompliant';
  text: TweetInterstitialText;
  revealText: TweetInterstitialRevealText;
}

interface TweetInterstitialText {
  rtl: boolean;
  text: string;
  entities: TweetInterstitialTextEntity[];
}

interface TweetInterstitialTextEntity {
  fromIndex: number;
  toIndex: number;
  ref: TweetInterstitialTextEntityRef;
}

interface TweetInterstitialTextEntityRef {
  type: 'TimelineUrl';
  url: string;
  urlType: 'ExternalUrl';
}

interface MediaVisibilityResults {
  blurred_image_interstitial: MediaVisibilityResultsBlurredImageInterstitial;
}

interface MediaVisibilityResultsBlurredImageInterstitial {
  opacity: number;
  text: TweetInterstitialText;
  title: TweetInterstitialText;
}

interface TweetInterstitialRevealText {
  rtl: boolean;
  text: string;
  entities: TweetInterstitialTextEntity[];
}

interface TweetTombstone {
  __typename: 'TweetWithVisibilityResults';
  [key: string]: unknown;
}

interface TweetUnavailable {
  __typename: 'TweetUnavailable';
  reason?: string;
}

interface Tweet {
  __typename: 'Tweet';
  rest_id: string;
  birdwatch_pivot?: BirdwatchPivot;
  core?: UserResultCore;
  card?: TweetCard;
  unmention_data?: Record<string, unknown>;
  edit_control?: TweetEditControl;
  edit_prespective?: TweetEditPrespective;
  is_translatable?: boolean;
  source?: string;
  legacy?: TweetLegacy;
  views?: TweetView;
  quoted_status_result?: ItemResult;
  note_tweet?: NoteTweet;
  quick_promote_eligibility?: Record<string, never>;
  unified_card?: UnifiedCard;
  previous_counts?: TweetPreviousCounts;
  quotedRefResult?: QuotedRefResult;
  superFollowsReplyUserResult?: SuperFollowsReplyUserResult;
  has_birdwatch_notes?: boolean;
  community_relationship?: CommunityRelationship;
  author_community_relationship?: AuthorCommunityRelationship;
  article?: Article;
  community_results?: CommunityData[];
  trend_results?: TrendResults[];
  grok_analysis_followups?: string[];
  grok_share_attachment?: GrokShareAttachment;
  grok_analysis_button?: boolean;
}

interface ItemResult {
  __typename?: 'TimelineTweet' | 'TweetUnavailable';
  result?: TweetUnion;
}

interface TweetEditControl {
  edit_tweet_ids?: string[];
  editable_until_msecs?: string;
  is_edit_eligible?: boolean;
  edits_remaining?: string;
  initial_tweet_id?: string;
  edit_control_initial?: TweetEditControlInitial;
}

interface TweetEditControlInitial {
  edit_tweet_ids: string[];
  editable_until_msecs: string;
  is_edit_eligible: boolean;
  edits_remaining: string;
}

interface TweetEditPrespective {
  favorited?: boolean;
  retweeted?: boolean;
}

interface TweetView {
  count?: string;
  state: 'Enabled' | 'EnabledWithCount';
}

interface NoteTweet {
  is_expandable: boolean;
  note_tweet_results: NoteTweetResult;
}

interface NoteTweetResult {
  result: NoteTweetResultData;
}

interface NoteTweetResultData {
  entity_set: Entities;
  id: string;
  media?: NoteTweetResultMedia;
  richtext?: NoteTweetResultRichText;
  text: string;
}

interface NoteTweetResultMedia {
  inline_media: NoteTweetResultMediaInlineMedia[];
}

interface NoteTweetResultMediaInlineMedia {
  media_id: string;
  index: number;
}

interface NoteTweetResultRichText {
  richtext_tags: NoteTweetResultRichTextTag[];
}

interface NoteTweetResultRichTextTag {
  from_index: number;
  to_index: number;
  richtext_types: ('Bold' | 'Italic')[];
}

interface UnifiedCard {
  card_fetch_state: 'NoCard';
}

interface TweetPreviousCounts {
  bookmark_count: number;
  favorite_count: number;
  quote_count: number;
  reply_count: number;
  retweet_count: number;
}

interface QuotedRefResult {
  result?: TweetUnion;
}

interface SuperFollowsReplyUserResult {
  result: SuperFollowsReplyUserResultData;
}

interface SuperFollowsReplyUserResultData {
  __typename: 'User';
  legacy: SuperFollowsReplyUserResultLegacy;
}

interface SuperFollowsReplyUserResultLegacy {
  screen_name: string;
}

interface BirdwatchPivot {
  destinationUrl: string;
  footer?: BirdwatchPivotFooter;
  note?: BirdwatchPivotNote;
  subtitle?: BirdwatchPivotSubtitle;
  title: string;
  shorttitle?: string;
  visualStyle?: 'Default' | 'Tentative';
  iconType: 'BirdwatchV1Icon';
  callToAction?: BirdwatchPivotCallToAction;
  titleDetail?: string;
}

interface BirdwatchPivotFooter {
  text: string;
  entities: BirdwatchEntity[];
}

interface BirdwatchEntity {
  fromIndex: number;
  toIndex: number;
  ref: BirdwatchEntityRef;
}

interface BirdwatchEntityRef {
  type: 'TimelineUrl' | 'TimelineRichTextHashtag';
  url?: string;
  urlType?: 'ExternalUrl';
  text?: string;
}

interface BirdwatchPivotNote {
  rest_id: string;
}

interface BirdwatchPivotSubtitle {
  text: string;
  entities: BirdwatchEntity[];
}

interface BirdwatchPivotCallToAction {
  prompt: string;
  title: string;
  destinationUrl: string;
}

interface TweetCard {
  rest_id?: string;
  legacy?: TweetCardLegacy;
}

interface TweetCardLegacy {
  name: string;
  url: string;
  binding_values: TweetCardLegacyBindingValue[];
  card_platform?: TweetCardPlatformData;
  user_refs_results?: UserResults[];
}

interface TweetCardPlatformData {
  platform: TweetCardPlatform;
}

interface TweetCardPlatform {
  audience: TweetCardPlatformAudience;
  device: TweetCardPlatformDevice;
}

interface TweetCardPlatformAudience {
  name: 'production';
}

interface TweetCardPlatformDevice {
  name: string;
  version: string;
}

interface TweetCardLegacyBindingValue {
  key: string;
  value: TweetCardLegacyBindingValueData;
}

interface TweetCardLegacyBindingValueData {
  string_value?: string;
  boolean_value?: boolean;
  scribe_key?: string;
  type: string;
  image_value?: TweetCardLegacyBindingValueDataImage;
  image_color_value?: Record<string, unknown>;
  user_value?: UserValue;
}

interface UserValue {
  id_str: string;
}

interface TweetCardLegacyBindingValueDataImage {
  height: number;
  width: number;
  url: string;
  alt?: string;
}

interface TweetLegacy {
  bookmark_count: number;
  bookmarked: boolean;
  created_at: string;
  conversation_id_str: string;
  display_text_range: number[];
  entities: Entities;
  favorite_count: number;
  favorited: boolean;
  full_text: string;
  is_quote_status: boolean;
  lang: string;
  possibly_sensitive?: boolean;
  possibly_sensitive_editable?: boolean;
  quote_count: number;
  reply_count: number;
  retweet_count: number;
  retweeted: boolean;
  retweeted_status_result?: ItemResult;
  user_id_str: string;
  id_str: string;
  self_thread?: SelfThread;
  extended_entities?: ExtendedEntities;
  scopes?: TweetLegacyScopes;
  in_reply_to_screen_name?: string;
  in_reply_to_status_id_str?: string;
  in_reply_to_user_id_str?: string;
  quoted_status_permalink?: QuotedStatusPermalink;
  quoted_status_id_str?: string;
  conversation_control?: Record<string, unknown>;
  limited_actions?:
    | 'limited_replies'
    | 'non_compliant'
    | 'dynamic_product_ad'
    | 'stale_tweet'
    | 'community_tweet_non_member_public_community'
    | 'community_tweet_non_member_closed_community'
    | 'blocked_viewer';
  place?: Record<string, unknown>;
}

interface SelfThread {
  id_str: string;
}

interface Entities {
  hashtags: Hashtag[];
  symbols: Symbol[];
  user_mentions: UserMention[];
  urls: Url[];
  media?: Media[];
  timestamps?: Timestamp[];
}

type Hashtag = Record<string, unknown>;
type Symbol = Record<string, unknown>;
type UserMention = Record<string, unknown>;

interface Url {
  display_url: string;
  expanded_url?: string;
  url: string;
  indices: number[];
}

interface Media {
  display_url: string;
  expanded_url: string;
  id_str: string;
  indices: number[];
  media_url_https: string;
  type: 'photo' | 'video' | 'animated_gif';
  url: string;
  features?: Record<string, never>;
  sizes: MediaSizes;
  original_info: MediaOriginalInfo;
  media_key: string;
  ext_media_availability: ExtMediaAvailability;
  video_info?: MediaVideoInfo;
  additional_media_info?: AdditionalMediaInfo;
  source_user_id_str?: string;
  source_status_id_str?: string;
  ext_alt_text?: string;
  sensitive_media_warning?: SensitiveMediaWarning;
  allow_download_status?: AllowDownloadStatus;
  media_results?: MediaResults;
}

interface TweetLegacyScopes {
  followers: boolean;
}

interface QuotedStatusPermalink {
  url: string;
  expanded: string;
  display: string;
}

interface ExtendedEntities {
  media: MediaExtended[];
}

interface MediaExtended {
  display_url: string;
  expanded_url: string;
  id_str: string;
  indices: number[];
  media_key: string;
  media_url_https: string;
  type: 'photo' | 'video' | 'animated_gif';
  url: string;
  additional_media_info?: AdditionalMediaInfo;
  mediaStats?: MediaStats;
  ext_media_availability?: ExtMediaAvailability;
  features?: Record<string, never>;
  sizes: MediaSizes;
  original_info: MediaOriginalInfo;
  video_info?: MediaVideoInfo;
  source_user_id_str?: string;
  source_status_id_str?: string;
  ext_alt_text?: string;
  sensitive_media_warning?: SensitiveMediaWarning;
  allow_download_status?: AllowDownloadStatus;
  media_results?: MediaResults;
}

interface MediaOriginalInfo {
  height: number;
  width: number;
  focus_rects?: MediaOriginalInfoFocusRect[];
}

interface MediaOriginalInfoFocusRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface MediaVideoInfo {
  aspect_ratio: number[];
  duration_millis?: number;
  variants: MediaVideoInfoVariant[];
}

interface MediaVideoInfoVariant {
  bitrate?: number;
  content_type: string;
  url: string;
}

interface AdditionalMediaInfo {
  monetizable: boolean;
  source_user?: UserResultCore;
  title?: string;
  description?: string;
  embeddable?: boolean;
  call_to_actions?: AdditionalMediaInfoCallToActions;
}

interface AdditionalMediaInfoCallToActions {
  visit_site?: AdditionalMediaInfoCallToActionsUrl;
  watch_now?: AdditionalMediaInfoCallToActionsUrl;
}

interface AdditionalMediaInfoCallToActionsUrl {
  url: string;
}

interface MediaStats {
  viewCount: number;
}

interface ExtMediaAvailability {
  reason?: string;
  status?: 'Available' | 'Unavailable';
}

interface SensitiveMediaWarning {
  adult_content?: boolean;
  graphic_violence?: boolean;
  other?: boolean;
}

interface MediaSizes {
  large: MediaSize;
  medium: MediaSize;
  small: MediaSize;
  thumb: MediaSize;
}

interface MediaSize {
  w: number;
  h: number;
  resize: 'crop' | 'fit';
}

interface ConversationControl {
  mode: 'Community' | 'Verified' | 'ByInvitation';
}

interface Timestamp {
  indices: number[];
  seconds: number;
  text: string;
}

interface Article {
  article_results: ArticleResults;
}

interface ArticleResults {
  result: ArticleResult;
}

interface ArticleResult {
  rest_id: string;
  id: string;
  title: string;
  preview_text: string;
  cover_media: ArticleCoverMedia;
  metadata: ArticleMetadata;
  lifecycle_state?: ArticleLifecycleState;
}

interface ArticleCoverMedia {
  id: string;
  media_key: string;
  media_id: string;
  media_info: ArticleCoverMediaInfo;
}

interface ArticleCoverMediaInfo {
  __typename?: 'ApiImage';
  original_img_height: number;
  original_img_width: number;
  original_img_url: string;
  color_info: ArticleCoverMediaColorInfo;
}

interface ArticleCoverMediaColorInfo {
  palette: ArticleCoverMediaColorInfoPalette[];
}

interface ArticleCoverMediaColorInfoPalette {
  percentage: number;
  rgb: ArticleCoverMediaColorInfoPaletteRGB;
}

interface ArticleCoverMediaColorInfoPaletteRGB {
  blue: number;
  green: number;
  red: number;
}

interface ArticleMetadata {
  first_published_at_secs: number;
}

interface ArticleLifecycleState {
  modified_at_secs: number;
}

interface AllowDownloadStatus {
  allow_download?: boolean;
}

interface MediaResults {
  result: MediaResult;
}

interface MediaResult {
  media_key: string;
  grok_image_annotation?: GrokImageAnnotation;
}

interface GrokImageAnnotation {
  prompt: string;
  upsampled_prompt: string;
}

interface TrendResults {
  rest_id: string;
}

interface GrokShareAttachment {
  items: GrokShareAttachmentItem[];
}

interface GrokShareAttachmentItem {
  media_urls: string[];
  message: string;
  analysis_post_id_results?: AnalysisResults;
}

interface AnalysisResults {
  result: Tweet;
}

interface TweetPreviewDisplay {
  __typename: 'TweetPreviewDisplay';
  tweet: TweetPreviewDisplayTweet;
  limited_action_results: TweetLimitedActionResults;
  cta: TweetPreviewDisplayCta;
}

interface TweetPreviewDisplayTweet {
  rest_id: string;
  text: string;
  core: UserResultCore;
  entities: Record<string, never>;
  reply_count: number;
  retweet_count: number;
  favorite_count: number;
  bookmark_count: number;
  quote_count: number;
  view_count: TweetPreviewDisplayTweetViewCount;
  created_at: string;
}

interface TweetPreviewDisplayTweetViewCount {
  count: string;
}

interface TweetLimitedActionResults {
  limited_actions: LimitedActionResultsData[];
}

interface LimitedActionResultsData {
  action:
    | 'Reply'
    | 'Retweet'
    | 'QuoteTweet'
    | 'Like'
    | 'React'
    | 'AddToBookmarks'
    | 'AddToMoment'
    | 'PinToProfile'
    | 'ViewHiddenReplies'
    | 'VoteOnPoll'
    | 'ShowRetweetActionMenu'
    | 'ReplyDownVote'
    | 'SendViaDm'
    | 'ViewPostEngagements';
}

interface TweetPreviewDisplayCta {
  title: string;
  url: TweetPreviewDisplayCtaUrl;
}

interface TweetPreviewDisplayCtaUrl {
  url: string;
  urlType: 'DeepLink' | 'UrtEndpoint' | 'ExternalUrl';
}

export type {
  TweetWithVisibilityResults,
  TweetInterstitial,
  TweetInterstitialText,
  TweetInterstitialTextEntity,
  TweetInterstitialTextEntityRef,
  MediaVisibilityResults,
  MediaVisibilityResultsBlurredImageInterstitial,
  TweetInterstitialRevealText,
  TweetTombstone,
  TweetUnavailable,
  Tweet,
  ItemResult,
  TweetEditControl,
  TweetEditControlInitial,
  TweetEditPrespective,
  TweetView,
  NoteTweet,
  NoteTweetResult,
  NoteTweetResultData,
  NoteTweetResultMedia,
  NoteTweetResultMediaInlineMedia,
  NoteTweetResultRichText,
  NoteTweetResultRichTextTag,
  UnifiedCard,
  TweetPreviousCounts,
  QuotedRefResult,
  SuperFollowsReplyUserResult,
  SuperFollowsReplyUserResultData,
  SuperFollowsReplyUserResultLegacy,
  BirdwatchPivot,
  BirdwatchPivotFooter,
  BirdwatchEntity,
  BirdwatchEntityRef,
  BirdwatchPivotNote,
  BirdwatchPivotSubtitle,
  BirdwatchPivotCallToAction,
  TweetCard,
  TweetCardLegacy,
  TweetCardPlatformData,
  TweetCardPlatform,
  TweetCardPlatformAudience,
  TweetCardPlatformDevice,
  TweetCardLegacyBindingValue,
  TweetCardLegacyBindingValueData,
  UserValue,
  TweetCardLegacyBindingValueDataImage,
  TweetLegacy,
  SelfThread,
  Entities,
  Url,
  Media,
  TweetLegacyScopes,
  QuotedStatusPermalink,
  ExtendedEntities,
  MediaExtended,
  MediaOriginalInfo,
  MediaOriginalInfoFocusRect,
  MediaVideoInfo,
  MediaVideoInfoVariant,
  AdditionalMediaInfo,
  AdditionalMediaInfoCallToActions,
  AdditionalMediaInfoCallToActionsUrl,
  MediaStats,
  ExtMediaAvailability,
  SensitiveMediaWarning,
  MediaSizes,
  MediaSize,
  ConversationControl,
  Timestamp,
  Article,
  ArticleResults,
  ArticleResult,
  ArticleCoverMedia,
  ArticleCoverMediaInfo,
  ArticleCoverMediaColorInfo,
  ArticleCoverMediaColorInfoPalette,
  ArticleCoverMediaColorInfoPaletteRGB,
  ArticleMetadata,
  ArticleLifecycleState,
  AllowDownloadStatus,
  MediaResults,
  MediaResult,
  GrokImageAnnotation,
  TrendResults,
  GrokShareAttachment,
  GrokShareAttachmentItem,
  AnalysisResults,
  TweetPreviewDisplay,
  TweetPreviewDisplayTweet,
  TweetPreviewDisplayTweetViewCount,
  TweetLimitedActionResults,
  LimitedActionResultsData,
  TweetPreviewDisplayCta,
  TweetPreviewDisplayCtaUrl,
  TweetUnion,
  Hashtag,
  Symbol,
  UserMention,
};
