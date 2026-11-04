import { HashRouter, Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import { useTask } from "./hooks/useTask";
import type { TaskInput } from "./types";

function TasksPage() {
  return (
    <>
      <p>
        <Link to="/tasks/new">Add task</Link>
      </p>
      <TaskList />
    </>
  );
}

function NewTaskPage() {
  const navigate = useNavigate();
  const { save, saving, saveError } = useTask();

  async function handleSubmit(input: TaskInput) {
    if (await save(input)) navigate("/");
  }

  return (
    <>
      <p>
        <Link to="/">Back</Link>
      </p>
      <TaskForm onSubmit={handleSubmit} submitting={saving} error={saveError} />
    </>
  );
}

function EditTaskPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { task, loading, error, save, saving, saveError } = useTask(id);

  async function handleSubmit(input: TaskInput) {
    if (await save(input)) navigate("/");
  }

  return (
    <>
      <p>
        <Link to="/">Back</Link>
      </p>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {task && (
        <TaskForm key={task.id} task={task} onSubmit={handleSubmit} submitting={saving} error={saveError} />
      )}
    </>
  );
}

// HashRouter: the phone's server only serves "/", so routes live after the "#".
function App() {
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
}

export default App;
