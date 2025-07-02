import { type Result } from './common.js';
import { type NoteCard } from './note.js';

interface SearchRecommendResult {
  search_cpl_id: string;
  word_request_id: string;
  sug_items: SugItem[];
}

interface SugItem {
  text: string;
  highlight_flags: boolean[];
  search_type: string; // enum
  type: string; // enum
}

interface SearchRecommendParams {
  keyword: string;
}

interface SearchOneboxRequest {
  keyword: string;
  search_id: string;
  biz_type: string; // enum
  request_id: string;
}

interface SearchNotesFilter {
  tags: string[];
  type: string;
}

interface SearchNotesRequest {
  keyword: string;
  page: number;
  page_size: number;
  search_id: string;
  sort: 'general' | 'time_descending' | 'popularity_descending';
  /**
   * 0: 全部
   * 1: 视频
   * 2: 图文
   */
  note_type: number; // 0: quanbu, 2:
  ext_flags: string[];
  filters?: SearchNotesFilter[];
  geo: string;
  image_formats: string[];
}

interface SearchNotesResult {
  has_more: boolean;
  items: NoteCard[];
}

interface FilterTag {
  id: string;
  name: string;
  show_type: number;
  need_location_info: boolean;
}

interface SearchFilter {
  type: string;
  name: string;
  id: string;
  invisible: boolean;
  word_request_id: string;
  group_show_type: number;
  filter_tags: FilterTag[];
}

const a = {
  code: 1000,
  success: true,
  msg: '成功',
  data: {
    title: '猜你想搜',
    queries: [
      {
        title: '《情感反诈模拟器》',
        desc: '《情感反诈模拟器》',
        type: 'firstEnterOther#docNextQueryRecWord#68553e450000000010012736#1#0',
        search_word: '《情感反诈模拟器》',
        hint_word_request_id: '9d9ffc4b-ed92-42d1-99e2-7894f15fa918#1751466443270',
      },
      {
        search_word: '在日本个人被税务调查',
        title: '在日本个人被税务调查',
        desc: '在日本个人被税务调查',
        type: 'firstEnterOther#trendingSavAggRecall#62751e76000000000102dea6#2#0',
      },
      {
        desc: '加密币暴跌',
        type: 'firstEnterOther#interestClusterLveRecall#61107f3b000000000101c85b#3#0',
        search_word: '加密币暴跌',
        title: '加密币暴跌',
      },
      {
        title: '日本春秋航空ij017',
        desc: '日本春秋航空ij017',
        type: 'firstEnterOther#trendingSavAggRecall#6863608f000000002001b189#4#0',
        search_word: '日本春秋航空IJ017',
      },
      {
        title: '日本工签挂靠',
        desc: '日本工签挂靠',
        type: 'firstEnterOther#q2qNextQuery#日本工签#5#0',
        search_word: '日本工签挂靠',
      },
      {
        desc: '日本私塾一川文研',
        type: 'firstEnterOther#trendingSavAggRecall#68395d590000000021006865#6#0',
        search_word: '日本私塾一川文研',
        title: '日本私塾一川文研',
      },
      {
        search_word: '日本长野县小布施',
        title: '日本长野县小布施',
        desc: '日本长野县小布施',
        type: 'firstEnterOther#trendingSavAggRecall#681381d1000000002100f3c8#7#0',
      },
      {
        title: '春秋不实',
        desc: '春秋不实',
        type: 'firstEnterOther#docNextQueryRecWord#6863594800000000170342ad#8#0',
        search_word: '春秋不实',
      },
    ],
    hint_word: {
      hint_word_request_id: '9d9ffc4b-ed92-42d1-99e2-7894f15fa918#1751466443270',
      title: '《情感反诈模拟器》',
      desc: '《情感反诈模拟器》',
      type: 'firstEnterOther#docNextQueryRecWord#68553e450000000010012736#1#0',
      search_word: '《情感反诈模拟器》',
    },
    word_request_id: '9d9ffc4b-ed92-42d1-99e2-7894f15fa918#1751466443270',
  },
};

interface SearchFiltersResult {
  filters: SearchFilter[];
}

interface SearchUserRequest {
  search_user_request: SearchUserRequestValues;
}

interface SearchUserRequestValues {
  keyword: string;
  search_id: string;
  page: number;
  page_size: number;
  biz_type: string; // enum
  request_id: string;
}

interface UserSearchUser {
  id: string;
  name: string;
  image: string;
  red_id: string;
  sub_title: string;
  fans: string;
  note_count: number;
  followed: boolean;
  is_self: boolean;
  vshow: number;
  red_official_verified: boolean;
  red_official_verify_type: number;
  show_red_official_verify_icon: boolean;
  xsec_token: string;
  link: string;
  update_time?: string;
}

interface UserSearchResult {
  result: Result;
  users: UserSearchUser[];
  has_more: boolean;
}

interface QueryTrending {
  title: string;
  desc: string;
  type: string;
  search_word: string;
  hint_word_request_id?: string;
}

interface SearchQueryTrendingResult {
  word_request_id: string;
  title: string;
  queries: QueryTrending[];
  hint_word: QueryTrending;
}

export type {
  SearchRecommendResult,
  SugItem,
  SearchRecommendParams,
  FilterTag,
  SearchFilter,
  SearchFiltersResult,
  SearchNotesRequest,
  SearchNotesResult,
  SearchNotesFilter,
  SearchOneboxRequest,
  SearchUserRequest,
  SearchUserRequestValues,
  UserSearchUser,
  UserSearchResult,
  QueryTrending,
  SearchQueryTrendingResult,
};
