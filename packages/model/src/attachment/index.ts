import { type Audio } from './audio.js';
import { type Image } from './image.js';
import { type Video } from './video.js';

export type Attachment = Image | Video | Audio;

export * from './audio.js';
export * from './image.js';
export * from './video.js';
