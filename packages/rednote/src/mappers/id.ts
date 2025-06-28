import { PostId } from '@social-sdk/model/feed';
import { UserId } from '@social-sdk/model/user';

class RednoteUserId extends UserId {
  constructor(userId: string, xsecToken: string) {
    super({ id: userId, domain: 'www.xiaohongshu.com', alt: xsecToken });
  }

  public toAP(): URL {
    return new URL(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- alt is always set in this context
      `https://${this.domain}/user/profile/${this.id}?channel_type=web_explore_feed&xsec_token=${this.alt!}&xsec_source=pc_note`,
    );
  }
}

class RednotePostId extends PostId {
  constructor(noteId: string, xsecToken: string) {
    super({ id: noteId, domain: 'www.xiaohongshu.com', alt: xsecToken });
  }

  public toAP(): URL {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- alt is always set in this context
    return new URL(`https://${this.domain}/explore/${this.id}?xsec_token=${this.alt!}&xsec_source=pc_feed`);
  }
}

export { RednoteUserId, RednotePostId };
