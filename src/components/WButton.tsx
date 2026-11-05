import type { ButtonHTMLAttributes } from "react";

const WButton = ({
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return <button type={type} {...props} />;
};

export default WButton;
