import { type Person } from '@activity-kit/types';
import { type Avatar } from './avatar.js';
import { type Location } from '@/entity/location.js';
import { type Tag } from '@/entity/tag.js';

interface BaseUserProps {
  id: string;
  createdAt: Date;
  followersCount: number;
  followingCount: number;
  name: string;
  displayName: string;
  avatar: Avatar;
  description: string;
  location?: Location;
  gender?: string;
  tags?: Tag[];
}

export abstract class BaseUser {
  public readonly id: string;
  public readonly createdAt: Date;
  public readonly followersCount: number;
  public readonly followingCount: number;
  public name: string;
  public displayName: string;
  public avatar: Avatar;
  public description: string;
  public location?: Location;
  public gender?: string;
  public tags?: Tag[];

  constructor(props: Readonly<BaseUserProps>) {
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

  abstract get url(): URL;

  public toAP(): Omit<Person, 'inbox' | 'outbox'> {
    return {
      type: 'Person',
      id: this.url,
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
    };
  }
}
