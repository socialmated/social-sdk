import { PostId } from '@social-sdk/model/feed';
import { UserId } from '@social-sdk/model/user';

class XUserId extends UserId {
  constructor(restId: string, screenName: string) {
    super({ id: restId, domain: 'x.com', alt: screenName });
  }

  public toAP(): URL {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- alt is always set in this context
    return new URL(`https://${this.domain}/${this.alt!}`);
  }
}

class XPostId extends PostId {
  constructor(restId: string, screenName: string) {
    super({ id: restId, domain: 'x.com', alt: screenName });
  }

  public toAP(): URL {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- alt is always set in this context
    return new URL(`https://${this.domain}/${this.alt!}/status/${this.id}`);
  }
}

export { XUserId, XPostId };
