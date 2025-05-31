interface NoteCardUser {
  user_id: string;
  nickname: string;
  xsec_token: string;
  nick_name?: string;
  avatar: string;
}

interface NoteCardImageInfo {
  image_scene: string;
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

interface NoteCardTag {
  id: string;
  name: string;
  type: string; // enum
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

interface FeedNoteCard {
  note_id: string;
  tag_list: NoteCardTag[];
  illegal_info?: NoteCardIllegalInfo;
  title: string;
  share_info: NoteCardShareInfo;
  user: NoteCardUser;
  interact_info: NoteCardInteractInfo;
  image_list: NoteCardImage[];
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

interface FeedRequest {
  source_note_id: string;
  xsec_source: string; // enum
  xsec_token: string;
  image_formats: string[];
  extra: Record<string, unknown>;
}

interface HomeFeedNoteCard {
  type: string; // enum
  display_title: string;
  user: NoteCardUser;
  interact_info: NoteCardInteractInfo;
  cover: NoteCardCover;
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

interface HomeFeedRequest {
  category:
    | 'homefeed_recommend'
    | 'homefeed.fashion_v3'
    | 'homefeed.food_v3'
    | 'homefeed.cosmetics_v3'
    | 'homefeed.movie_and_tv_v3'
    | 'homefeed.career_v3'
    | 'homefeed.love_v3'
    | 'homefeed.household_product_v3'
    | 'homefeed.gaming_v3'
    | 'homefeed.travel_v3'
    | 'homefeed.fitness_v3';
  cursor_score: string;
  image_formats: string[];
  need_filter_image: boolean;
  need_num: number;
  note_index: number;
  num: number;
  refresh_type: number; // enum
  search_key: string;
  unread_begin_note_id: string;
  unread_end_note_id: string;
  unread_note_count: number;
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
};
