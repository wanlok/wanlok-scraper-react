import { HashRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import { TaskList } from "./components/TaskList";
import { TaskFormPage } from "./components/TaskFormPage";

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

// HashRouter: the phone's server only serves "/", so routes live after the "#".
export const App = () => {
  return (
    <HashRouter>
      <main>
        <Routes>
          <Route path="/" element={<TasksPage />} />
          <Route path="/tasks/new" element={<TaskFormPage />} />
          <Route path="/tasks/:id" element={<TaskFormPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </HashRouter>
  );
};
