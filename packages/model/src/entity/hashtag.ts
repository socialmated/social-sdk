import { type Hashtag as APHashtag } from '@activity-kit/types';

export interface HashtagProps {
  name: string;
  description?: string;
  href?: string;
}

export class Hashtag {
  public readonly name: string;
  public readonly description?: string;
  public readonly href?: string;

  constructor(props: Readonly<HashtagProps>) {
    this.name = props.name;
    this.description = props.description;
    this.href = props.href;
  }

  public toAP(): APHashtag {
    return {
      type: 'Hashtag',
      name: this.name,
      summary: this.description,
      url: this.href ? new URL(this.href) : undefined,
    };
  }
}
