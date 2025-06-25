interface ListReportRequest {
  scene_code: string; // enum
  target_id: string;
}

interface ReportItemType {
  type_code: string; // enum
  type_name: string;
}

interface ListReportResult {
  item: ReportItemType[];
  special_code: string[];
}

interface ReportItem {
  id: string; // enum
  reason: string;
}

interface SubmitReportRequest {
  report_item: ReportItem;
  scenario_id: string; // enum
  target_id: string;
  target_type: string; // enum
  target_user_id: string;
}

export type { ListReportRequest, ListReportResult, ReportItemType, ReportItem, SubmitReportRequest };
