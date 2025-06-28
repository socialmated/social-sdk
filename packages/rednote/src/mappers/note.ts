import { Post } from '@social-sdk/model/feed';
import { type Attachment, Image, Video } from '@social-sdk/model/attachment';
import { Hashtag, Location, Mention } from '@social-sdk/model/entity';
import { mapNoteCardUserToUser } from './user.js';
import { countToNumber } from './primitive.js';
import { RednotePostId } from './id.js';
import { type HomeFeedItem, type FeedNoteCard } from '@/types/feed.js';
import {
  type NoteCardTag,
  type NoteCardImage,
  type NoteCardMediaStream,
  type NoteCardMediaStreamMeta,
} from '@/types/note.js';

function homeFeedItemToPost(item: HomeFeedItem): Post {
  const id = new RednotePostId(item.id, item.xsec_token);
  const author = mapNoteCardUserToUser(item.note_card.user);

  return new Post({
    id,
    title: item.note_card.display_title,
    author,
    likeCount: countToNumber(item.note_card.interact_info.liked_count),
  });
}

function noteCardMediaStreamMetaToVideo(stream: NoteCardMediaStreamMeta): Video {
  return new Video({
    url: stream.master_url,
    width: stream.width,
    height: stream.height,
    duration: String(stream.duration),
    mediaType: 'video/mp4',
  });
}

function noteCardMediaStreamToVideos(streams?: NoteCardMediaStream): Video | null {
  const av1 = streams?.av1?.map(noteCardMediaStreamMetaToVideo) ?? [];
  const h264 = streams?.h264?.map(noteCardMediaStreamMetaToVideo) ?? [];
  const h265 = streams?.h265?.map(noteCardMediaStreamMetaToVideo) ?? [];
  const h266 = streams?.h266?.map(noteCardMediaStreamMetaToVideo) ?? [];

  const allVideos = [...av1, ...h264, ...h265, ...h266];

  if (allVideos.length === 0) {
    return null;
  }

  // eslint-disable-next-line sonarjs/reduce-initial-value -- no need for initial value here
  const maxVideo = allVideos.reduce((max, current) =>
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- width and height are always defined in this context
    current.width! * current.height! > max.width! * max.height! ? current : max,
  );

  return maxVideo;
}

function noteCardImageToImage(image: NoteCardImage): Image {
  return new Image({
    url: image.url_default,
    height: image.height,
    width: image.width,
    preview: image.url_pre,
  });
}

function noteCardTagToTag(tag: NoteCardTag): Mention | Hashtag {
  if (tag.type === 'mention') {
    return new Mention({ name: tag.name });
  }
  return new Hashtag({
    name: tag.name,
    href:
      tag.type === 'topic'
        ? `https://www.xiaohongshu.com/search_result?keyword=${tag.name}&type=54&source=web_note_detail_r10`
        : undefined,
  });
}

function feedNoteCardToPost(note: FeedNoteCard, xsecToken = ''): Post {
  const id = new RednotePostId(note.note_id, xsecToken);
  const author = mapNoteCardUserToUser(note.user);

  const images = note.image_list.map(noteCardImageToImage);
  const videos = noteCardMediaStreamToVideos(note.video?.media?.stream);
  const attachments: Attachment[] = [...images];
  if (videos) {
    attachments.push(videos);
  }

  const tags = note.tag_list.map(noteCardTagToTag);
  const location = new Location({ name: note.ip_location });

  return new Post({
    id,
    title: note.title,
    content: note.desc,
    author,
    publishedAt: new Date(note.time),
    updatedAt: new Date(note.last_update_time),
    likeCount: countToNumber(note.interact_info.liked_count),
    replyCount: countToNumber(note.interact_info.comment_count),
    shareCount: countToNumber(note.interact_info.share_count),
    bookmarkCount: countToNumber(note.interact_info.collected_count),
    attachments,
    tags,
    location,
  });
}

export {
  homeFeedItemToPost,
  noteCardMediaStreamMetaToVideo,
  noteCardMediaStreamToVideos,
  noteCardImageToImage,
  noteCardTagToTag,
  feedNoteCardToPost,
};
