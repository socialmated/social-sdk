import { type Hashtag } from '@activity-kit/types';

export class Tag {
  constructor(
    public readonly name: string,
    public readonly description?: string,
    public readonly href?: string,
  ) {}

  public toAP(): Hashtag {
    return {
      type: 'Hashtag',
      name: this.name,
      summary: this.description,
      url: this.href ? new URL(this.href) : undefined,
    };
  }
}
