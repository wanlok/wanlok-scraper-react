import { useState, type ButtonHTMLAttributes } from "react";
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
    backgroundColor: "#EEEEEE",
  },
  hover: {
    backgroundColor: "#DDDDDD",
  },
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

  return (
    <button
      type={type}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...wStyle?.regular,
        ...(hovered && !props.disabled ? wStyle?.hover : undefined),
        ...style,
      }}
      {...props}
    />
  );
};
