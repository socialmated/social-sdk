import type { AdSet, Targeting } from './ads.js';
import type { ShadowIGUser, User } from './user.js';
import type { MailingAddress, Location } from './geo.js';
import type { CoverPhoto } from './photo.js';
import type { CopyrightAttributionInsights } from './insights.js';
import type { MessagingFeatureStatus, VoipInfo } from './messaging.js';

/**
 * A category for a Facebook Page.
 * @see {@link https://developers.facebook.com/docs/graph-api/reference/page-category/ | Graph API Reference - Page Category}
 */
interface PageCategory {
  /**
   * The id of the category.
   */
  id: string;

  /**
   * The value to be used, in the API, for category_enum.
   */
  api_enum: string;

  /**
   * List of child categories.
   */
  fb_page_categories?: PageCategory[];

  /**
   * The name of the category.
   */
  name: string;
}

/**
 * The social sentence and like count used to render the like plugin
 * @see {@link https://developers.facebook.com/docs/graph-api/reference/engagement/ | Graph API Reference - Engagement}
 */
interface Engagement {
  /**
   * Number of people who like this
   */
  count: number;

  /**
   * Abbreviated string representation of count
   */
  count_string?: string;

  /**
   * Abbreviated string representation of count if the viewer likes the object
   */
  count_string_with_like?: string;

  /**
   * Abbreviated string representation of count if the viewer does not like the object
   */
  count_string_without_like?: string;

  /**
   * Text that the like button would currently display
   */
  social_sentence: string;

  /**
   * Text that the like button would display if the viewer likes the object
   */
  social_sentence_with_like?: string;

  /**
   * Text that the like button would display if the viewer does not like the object
   */
  social_sentence_without_like?: string;
}

/**
 * @see {@link https://developers.facebook.com/docs/graph-api/reference/has-lead-access/ | Graph API Reference - Has Lead Access}
 */
interface HasLeadAccess {
  /**
   * Whether or not the app has lead retrieval permission.
   */
  app_has_leads_permission: boolean;

  /**
   * Whether lead retrieval is possible with the given parameters.
   */
  can_access_lead: boolean;

  /**
   * Whether Lead Access Manager is enabled.
   */
  enabled_lead_access_manager: boolean;

  /**
   * Why lead retrieval is not allowed.
   */
  failure_reason: string;

  /**
   * How to resolve the lead retrieval failure.
   */
  failure_resolution: string;

  /**
   * Whether the user is a page admin.
   */
  is_page_admin: boolean;

  /**
   * The unique identifier of the page for which the permission/privacy status is being checked.
   */
  page_id: string;

  /**
   * Whether or not the user has lead permission on the page.
   */
  user_has_leads_permission: boolean;

  /**
   * The unique identifier of the Facebook user for which the permission/privacy status is being checked.
   */
  user_id: string;
}

/**
 * Page payment options in the Graph API. Used for Facebook Pages.
 * @see {@link https://developers.facebook.com/docs/graph-api/reference/page-payment-options/ | Graph API Reference - Page Payment Options}
 */
interface PagePaymentOptions {
  /**
   * Whether the business accepts American Express as a payment option.
   */
  amex: number;

  /**
   * Whether the business accepts cash only as a payment option.
   */
  cash_only: number;

  /**
   * Whether the business accepts Discover as a payment option.
   */
  discover: number;

  /**
   * Whether the business accepts MasterCard as a payment option.
   */
  mastercard: number;

  /**
   * Whether the business accepts Visa as a payment option.
   */
  visa: number;
}

/**
 * Parking options for a Page. Useful for Facebook Pages that have a business with parking.
 * @see {@link https://developers.facebook.com/docs/graph-api/reference/page-parking/ | Graph API Reference - Page Parking}
 */
interface PageParking {
  /**
   * Whether lot parking is available.
   */
  lot: number;

  /**
   * Whether street parking is available.
   */
  street: number;

  /**
   * Whether valet parking is available.
   */
  valet: number;
}

/**
 * Services that a Restaurant that's represented as a Facebook Page might provide
 * @see {@link https://developers.facebook.com/docs/graph-api/reference/page-restaurant-services/ | Graph API Reference - Page Restaurant Services}
 */
interface PageRestaurantServices {
  /**
   * Whether the restaurant has catering service.
   */
  catering: boolean;

  /**
   * Whether the restaurant has delivery service.
   */
  delivery: boolean;

  /**
   * Whether the restaurant is group-friendly.
   */
  groups: boolean;

  /**
   * Whether the restaurant is kids-friendly.
   */
  kids: boolean;

  /**
   * Whether the restaurant has outdoor seating.
   */
  outdoor: boolean;

  /**
   * Whether the restaurant has pickup service.
   */
  pickup: boolean;

  /**
   * Whether the restaurant takes reservations.
   */
  reserve: boolean;

  /**
   * Whether the restaurant has takeout service.
   */
  takeout: boolean;

  /**
   * Whether the restaurant has waiters.
   */
  waiter: boolean;

  /**
   * Whether the restaurant welcomes walkins.
   */
  walkins: boolean;
}

/**
 * Specialties of a restaurant that is represented by a Facebook Page
 * @see {@link https://developers.facebook.com/docs/graph-api/reference/page-restaurant-specialties/ | Graph API Reference - Page Restaurant Specialties}
 */
interface PageRestaurantSpecialties {
  /**
   * Whether the restaurant serves breakfast.
   */
  breakfast: number;

  /**
   * Whether the restaurant serves coffee.
   */
  coffee: number;

  /**
   * Whether the restaurant serves dinner.
   */
  dinner: number;

  /**
   * Whether the restaurant serves drinks.
   */
  drinks: number;

  /**
   * Whether the restaurant serves lunch.
   */
  lunch: number;
}

/**
 * Information about when a business was started that's represented by a Facebook Page
 * @see {@link https://developers.facebook.com/docs/graph-api/reference/page-start-info/ | Graph API Reference - Page Start Info}
 */
interface PageStartInfo {
  /**
   * The start date of the entity.
   */
  date: PageStartDate;

  /**
   * The start type of the entity.
   */
  type: string;
}

/**
 * Date about when the entity represented by the Page was started
 * @see {@link https://developers.facebook.com/docs/graph-api/reference/page-start-date/ | Graph API Reference - Page Start Date}
 */
interface PageStartDate {
  /**
   * The start day of the entity.
   */
  day: number;

  /**
   * The start month of the entity.
   */
  month: number;

  /**
   * The start year of the entity.
   */
  year: number;
}

/**
 * Represents a {@link https://www.facebook.com/help/282489752085908/ | Facebook Page}.
 * @see {@link https://developers.facebook.com/docs/graph-api/reference/page | Graph API Reference - Page }
 */
interface Page {
  /**
   * The ID representing a Facebook Page.
   */
  id: string;

  /**
   * Information about the Page. Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   * This value maps to the Description setting in the Edit Page Info user interface. Limit of 100 characters.
   */
  about?: string;

  /**
   * The Page's access token. Only returned if the User making the request has a role (other than Live Contributor) on the Page.
   * If your business requires two-factor authentication, the User must also be authenticated.
   */
  access_token?: string;

  /**
   * The Page's currently running ad campaign.
   */
  ad_campaign?: AdSet;

  /**
   * Affiliation of this person. Applicable to Pages representing people.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  affiliation?: string;

  /**
   * App ID for app-owned Pages and app Pages.
   */
  app_id?: string;

  /**
   * Artists the band likes. Applicable to Bands.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  artists_we_like?: string;

  /**
   * Dress code of the business. Applicable to Restaurants or Nightlife.
   * Can be one of Casual, Dressy or Unspecified.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  attire?: 'Casual' | 'Dressy' | 'Unspecified';

  /**
   * Available promotional offer IDs.
   */
  available_promo_offer_ids?: Record<string, Record<string, string>[]>[];

  /**
   * The awards information of the film. Applicable to Films.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  awards?: string;

  /**
   * Band interests. Applicable to Bands.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  band_interests?: string;

  /**
   * Members of the band. Applicable to Bands.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  band_members?: string;

  /**
   * The best available Page on Facebook for the concept represented by this Page.
   * The best available Page takes into account authenticity and the number of likes.
   */
  best_page?: Page;

  /**
   * Biography of the band. Applicable to Bands.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}. Limit of 100 characters.
   */
  bio?: string;

  /**
   * Birthday of this person. Applicable to Pages representing people.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  birthday?: string;

  /**
   * Booking agent of the band. Applicable to Bands.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  booking_agent?: string;

  /**
   * Information about the availability of daily and monthly usages of the breaking news indicator.
   * @deprecated This field is deprecated.
   */
  breaking_news_usage?: null;

  /**
   * Year vehicle was built. Applicable to Vehicles.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  built?: string;

  /**
   * The Business associated with this Page. Requires business_management permissions,
   * and a page or user access token. The person requesting the access token must be an admin of the page.
   */
  business?: object;

  /**
   * Whether the Page has checkin functionality enabled.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  can_checkin?: boolean;

  /**
   * Indicates whether the current app user can post on this Page.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  can_post?: boolean;

  /**
   * The Page's category. e.g. Product/Service, Computers/Technology.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  category: string;

  /**
   * The Page's sub-categories. This field will not return the parent category.
   */
  category_list?: PageCategory[];

  /**
   * Number of checkins at a place represented by a Page.
   */
  checkins: number;

  /**
   * The company overview. Applicable to Companies.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  company_overview?: string;

  /**
   * Instagram account connected to page via page settings.
   */
  connected_instagram_account?: ShadowIGUser;

  /**
   * The mailing or contact address for this page.
   * This field will be blank if the contact address is the same as the physical address.
   */
  contact_address?: MailingAddress;

  /**
   * Insight metrics that measures performance of copyright attribution.
   * An example metric would be number of incremental followers from attribution.
   */
  copyright_attribution_insights?: CopyrightAttributionInsights;

  /**
   * Instagram usernames who will not be reported in copyright match systems.
   */
  copyright_whitelisted_ig_partners?: string[];

  /**
   * If this is a Page in a Global Pages hierarchy, the number of people who are being directed to this Page.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  country_page_likes?: number;

  /**
   * Information about the page's cover photo.
   */
  cover?: CoverPhoto;

  /**
   * Culinary team of the business. Applicable to Restaurants or Nightlife.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  culinary_team?: string;

  /**
   * Current location of the Page. Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   * To manage a child Page's location use the /\{page-id\}/locations endpoint.
   */
  current_location?: string;

  /**
   * A Vector of url strings for delivery_and_pickup_option_info of the Page.
   */
  delivery_and_pickup_option_info?: string[];

  /**
   * The description of the Page. Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   * Note that this value is mapped to the Additional Information setting in the Edit Page Info user interface.
   */
  description: string;

  /**
   * The description of the Page in raw HTML.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  description_html?: string;

  /**
   * To be used when temporary_status is set to differently_open to indicate how the business is operating differently than usual,
   * such as a restaurant offering takeout. Enum keys can be one or more of the following: ONLINE_SERVICES, DELIVERY, PICKUP, OTHER
   * with the value set to true or false.
   */
  differently_open_offerings?: Record<'ONLINE_SERVICES' | 'DELIVERY' | 'PICKUP' | 'OTHER', boolean>;

  /**
   * The director of the film. Applicable to Films.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  directed_by?: string;

  /**
   * Subtext about the Page being viewed.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  display_subtext?: string;

  /**
   * Page estimated message response time displayed to user.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  displayed_message_response_time?: string;

  /**
   * Whether the viewer has page permission to link Instagram.
   */
  does_viewer_have_page_permission_link_ig?: boolean;

  /**
   * The emails listed in the About section of a Page.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  emails?: string[];

  /**
   * The social sentence and like count information for this Page.
   * This is the same info used for the like button.
   */
  engagement?: Engagement;

  /**
   * The number of users who like the Page. For Global Pages this is the count for all Pages across the brand.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   * For {@link https://developers.facebook.com/docs/pages-api | New Page Experience} Pages, this field will return followers_count.
   */
  fan_count?: number;

  /**
   * Features of the vehicle. Applicable to Vehicles.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  features?: string;

  /**
   * Number of page followers.
   */
  followers_count?: number;

  /**
   * The restaurant's food styles. Applicable to Restaurants.
   */
  food_styles?: string[];

  /**
   * When the company was founded. Applicable to Pages in the Company category.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  founded?: string;

  /**
   * General information provided by the Page.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  general_info?: string;

  /**
   * General manager of the business. Applicable to Restaurants or Nightlife.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  general_manager?: string;

  /**
   * The genre of the film. Applicable to Films.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  genre?: string;

  /**
   * The name of the Page with country codes appended for Global Pages. Only visible to the Page admin.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  global_brand_page_name?: string;

  /**
   * This brand's global Root ID.
   */
  global_brand_root_id?: string;

  /**
   * Indicates whether this Page has added the app making the query in a Page tab.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access}.
   */
  has_added_app?: boolean;

  /**
   * Lead access information.
   */
  has_lead_access?: HasLeadAccess;

  /**
   * Indicates whether a page has transitioned to new page experience or not.
   */
  has_transitioned_to_new_page_experience?: boolean;

  /**
   * Indicates whether WhatsApp number connected to this page is a WhatsApp business number.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  has_whatsapp_business_number?: boolean;

  /**
   * Indicates whether WhatsApp number connected to this page is a WhatsApp number.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  has_whatsapp_number?: boolean;

  /**
   * Hometown of the band. Applicable to Bands.
   */
  hometown?: string;

  /**
   * Indicates a single range of opening hours for a day. Each day can have 2 different hours ranges.
   * The keys in the map are in the form of \{day\}_\{number\}_\{status\}.
   * \{day\} should be the first 3 characters of the day of the week,
   * \{number\} should be either 1 or 2 to allow for the two different hours ranges per day.
   * \{status\} should be either open or close to delineate the start or end of a time range.
   */
  hours?: Record<string, string>;

  /**
   * Legal information about the Page publishers.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  impressum?: string;

  /**
   * Influences on the band. Applicable to Bands.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  influences?: string;

  /**
   * Instagram account linked to page during Instagram business conversion flow.
   */
  instagram_business_account?: ShadowIGUser;

  /**
   * Indicates whether this location is always open.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  is_always_open?: boolean;

  /**
   * Whether the page is eligible for calling.
   */
  is_calling_eligible?: boolean;

  /**
   * Indicates whether location is part of a chain.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  is_chain?: boolean;

  /**
   * Indicates whether the Page is a community Page.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  is_community_page?: boolean;

  /**
   * Indicates whether the page is eligible for the branded content tool.
   */
  is_eligible_for_branded_content?: boolean;

  /**
   * Whether the page is eligible for disabling connect IG button for non-page admin AM web.
   */
  is_eligible_for_disable_connect_ig_btn_for_non_page_admin_am_web?: boolean;

  /**
   * Indicates whether the page is a Messenger Platform Bot with Get Started button enabled.
   */
  is_messenger_bot_get_started_enabled?: boolean;

  /**
   * Indicates whether the page is a Messenger Platform Bot.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  is_messenger_platform_bot?: boolean;

  /**
   * Indicates whether Page is owned.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  is_owned?: boolean;

  /**
   * Whether the business corresponding to this Page is permanently closed.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  is_permanently_closed?: boolean;

  /**
   * Indicates whether the Page is published and visible to non-admins.
   */
  is_published?: boolean;

  /**
   * Indicates whether the Page is unclaimed.
   */
  is_unclaimed?: boolean;

  /**
   * @deprecated Use "verification_status" instead.
   * Pages with a large number of followers can be manually verified by Facebook as having an authentic identity.
   * This field indicates whether the Page is verified by this process.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  is_verified?: boolean;

  /**
   * Indicates whether the application is subscribed for real time updates from this page.
   */
  is_webhooks_subscribed?: boolean;

  /**
   * @deprecated Returns null.
   */
  keywords?: null;

  /**
   * Indicates the time when the TOS for running LeadGen Ads on the page was accepted.
   */
  leadgen_tos_acceptance_time?: string;

  /**
   * Indicates whether a user has accepted the TOS for running LeadGen Ads on the Page.
   */
  leadgen_tos_accepted?: boolean;

  /**
   * Indicates the user who accepted the TOS for running LeadGen Ads on the page.
   */
  leadgen_tos_accepting_user?: User;

  /**
   * The Page's Facebook URL.
   */
  link: string;

  /**
   * The location of this place. Applicable to all Places.
   */
  location?: Location;

  /**
   * Members of this org. Applicable to Pages representing Team Orgs.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access}.
   */
  members?: string;

  /**
   * The instant workflow merchant ID associated with the Page.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  merchant_id?: string;

  /**
   * Review status of the Page against FB commerce policies,
   * this status decides whether the Page can use component flow.
   */
  merchant_review_status?: string;

  /**
   * Messaging feature status.
   */
  messaging_feature_status?: MessagingFeatureStatus;

  /**
   * The default ice breakers for a certain page.
   */
  messenger_ads_default_icebreakers?: string[];

  /**
   * The default quick replies for a certain page.
   */
  messenger_ads_default_quick_replies?: string[];

  /**
   * Indicates what type this page is and we will generate different sets of quick replies based on it.
   * Values include UNKNOWN, PAGE_SHOP, or RETAIL.
   */
  messenger_ads_quick_replies_type?: 'UNKNOWN' | 'PAGE_SHOP' | 'RETAIL';

  /**
   * The company mission. Applicable to Companies.
   */
  mission?: string;

  /**
   * MPG of the vehicle. Applicable to Vehicles.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  mpg?: string;

  /**
   * The name of the Page.
   */
  name: string;

  /**
   * The name of the Page with its location and/or global brand descriptor.
   * Only visible to a page admin. Non-page admins will get the same value as name.
   */
  name_with_location_descriptor?: string;

  /**
   * The TV network for the TV show. Applicable to TV Shows.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  network?: string;

  /**
   * The number of people who have liked the Page, since the last login. Only visible to a Page admin.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  new_like_count?: number;

  /**
   * Offer eligibility status. Only visible to a page admin.
   */
  offer_eligible?: boolean;

  /**
   * Overall page rating based on rating survey from users on a scale of 1-5.
   * This value is normalized and is not guaranteed to be a strict average of user ratings.
   * If there are 0 or a small number of ratings, this field will not be returned.
   */
  overall_star_rating?: number;

  /**
   * Page token.
   */
  page_token?: string;

  /**
   * Parent Page of this Page. If the Page is part of a Global Root Structure and you have permission to the Global Root,
   * the Global Root Parent Page is returned. If you do not have Global Root permission,
   * the Market Page for your current region is returned as the Parent Page.
   * If your Page is not part of a Global Root Structure, the Parent Page is returned.
   */
  parent_page?: Page;

  /**
   * Parking information. Applicable to Businesses and Places.
   */
  parking?: PageParking;

  /**
   * Payment options accepted by the business. Applicable to Restaurants or Nightlife.
   */
  payment_options?: PagePaymentOptions;

  /**
   * Personal information. Applicable to Pages representing People.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access}.
   */
  personal_info?: string;

  /**
   * Personal interests. Applicable to Pages representing People.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  personal_interests?: string;

  /**
   * Pharmacy safety information. Applicable to Pharmaceutical companies.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  pharma_safety_info?: string;

  /**
   * Phone number provided by a Page. Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access}.
   */
  phone?: string;

  /**
   * List of pickup options available at this Page's store location.
   * Values can include CURBSIDE, IN_STORE, and OTHER.
   */
  pickup_options?: ('CURBSIDE' | 'IN_STORE' | 'OTHER')[];

  /**
   * For places, the category of the place.
   * Value can be CITY, COUNTRY, EVENT, GEO_ENTITY, PLACE, RESIDENCE, STATE_PROVINCE, or TEXT.
   */
  place_type?: 'CITY' | 'COUNTRY' | 'EVENT' | 'GEO_ENTITY' | 'PLACE' | 'RESIDENCE' | 'STATE_PROVINCE' | 'TEXT';

  /**
   * The plot outline of the film. Applicable to Films.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  plot_outline?: string;

  /**
   * Group of tags describing the preferred audience of ads created for the Page.
   */
  preferred_audience?: Targeting;

  /**
   * Press contact information of the band. Applicable to Bands.
   */
  press_contact?: string;

  /**
   * Price range of the business, such as a restaurant or salon.
   * Values can be one of $, $$, $$$, $$$$, Not Applicable, or null if no value is set.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  price_range?: '$' | '$$' | '$$$' | '$$$$' | 'Not Applicable';

  /**
   * Privacy url in page info section.
   */
  privacy_info_url?: string;

  /**
   * The producer of the film. Applicable to Films.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  produced_by?: string;

  /**
   * The products of this company. Applicable to Companies.
   */
  products?: string;

  /**
   * Boosted posts eligibility status. Only visible to a page admin.
   */
  promotion_eligible?: boolean;

  /**
   * Reason for which boosted posts are not eligible. Only visible to a page admin.
   */
  promotion_ineligible_reason?: string;

  /**
   * Public transit to the business. Applicable to Restaurants or Nightlife.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  public_transit?: string;

  /**
   * Number of ratings for the Page (limited to ratings that are publicly accessible).
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  rating_count?: number;

  /**
   * Messenger page scope id associated with page and a user using account_linking_token.
   */
  recipient?: string;

  /**
   * Record label of the band. Applicable to Bands.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  record_label?: string;

  /**
   * The film's release date. Applicable to Films.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  release_date?: string;

  /**
   * Services the restaurant provides. Applicable to Restaurants.
   */
  restaurant_services?: PageRestaurantServices;

  /**
   * The restaurant's specialties. Applicable to Restaurants.
   */
  restaurant_specialties?: PageRestaurantSpecialties;

  /**
   * The air schedule of the TV show. Applicable to TV Shows.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  schedule?: string;

  /**
   * The screenwriter of the film. Applicable to Films.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  screenplay_by?: string;

  /**
   * The season information of the TV Show. Applicable to TV Shows.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  season?: string;

  /**
   * The Page address, if any, in a simple single line format.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  single_line_address?: string;

  /**
   * The cast of the film. Applicable to Films.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  starring?: string;

  /**
   * Information about when the entity represented by the Page was started.
   */
  start_info?: PageStartInfo;

  /**
   * Unique store code for this location Page.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  store_code?: string;

  /**
   * Location Page's store location descriptor.
   */
  store_location_descriptor?: string;

  /**
   * Unique store number for this location Page.
   */
  store_number?: number;

  /**
   * The studio for the film production. Applicable to Films.
   */
  studio?: string;

  /**
   * Whether the user can add a Donate Button to their Live Videos.
   */
  supports_donate_button_in_live_video?: boolean;

  /**
   * The number of people talking about this Page.
   */
  talking_about_count?: number;

  /**
   * Indicates how the business corresponding to this Page is operating differently than usual.
   * Possible values: differently_open, temporarily_closed, operating_as_usual, no_data.
   * If set to differently_open use with differently_open_offerings to set status.
   */
  temporary_status?: 'differently_open' | 'temporarily_closed' | 'operating_as_usual' | 'no_data';

  /**
   * Unread message count for the Page. Only visible to a page admin.
   */
  unread_message_count?: number;

  /**
   * Number of unread notifications. Only visible to a page admin.
   */
  unread_notif_count?: number;

  /**
   * Unseen message count for the Page. Only visible to a page admin.
   */
  unseen_message_count?: number;

  /**
   * User access expire time.
   */
  user_access_expire_time?: string;

  /**
   * The alias of the Page. For example, for www.facebook.com/platform the username is 'platform'.
   */
  username: string;

  /**
   * Showing whether this {@link https://www.facebook.com/help/1288173394636262 | Page is verified}. Value can be blue_verified or gray_verified,
   * which represents that Facebook has confirmed that a Page is the authentic presence of the public figure,
   * celebrity, or global brand it represents, or not_verified.
   * This field can be read with the {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access} feature.
   */
  verification_status?: 'blue_verified' | 'gray_verified' | 'not_verified';

  /**
   * VoIP information.
   */
  voip_info?: VoipInfo;

  /**
   * The URL of the Page's website.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  website?: string;

  /**
   * The number of visits to this Page's location. If the Page setting Show map, check-ins and star ratings on the Page
   * (under Page Settings \> Page Info \> Address) is disabled, then this value will also be disabled.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  were_here_count?: number;

  /**
   * The Page's WhatsApp number.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  whatsapp_number?: string;

  /**
   * The writer of the TV show. Applicable to TV Shows.
   * Can be read with {@link https://developers.facebook.com/docs/features-reference/page-public-content-access | Page Public Content Access} or {@link https://developers.facebook.com/docs/features-reference/page-public-metadata-access | Page Public Metadata Access}.
   */
  written_by?: string;
}

export type {
  PageCategory,
  Engagement,
  HasLeadAccess,
  MessagingFeatureStatus,
  PageParking,
  PagePaymentOptions,
  PageRestaurantServices,
  PageRestaurantSpecialties,
  PageStartInfo,
  PageStartDate,
  VoipInfo,
  Page,
};
