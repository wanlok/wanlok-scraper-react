import { useNavigate, useParams } from "react-router-dom";
import { useTask } from "../hooks/useTask";
import type { TaskInput } from "../types";
import { TaskForm } from "./TaskForm";
import { WError } from "./WError";
import { WLoading } from "./WLoading";

export const TaskPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    task,
    loading,
    error,
    save,
    saving,
    saveError,
    remove,
    removing,
    removeError,
  } = useTask(id);

  const handleSubmit = async (input: TaskInput) => {
    if (await save(input)) {
      navigate("/");
    }
  };

  const handleDelete = async () => {
    if (await remove()) {
      navigate("/");
    }
  };

  if (loading) {
    return <WLoading />;
  }

  if (error) {
    return <WError error={error} />;
  }

  return (
    <TaskForm
      key={task?.id}
      task={task ?? undefined}
      onSubmit={handleSubmit}
      submitting={saving}
      error={saveError ?? removeError}
      onDelete={task ? handleDelete : undefined}
      deleting={removing}
    />
  );
};
