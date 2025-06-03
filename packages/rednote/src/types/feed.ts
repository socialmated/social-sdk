interface NoteCardUser {
  user_id: string;
  nickname: string;
  xsec_token: string;
  nick_name?: string;
  avatar: string;
}

interface NoteCardImageInfo {
  image_scene: string; // enum
  url: string;
}

interface NoteCardCover {
  url: string;
  info_list: NoteCardImageInfo[];
  url_pre: string;
  url_default: string;
  file_id: string;
  height: number;
  width: number;
}

interface NoteCardInteractInfo {
  liked: boolean;
  liked_count: string;
  collected?: boolean;
  collected_count?: string;
  comment_count?: string;
  share_count?: string;
  followed?: boolean;
  relation?: string; // enum
}

type NoteCardTagType = 'topic' | 'emoji' | 'mention' | 'text';

interface NoteCardTag {
  id: string;
  name: string;
  type: NoteCardTagType;
}

interface NoteCardIllegalInfo {
  desc: string;
  left_icon: string;
}

interface NoteCardShareInfo {
  un_share: boolean;
}

interface NoteCardStreamSource {
  master_url: string;
  backup_urls: string[];
}

interface NoteCardStream {
  av1?: NoteCardStreamSource[];
  h264?: NoteCardStreamSource[];
  h265?: NoteCardStreamSource[];
  h266?: NoteCardStreamSource[];
}

interface NoteCardImage {
  width: number;
  height: number;
  url: string;
  url_pre: string;
  url_default: string;
  trace_id: string;
  file_id: string;
  live_photo: boolean;
  stream: NoteCardStream;
  info_list: NoteCardImageInfo[];
}

interface NoteCardVideoCapa {
  duration: number;
}

interface NoteCardVideoConsumer {
  origin_video_key: string;
}

interface NoteCardVideoImage {
  first_frame_fileid: string;
  thumbnail_fileid: string;
}
interface NoteCardMediaStreamMeta {
  backup_urls: string[];
  ssim: number;
  audio_bitrate: number;
  width: number;
  size: number;
  audio_codec: string;
  audio_duration: number;
  stream_type: number;
  video_bitrate: number;
  vmaf: number;
  hdr_type: number;
  weight: number;
  quality_type: string;
  default_stream: number;
  height: number;
  video_duration: number;
  audio_channels: number;
  format: string;
  volume: number;
  avg_bitrate: number;
  video_codec: string;
  master_url: string;
  fps: number;
  rotate: number;
  psnr: number;
  duration: number;
  stream_desc: string;
}

interface NoteCardMediaStream {
  h264?: NoteCardMediaStreamMeta[];
  h265?: NoteCardMediaStreamMeta[];
  h266?: NoteCardMediaStreamMeta[];
  av1?: NoteCardMediaStreamMeta[];
}

interface NoteCardMediaVideo {
  hdr_type: number;
  drm_type: number;
  stream_types: number[];
  biz_name: number;
  biz_id: string;
  duration: number;
  md5: string;
}

interface NoteCardMedia {
  video_id: string;
  stream: NoteCardMediaStream;
  video: NoteCardMediaVideo;
}

interface NoteCardVideo {
  capa: NoteCardVideoCapa;
  consumer?: NoteCardVideoConsumer;
  image?: NoteCardVideoImage;
  media?: NoteCardMedia;
}

interface FeedNoteCard {
  note_id: string;
  tag_list: NoteCardTag[];
  illegal_info?: NoteCardIllegalInfo;
  title: string;
  share_info: NoteCardShareInfo;
  user: NoteCardUser;
  interact_info: NoteCardInteractInfo;
  image_list: NoteCardImage[];
  video?: NoteCardVideo;
  at_user_list: string[]; // fixme
  last_update_time: number;
  type: string; // enum
  desc: string;
  time: number;
  ip_location: string;
}

interface FeedItem {
  id: string;
  model_type: string; // enum
  note_card: FeedNoteCard;
}

interface FeedResult {
  cursor_score: string;
  items: FeedItem[];
  current_time: number;
}

type XsecSource = 'pc_board' | 'pc_feed' | 'pc_user' | 'pc_search';

interface FeedRequest {
  source_note_id: string;
  xsec_source: XsecSource;
  xsec_token: string;
  image_formats: string[];
  extra: Record<string, unknown>;
}

interface HomeFeedNoteCard {
  type: string;
  display_title: string;
  user: NoteCardUser;
  interact_info: NoteCardInteractInfo;
  cover: NoteCardCover;
  video?: NoteCardVideo;
}

interface HomeFeedItem {
  track_id: string;
  ignore: boolean;
  xsec_token: string;
  id: string;
  model_type: string; // enum
  note_card: HomeFeedNoteCard;
}

interface HomeFeedResult {
  cursor_score: string;
  items: HomeFeedItem[];
}

enum RefreshType {
  Active = 1,
  LoadMore = 3,
}

interface HomeFeedRequest {
  category: string;
  cursor_score: string;
  image_formats: string[];
  need_filter_image: boolean;
  need_num: number;
  note_index: number;
  num: number;
  refresh_type: RefreshType;
  search_key: string;
  unread_begin_note_id: string;
  unread_end_note_id: string;
  unread_note_count: number;
}

interface HomeFeedCategory {
  id: string;
  name: string;
}

interface HomeFeedCategoryResult {
  categories: HomeFeedCategory[];
}

export type {
  FeedNoteCard,
  FeedItem,
  FeedResult,
  FeedRequest,
  HomeFeedNoteCard,
  HomeFeedItem,
  HomeFeedResult,
  HomeFeedRequest,
  HomeFeedCategory,
  HomeFeedCategoryResult,
  XsecSource,
  RefreshType,
  NoteCardUser,
  NoteCardImageInfo,
  NoteCardCover,
  NoteCardInteractInfo,
  NoteCardTag,
  NoteCardIllegalInfo,
  NoteCardShareInfo,
  NoteCardStreamSource,
  NoteCardStream,
  NoteCardImage,
  NoteCardVideoCapa,
  NoteCardVideoConsumer,
  NoteCardVideoImage,
  NoteCardMediaStreamMeta,
  NoteCardMediaStream,
  NoteCardMediaVideo,
  NoteCardMedia,
  NoteCardVideo,
  NoteCardTagType,
};
