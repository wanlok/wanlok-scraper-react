import { useTasks } from "../hooks/useTasks";

function TaskList() {
  const { tasks, loading, error } = useTasks();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (tasks.length === 0) return <p>No tasks yet.</p>;

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <strong>{task.name}</strong>
          <div>{task.url}</div>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
