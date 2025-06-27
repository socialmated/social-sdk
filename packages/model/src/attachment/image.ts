import { type Image as APImage, type LinkReference } from '@activity-kit/types';

export interface ImageProps {
  url: string;
  name?: string;
  width?: number;
  height?: number;
  alt?: string;
}

export class Image {
  public readonly url: string;
  public readonly name?: string;
  public readonly width?: number;
  public readonly height?: number;
  public readonly alt?: string;

  constructor(props: Readonly<ImageProps>) {
    this.url = props.url;
    this.name = props.name;
    this.width = props.width;
    this.height = props.height;
    this.alt = props.alt;
  }

  public toAP(): APImage | LinkReference {
    return {
      type: 'Image',
      url: new URL(this.url),
      width: this.width,
      height: this.height,
      summary: this.alt,
    };
  }
}
