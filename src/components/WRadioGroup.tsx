interface WRadioGroupOption<T extends string> {
  value: T;
  label: string;
}

interface WRadioGroupProps<T extends string> {
  name: string;
  options: WRadioGroupOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
}

export const WRadioGroup = <T extends string>({
  name,
  options,
  value,
  onChange,
  disabled,
}: WRadioGroupProps<T>) => {
  return (
    <div role="radiogroup" style={{ display: "flex", gap: 16 }}>
      {options.map((option) => (
        <label key={option.value}>
          <input
            id={`${name}-${option.value}`}
            type="radio"
            name={name}
            value={option.value}
            checked={option.value === value}
            onChange={() => onChange(option.value)}
            disabled={disabled}
          />{" "}
          {option.label}
        </label>
      ))}
    </div>
  );
};
