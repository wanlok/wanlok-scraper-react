import { useEffect, useState } from "react";
import type { Task } from "../types";

interface UseTasks {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export const useTasks = (): UseTasks => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/tasks", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<Task[]>;
      })
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((e: Error) => {
        if (e.name === "AbortError") return;
        setError(e.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { tasks, loading, error };
};
