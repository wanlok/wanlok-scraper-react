import type { Snapshot } from "../types";

interface TaskSnapshotListProps {
  snapshots: Snapshot[];
}

export const TaskSnapshotList = ({ snapshots }: TaskSnapshotListProps) => {
  if (snapshots.length === 0) {
    return <p>Nothing has been scraped yet.</p>;
  }

  return (
    <ul>
      {snapshots.map((snapshot) => (
        <li key={snapshot.date}>
          <details>
            <summary style={{ background: "#EEEEEE" }}>
              <span style={{ display: "block" }}>
                {new Date(snapshot.date).toLocaleString()}
              </span>
              <span style={{ display: "block" }}>{snapshot.status}</span>
            </summary>
            <pre>
              {JSON.stringify(snapshot.error ?? snapshot.data, null, 2)}
            </pre>
          </details>
        </li>
      ))}
    </ul>
  );
};
