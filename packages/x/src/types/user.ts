import { type TypeName } from './common.js';

interface User {
  __typename: 'User';
  affiliates_highlighted_label?: Record<string, unknown>;
  has_graduated_access?: boolean;
  has_nft_avatar?: boolean;
  id: string; // Base64 pattern
  is_blue_verified: boolean;
  legacy: UserLegacy;
  rest_id: string; // Numeric string pattern
  business_account?: Record<string, unknown>;
  super_follow_eligible?: boolean;
  super_followed_by?: boolean;
  super_following?: boolean;
  profile_image_shape: 'Circle' | 'Square' | 'Hexagon';
  professional?: UserProfessional;
  user_seed_tweet_count?: number;
  highlights_info?: UserHighlightsInfo;
  creator_subscriptions_count?: number;
  verification_info?: UserVerificationInfo;
  is_profile_translatable?: boolean;
  tipjar_settings?: UserTipJarSettings;
  legacy_extended_profile?: UserLegacyExtendedProfile;
  has_hidden_likes_on_profile?: boolean;
  premium_gifting_eligible?: boolean;
  has_hidden_subscriptions_on_profile?: boolean;
  parody_commentary_fan_label?: 'None' | 'Parody' | 'Commentary';
}

interface UserUnavailable {
  __typename: 'UserUnavailable';
  reason: string;
  message?: string;
}

interface UserResults {
  result: UserUnion;
}

interface UserResultCore {
  user_results: UserResults;
}

type UserUnion = User | UserUnavailable;

interface UserProfessional {
  rest_id: string; // Numeric string pattern
  professional_type: 'Business' | 'Creator';
  category: UserProfessionalCategory[];
}

interface UserProfessionalCategory {
  id: number;
  name: string;
  icon_name: string;
}

interface UserHighlightsInfo {
  can_highlight_tweets: boolean;
  highlighted_tweets: string;
}

interface UserVerificationInfo {
  is_identity_verified: boolean;
  reason?: UserVerificationInfoReason;
}

interface UserVerificationInfoReason {
  description: UserVerificationInfoReasonDescription;
  verified_since_msec: string; // Numeric string pattern
  override_verified_year?: number;
}

interface UserVerificationInfoReasonDescription {
  text: string;
  entities: UserVerificationInfoReasonDescriptionEntities[];
}

interface UserVerificationInfoReasonDescriptionEntities {
  from_index: number;
  to_index: number;
  ref: UserVerificationInfoReasonDescriptionEntitiesRef;
}

interface UserVerificationInfoReasonDescriptionEntitiesRef {
  url: string; // URI format
  url_type: 'ExternalUrl';
}

interface UserTipJarSettings {
  is_enabled?: boolean;
  patreon_handle?: string;
  bitcoin_handle?: string;
  ethereum_handle?: string;
  cash_app_handle?: string;
  venmo_handle?: string;
  gofundme_handle?: string; // URI format
  bandcamp_handle?: string; // URI format
  pay_pal_handle?: string;
}

interface UserLegacyExtendedProfile {
  birthdate?: UserLegacyExtendedProfileBirthdate;
}

interface UserLegacyExtendedProfileBirthdate {
  day: number;
  month: number;
  year?: number;
  visibility: 'Self' | 'Public' | 'MutualFollow' | 'Followers' | 'Following';
  year_visibility: 'Self' | 'Public' | 'MutualFollow' | 'Followers' | 'Following';
}

interface UserLegacy {
  created_at: string; // Reference to TwitterTimeFormat
  default_profile: boolean;
  default_profile_image: boolean;
  description: string;
  entities: Record<string, unknown>;
  fast_followers_count: number;
  favourites_count: number;
  followers_count: number;
  friends_count: number;
  has_custom_timelines: boolean;
  is_translator: boolean;
  listed_count: number;
  location: string;
  media_count: number;
  name: string;
  normal_followers_count: number;
  pinned_tweet_ids_str: string[];
  possibly_sensitive: boolean;
  profile_image_url_https: string; // URI format
  profile_interstitial_type: string;
  screen_name: string;
  statuses_count: number;
  translator_type: string;
  verified: boolean;
  // Optional fields
  blocked_by?: boolean;
  blocking?: boolean;
  can_dm?: boolean;
  can_media_tag?: boolean;
  follow_request_sent?: boolean;
  followed_by?: boolean;
  following?: boolean;
  muting?: boolean;
  notifications?: boolean;
  protected?: boolean;
  url?: string;
  want_retweets?: boolean;
  verified_type?: 'Business' | 'Government';
  withheld_in_countries?: string[];
}

interface ProfileResponseData {
  userResultByScreenName?: UserResultByScreenName;
}

interface UserResultByScreenName {
  id: string;
  result: UserResultByScreenNameResult;
}

interface UserResultByScreenNameResult {
  typename: TypeName;
  id: string;
  legacy: UserResultByScreenNameLegacy;
  profilemodules: Record<string, unknown>;
  restId: string;
}

interface UserResultByScreenNameLegacy {
  blockedBy?: boolean;
  blocking?: boolean;
  followedBy?: boolean;
  following?: boolean;
  name?: string;
  _protected?: boolean;
  screenName?: string;
}

export type {
  UserResultCore,
  UserResults,
  UserUnion,
  User,
  UserUnavailable,
  UserProfessional,
  UserProfessionalCategory,
  UserHighlightsInfo,
  UserVerificationInfo,
  UserVerificationInfoReason,
  UserVerificationInfoReasonDescription,
  UserVerificationInfoReasonDescriptionEntities,
  UserVerificationInfoReasonDescriptionEntitiesRef,
  UserTipJarSettings,
  UserLegacyExtendedProfile,
  UserLegacyExtendedProfileBirthdate,
  UserLegacy,
  ProfileResponseData,
  UserResultByScreenName,
  UserResultByScreenNameResult,
  UserResultByScreenNameLegacy,
};
