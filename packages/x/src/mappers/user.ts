import { User as UserModel } from '@social-sdk/model/user';
import { Location } from '@social-sdk/model/entity';
import { Image } from '@social-sdk/model/attachment';
import { XUserId } from './id.js';
import { type UserUnion } from '@/types/user.js';

export function mapUserToUserModel(user?: UserUnion): UserModel | null {
  if (!user || user.__typename === 'UserUnavailable') {
    return null;
  }

  const id = new XUserId(user.rest_id, user.legacy.screen_name);
  const avatar = new Image({ url: user.legacy.profile_image_url_https });
  const location = new Location({ name: user.legacy.location });

  return new UserModel({
    id,
    createdAt: new Date(user.legacy.created_at),
    followersCount: user.legacy.followers_count,
    followingCount: user.legacy.friends_count,
    name: user.legacy.name,
    displayName: user.legacy.screen_name,
    avatar,
    description: user.legacy.description,
    location,
  });
}
