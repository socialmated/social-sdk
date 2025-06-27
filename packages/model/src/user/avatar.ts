import { type ImageReference, type LinkReference } from '@activity-kit/types';

export interface AvatarProps {
  url: string;
  width?: number;
  height?: number;
}

export class Avatar {
  public readonly url: string;
  public readonly width?: number;
  public readonly height?: number;

  constructor(props: Readonly<AvatarProps>) {
    this.url = props.url;
    this.width = props.width;
    this.height = props.height;
  }

  public toAP(): ImageReference | LinkReference {
    return {
      type: 'Image',
      url: new URL(this.url),
      width: this.width,
      height: this.height,
    };
  }
}
