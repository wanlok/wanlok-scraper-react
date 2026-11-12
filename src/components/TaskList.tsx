import { Link } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";
import { WError } from "./WError";
import { WLoading } from "./WLoading";

export const TaskList = () => {
  const { tasks, loading, error } = useTasks();

  if (loading) {
    return <WLoading />;
  }

  if (error) {
    return <WError error={error} />;
  }

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
