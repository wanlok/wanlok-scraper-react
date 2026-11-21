import type { ReactNode } from "react";

interface WTabPanelProps {
  id: string;
  value: string;
  children: ReactNode;
}

export const WTabPanel = ({ id, value, children }: WTabPanelProps) => {
  return (
    <div
      role="tabpanel"
      id={`${id}-panel-${value}`}
      aria-labelledby={`${id}-tab-${value}`}
      tabIndex={0}
    >
      {children}
    </div>
  );
};
