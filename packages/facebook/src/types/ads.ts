// Referenced type declarations for AdSet
type AdLabel = object;
type DayPart = object;
type AttributionSpec = object;
type AdBidAdjustments = object;
type AdCampaignBidConstraint = object;
type BrandSafetyCampaignConfig = object;
type Campaign = object;
type ContextualBundlingSpec = object;
type AdCampaignFrequencyControlSpecs = object;
type AdCampaignIssuesInfo = object;
type AdCampaignLearningStageInfo = object;
type AdPromotedObject = object;
type AdRecommendation = object;
type RegionalRegulationIdentities = object;

interface IdName {
  id: string;
  name: string;
}

type CatalogBasedTargeting = object;
type ConnectionsTargeting = object;
type RawCustomAudience = object;
type DevicePlatforms = object;
type EffectiveDevicePlatforms = object;
type TargetingDynamicRule = object;
type TargetingGeoLocation = object;
type TargetingProductAudienceSpec = object;
type TargetingProspectingAudience = object;
type FlexibleTargeting = object;

interface Targeting {
  adgroup_id: string;
  age_max: number;
  age_min: number;
  app_install_state: string;
  audience_network_positions: string[];
  behaviors: IdName[];
  brand_safety_content_filter_levels: string[];
  catalog_based_targeting: CatalogBasedTargeting;
  cities: IdName[];
  college_years: number[];
  connections: ConnectionsTargeting[];
  contextual_targeting_categories: IdName[];
  countries: string[];
  country: string[];
  country_groups: string[];
  custom_audiences: RawCustomAudience[];
  device_platforms: DevicePlatforms[];
  direct_install_devices: boolean;
  dynamic_audience_ids: string[];
  education_majors: IdName[];
  education_schools: IdName[];
  education_statuses: number[];
  effective_audience_network_positions: string[];
  effective_device_platforms: EffectiveDevicePlatforms[];
  effective_facebook_positions: string[];
  effective_instagram_positions: string[];
  effective_messenger_positions: string[];
  effective_publisher_platforms: string[];
  engagement_specs: TargetingDynamicRule[];
  ethnic_affinity: IdName[];
  exclude_reached_since: string[];
  excluded_brand_safety_content_types: string[];
  excluded_connections: ConnectionsTargeting[];
  excluded_custom_audiences: RawCustomAudience[];
  excluded_dynamic_audience_ids: string[];
  excluded_engagement_specs: TargetingDynamicRule[];
  excluded_geo_locations: TargetingGeoLocation;
  excluded_mobile_device_model: string[];
  excluded_product_audience_specs: TargetingProductAudienceSpec[];
  excluded_publisher_categories: string[];
  excluded_publisher_list_ids: string[];
  excluded_user_device: string[];
  exclusions: FlexibleTargeting;
  facebook_positions: string[];
  family_statuses: IdName[];
  fb_deal_id: string;
  flexible_spec: FlexibleTargeting[];
  friends_of_connections: ConnectionsTargeting[];
  genders: number[];
  generation: IdName[];
  geo_locations: TargetingGeoLocation;
  home_ownership: IdName[];
  home_type: IdName[];
  home_value: IdName[];
  household_composition: IdName[];
  income: IdName[];
  industries: IdName[];
  instagram_positions: string[];
  instream_video_skippable_excluded: boolean;
  interested_in: number[];
  interests: IdName[];
  is_whatsapp_destination_ad: boolean;
  keywords: string[];
  life_events: IdName[];
  locales: number[];
  messenger_positions: string[];
  moms: IdName[];
  net_worth: IdName[];
  office_type: IdName[];
  place_page_set_ids: string[];
  political_views: number[];
  politics: IdName[];
  product_audience_specs: TargetingProductAudienceSpec[];
  prospecting_audience: TargetingProspectingAudience;
  publisher_platforms: string[];
  radius: string;
  regions: IdName[];
  relationship_statuses: number[];
  site_category: string[];
  targeting_optimization: string;
  user_adclusters: IdName[];
  user_device: string[];
  user_event: number[];
  user_os: string[];
  wireless_carrier: string[];
  work_employers: IdName[];
  work_positions: IdName[];
  zips: string[];
}

/**
 * An ad set is a group of ads that share the same daily or lifetime budget, schedule, bid type, bid info, and targeting data.
 * Ad sets enable you to group ads according to your criteria, and you can retrieve the ad-related statistics that apply to a set.
 * @see {@link https://developers.facebook.com/docs/marketing-api/reference/ad-campaign/ | Marketing API Reference - Ad Set}
 */
interface AdSet {
  /**
   * ID for the Ad Set.
   */
  id: string;

  /**
   * ID for the Ad Account associated with this Ad Set.
   */
  account_id?: string;

  /**
   * Ad Labels associated with this ad set.
   */
  adlabels?: AdLabel[];

  /**
   * Ad set schedule, representing a delivery schedule for a single day.
   */
  adset_schedule?: DayPart[];

  /**
   * The ID of the asset feed that contains a content to create ads.
   */
  asset_feed_id?: string;

  /**
   * Conversion attribution spec used for attributing conversions for optimization.
   * Supported window lengths differ by optimization goal and campaign objective.
   */
  attribution_spec?: AttributionSpec[];

  /**
   * Map of bid adjustment types to values.
   */
  bid_adjustments?: AdBidAdjustments;

  /**
   * Bid cap or target cost for this ad set. The bid cap used in a lowest cost bid strategy
   * is defined as the maximum bid you want to pay for a result based on your optimization_goal.
   * The target cost used in a target cost bid strategy lets Facebook bid on your behalf
   * to meet your target on average and keep costs stable as you raise budget.
   */
  bid_amount?: number;

  /**
   * Choose bid constraints for ad set to suit your specific business goals.
   * It usually works together with bid_strategy field.
   */
  bid_constraints?: AdCampaignBidConstraint;

  /**
   * Map of bid objective to bid value.
   */
  bid_info?: Record<string, number>;

  /**
   * Bid strategy for this ad set when you use AUCTION as your buying type.
   */
  bid_strategy?: 'LOWEST_COST_WITHOUT_CAP' | 'LOWEST_COST_WITH_BID_CAP' | 'COST_CAP' | 'LOWEST_COST_WITH_MIN_ROAS';

  /**
   * The billing event for this ad set.
   */
  billing_event?:
    | 'APP_INSTALLS'
    | 'CLICKS'
    | 'IMPRESSIONS'
    | 'LINK_CLICKS'
    | 'NONE'
    | 'OFFER_CLAIMS'
    | 'PAGE_LIKES'
    | 'POST_ENGAGEMENT'
    | 'THRUPLAY'
    | 'PURCHASE'
    | 'LISTING_INTERACTION';

  /**
   * Brand safety configuration.
   */
  brand_safety_config?: BrandSafetyCampaignConfig;

  /**
   * Remaining budget of this Ad Set.
   */
  budget_remaining?: string;

  /**
   * The campaign that contains this ad set.
   */
  campaign?: Campaign;

  /**
   * Campaign running length.
   */
  campaign_active_time?: string;

  /**
   * Campaign attribution, a new field for app ads campaign, used to indicate a campaign's attribution type.
   */
  campaign_attribution?: string;

  /**
   * The ID of the campaign that contains this ad set.
   */
  campaign_id?: string;

  /**
   * The status set at the ad set level. It can be different from the effective status due to its parent campaign.
   * Prefer using 'status' instead of this.
   */
  configured_status?: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';

  /**
   * Specs of contextual bundling Ad Set setup, including signal of opt-in/out the feature.
   */
  contextual_bundling_spec?: ContextualBundlingSpec;

  /**
   * Time when this Ad Set was created.
   */
  created_time?: string;

  /**
   * Order of the adgroup sequence to be shown to users.
   */
  creative_sequence?: string[];

  /**
   * The daily budget of the set defined in your account currency.
   */
  daily_budget?: string;

  /**
   * Daily minimum spend target of the ad set defined in your account currency.
   * To use this field, daily budget must be specified in the Campaign.
   */
  daily_min_spend_target?: string;

  /**
   * Daily spend cap of the ad set defined in your account currency.
   * To use this field, daily budget must be specified in the Campaign.
   */
  daily_spend_cap?: string;

  /**
   * Destination of ads in this Ad Set.
   * Options include: WEBSITE, APP, MESSENGER, INSTAGRAM_DIRECT.
   */
  destination_type?: string;

  /**
   * The beneficiary of all ads in this ad set.
   */
  dsa_beneficiary?: string;

  /**
   * The payor of all ads in this ad set.
   */
  dsa_payor?: string;

  /**
   * The effective status of the adset. The status could be effective either because of its own status,
   * or the status of its parent campaign.
   */
  effective_status?: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'CAMPAIGN_PAUSED' | 'ARCHIVED' | 'IN_PROCESS' | 'WITH_ISSUES';

  /**
   * End time, in UTC UNIX timestamp.
   */
  end_time?: string;

  /**
   * An array of frequency control specs for this ad set. As there is only one event type currently supported,
   * this array has no more than one element. Writes to this field are only available in ad sets where REACH is the objective.
   */
  frequency_control_specs?: AdCampaignFrequencyControlSpecs[];

  /**
   * Represents your Instagram account id, used for ads, including dynamic creative ads on Instagram.
   */
  instagram_user_id?: string;

  /**
   * Whether this ad set is a dynamic creative ad set.
   * Dynamic creative ad can be created only under ad set with this field set to be true.
   */
  is_dynamic_creative?: boolean;

  /**
   * Whether the campaign should use incremental attribution optimization.
   */
  is_incremental_attribution_enabled?: boolean;

  /**
   * Issues for this ad set that prevented it from delivering.
   */
  issues_info?: AdCampaignIssuesInfo[];

  /**
   * Info about whether the ranking or delivery system is still learning for this ad set.
   * While the ad set is still in learning, we might have unstabilized delivery performances.
   */
  learning_stage_info?: AdCampaignLearningStageInfo;

  /**
   * The lifetime budget of the set defined in your account currency.
   */
  lifetime_budget?: string;

  /**
   * Lifetime impressions. Available only for campaigns with buying_type=FIXED_CPM.
   */
  lifetime_imps?: number;

  /**
   * Lifetime minimum spend target of the ad set defined in your account currency.
   * To use this field, lifetime budget must be specified in the Campaign.
   */
  lifetime_min_spend_target?: string;

  /**
   * Lifetime spend cap of the ad set defined in your account currency.
   * To use this field, lifetime budget must be specified in the Campaign.
   */
  lifetime_spend_cap?: string;

  /**
   * Minimum budget spend percentage.
   */
  min_budget_spend_percentage?: string;

  /**
   * Multi optimization goal weight.
   */
  multi_optimization_goal_weight?: string;

  /**
   * Name of the ad set.
   */
  name?: string;

  /**
   * The optimization goal this ad set is using.
   */
  optimization_goal?:
    | 'NONE'
    | 'APP_INSTALLS'
    | 'AD_RECALL_LIFT'
    | 'ENGAGED_USERS'
    | 'EVENT_RESPONSES'
    | 'IMPRESSIONS'
    | 'LEAD_GENERATION'
    | 'QUALITY_LEAD'
    | 'LINK_CLICKS'
    | 'OFFSITE_CONVERSIONS'
    | 'PAGE_LIKES'
    | 'POST_ENGAGEMENT'
    | 'QUALITY_CALL'
    | 'REACH'
    | 'LANDING_PAGE_VIEWS'
    | 'VISIT_INSTAGRAM_PROFILE'
    | 'VALUE'
    | 'THRUPLAY'
    | 'DERIVED_EVENTS'
    | 'APP_INSTALLS_AND_OFFSITE_CONVERSIONS'
    | 'CONVERSATIONS'
    | 'IN_APP_VALUE'
    | 'MESSAGING_PURCHASE_CONVERSION'
    | 'SUBSCRIBERS'
    | 'REMINDERS_SET'
    | 'MEANINGFUL_CALL_ATTEMPT'
    | 'PROFILE_VISIT'
    | 'PROFILE_AND_PAGE_ENGAGEMENT'
    | 'ADVERTISER_SILOED_VALUE'
    | 'AUTOMATIC_OBJECTIVE'
    | 'MESSAGING_APPOINTMENT_CONVERSION';

  /**
   * Optimization sub event for a specific optimization goal.
   * For example: Sound-On event for Video-View-2s optimization goal.
   */
  optimization_sub_event?: string;

  /**
   * Defines the pacing type, standard or using ad scheduling.
   */
  pacing_type?: string[];

  /**
   * The object this ad set is promoting across all its ads.
   */
  promoted_object?: AdPromotedObject;

  /**
   * If there are recommendations for this ad set, this field includes them.
   * Otherwise, will not be included in the response.
   */
  recommendations?: AdRecommendation[];

  /**
   * If this field is true, your daily spend may be more than your daily budget while your weekly spend
   * will not exceed 7 times your daily budget. If this is false, your amount spent daily will not exceed
   * the daily budget. This field is not applicable for lifetime budgets.
   */
  recurring_budget_semantics?: boolean;

  /**
   * This param is used to specify regional_regulated_categories.
   */
  regional_regulated_categories?: string[];

  /**
   * This param is used to specify regional_regulation_identities used to represent the ad set.
   */
  regional_regulation_identities?: RegionalRegulationIdentities;

  /**
   * Reviews for dynamic creative ad.
   */
  review_feedback?: string;

  /**
   * Reach and frequency prediction ID.
   */
  rf_prediction_id?: string;

  /**
   * The source ad set that this ad set was copied from.
   */
  source_adset?: AdSet;

  /**
   * The source ad set id that this ad set was copied from.
   */
  source_adset_id?: string;

  /**
   * Start time, in UTC UNIX timestamp.
   */
  start_time?: string;

  /**
   * The status set at the ad set level. It can be different from the effective status due to its parent campaign.
   * The field returns the same value as configured_status, and is the suggested one to use.
   */
  status?: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';

  /**
   * Targeting configuration for this ad set.
   */
  targeting?: Targeting;

  /**
   * Targeting options that are relaxed and used as a signal for optimization.
   */
  targeting_optimization_types?: Record<string, number>[];

  /**
   * Specify ad creative that displays at custom date ranges in a campaign as an array.
   * A list of Adgroup IDs.
   */
  time_based_ad_rotation_id_blocks?: number[][];

  /**
   * Date range when specific ad creative displays during a campaign.
   * Provide date ranges in an array of UNIX timestamps.
   */
  time_based_ad_rotation_intervals?: number[];

  /**
   * Time when the Ad Set was updated.
   */
  updated_time?: string;

  /**
   * If set, allows Mobile App Engagement ads to optimize for LINK_CLICKS.
   */
  use_new_app_click?: boolean;

  /**
   * Value rule set ID.
   */
  value_rule_set_id?: string;
}

export type {
  AdLabel,
  DayPart,
  AttributionSpec,
  AdBidAdjustments,
  AdCampaignBidConstraint,
  BrandSafetyCampaignConfig,
  Campaign,
  ContextualBundlingSpec,
  AdCampaignFrequencyControlSpecs,
  AdCampaignIssuesInfo,
  AdCampaignLearningStageInfo,
  AdPromotedObject,
  AdRecommendation,
  RegionalRegulationIdentities,
  Targeting,
  AdSet,
};
