import { type EitherCollectionReference, type Person } from '@activity-kit/types';
import { type UserId } from './id.js';
import { type Location } from '@/entity/location.js';
import { type Image } from '@/attachment/image.js';
import { type Hashtag } from '@/entity/hashtag.js';

interface UserProps {
  id: UserId;
  name: string;
  avatar: Image;
  createdAt?: Date;
  followersCount?: number;
  followingCount?: number;
  likesCount?: number;
  likedCount?: number;
  bookmarkCount?: number;
  description?: string;
  displayName?: string;
  gender?: string;
  location?: Location;
  tags?: Hashtag[];
}

export class User {
  public readonly id: UserId;
  public readonly avatar: Image;
  public readonly createdAt?: Date;
  public readonly followersCount?: number;
  public readonly followingCount?: number;
  public readonly likesCount?: number;
  public readonly likedCount?: number;
  public readonly bookmarkCount?: number;
  public name: string;
  public description?: string;
  public displayName?: string;
  public gender?: string;
  public location?: Location;
  public tags?: Hashtag[];

  constructor(props: Readonly<UserProps>) {
    this.avatar = props.avatar;
    this.description = props.description;
    this.displayName = props.displayName;
    this.createdAt = props.createdAt;
    this.followersCount = props.followersCount;
    this.followingCount = props.followingCount;
    this.likesCount = props.likesCount;
    this.likedCount = props.likedCount;
    this.bookmarkCount = props.bookmarkCount;
    this.gender = props.gender;
    this.id = props.id;
    this.location = props.location;
    this.name = props.name;
    this.tags = props.tags;
  }

  public toAP(): Person & { bookmarks?: EitherCollectionReference; gender?: string } {
    return {
      type: 'Person',
      id: this.id.toAP(),
      name: this.name,
      preferredUsername: this.displayName,
      icon: this.avatar.toAP(),
      followers: this.followersCount
        ? {
            type: 'Collection',
            totalItems: this.followersCount,
          }
        : undefined,
      following: this.followingCount
        ? {
            type: 'Collection',
            totalItems: this.followingCount,
          }
        : undefined,
      likes: this.likesCount
        ? {
            type: 'OrderedCollection',
            totalItems: this.likesCount,
          }
        : undefined,
      liked: this.likedCount
        ? {
            type: 'OrderedCollection',
            totalItems: this.likedCount,
          }
        : undefined,
      bookmarks: this.bookmarkCount
        ? {
            type: 'OrderedCollection',
            totalItems: this.bookmarkCount,
          }
        : undefined,
      published: this.createdAt,
      location: this.location?.toAP(),
      summary: this.description,
      tag: this.tags?.map((tag) => tag.toAP()),
      gender: this.gender,
      inbox: {
        type: 'OrderedCollection',
      },
      outbox: {
        type: 'OrderedCollection',
      },
    };
  }
}
