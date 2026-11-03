import { useState } from "react";
import type { Task, TaskInput } from "../types";

interface UseCreateTask {
  createTask: (input: TaskInput) => Promise<Task | null>;
  submitting: boolean;
  error: string | null;
}

// POST /api/tasks. Returns the created task, or null if it failed (see `error`).
export function useCreateTask(): UseCreateTask {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createTask(input: TaskInput): Promise<Task | null> {
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? `HTTP ${response.status}`);
      }
      return (await response.json()) as Task;
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      return null;
    } finally {
      setSubmitting(false);
    }
  }

  return { createTask, submitting, error };
}
