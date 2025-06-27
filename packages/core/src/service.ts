import { type User } from '@social-sdk/model/user';

interface UserService {
  me: () => Promise<User>;
  update: (user: Partial<User>) => Promise<User>;
  getById: (userId: string) => Promise<User>;
  getByUsername: (username: string) => Promise<User>;
  getFollowers: (userId: string) => AsyncIterableIterator<User>;
  getFollowing: (userId: string) => AsyncIterableIterator<User>;
  follow: (userId: string) => Promise<void>;
  unfollow: (userId: string) => Promise<void>;
  search: (query: string) => AsyncIterableIterator<User>;
}

export type { UserService };
