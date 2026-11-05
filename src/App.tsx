import { HashRouter, Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import { useTask } from "./hooks/useTask";
import type { TaskInput } from "./types";

const TasksPage = () => {
  return (
    <>
      <p>
        <Link to="/tasks/new">Add task</Link>
      </p>
      <TaskList />
    </>
  );
};

const NewTaskPage = () => {
  const navigate = useNavigate();
  const { save, saving, saveError } = useTask();

  const handleSubmit = async (input: TaskInput) => {
    if (await save(input)) navigate("/");
  };

  return (
    <>
      <p>
        <Link to="/">Back</Link>
      </p>
      <TaskForm onSubmit={handleSubmit} submitting={saving} error={saveError} />
    </>
  );
};

const EditTaskPage = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { task, loading, error, save, saving, saveError, remove, removing, removeError } = useTask(id);

  const handleSubmit = async (input: TaskInput) => {
    if (await save(input)) navigate("/");
  };

  const handleDelete = async () => {
    if (await remove()) navigate("/");
  };

  return (
    <>
      <p>
        <Link to="/">Back</Link>
      </p>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {task && (
        <TaskForm
          key={task.id}
          task={task}
          onSubmit={handleSubmit}
          submitting={saving}
          error={saveError ?? removeError}
          onDelete={handleDelete}
          deleting={removing}
        />
      )}
    </>
  );
};

// HashRouter: the phone's server only serves "/", so routes live after the "#".
const App = () => {
  return (
    <HashRouter>
      <main>
        <h1>Scraper</h1>
        <Routes>
          <Route path="/" element={<TasksPage />} />
          <Route path="/tasks/new" element={<NewTaskPage />} />
          <Route path="/tasks/:id" element={<EditTaskPage />} />
        </Routes>
      </main>
    </HashRouter>
  );
};

export default App;
