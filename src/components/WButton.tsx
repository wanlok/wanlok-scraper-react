import type { ButtonHTMLAttributes } from "react";

// Every button in the app goes through here, so the styles can be unified in one place.
// Unlike a bare <button>, it defaults to type="button" so it never submits a form by accident.
function WButton({
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} {...props} />;
}

export default WButton;
