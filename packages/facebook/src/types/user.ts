import type { Page } from './page.js';

interface ShadowIGComment {
  /**
   * The id of the object
   */
  id: string;
  /**
   * Whether the comment is hidden
   */
  hidden: boolean;
  /**
   * Number of likes on the comment
   */
  like_count: number;
  /**
   * Media on which the comment is made
   */
  media: ShadowIGMedia;
  /**
   * Text of the comment
   */
  text: string;
  /**
   * Timestamp of comment
   */
  timestamp: string;
  /**
   * User who made the comment
   */
  user: ShadowIGUser;
  /**
   * username of the commenter
   */
  username: string;
}

interface ShadowIGMedia {
  /**
   * Id
   */
  id: string;
  /**
   * Caption
   */
  caption: string;
  /**
   * Comments Count
   */
  comments_count: number;
  /**
   * IgId
   */
  ig_id: string;
  /**
   * IsCommentEnabled
   */
  is_comment_enabled: boolean;
  /**
   * Likes Count
   */
  like_count: number;
  /**
   * MediaType
   */
  media_type: string;
  /**
   * MediaUrl
   */
  media_url: string;
  /**
   * Owner
   */
  owner: ShadowIGUser;
  /**
   * Permalink
   */
  permalink: string;
  /**
   * Shortcode
   */
  shortcode: string;
  /**
   * ThumbnailUrl
   */
  thumbnail_url: string;
  /**
   * Timestamp
   */
  timestamp: string;
  /**
   * Username of the media owner
   */
  username: string;
}

/**
 * @see {@link https://developers.facebook.com/docs/graph-api/reference/shadow-ig-user | Facebook Graph API - IGUser}
 */
interface ShadowIGUser {
  /**
   * The id of the object
   */
  id: string;

  /**
   * Biography of the user
   */
  biography?: string;

  /**
   * Loads business discovery information
   */
  business_discovery?: ShadowIGUser;

  /**
   * Active follower count of the user
   */
  followers_count?: number;

  /**
   * Active follows count of the user
   */
  follows_count?: number;

  /**
   * has_profile_pic
   */
  has_profile_pic?: boolean;

  /**
   * Ig Id of the user
   */
  ig_id?: number;

  /**
   * is_published
   */
  is_published?: boolean;

  /**
   * Legacy Instagram user id still used in some endpoints
   */
  legacy_instagram_user_id?: string;

  /**
   * Filtered media count of the user
   */
  media_count?: number;

  /**
   * Loads the comment if the user is mentioned in it
   */
  mentioned_comment?: ShadowIGComment;

  /**
   * Loads the media if the user is mentioned in the caption
   */
  mentioned_media?: ShadowIGMedia;

  /**
   * Name of the user
   */
  name?: string;

  /**
   * The cdn url to query the raw profile picture of the user
   */
  profile_picture_url?: string;

  /**
   * Status of the Shopping Merchant Review process for this account
   */
  shopping_review_status?: string;

  /**
   * Username handle of the user
   */
  username?: string;

  /**
   * Url in the profile
   */
  website?: string;
}

interface EducationExperience {
  classes: Experience[];
  concentration: Page[];
  degree: Page;
  id: string;
  school: Page;
  type: string;
  with: User[];
  year: Page;
}

/**
 * @see {@link https://developers.facebook.com/docs/graph-api/reference/video-upload-limits/ | Graph API Reference - Video Upload Limits}
 */
interface VideoUploadLimits {
  /**
   * The maximum length for video uploads.
   */
  length: number;

  /**
   * The maximum size for video uploads.
   */
  size: number;
}

/**
 * @see {@link https://developers.facebook.com/docs/graph-api/reference/experience/ | Graph API Reference - Experience}
 */
interface Experience {
  /**
   * The ID of the experience.
   */
  id: string;

  /**
   * The description of the experience.
   */
  description: string;

  /**
   * From field (currently null).
   */
  from: null;

  /**
   * The name of the experience.
   */
  name: string;

  /**
   * Tagged users associated with this experience.
   */
  with: User[];
}

/**
 * Represents the age range of a user
 */
interface AgeRangeInfo {
  /**
   * The lower bounds of the range for this person's age.
   * Possible values: 13, 18, 21
   */
  min: 13 | 18 | 21;

  /**
   * The upper bounds of the range for this person's age.
   * Possible values: 17, 20, or undefined (empty)
   */
  max: 17 | 20;
}

/**
 * Represents a Facebook user.
 * @see {@link https://developers.facebook.com/docs/graph-api/reference/user/ | Facebook Graph API - User}
 */
interface User {
  /**
   * The app user's App-Scoped User ID. This ID is unique to the app and cannot be used by other apps.
   */
  id: string;

  /**
   * Returns no data as of April 4, 2018.
   * @deprecated This field is deprecated and returns no data.
   */
  about?: string;

  /**
   * The age segment for this person expressed as a minimum and maximum age.
   * For example, more than 18, less than 21.
   */
  age_range: AgeRangeInfo;

  /**
   * The person's birthday. This is a fixed format string, like MM/DD/YYYY.
   * However, people can control who can see the year they were born separately from the month and day
   * so this string can be only the year (YYYY) or the month + day (MM/DD).
   */
  birthday: string;

  /**
   * The client's Business ID associated with a Business Integration System User.
   */
  client_business_id?: string;

  /**
   * Returns no data as of April 4, 2018.
   * @deprecated This field is deprecated and returns no data.
   */
  education?: EducationExperience[];

  /**
   * The User's primary email address listed on their profile.
   * This field will not be returned if no valid email address is available.
   */
  email: string;

  /**
   * Athletes the User likes.
   */
  favorite_athletes?: Experience[];

  /**
   * Sports teams the User likes.
   */
  favorite_teams?: Experience[];

  /**
   * The person's first name.
   */
  first_name: string;

  /**
   * The gender selected by this person, male or female.
   * If the gender is set to a custom value, this value will be based off of the selected pronoun;
   * it will be omitted if the pronoun is neutral.
   */
  gender: string;

  /**
   * The person's hometown.
   */
  hometown?: Page;

  /**
   * A profile based app scoped ID. It is used to query avatars.
   */
  id_for_avatars?: string;

  /**
   * The person's inspirational people.
   */
  inspirational_people?: Experience[];

  /**
   * Is the app making the request installed.
   */
  installed?: boolean;

  /**
   * If the current user is a guest user. Should always return false.
   */
  is_guest_user?: boolean;

  /**
   * Facebook Pages representing the languages this person knows.
   */
  languages?: Experience[];

  /**
   * The person's last name.
   */
  last_name: string;

  /**
   * A link to the person's Timeline. The link will only resolve if the person clicking the link
   * is logged into Facebook and is a friend of the person whose profile is being viewed.
   */
  link: string;

  /**
   * Display megaphone for local news bookmark.
   * @deprecated This field is deprecated.
   */
  local_news_megaphone_dismiss_status?: boolean;

  /**
   * Daily local news notification.
   * @deprecated This field is deprecated.
   */
  local_news_subscription_status?: boolean;

  /**
   * The person's locale.
   * @deprecated This field is deprecated.
   */
  locale: string;

  /**
   * The person's current location as entered by them on their profile.
   * This field requires the user_location permission.
   */
  location: Page;

  /**
   * What the person is interested in meeting for.
   */
  meeting_for?: string[];

  /**
   * The person's middle name.
   */
  middle_name: string;

  /**
   * The person's full name.
   */
  name: string;

  /**
   * The person's name formatted to correctly handle Chinese, Japanese, or Korean ordering.
   */
  name_format?: string;

  /**
   * Returns no data as of April 4, 2018.
   * @deprecated This field is deprecated and returns no data.
   */
  political?: string;

  /**
   * The person's favorite quotes.
   */
  quotes?: string;

  /**
   * Returns no data as of April 4, 2018.
   * @deprecated This field is deprecated and returns no data.
   */
  relationship_status?: string;

  /**
   * Returns no data as of April 4, 2018.
   * @deprecated This field is deprecated and returns no data.
   */
  religion?: string;

  /**
   * The time that the shared login needs to be upgraded to Business Manager by.
   */
  shared_login_upgrade_required_by?: string;

  /**
   * The person's significant other.
   */
  significant_other?: User;

  /**
   * Sports played by the person.
   */
  sports?: Experience[];

  /**
   * Whether the user can add a Donate Button to their Live Videos.
   */
  supports_donate_button_in_live_video?: boolean;

  /**
   * A string containing an anonymous, unique identifier for the User, for use with third-parties.
   * Deprecated for versions 3.0+. Apps using older versions of the API can get this field until January 8, 2019.
   * Apps installed by the User on or after May 1st, 2018, cannot get this field.
   * @deprecated This field is deprecated.
   */
  third_party_id?: string;

  /**
   * The person's current timezone offset from UTC.
   * @deprecated This field is deprecated.
   */
  timezone: number;

  /**
   * A token that is the same across a business's apps. Access to this token requires that the person
   * be logged into your app or have a role on your app. This token will change if the business owning the app changes.
   */
  token_for_business?: string;

  /**
   * Updated time.
   * @deprecated This field is deprecated.
   */
  updated_time?: string;

  /**
   * Indicates whether the account has been verified. This is distinct from the is_verified field.
   * Someone is considered verified if they take any of the following actions:
   * - Register for mobile
   * - Confirm their account via SMS
   * - Enter a valid credit card
   * @deprecated This field is deprecated.
   */
  verified?: boolean;

  /**
   * Video upload limits.
   */
  video_upload_limits?: VideoUploadLimits;

  /**
   * Returns no data as of April 4, 2018.
   * @deprecated This field is deprecated and returns no data.
   */
  website?: string;
}

export type {
  ShadowIGUser,
  ShadowIGComment,
  ShadowIGMedia,
  AgeRangeInfo,
  User,
  EducationExperience,
  Experience,
  VideoUploadLimits,
};
