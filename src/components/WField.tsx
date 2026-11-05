import type { ReactNode } from "react";

interface WFieldProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
}

const WField = ({ label, htmlFor, children }: WFieldProps) => {
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
};

export default WField;
