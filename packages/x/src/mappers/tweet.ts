import { Post } from '@social-sdk/model/feed';
import { Image, Video } from '@social-sdk/model/attachment';
import { mapUserToUserModel } from './user.js';
import { XPostId } from './id.js';
import { type Tweet } from '@/types/tweet.js';

export function mapTweetToPost(tweet: Tweet): Post {
  const user = mapUserToUserModel(tweet.core?.user_results.result);

  const id = new XPostId(tweet.rest_id, user?.displayName ?? '');

  const attachments = tweet.legacy?.extended_entities?.media.map((media) => {
    if (media.type === 'photo') {
      return new Image({
        url: media.media_url_https,
        width: media.original_info.width,
        height: media.original_info.height,
        alt: media.ext_alt_text,
      });
    }
    return new Video({
      url: media.media_url_https,
      width: media.original_info.width,
      height: media.original_info.height,
      duration: media.video_info?.duration_millis ? String(media.video_info.duration_millis) : undefined,
      alt: media.ext_alt_text,
    });
  });

  return new Post({
    id,
    author: user,
    content: tweet.legacy?.full_text,
    publishedAt: tweet.legacy?.created_at ? new Date(tweet.legacy.created_at) : undefined,
    likeCount: tweet.legacy?.favorite_count,
    replyCount: tweet.legacy?.reply_count,
    shareCount: tweet.legacy?.retweet_count,
    bookmarkCount: tweet.legacy?.bookmark_count,
    attachments,
  });
}
