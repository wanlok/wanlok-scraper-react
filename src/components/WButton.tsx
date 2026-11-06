import type { ButtonHTMLAttributes } from "react";

export const WButton = ({
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return <button type={type} {...props} />;
};
