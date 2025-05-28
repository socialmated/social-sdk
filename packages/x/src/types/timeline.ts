import { type ItemResult } from './tweet.js';
import { type UserResults } from './user.js';

type ContentUnion = TimelineTimelineItem | TimelineTimelineModule | TimelineTimelineCursor;
type ContentEntryType = 'TimelineTimelineItem' | 'TimelineTimelineCursor' | 'TimelineTimelineModule';
type CursorType = 'Top' | 'Bottom' | 'ShowMore' | 'ShowMoreThreads' | 'Gap' | 'ShowMoreThreadsPrompt';

interface TimelineTimelineItem {
  __typename: 'TimelineTimelineItem';
  entryType: 'TimelineTimelineItem';
  itemContent: ItemContentUnion;
  clientEventInfo?: ClientEventInfo;
  feedbackInfo?: Record<string, unknown>;
}

interface TimelineTimelineModule {
  __typename: 'TimelineTimelineModule';
  entryType: 'TimelineTimelineModule';
  displayType: DisplayType;
  items?: ModuleItem[];
  footer?: Record<string, unknown>;
  header?: Record<string, unknown>;
  clientEventInfo?: ClientEventInfo;
  metadata?: Record<string, unknown>;
  feedbackInfo?: FeedbackInfo;
}

interface TimelineTimelineCursor {
  __typename: 'TimelineTimelineCursor';
  entryType?: 'TimelineTimelineCursor';
  itemType?: 'TimelineTimelineCursor';
  cursorType: CursorType;
  value: string;
  stopOnEmptyResponse?: boolean;
  displayTreatment?: DisplayTreatment;
}

interface DisplayTreatment {
  actionText: string;
  labelText?: string;
}

type DisplayType = 'Vertical' | 'VerticalConversation' | 'VerticalGrid' | 'Carousel';

interface ModuleItem {
  entryId: string;
  item: ModuleEntry;
  dispensable?: boolean;
}

interface ModuleEntry {
  clientEventInfo?: ClientEventInfo;
  itemContent: ItemContentUnion;
  feedbackInfo?: FeedbackInfo;
}

interface FeedbackInfo {
  feedbackKeys?: string[];
  clientEventInfo?: ClientEventInfo;
}

type ItemContentUnion =
  | TimelineTweet
  | TimelineTimelineCursor
  | TimelineUser
  | TimelinePrompt
  | TimelineMessagePrompt
  | TimelineCommunity
  | TimelineTombstone
  | TimelineTrend
  | TimelineNotification;

type ContentItemType =
  | 'TimelineTweet'
  | 'TimelineTimelineCursor'
  | 'TimelineUser'
  | 'TimelinePrompt'
  | 'TimelineMessagePrompt'
  | 'TimelineCommunity'
  | 'TimelineTombstone'
  | 'TimelineTrend'
  | 'TimelineNotification';

interface TimelineTweet {
  __typename: 'TimelineTweet';
  itemType: 'TimelineTweet';
  tweetDisplayType: 'Tweet' | 'SelfThread' | 'MediaGrid' | 'CondensedTweet';
  tweet_results: ItemResult;
  socialContext?: SocialContextUnion;
  promotedMetadata?: Record<string, unknown>;
  highlights?: Highlight;
  hasModeratedReplies?: boolean;
}

interface TimelineUser {
  __typename: 'TimelineUser';
  itemType: 'TimelineUser';
  socialContext?: SocialContextUnion;
  userDisplayType: 'User' | 'UserDetailed' | 'SubscribableUser' | 'UserConcise';
  user_results: UserResults;
}

type SocialContextUnion = TimelineGeneralContext | TimelineTopicContext;

type SocialContextUnionType = 'TimelineGeneralContext' | 'TimelineTopicContext';

interface TimelineGeneralContext {
  type: 'TimelineGeneralContext';
  contextType?: 'Follow' | 'Pin' | 'Like' | 'Location' | 'Sparkle' | 'Conversation' | 'List' | 'Community' | 'Facepile';
  text?: string;
  landingUrl?: SocialContextLandingUrl;
  contextImageUrls?: string[];
}

interface TimelineTopicContext {
  type: 'TimelineTopicContext';
  topic?: TopicContext;
  functionalityType?: 'Basic';
}

interface TopicContext {
  id?: string;
  topic_id?: string;
  name?: string;
  description?: string;
  icon_url?: string;
  following?: boolean;
  not_interested?: boolean;
}

interface SocialContextLandingUrl {
  urlType?: 'DeepLink' | 'UrtEndpoint' | 'ExternalUrl';
  url?: string;
  urtEndpointOptions?: UrtEndpointOptions;
}

interface UrtEndpointOptions {
  title: string;
  requestParams: UrtEndpointRequestParams[];
}

interface UrtEndpointRequestParams {
  key: string;
  value: string;
}

interface Highlight {
  textHighlights: TextHighlight[];
}

interface TextHighlight {
  startIndex: number;
  endIndex: number;
}

interface TimelinePrompt {
  __typename?: 'TimelinePrompt';
  [key: string]: unknown;
}

interface TimelineMessagePrompt {
  __typename?: 'TimelineMessagePrompt';
  [key: string]: unknown;
}

interface TimelineCommunity {
  __typename?: 'TimelineCommunity';
  [key: string]: unknown;
}

interface ClientEventInfo {
  component?: string;
  element?: string;
  details?: Record<string, unknown>;
}

interface TimelineTombstone {
  __typename?: 'TimelineTombstone';
  itemType?: 'TimelineTombstone';
  tombstoneDisplayType?: 'Inline';
  tombstoneInfo?: TombstoneInfo;
}

interface TombstoneInfo {
  text?: string;
  richText?: TombstoneRichText;
}

interface TombstoneRichText {
  rtl?: boolean;
  text?: string;
  entities?: TombstoneEntity[];
}

interface TombstoneEntity {
  fromIndex?: number;
  toIndex?: number;
  ref?: TombstoneRef;
}

interface TombstoneRef {
  type?: 'TimelineUrl';
  url?: string;
  urlType?: 'ExternalUrl';
}

interface TimelineTrend {
  __typename: 'TimelineTrend';
  itemType?: 'TimelineTrend';
  social_context?: SocialContextUnion;
  is_ai_trend?: boolean;
  name: string;
  trend_url: SocialContextLandingUrl;
  trend_metadata: TrendMetadata;
  thumbnail_image?: ThumbnailImage;
  images?: TrendImage[];
}

interface TrendMetadata {
  url?: SocialContextLandingUrl;
}

interface ThumbnailImage {
  original_img_url?: string;
  original_img_width?: number;
  original_img_height?: number;
}

interface TrendImage {
  url?: string;
}

interface TimelineNotification {
  __typename: 'TimelineNotification';
  itemType: 'TimelineNotification';
  id: string;
  notification_icon: string;
  rich_message: RichMessage;
  notification_url: SocialContextLandingUrl;
  template: NotificationTemplate;
  timestamp_ms: string;
}

interface RichMessage {
  rtl?: boolean;
  text?: string;
}

interface NotificationTemplate {
  __typename?: 'NotificationTemplate';
  target_objects?: Record<string, never>[];
  from_users?: Record<string, never>[];
}

interface TimelineResult {
  id?: string;
  timeline?: Timeline;
}

interface Timeline {
  instructions: InstructionUnion[];
  metadata?: Record<string, unknown>;
  responseObjects?: Record<string, unknown>;
}

type InstructionUnion =
  | TimelineAddEntries
  | TimelineAddToModule
  | TimelineClearCache
  | TimelinePinEntry
  | TimelineReplaceEntry
  | TimelineShowAlert
  | TimelineTerminateTimeline
  | TimelineShowCover
  | TimelineClearEntriesUnreadState
  | TimelineMarkEntriesUnreadGreaterThanSortIndex;

type InstructionType =
  | 'TimelineAddEntries'
  | 'TimelineAddToModule'
  | 'TimelineClearCache'
  | 'TimelinePinEntry'
  | 'TimelineReplaceEntry'
  | 'TimelineShowAlert'
  | 'TimelineTerminateTimeline'
  | 'TimelineShowCover'
  | 'TimelineClearEntriesUnreadState'
  | 'TimelineMarkEntriesUnreadGreaterThanSortIndex';

interface TimelineAddEntries {
  type: 'TimelineAddEntries';
  entries: TimelineAddEntry[];
}

interface TimelineAddToModule {
  type: 'TimelineAddToModule';
  moduleItems: ModuleItem[];
  moduleEntryId: string;
  prepend?: boolean;
}

interface TimelineClearCache {
  type: 'TimelineClearCache';
}

interface TimelinePinEntry {
  type: 'TimelinePinEntry';
  entry: TimelineAddEntry;
}

interface TimelineReplaceEntry {
  type: 'TimelineReplaceEntry';
  entry_id_to_replace: string;
  entry: TimelineAddEntry;
}

interface TimelineShowAlert {
  type: 'TimelineShowAlert';
  alertType?: 'NewTweets';
  triggerDelayMs?: number;
  displayDurationMs?: number;
  usersResults: UserResults[];
  richText: {
    text?: string;
    entities?: Record<string, unknown>[];
  };
  iconDisplayInfo?: Record<string, unknown>;
  colorConfig?: Record<string, unknown>;
  displayLocation?: 'Top';
}

interface TimelineTerminateTimeline {
  type: 'TimelineTerminateTimeline';
  direction: 'Top' | 'Bottom' | 'TopAndBottom';
}

interface TimelineAddEntry {
  content: ContentUnion;
  entryId: string;
  sortIndex: string;
}

interface TimelineShowCover {
  type: 'TimelineShowCover';
  clientEventInfo: ClientEventInfo;
  cover: TimelineHalfCover;
}

interface TimelineHalfCover {
  type: 'TimelineHalfCover';
  halfCoverDisplayType: 'Cover';
  primaryText: Text;
  secondaryText: Text;
  primaryCoverCta: CoverCta;
  impressionCallbacks: Callback[];
  dismissible: boolean;
}

interface Text {
  text: string;
  entities: TextEntity[];
}

interface TextEntity {
  fromIndex: number;
  toIndex: number;
  ref: TextEntityRef;
}

interface TextEntityRef {
  type: 'TimelineUrl';
  url: string;
  urlType: 'ExternalUrl';
}

interface CoverCta {
  Text?: string;
  ctaBehavior: TimelineCoverBehavior;
  callbacks: Callback[];
  clientEventInfo: CtaClientEventInfo;
  buttonStyle?: 'Primary';
}

interface TimelineCoverBehavior {
  type: 'TimelineCoverBehaviorDismiss' | 'TimelineCoverBehaviorNavigate';
  url?: Record<string, never>;
}

interface TimelineCoverBehaviorUrl {
  url: string;
  url_type: 'ExternalUrl';
}

interface Callback {
  endpoint: string;
}

interface CtaClientEventInfo {
  action: 'primary_cta';
}

interface TimelineClearEntriesUnreadState {
  type: 'TimelineClearEntriesUnreadState';
}

interface TimelineMarkEntriesUnreadGreaterThanSortIndex {
  type: 'TimelineMarkEntriesUnreadGreaterThanSortIndex';
  sort_index?: string;
}

export type {
  ContentUnion,
  ContentEntryType,
  CursorType,
  DisplayType,
  ItemContentUnion,
  ContentItemType,
  SocialContextUnion,
  SocialContextUnionType,
  TimelineTimelineItem,
  TimelineTimelineModule,
  TimelineTimelineCursor,
  DisplayTreatment,
  ModuleItem,
  ModuleEntry,
  FeedbackInfo,
  TimelineTweet,
  TimelineUser,
  ItemResult,
  TimelineGeneralContext,
  TimelineTopicContext,
  TopicContext,
  SocialContextLandingUrl,
  UrtEndpointOptions,
  UrtEndpointRequestParams,
  Highlight,
  TextHighlight,
  TimelinePrompt,
  TimelineMessagePrompt,
  TimelineCommunity,
  ClientEventInfo,
  TimelineTombstone,
  TombstoneInfo,
  TombstoneRichText,
  TombstoneEntity,
  TombstoneRef,
  TimelineTrend,
  TrendMetadata,
  ThumbnailImage,
  TrendImage,
  TimelineNotification,
  RichMessage,
  NotificationTemplate,
  TimelineResult,
  Timeline,
  InstructionUnion,
  InstructionType,
  TimelineAddEntries,
  TimelineAddToModule,
  TimelineClearCache,
  TimelinePinEntry,
  TimelineReplaceEntry,
  TimelineShowAlert,
  TimelineTerminateTimeline,
  TimelineAddEntry,
  TimelineShowCover,
  TimelineHalfCover,
  Text,
  TextEntity,
  TextEntityRef,
  CoverCta,
  TimelineCoverBehavior,
  TimelineCoverBehaviorUrl,
  Callback,
  CtaClientEventInfo,
  TimelineClearEntriesUnreadState,
  TimelineMarkEntriesUnreadGreaterThanSortIndex,
};
