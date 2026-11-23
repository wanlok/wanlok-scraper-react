import { useState, type ButtonHTMLAttributes, type CSSProperties } from "react";
import type { WStyle } from "../types";

export const clearStyle: WStyle = {
  regular: {
    appearance: "none",
    background: "none",
    border: "none",
    borderRadius: 0,
    margin: 0,
    padding: 0,
    font: "inherit",
    color: "inherit",
    cursor: "pointer",
  },
};

export const tabStyle: WStyle = {
  regular: {
    ...clearStyle.regular,
    paddingLeft: 16,
    paddingRight: 16,
    height: 40,
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
  },
  hover: {
    backgroundColor: "#DDDDDD",
  },
};

export const selectedTabStyle: WStyle = {
  regular: {
    ...tabStyle.regular,
    borderTop: "black solid 1px",
    borderLeft: "black solid 1px",
    borderRight: "black solid 1px",
  },
  hover: tabStyle.hover,
};

interface WButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  wStyle?: WStyle;
}

export const WButton = ({
  type = "button",
  wStyle,
  style,
  ...props
}: WButtonProps) => {
  const [hovered, setHovered] = useState(false);
  const resetHover = Object.fromEntries(
    Object.keys(wStyle?.hover ?? {}).map((key) => [key, "unset"]),
  ) as CSSProperties;

  return (
    <button
      type={type}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...resetHover,
        ...wStyle?.regular,
        ...(hovered && !props.disabled ? wStyle?.hover : undefined),
        ...style,
      }}
      {...props}
    />
  );
};
