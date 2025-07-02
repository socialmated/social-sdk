import { type AtUser } from './user.js';

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

interface NoteCard {
  cover: NoteCardCover;
  display_title: string;
  interact_info: NoteCardInteractInfo;
  note_id: string;
  type: string; // enum: normal, video
  user: NoteCardUser;
  xsec_token: string;
}

interface Comment {
  sub_comment_cursor: string;
  at_users: AtUser[];
  like_count: string;
  show_tags: string[];
  create_time: number;
  ip_location: string;
  sub_comment_count: string;
  sub_comment_has_more: boolean;
  id: string;
  status: number; // enum
  user_info: CommentUserInfo;
  sub_comments: SubComment[];
  note_id: string;
  content: string;
  liked: boolean;
}

interface CommentUserInfo {
  user_id: string;
  nickname: string;
  image: string;
  xsec_token: string;
}

interface TargetComment {
  id: string;
  user_info: CommentUserInfo;
}

interface SubComment {
  id: string;
  note_id: string;
  target_comment: TargetComment;
  like_count: string;
  user_info: CommentUserInfo;
  show_tags: string[];
  create_time: number;
  status: number; // enum
  content: string;
  at_users: AtUser[];
  liked: boolean;
  ip_location: string;
}

interface CommentPageResult {
  user_id: string;
  comments: Comment[];
  cursor: string;
  has_more: boolean;
  time: number;
  xsec_token: string;
}

interface LikeRequest {
  note_oid: string;
}

interface LikeResult {
  new_like: boolean;
}

interface DislikeResult {
  like_count: string;
}

interface CollectNoteRequest {
  note_id: string;
}

interface UncollectNoteRequest {
  note_ids: string;
}

interface NotePageResult {
  cursor: string;
  notes: NoteCard[];
  has_more: boolean;
}

interface LikedNumResult {
  liked_num: number;
}

interface LikeCommentRequest {
  comment_id: string;
  note_id: string;
}

interface PostCommentRequest {
  note_id: string;
  content: string;
  at_users: AtUser[];
  target_comment_id?: string;
}

interface DeleteCommentRequest {
  comment_id: string;
  note_id: string;
}

export type {
  NoteCardCover,
  NoteCardInteractInfo,
  NoteCardUser,
  NoteCardImageInfo,
  NoteCardTagType,
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
  NoteCard,
  Comment,
  CommentUserInfo,
  TargetComment,
  SubComment,
  CommentPageResult,
  PostCommentRequest,
  DeleteCommentRequest,
  LikeRequest,
  LikeResult,
  DislikeResult,
  LikedNumResult,
  CollectNoteRequest,
  UncollectNoteRequest,
  NotePageResult,
  LikeCommentRequest,
};
