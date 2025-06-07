import { type TimelineAddEntry, type InstructionUnion, type TimelineTimelineCursor } from '@/types/timeline.js';

const getEntries = (instruction: InstructionUnion): TimelineAddEntry[] => {
  if (instruction.type === 'TimelineAddEntries') {
    return instruction.entries;
  } else if (instruction.type === 'TimelineReplaceEntry') {
    return [instruction.entry];
  }
  return [];
};

const getCursor = (entry: TimelineAddEntry): TimelineTimelineCursor | null => {
  if (entry.content.entryType === 'TimelineTimelineCursor') {
    return entry.content;
  } else if (entry.content.entryType === 'TimelineTimelineItem') {
    const item = entry.content;
    if (item.itemContent.itemType === 'TimelineTimelineCursor') {
      return item.itemContent as TimelineTimelineCursor;
    }
  }
  return null;
};

export { getEntries, getCursor };
