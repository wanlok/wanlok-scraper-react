import { HashRouter, Link, Route, Routes, useNavigate } from "react-router-dom";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

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

  return (
    <>
      <p>
        <Link to="/">Back</Link>
      </p>
      <TaskForm onCreated={() => navigate("/")} />
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
        </Routes>
      </main>
    </HashRouter>
  );
}

export default App;
