import type { Snapshot } from "../types";

interface TaskSnapshotListProps {
  snapshots: Snapshot[];
}

export const TaskSnapshotList = ({ snapshots }: TaskSnapshotListProps) => {
  if (snapshots.length === 0) {
    return <p>Nothing has been scraped yet.</p>;
  }

  return (
    <ul
      style={{
        listStyle: "none",
        paddingLeft: 0,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      {snapshots.map((snapshot) => (
        <li key={snapshot.date}>
          <details>
            <summary
              style={{
                background: "#EEEEEE",
                padding: "16px",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  verticalAlign: "top",
                  marginLeft: "4px",
                }}
              >
                <span style={{ display: "block" }}>
                  {new Date(snapshot.date).toLocaleString()}
                </span>
                <span style={{ display: "block" }}>{snapshot.status}</span>
                {snapshot.data && (
                  <span style={{ display: "block" }}>
                    {snapshot.data.length === 1
                      ? "1 item"
                      : `${snapshot.data.length} items`}
                  </span>
                )}
              </span>
            </summary>
            <div style={{ background: "#DDDDDD", padding: "16px" }}>
              <pre style={{ margin: 0 }}>
                {JSON.stringify(snapshot.error ?? snapshot.data, null, 2)}
              </pre>
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
};
