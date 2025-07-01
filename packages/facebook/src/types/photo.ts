/**
 * The cover photo for a Facebook {@link https://developers.facebook.com/docs/graph-api/reference/event | Event}, {@link https://developers.facebook.com/docs/graph-api/reference/group | Group}, or {@link https://developers.facebook.com/docs/graph-api/reference/page | Page}.
 * @see {@link https://developers.facebook.com/docs/graph-api/reference/cover-photo/ | Graph API Reference - Cover Photo}
 */
interface CoverPhoto {
  /**
   * The ID of the cover photo
   */
  id: string;

  /**
   * @deprecated Please use the id field instead
   * Deprecated cover photo ID
   */
  cover_id: string;

  /**
   * When greater than 0% but less than 100%, the cover photo overflows horizontally.
   * The value represents the horizontal manual offset (the amount the user dragged the photo horizontally
   * to show the part of interest) as a percentage of the offset necessary to make the photo fit the space.
   */
  offset_x: number;

  /**
   * When greater than 0% but less than 100%, the cover photo overflows vertically.
   * The value represents the vertical manual offset (the amount the user dragged the photo vertically
   * to show the part of interest) as a percentage of the offset necessary to make the photo fit the space.
   */
  offset_y: number;

  /**
   * Direct URL for the person's cover photo image
   */
  source: string;
}

export type { CoverPhoto };
