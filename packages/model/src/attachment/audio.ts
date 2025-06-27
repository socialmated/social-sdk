import { type LinkReference, type Audio as APAudio } from '@activity-kit/types';

export interface AudioProps {
  url: string;
  name?: string;
  width?: number;
  height?: number;
  duration?: string;
  alt?: string;
}

export class Audio {
  public readonly url: string;
  public readonly name?: string;
  public readonly width?: number;
  public readonly height?: number;
  public readonly duration?: string;
  public readonly alt?: string;

  constructor(props: Readonly<AudioProps>) {
    this.url = props.url;
    this.name = props.name;
    this.width = props.width;
    this.height = props.height;
    this.duration = props.duration;
    this.alt = props.alt;
  }

  public toAP(): APAudio | LinkReference {
    return {
      type: 'Audio',
      url: new URL(this.url),
      name: this.name,
      width: this.width,
      height: this.height,
      duration: this.duration,
      summary: this.alt,
    };
  }
}
