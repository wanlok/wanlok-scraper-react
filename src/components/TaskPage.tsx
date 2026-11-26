import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTask } from "../hooks/useTask";
import type { TaskInput } from "../types";
import { TaskForm } from "./TaskForm";
import { TaskSnapshotList } from "./TaskSnapshotList";
import { WButton } from "./WButton";
import { WError } from "./WError";
import { WLoading } from "./WLoading";
import { WTabList } from "./WTabList";
import { WTabPanel } from "./WTabPanel";

type Tab = "snapshots" | "edit";


export const TaskPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isNew = id === undefined;
  const defaultTab: Tab = isNew ? "edit" : "snapshots";
  const tabParam = searchParams.get("tab");
  const tab: Tab =
    tabParam === "edit" || tabParam === "snapshots" ? tabParam : defaultTab;
  const tabs: { value: Tab; label: string }[] = [
    { value: "snapshots", label: "Snapshots" },
    { value: "edit", label: isNew ? "Add task" : "Edit task" },
  ];
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

  return (
    <>
      <WTabList
        id="task"
        tabs={tabs}
        value={tab}
        onChange={(value) =>
          setSearchParams(value === defaultTab ? {} : { tab: value })
        }
      />
      <WTabPanel id="task" value={tab}>
        {tab === "snapshots" ? (
          <>
            {task && (
              <WButton onClick={run} disabled={running}>
                Run
              </WButton>
            )}
            {runError && <WError error={runError} />}
            <TaskSnapshotList snapshots={task?.snapshots ?? []} />
          </>
        ) : (
          form
        )}
      </WTabPanel>
    </>
  );
};
