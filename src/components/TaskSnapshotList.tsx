import type { Snapshot } from "../types";

interface TaskSnapshotListProps {
  snapshots: Snapshot[];
}

export const TaskSnapshotList = ({ snapshots }: TaskSnapshotListProps) => {
  if (snapshots.length === 0) {
    return <p>Nothing has been scraped yet.</p>;
  }

  return <pre>{JSON.stringify(snapshots, null, 2)}</pre>;
};
