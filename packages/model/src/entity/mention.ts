import { type Mention as APMention } from '@activity-kit/types';

export interface MentionProps {
  name: string;
  href?: string;
}

export class Mention {
  public readonly name: string;
  public readonly href?: string;

  constructor(props: Readonly<MentionProps>) {
    this.name = props.name;
    this.href = props.href;
  }

  public toAP(): APMention {
    return {
      type: 'Mention',
      name: this.name,
      href: this.href ? new URL(this.href) : undefined,
    };
  }
}
