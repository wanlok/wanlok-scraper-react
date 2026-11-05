import type { ReactNode } from "react";

interface WFieldProps {
  label: string;
  // The id of the input or textarea in `children`, so the label is linked to it.
  htmlFor: string;
  children: ReactNode;
}

// A label with its input, one above the other.
function WField({ label, htmlFor, children }: WFieldProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 8,
      }}
    >
      <label htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  );
}

export default WField;
