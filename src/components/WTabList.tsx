import { WButton } from "./WButton";

interface WTabListTab<T extends string> {
  value: T;
  label: string;
}

interface WTabListProps<T extends string> {
  tabs: WTabListTab<T>[];
  value: T;
  onChange: (value: T) => void;
}

export const WTabList = <T extends string>({
  tabs,
  value,
  onChange,
}: WTabListProps<T>) => {
  return (
    <div role="tablist">
      {tabs.map((tab) => (
        <WButton
          key={tab.value}
          role="tab"
          aria-selected={tab.value === value}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </WButton>
      ))}
    </div>
  );
};
