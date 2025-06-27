interface UserIdProps {
  id: string;
  domain: string;
  alt?: string;
}

export abstract class UserId {
  public readonly id: string;
  public readonly domain: string;
  public readonly alt?: string;

  constructor(props: Readonly<UserIdProps>) {
    this.id = props.id;
    this.domain = props.domain;
    this.alt = props.alt;
  }

  abstract toAP(): URL;
}
