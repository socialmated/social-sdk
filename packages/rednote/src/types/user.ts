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

interface UserInfoResult {
  message: string;
  success: boolean;
  code: number;
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
  tagType: 'info' | 'location';
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
  result: UserInfoResult;
  basic_info: UserBasicInfo;
  verify_info: UserVerifyInfo;
  interactions: UserInteractions[];
  tags: UserTag[];
  tab_public: UserTabPublic;
}

export type { UserMe, OtherUserInfo };
