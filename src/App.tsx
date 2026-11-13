import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { TaskPage } from "./components/TaskPage";
import { TaskFormPage } from "./components/TaskFormPage";

// HashRouter: the phone's server only serves "/", so routes live after the "#".
export const App = () => {
  return (
    <HashRouter>
      <main>
        <Routes>
          <Route path="/" element={<TaskPage />} />
          <Route path="/tasks/new" element={<TaskFormPage />} />
          <Route path="/tasks/:id" element={<TaskFormPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </HashRouter>
  );
};
