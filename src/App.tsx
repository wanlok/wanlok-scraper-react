import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { TaskListPage } from "./components/TaskListPage";
import { TaskPage } from "./components/TaskPage";

// HashRouter: the phone's server only serves "/", so routes live after the "#".
export const App = () => {
  return (
    <HashRouter>
      <main>
        <Routes>
          <Route path="/" element={<TaskListPage />} />
          <Route path="/tasks/new" element={<TaskPage />} />
          <Route path="/tasks/:id" element={<TaskPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </HashRouter>
  );
};
