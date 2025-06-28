import { User } from '@social-sdk/model/user';
import { Image } from '@social-sdk/model/attachment';
import { RednoteUserId } from './id.js';
import { countToNumber } from './primitive.js';
import { type NoteCardUser } from '@/types/note.js';
import { type OtherUserInfo } from '@/types/user.js';

function mapNoteCardUserToUser(user: NoteCardUser): User {
  const id = new RednoteUserId(user.user_id, user.xsec_token);
  const avatar = new Image({ url: user.avatar });

  return new User({
    id,
    name: user.nickname,
    avatar,
  });
}

function mapOtherUserInfoToUser(user: OtherUserInfo, id = new RednoteUserId('', '')): User {
  const avatar = new Image({ url: user.basic_info.images });

  return new User({
    id,
    name: user.basic_info.nickname,
    gender: user.basic_info.gender === 0 ? 'male' : 'female',
    avatar,
    followersCount: countToNumber(user.interactions.find((i) => i.type === 'fans')?.count),
    followingCount: countToNumber(user.interactions.find((i) => i.type === 'follows')?.count),
    likesCount: countToNumber(user.interactions.find((i) => i.type === 'interaction')?.count),
    bookmarkCount: user.tab_public.collectionNote.count,
    description: user.basic_info.desc,
    displayName: user.basic_info.red_id,
  });
}

export { mapNoteCardUserToUser, mapOtherUserInfoToUser };
