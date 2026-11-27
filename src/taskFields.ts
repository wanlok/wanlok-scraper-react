import type { DataSelector, Task, TaskInput } from "./types";

export type YesNo = "yes" | "no";

// What the task form holds. The selectors are text: a page selector is a JSON object, or empty for
// none. A data selector is a plain CSS selector, or a JSON object when it starts with "{".
export interface TaskFields {
  name: string;
  url: string;
  pageSelector: string;
  dataSelector: string;
  scheduled: YesNo;
}

export const stringifySelector = (
  selector?: DataSelector | Record<string, string>,
): string => {
  if (selector === undefined) {
    return "";
  }
  return typeof selector === "string"
    ? selector
    : JSON.stringify(selector, null, 2);
};

export const fieldsFromTask = (task?: Task): TaskFields => {
  return {
    name: task?.name ?? "",
    url: task?.url ?? "",
    pageSelector: stringifySelector(task?.page_selector),
    dataSelector: stringifySelector(task?.data_selector),
    scheduled: task?.scheduled === false ? "no" : "yes",
  };
};

export const parseObject = (
  text: string,
  label: string,
): Record<string, unknown> => {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch (e) {
    throw new Error(
      `${label} is not valid JSON: ${e instanceof Error ? e.message : e}`,
    );
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be a JSON object`);
  }
  return value as Record<string, unknown>;
};

const parsePageSelector = (
  text: string,
): Record<string, string> | undefined => {
  const trimmed = text.trim();
  if (!trimmed) {
    return undefined;
  }
  return parseObject(trimmed, "Page selector") as Record<string, string>;
};

const parseDataSelector = (text: string): DataSelector => {
  const trimmed = text.trim();
  if (trimmed.startsWith("{")) {
    return parseObject(trimmed, "Data selector") as DataSelector;
  }
  return trimmed;
};

// Throws an Error with a message for the user if a selector is not valid JSON.
export const toTaskInput = (fields: TaskFields): TaskInput => {
  const input: TaskInput = {
    name: fields.name.trim(),
    url: fields.url.trim(),
    data_selector: parseDataSelector(fields.dataSelector),
    scheduled: fields.scheduled === "yes",
  };
  const pageSelector = parsePageSelector(fields.pageSelector);
  if (pageSelector) {
    input.page_selector = pageSelector;
  }
  return input;
};
