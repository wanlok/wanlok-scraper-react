import { useState, type FormEvent } from "react";
import type { DataSelector, Task, TaskInput } from "../types";
import WButton from "./WButton";
import WField from "./WField";

// The selectors are typed as text. A page selector is a JSON object, or empty for none.
// A data selector is a plain CSS selector, or a JSON object when it starts with "{".

function stringifySelector(
  selector?: DataSelector | Record<string, string>,
): string {
  if (selector === undefined) return "";
  return typeof selector === "string"
    ? selector
    : JSON.stringify(selector, null, 2);
}

function parseObject(text: string, label: string): Record<string, unknown> {
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
}

function parsePageSelector(text: string): Record<string, string> | undefined {
  const trimmed = text.trim();
  if (!trimmed) return undefined;
  return parseObject(trimmed, "Page selector") as Record<string, string>;
}

function parseDataSelector(text: string): DataSelector {
  const trimmed = text.trim();
  if (trimmed.startsWith("{"))
    return parseObject(trimmed, "Data selector") as DataSelector;
  return trimmed;
}

interface TaskFormProps {
  // Give a task to edit it; leave it out to add a new one.
  // The fields start from the task, so use `key={task.id}` to show a different one.
  task?: Task;
  onSubmit: (input: TaskInput) => void | Promise<void>;
  submitting: boolean;
  error: string | null;
  // Shows a Delete button (after a confirmation). Only makes sense when editing.
  onDelete?: () => void | Promise<void>;
  deleting?: boolean;
}

function TaskForm({
  task,
  onSubmit,
  submitting,
  error,
  onDelete,
  deleting = false,
}: TaskFormProps) {
  const busy = submitting || deleting;

  const [name, setName] = useState(task?.name ?? "");
  const [url, setUrl] = useState(task?.url ?? "");
  const [pageSelector, setPageSelector] = useState(
    stringifySelector(task?.page_selector),
  );
  const [dataSelector, setDataSelector] = useState(
    stringifySelector(task?.data_selector),
  );
  const [inputError, setInputError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    let input: TaskInput;
    try {
      input = {
        name: name.trim(),
        url: url.trim(),
        data_selector: parseDataSelector(dataSelector),
      };
      const parsedPageSelector = parsePageSelector(pageSelector);
      if (parsedPageSelector) input.page_selector = parsedPageSelector;
    } catch (e) {
      setInputError(e instanceof Error ? e.message : String(e));
      return;
    }

    setInputError(null);
    await onSubmit(input);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{task ? "Edit task" : "Add task"}</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <WField label="Name" htmlFor="task-name">
          <input
            id="task-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </WField>

        <WField label="URL" htmlFor="task-url">
          <input
            id="task-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://"
            required
          />
        </WField>

        <WField
          label="Page selector (optional, JSON)"
          htmlFor="task-page-selector"
        >
          <textarea
            id="task-page-selector"
            rows={4}
            cols={60}
            value={pageSelector}
            onChange={(e) => setPageSelector(e.target.value)}
            placeholder={'{ ".pagination a": "page" }'}
            spellCheck={false}
          />
        </WField>

        <WField
          label="Data selector (a CSS selector, or JSON)"
          htmlFor="task-data-selector"
        >
          <textarea
            id="task-data-selector"
            rows={8}
            cols={60}
            value={dataSelector}
            onChange={(e) => setDataSelector(e.target.value)}
            placeholder={
              'p.name\n\nor\n\n{ "div.card": { "name": "h6.card-title", "price": ".price" } }'
            }
            spellCheck={false}
            required
          />
        </WField>
      </div>

      {(inputError ?? error) && (
        <p role="alert">Error: {inputError ?? error}</p>
      )}

      <WButton type="submit" disabled={busy}>
        {submitting ? "Saving..." : task ? "Save changes" : "Add task"}
      </WButton>

      {onDelete && (
        <WButton
          disabled={busy}
          onClick={() => {
            if (window.confirm(`Delete "${task?.name}" and its snapshots?`))
              onDelete();
          }}
        >
          {deleting ? "Deleting..." : "Delete"}
        </WButton>
      )}
    </form>
  );
}

export default TaskForm;
