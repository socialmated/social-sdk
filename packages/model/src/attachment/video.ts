import { type LinkReference, type Video as APVideo } from '@activity-kit/types';

export interface VideoProps {
  url: string;
  name?: string;
  width?: number;
  height?: number;
  duration?: string;
  alt?: string;
  preview?: string;
  mediaType?: string;
}

export class Video {
  public readonly url: string;
  public readonly name?: string;
  public readonly width?: number;
  public readonly height?: number;
  public readonly duration?: string;
  public readonly alt?: string;
  public readonly preview?: string;
  public readonly mediaType?: string;

  constructor(props: Readonly<VideoProps>) {
    this.url = props.url;
    this.name = props.name;
    this.width = props.width;
    this.height = props.height;
    this.duration = props.duration;
    this.alt = props.alt;
    this.preview = props.preview;
    this.mediaType = props.mediaType;
  }

  public toAP(): APVideo | LinkReference {
    return {
      type: 'Video',
      url: new URL(this.url),
      width: this.width,
      height: this.height,
      duration: this.duration,
      summary: this.alt,
      mediaType: this.mediaType,
      preview: this.preview ? new URL(this.preview) : undefined,
    };
  }
}
