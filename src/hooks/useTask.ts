import { useEffect, useState } from "react";
import type { Task, TaskInput } from "../types";

interface UseTask {
  task: Task | null;
  loading: boolean;
  error: string | null;
  // POST /api/tasks, or PUT /api/tasks/{id} when the hook has an id.
  // Returns the saved task, or null if it failed (see `saveError`).
  save: (input: TaskInput) => Promise<Task | null>;
  saving: boolean;
  saveError: string | null;
  // DELETE /api/tasks/{id}. Returns true if the task was deleted (see `removeError`).
  remove: () => Promise<boolean>;
  removing: boolean;
  removeError: string | null;
}

const errorMessage = async (response: Response): Promise<string> => {
  const body = await response.json().catch(() => null);
  return body?.error ?? `HTTP ${response.status}`;
};

// With an id, loads that task (GET /api/tasks/{id}, ignoring its snapshots) so it can be edited.
// Without one, there is nothing to load and `save` adds a new task.
export const useTask = (id?: string): UseTask => {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(id !== undefined);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);

  useEffect(() => {
    if (id === undefined) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`/api/tasks/${encodeURIComponent(id)}`, { signal: controller.signal })
      .then(async (response) => {
        if (response.status === 404) throw new Error("Task not found");
        if (!response.ok) throw new Error(await errorMessage(response));
        return response.json() as Promise<Task>;
      })
      .then((data) => {
        setTask(data);
        setLoading(false);
      })
      .catch((e: Error) => {
        if (e.name === "AbortError") return;
        setError(e.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  const save = async (input: TaskInput): Promise<Task | null> => {
    setSaving(true);
    setSaveError(null);
    try {
      const response = await fetch(id === undefined ? "/api/tasks" : `/api/tasks/${encodeURIComponent(id)}`, {
        method: id === undefined ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!response.ok) throw new Error(await errorMessage(response));
      return (await response.json()) as Task;
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : String(e));
      return null;
    } finally {
      setSaving(false);
    }
  };

  const remove = async (): Promise<boolean> => {
    if (id === undefined) return false;
    setRemoving(true);
    setRemoveError(null);
    try {
      const response = await fetch(`/api/tasks/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!response.ok) throw new Error(await errorMessage(response));
      return true;
    } catch (e) {
      setRemoveError(e instanceof Error ? e.message : String(e));
      return false;
    } finally {
      setRemoving(false);
    }
  };

  return { task, loading, error, save, saving, saveError, remove, removing, removeError };
};
