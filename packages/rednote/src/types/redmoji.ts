import { type Result } from './common.js';

interface RedmojiVersion {
  result: Result;
  version: number;
}

interface RedmojiTab {
  image_name: string;
  image: string;
}

interface RedmojiEmoji {
  tabs: RedmojiTab[];
}

interface RedmojiDetail {
  result: Result;
  version: number;
  emoji: RedmojiEmoji;
}

export type { RedmojiVersion, RedmojiDetail };
