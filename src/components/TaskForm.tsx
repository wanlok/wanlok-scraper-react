import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  parseObject,
  stringifySelector,
  toTaskInput,
  type TaskFields,
  type YesNo,
} from "../taskFields";
import type { DataSelector, Task, TaskInput } from "../types";
import { WButton } from "./WButton";
import { WField } from "./WField";
import { WInput } from "./WInput";
import { WRadioGroup } from "./WRadioGroup";

const scheduledOptions: { value: YesNo; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

interface TaskFormProps {
  // Give a task to edit it; leave it out to add a new one.
  task?: Task;
  // What the fields hold. The page owns them, so they survive while the form is not shown.
  fields: TaskFields;
  onFieldsChange: (fields: TaskFields) => void;
  onSubmit: (input: TaskInput) => void | Promise<void>;
  submitting: boolean;
  error: string | null;
  // Shows a Delete button (after a confirmation). Only makes sense when editing.
  onDelete?: () => void | Promise<void>;
  deleting?: boolean;
}

export const TaskForm = ({
  task,
  fields,
  onFieldsChange,
  onSubmit,
  submitting,
  error,
  onDelete,
  deleting = false,
}: TaskFormProps) => {
  const { name, url, pageSelector, dataSelector, scheduled } = fields;
  const setName = (value: string) => onFieldsChange({ ...fields, name: value });
  const setUrl = (value: string) => onFieldsChange({ ...fields, url: value });
  const setPageSelector = (value: string) =>
    onFieldsChange({ ...fields, pageSelector: value });
  const setDataSelector = (value: string) =>
    onFieldsChange({ ...fields, dataSelector: value });
  const setScheduled = (value: YesNo) =>
    onFieldsChange({ ...fields, scheduled: value });
  const [inputError, setInputError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    try {
      const value = parseObject(await file.text(), file.name);
      onFieldsChange({
        name: typeof value.name === "string" ? value.name : "",
        url: typeof value.url === "string" ? value.url : "",
        pageSelector: stringifySelector(
          value.page_selector as Record<string, string>,
        ),
        dataSelector: stringifySelector(value.data_selector as DataSelector),
        scheduled: value.scheduled === false ? "no" : "yes",
      });
      setInputError(null);
    } catch (e) {
      setInputError(e instanceof Error ? e.message : String(e));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    let input: TaskInput;
    try {
      input = toTaskInput(fields);
    } catch (e) {
      setInputError(e instanceof Error ? e.message : String(e));
      return;
    }

    setInputError(null);
    await onSubmit(input);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ paddingLeft: 16, paddingRight: 16 }}>
        <h2>{task ? "Edit task" : "Add task"}</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <WField label="Name" htmlFor="task-name">
            <WInput
              id="task-name"
              rows={1}
              cols={60}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </WField>

          <WField label="URL" htmlFor="task-url">
            <WInput
              id="task-url"
              rows={1}
              cols={60}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://"
              spellCheck={false}
              required
            />
          </WField>

          <WField
            label="Page selector (optional, JSON)"
            htmlFor="task-page-selector"
          >
            <WInput
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
            <WInput
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

          <WField label="Scheduled" htmlFor="scheduled-yes">
            <WRadioGroup
              name="scheduled"
              options={scheduledOptions}
              value={scheduled}
              onChange={setScheduled}
            />
          </WField>

          {(inputError ?? error) && (
            <p role="alert">Error: {inputError ?? error}</p>
          )}

          <div>
            {!task && (
              <>
                <WButton
                  disabled={submitting}
                  onClick={() => fileInput.current?.click()}
                >
                  Import
                </WButton>
                <input
                  ref={fileInput}
                  type="file"
                  accept="application/json,.json"
                  onChange={handleImport}
                  hidden
                />
              </>
            )}

            <WButton type="submit" disabled={submitting || deleting}>
              {submitting ? "Saving..." : "Save"}
            </WButton>

            {onDelete && (
              <WButton
                disabled={submitting || deleting}
                onClick={() => {
                  if (
                    window.confirm(`Delete "${task?.name}" and its snapshots?`)
                  ) {
                    onDelete();
                  }
                }}
              >
                {deleting ? "Deleting..." : "Delete"}
              </WButton>
            )}

            {task && (
              <WButton
                disabled={submitting || deleting}
                onClick={() => {
                  window.location.href = `/api/tasks/${encodeURIComponent(task.id)}/export`;
                }}
              >
                Export
              </WButton>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};
