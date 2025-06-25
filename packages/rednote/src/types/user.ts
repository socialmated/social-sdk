import { type Result } from './common.js';
import { type NoteCard } from './note.js';

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

interface UserExtraInfo {
  fstatus: string; // enum
  blockType: string; // enum
}

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
  fstatus: string; // enum
}

interface UserSession {
  user_id: string;
  session: string;
  secure_session: string;
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
};
