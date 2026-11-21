import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTask } from "../hooks/useTask";
import type { TaskInput } from "../types";
import { TaskForm } from "./TaskForm";
import { TaskSnapshotList } from "./TaskSnapshotList";
import { WButton } from "./WButton";
import { WError } from "./WError";
import { WLoading } from "./WLoading";
import { WTabList } from "./WTabList";

type Tab = "snapshots" | "edit";

const TABS: { value: Tab; label: string }[] = [
  { value: "snapshots", label: "Snapshots" },
  { value: "edit", label: "Edit task" },
];

export const TaskPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab: Tab = searchParams.get("tab") === "edit" ? "edit" : "snapshots";
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
    run,
    running,
    runError,
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

  const form = (
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

  // A new task has nothing scraped yet, so it only gets the form.
  if (!task) {
    return form;
  }

  return (
    <>
      <WTabList
        tabs={TABS}
        value={tab}
        onChange={(value) =>
          setSearchParams(value === "snapshots" ? {} : { tab: value }, {
            replace: true,
          })
        }
      />
      {tab === "snapshots" ? (
        <>
          <WButton onClick={run} disabled={running}>
            Run
          </WButton>
          {runError && <WError error={runError} />}
          <TaskSnapshotList snapshots={task.snapshots ?? []} />
        </>
      ) : (
        form
      )}
    </>
  );
};
