import {
  type NoteCardTag,
  type NoteCardIllegalInfo,
  type NoteCardShareInfo,
  type NoteCardUser,
  type NoteCardInteractInfo,
  type NoteCardImage,
  type NoteCardVideo,
  type NoteCardCover,
} from './note.js';

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
  type: string; // enum: normal, video
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
};
