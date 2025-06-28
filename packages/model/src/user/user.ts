import { type Person } from '@activity-kit/types';
import { type UserId } from './id.js';
import { type Location } from '@/entity/location.js';
import { type Tag } from '@/entity/tag.js';
import { type Image } from '@/attachment/image.js';

interface UserProps {
  id: UserId;
  createdAt: Date;
  followersCount: number;
  followingCount: number;
  name: string;
  displayName: string;
  avatar: Image;
  description: string;
  location?: Location;
  gender?: string;
  tags?: Tag[];
}

export class User {
  public readonly id: UserId;
  public readonly createdAt: Date;
  public readonly followersCount: number;
  public readonly followingCount: number;
  public name: string;
  public displayName: string;
  public avatar: Image;
  public description: string;
  public location?: Location;
  public gender?: string;
  public tags?: Tag[];

  constructor(props: Readonly<UserProps>) {
    this.id = props.id;
    this.createdAt = props.createdAt;
    this.followersCount = props.followersCount;
    this.followingCount = props.followingCount;
    this.name = props.name;
    this.displayName = props.displayName;
    this.avatar = props.avatar;
    this.description = props.description;
    this.location = props.location;
    this.gender = props.gender;
    this.tags = props.tags;
  }

  public toAP(): Person {
    return {
      type: 'Person',
      id: this.id.toAP(),
      name: this.name,
      preferredUsername: this.displayName,
      icon: this.avatar.toAP(),
      followers: {
        type: 'Collection',
        totalItems: this.followersCount,
      },
      following: {
        type: 'Collection',
        totalItems: this.followingCount,
      },
      published: this.createdAt,
      location: this.location?.toAP(),
      summary: this.description,
      tag: this.tags?.map((tag) => tag.toAP()),
      inbox: {
        type: 'OrderedCollection',
      },
      outbox: {
        type: 'OrderedCollection',
      },
    };
  }
}
