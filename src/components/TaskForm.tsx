import { useState, type FormEvent } from "react";
import type { DataSelector, Task, TaskInput } from "../types";

interface Pair {
  key: string;
  value: string;
}

type DataMode = "text" | "fields";

const emptyPair: Pair = { key: "", value: "" };

function toRecord(pairs: Pair[]): Record<string, string> {
  const record: Record<string, string> = {};
  for (const { key, value } of pairs) {
    if (key.trim() && value.trim()) record[key.trim()] = value.trim();
  }
  return record;
}

function toPairs(record: Record<string, string> = {}): Pair[] {
  const pairs = Object.entries(record).map(([key, value]) => ({ key, value }));
  return pairs.length > 0 ? pairs : [emptyPair];
}

// A data selector is either a string, or an object with one container key.
function splitDataSelector(selector?: DataSelector) {
  if (typeof selector === "object") {
    const [container = "", fields = {}] = Object.entries(selector)[0] ?? [];
    return { mode: "fields" as DataMode, text: "", container, fields: toPairs(fields) };
  }
  return { mode: "text" as DataMode, text: selector ?? "", container: "", fields: toPairs() };
}

interface PairRowsProps {
  pairs: Pair[];
  keyPlaceholder: string;
  valuePlaceholder: string;
  onChange: (pairs: Pair[]) => void;
}

function PairRows({ pairs, keyPlaceholder, valuePlaceholder, onChange }: PairRowsProps) {
  function update(index: number, patch: Partial<Pair>) {
    onChange(pairs.map((pair, i) => (i === index ? { ...pair, ...patch } : pair)));
  }

  return (
    <div>
      {pairs.map((pair, index) => (
        <div key={index}>
          <input
            placeholder={keyPlaceholder}
            value={pair.key}
            onChange={(e) => update(index, { key: e.target.value })}
          />{" "}
          <input
            placeholder={valuePlaceholder}
            value={pair.value}
            onChange={(e) => update(index, { value: e.target.value })}
          />{" "}
          <button
            type="button"
            disabled={pairs.length === 1}
            onClick={() => onChange(pairs.filter((_, i) => i !== index))}
          >
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...pairs, emptyPair])}>
        Add
      </button>
    </div>
  );
}

interface TaskFormProps {
  // Give a task to edit it; leave it out to add a new one.
  // The fields start from the task, so use `key={task.id}` to show a different one.
  task?: Task;
  onSubmit: (input: TaskInput) => void | Promise<void>;
  submitting: boolean;
  error: string | null;
}

function TaskForm({ task, onSubmit, submitting, error }: TaskFormProps) {
  const initialData = splitDataSelector(task?.data_selector);

  const [name, setName] = useState(task?.name ?? "");
  const [url, setUrl] = useState(task?.url ?? "");
  const [pageSelectors, setPageSelectors] = useState<Pair[]>(toPairs(task?.page_selector));
  const [dataMode, setDataMode] = useState<DataMode>(initialData.mode);
  const [textSelector, setTextSelector] = useState(initialData.text);
  const [container, setContainer] = useState(initialData.container);
  const [fields, setFields] = useState<Pair[]>(initialData.fields);

  function buildDataSelector(): DataSelector {
    if (dataMode === "text") return textSelector.trim();
    return { [container.trim()]: toRecord(fields) };
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const input: TaskInput = {
      name: name.trim(),
      url: url.trim(),
      data_selector: buildDataSelector(),
    };
    const pageSelector = toRecord(pageSelectors);
    if (Object.keys(pageSelector).length > 0) input.page_selector = pageSelector;

    await onSubmit(input);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{task ? "Edit task" : "Add task"}</h2>

      <p>
        <label>
          Name <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
      </p>

      <p>
        <label>
          URL{" "}
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://"
            required
          />
        </label>
      </p>

      <fieldset>
        <legend>Page selector (optional)</legend>
        <PairRows
          pairs={pageSelectors}
          keyPlaceholder="Pagination links, e.g. .pagination a"
          valuePlaceholder="Page parameter, e.g. page"
          onChange={setPageSelectors}
        />
      </fieldset>

      <fieldset>
        <legend>Data selector</legend>
        <label>
          <input
            type="radio"
            checked={dataMode === "text"}
            onChange={() => setDataMode("text")}
          />{" "}
          Text
        </label>{" "}
        <label>
          <input
            type="radio"
            checked={dataMode === "fields"}
            onChange={() => setDataMode("fields")}
          />{" "}
          Fields
        </label>

        {dataMode === "text" ? (
          <p>
            <input
              placeholder="CSS selector, e.g. p.name"
              value={textSelector}
              onChange={(e) => setTextSelector(e.target.value)}
              required
            />
          </p>
        ) : (
          <div>
            <p>
              <input
                placeholder="Container selector, e.g. div.card"
                value={container}
                onChange={(e) => setContainer(e.target.value)}
                required
              />
            </p>
            <PairRows
              pairs={fields}
              keyPlaceholder="Field name, e.g. price"
              valuePlaceholder="Selector, e.g. .price"
              onChange={setFields}
            />
          </div>
        )}
      </fieldset>

      {error && <p role="alert">Error: {error}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : task ? "Save changes" : "Add task"}
      </button>
    </form>
  );
}

export default TaskForm;
