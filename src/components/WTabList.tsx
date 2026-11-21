import type { KeyboardEvent, ReactNode } from "react";
import { WButton } from "./WButton";

interface WTabListTab<T extends string> {
  value: T;
  label: string;
}

interface WTabListProps<T extends string> {
  id: string;
  tabs: WTabListTab<T>[];
  value: T;
  onChange: (value: T) => void;
}

const tabId = (id: string, value: string) => `${id}-tab-${value}`;

const panelId = (id: string, value: string) => `${id}-panel-${value}`;

export const WTabList = <T extends string>({
  id,
  tabs,
  value,
  onChange,
}: WTabListProps<T>) => {
  const handleKeyDown = (event: KeyboardEvent, index: number) => {
    let next: number;
    switch (event.key) {
      case "ArrowRight":
        next = (index + 1) % tabs.length;
        break;
      case "ArrowLeft":
        next = (index - 1 + tabs.length) % tabs.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = tabs.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    onChange(tabs[next].value);
    document.getElementById(tabId(id, tabs[next].value))?.focus();
  };

  return (
    <div role="tablist">
      {tabs.map((tab, index) => {
        const selected = tab.value === value;
        return (
          <WButton
            key={tab.value}
            id={tabId(id, tab.value)}
            role="tab"
            aria-selected={selected}
            aria-controls={panelId(id, tab.value)}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {tab.label}
          </WButton>
        );
      })}
    </div>
  );
};

interface WTabPanelProps {
  id: string;
  value: string;
  children: ReactNode;
}

export const WTabPanel = ({ id, value, children }: WTabPanelProps) => {
  return (
    <div
      role="tabpanel"
      id={panelId(id, value)}
      aria-labelledby={tabId(id, value)}
      tabIndex={0}
    >
      {children}
    </div>
  );
};
