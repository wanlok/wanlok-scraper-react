import { Link } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";
import type { Task } from "../types";
import { WError } from "./WError";
import { WLoading } from "./WLoading";

interface TaskListProps {
  tasks: Task[];
}

const TaskList = ({ tasks }: TaskListProps) => {
  if (tasks.length === 0) {
    return <p>No tasks yet.</p>;
  }

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Link to={`/tasks/${task.id}`}>
            <strong>{task.name}</strong>
            <div>{task.url}</div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export const TaskListPage = () => {
  const { tasks, loading, error } = useTasks();

  if (loading) {
    return <WLoading />;
  }

  if (error) {
    return <WError error={error} />;
  }

  return (
    <>
      <p>
        <Link to="/tasks/new">Add task</Link>
      </p>
      <TaskList tasks={tasks} />
    </>
  );
};
