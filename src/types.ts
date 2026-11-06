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
  id: string;
}
