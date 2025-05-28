import { type UserResults } from './user.js';

interface Community {
  result: CommunityData;
}

interface CommunityData {
  __typename: 'Community';
  id_str: string;
  name?: string;
  description?: string;
  created_at?: number;
  question?: string;
  search_tags?: string[];
  primary_community_topic?: PrimaryCommunityTopic;
  actions?: CommunityActions;
  admin_results?: UserResults[];
  creator_results?: UserResults[];
  invites_result?: CommunityInvitesResult;
  join_requests_result?: CommunityJoinRequestsResult;
  join_policy?: 'Open' | 'RestrictedJoinRequestsRequireModeratorApproval';
  invites_policy?: 'MemberInvitesAllowed' | 'ModeratorInvitesAllowed';
  is_pinned?: boolean;
  members_facepile_results?: UserResults[];
  moderator_count?: number;
  member_count?: number;
  role?: 'NonMember';
  rules?: CommunityRule[];
  show_only_users_to_display?: string[];
  urls?: CommunityUrls;
  default_banner_media?: Record<string, unknown>;
  custom_banner_media?: Record<string, unknown>;
  viewer_relationship?: Record<string, unknown>;
}

interface PrimaryCommunityTopic {
  topic_id: string;
  topic_name: string;
}

interface CommunityActions {
  delete_action_result?: CommunityDeleteActionResult;
  join_action_result?: CommunityJoinActionResultUnion;
  leave_action_result?: CommunityLeaveActionResult;
  pin_action_result?: CommunityPinActionResult;
  unpin_action_result?: CommunityUnpinActionResult;
}

interface CommunityDeleteActionResult {
  __typename: 'CommunityDeleteActionUnavailable';
  reason: 'Unavailable';
}

type CommunityJoinActionResultUnion = CommunityJoinAction | CommunityJoinActionUnavailable;

interface CommunityJoinAction {
  __typename: 'CommunityJoinAction';
}

interface CommunityJoinActionUnavailable {
  __typename: 'CommunityJoinActionUnavailable';
  reason: 'ViewerRequestRequired';
  message: string;
}

interface CommunityLeaveActionResult {
  __typename: 'CommunityLeaveActionUnavailable';
  reason: 'ViewerNotMember';
  message: string;
}

interface CommunityPinActionResult {
  __typename: 'CommunityTweetPinActionUnavailable';
}

interface CommunityUnpinActionResult {
  __typename: 'CommunityTweetUnpinActionUnavailable';
}

interface CommunityInvitesResult {
  __typename: 'CommunityInvitesUnavailable';
  reason: 'Unavailable';
  message: string;
}

interface CommunityJoinRequestsResult {
  __typename: 'CommunityJoinRequestsUnavailable';
}

interface CommunityRule {
  rest_id: string;
  name: string;
  description?: string;
}

interface CommunityUrls {
  permalink: CommunityUrlsPermalink;
}

interface CommunityUrlsPermalink {
  url: string;
}

interface CommunityRelationship {
  id: string;
  rest_id: string;
  moderation_state: Record<string, unknown>;
  actions: CommunityActions;
}

interface AuthorCommunityRelationship {
  community_results: CommunityData[];
  role?: 'Member' | 'Moderator' | 'Admin';
  user_results?: UserResults[];
}

export type {
  CommunityRelationship,
  AuthorCommunityRelationship,
  Community,
  CommunityData,
  PrimaryCommunityTopic,
  CommunityActions,
  CommunityDeleteActionResult,
  CommunityJoinAction,
  CommunityJoinActionUnavailable,
  CommunityLeaveActionResult,
  CommunityPinActionResult,
  CommunityUnpinActionResult,
  CommunityInvitesResult,
  CommunityJoinRequestsResult,
  CommunityRule,
  CommunityUrls,
  CommunityUrlsPermalink,
  CommunityJoinActionResultUnion,
};
