import type { KeyboardEvent } from "react";
import { selectedTabStyle, tabStyle, WButton } from "./WButton";

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
    document.getElementById(`${id}-tab-${tabs[next].value}`)?.focus();
  };

  return (
    <div role="tablist" style={{ display: "flex" }}>
      {tabs.map((tab, index) => {
        const selected = tab.value === value;
        return (
          <WButton
            key={tab.value}
            id={`${id}-tab-${tab.value}`}
            role="tab"
            aria-selected={selected}
            aria-controls={`${id}-panel-${tab.value}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            wStyle={selected ? selectedTabStyle : tabStyle}
            style={
              {
                // borderBottom: `4px solid ${selected ? "#000000" : "transparent"}`,
              }
            }
          >
            {tab.label}
          </WButton>
        );
      })}
    </div>
  );
};
