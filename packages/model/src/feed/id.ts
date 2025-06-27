export interface PostIdProps {
  id: string;
  domain: string;
  alt?: string;
}

export abstract class PostId {
  public readonly id: string;
  public readonly domain: string;
  public readonly alt?: string;

  constructor(props: Readonly<PostIdProps>) {
    this.id = props.id;
    this.domain = props.domain;
    this.alt = props.alt;
  }

  abstract toAP(): URL;
}
