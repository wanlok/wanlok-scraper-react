import { useState, type FormEvent } from "react";
import { useCreateTask } from "../hooks/useCreateTask";
import type { DataSelector, TaskInput } from "../types";

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
  onCreated: () => void;
}

function TaskForm({ onCreated }: TaskFormProps) {
  const { createTask, submitting, error } = useCreateTask();

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [pageSelectors, setPageSelectors] = useState<Pair[]>([emptyPair]);
  const [dataMode, setDataMode] = useState<DataMode>("text");
  const [textSelector, setTextSelector] = useState("");
  const [container, setContainer] = useState("");
  const [fields, setFields] = useState<Pair[]>([emptyPair]);

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

    const created = await createTask(input);
    if (created) {
      setName("");
      setUrl("");
      setPageSelectors([emptyPair]);
      setTextSelector("");
      setContainer("");
      setFields([emptyPair]);
      onCreated();
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add task</h2>

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
        {submitting ? "Adding..." : "Add task"}
      </button>
    </form>
  );
}

export default TaskForm;
