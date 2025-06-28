import { type Note } from '@activity-kit/types';
import { type PostId } from './id.js';
import { type User } from '@/user/user.js';
import { type Location } from '@/entity/location.js';
import { type Attachment } from '@/attachment/index.js';
import { type Tag } from '@/entity/tag.js';

interface PostProps {
  id: PostId;
  author: User;
  title?: string;
  content: string;
  publishedAt: Date;
  likeCount?: number;
  replyCount?: number;
  shareCount?: number;
  bookmarkCount?: number;
  location?: Location;
  attachments?: Attachment[];
  mentions?: User[];
  tags?: Tag[];
}

export class Post {
  public readonly id: PostId;
  public readonly title?: string;
  public readonly content: string;
  public readonly publishedAt: Date;
  public readonly author: User;
  public readonly location?: Location;
  public readonly attachments?: Attachment[];
  public likeCount?: number;
  public replyCount?: number;
  public shareCount?: number;
  public bookmarkCount?: number;
  public mentions?: User[];
  public tags?: Tag[];

  constructor(props: Readonly<PostProps>) {
    this.id = props.id;
    this.title = props.title;
    this.content = props.content;
    this.publishedAt = props.publishedAt;
    this.author = props.author;
    this.location = props.location;
    this.attachments = props.attachments;
    this.likeCount = props.likeCount;
    this.replyCount = props.replyCount;
    this.shareCount = props.shareCount;
    this.bookmarkCount = props.bookmarkCount;
    this.mentions = props.mentions;
    this.tags = props.tags;
  }

  public toAP(): Note {
    return {
      type: 'Note',
      id: this.id.toAP(),
      name: this.title,
      attributedTo: this.author.toAP(),
      published: this.publishedAt,
      content: this.content,
      location: this.location ? this.location.toAP() : undefined,
      attachment: this.attachments?.map((attachment) => attachment.toAP()),
      likes: {
        type: 'OrderedCollection',
        totalItems: this.likeCount,
      },
      replies: {
        type: 'Collection',
        totalItems: this.replyCount,
      },
      shares: {
        type: 'OrderedCollection',
        totalItems: this.shareCount,
      },
      tag: [
        {
          type: 'Collection',
          name: 'Bookmarks',
          totalItems: this.bookmarkCount,
        },
        {
          type: 'Collection',
          name: 'Mentions',
          items: this.mentions?.map((mention) => mention.toAP()),
        },
        {
          type: 'Collection',
          name: 'Hashtags',
          items: this.tags?.map((tag) => tag.toAP()),
        },
      ],
    };
  }
}
