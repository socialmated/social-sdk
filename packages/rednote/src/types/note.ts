interface Comment {
  sub_comment_cursor: string;
  at_users: string[]; // fixme
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
  at_users: string[]; // fixme
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

interface CommentParams {
  note_id: string;
  cursor: string;
  top_comment_id: string;
  image_formats: string[];
  xsec_token: string;
}

export type { Comment, CommentUserInfo, TargetComment, SubComment, CommentPageResult, CommentParams };
