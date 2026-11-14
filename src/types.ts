// A data selector is a CSS selector, or one container selector mapped to named field selectors.
export type DataSelector = string | Record<string, Record<string, string>>;

// The body of POST /api/tasks and PUT /api/tasks/{id}.
export interface TaskInput {
  name: string;
  url: string;
  page_selector?: Record<string, string>;
  data_selector: DataSelector;
  enabled: boolean;
}

export interface Task extends TaskInput {
  // Newest first. Only present when the task is loaded by id.
  snapshots?: Snapshot[];
  id: string;
}

// An item is the text of a match, or an object of named fields (null for a missing field).
export type ScrapedItem = string | Record<string, string | null>;

export interface Snapshot {
  date: string;
  status: string;
  data?: ScrapedItem[];
  error?: string;
}
