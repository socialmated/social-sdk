import { type Result } from './common.js';

type UserMe =
  | {
      guest: true;
      user_id: string;
    }
  | {
      guest: false;
      red_id: string;
      user_id: string;
      nickname: string;
      desc: string;
      gender: number; // enum
      images: string;
      imageb: string;
    };

interface UserBasicInfo {
  nickname: string;
  images: string;
  red_id: string;
  gender: number; // enum
  ip_location: string;
  desc: string;
  imageb: string;
}

interface UserVerifyInfo {
  red_official_verify_type: number; // enum
}

interface UserInteractions {
  type: 'follows' | 'fans' | 'interaction';
  name: string;
  count: string;
}

interface UserTag {
  icon?: string; // optional for location tags
  name?: string; // optional for info tags
  tagType: 'info' | 'location' | 'college';
}

interface UserTabPublic {
  collection: boolean;
  collectionNote: {
    lock: boolean;
    count: number;
    display: boolean;
  };
  collectionBoard: {
    lock: boolean;
    count: number;
    display: boolean;
  };
}

type FStatus = 'none' | 'follows' | 'fans' | 'both';

interface OtherUserInfo {
  extra_info: UserExtraInfo;
  result: Result;
  basic_info: UserBasicInfo;
  verify_info: UserVerifyInfo;
  interactions: UserInteractions[];
  tags: UserTag[];
  tab_public: UserTabPublic;
}

interface SelfUserInfo {
  basic_info: UserBasicInfo;
  interactions: UserInteractions[];
  result: Result;
  tab_public: UserTabPublic;
  tag: UserTag[];
}

interface FollowUserRequest {
  target_user_id: string;
}

interface FollowUserResult {
  fstatus: FStatus;
}

interface UserSession {
  user_id: string;
  session: string;
  secure_session: string;
}

interface AtUser {
  user_id: string;
  nickname: string;
}

interface IntimacyListItem {
  rid: string;
  userid: string;
  nickname: string;
  images: string;
}

interface IntimacyListSearchResult {
  items: IntimacyListItem[];
}

interface UserInteractInfo {
  follows: string;
  fans: string;
  interaction: string;
}

interface UserExtraInfo {
  fstatus: FStatus;
  block_type: string;
}

interface NoteCover {
  url_default: string;
}

interface UserHoverCardNote {
  note_id: string;
  type: string;
  cover: NoteCover;
  xsec_token: string;
}

interface UserHoverCard {
  basic_info: UserBasicInfo;
  verify_info: UserVerifyInfo;
  interact_info: UserInteractInfo;
  extraInfo_info: UserExtraInfo;
  notes: UserHoverCardNote[];
}

export type {
  UserMe,
  OtherUserInfo,
  SelfUserInfo,
  UserExtraInfo,
  UserBasicInfo,
  UserVerifyInfo,
  UserInteractions,
  UserTag,
  UserTabPublic,
  FollowUserRequest,
  FollowUserResult,
  UserSession,
  AtUser,
  IntimacyListItem,
  IntimacyListSearchResult,
  UserInteractInfo,
  NoteCover,
  UserHoverCardNote,
  UserHoverCard,
};
