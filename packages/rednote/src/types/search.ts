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

export type { SearchRecommendResult, SugItem, SearchRecommendParams };
