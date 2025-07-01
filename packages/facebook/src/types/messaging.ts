interface MessagingFeatureStatus {
  hop_v2?: boolean;
  ig_multi_app?: boolean;
  msgr_multi_app?: boolean;
}

/**
 * Information about a person's VOIP status
 * @see {@link https://developers.facebook.com/docs/graph-api/reference/voip-info/ | Graph API Reference - VOIP Info}
 */
interface VoipInfo {
  /**
   * Whether the page has a mobile app.
   */
  has_mobile_app: boolean;

  /**
   * Whether the page has permission for VoIP services.
   */
  has_permission: boolean;

  /**
   * Whether the page is callable.
   */
  is_callable: boolean;

  /**
   * Whether the page is callable via WebRTC.
   */
  is_callable_webrtc: boolean;

  /**
   * Whether the page is pushable.
   */
  is_pushable: boolean;

  /**
   * The reason code for VoIP status.
   */
  reason_code: number;

  /**
   * The reason description for VoIP status.
   */
  reason_description: string;
}

export type { MessagingFeatureStatus, VoipInfo };
