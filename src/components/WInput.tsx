import {
  useLayoutEffect,
  useRef,
  type TextareaHTMLAttributes,
} from "react";

export const WInput = ({
  style,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const fitHeight = () => {
      const element = ref.current;
      if (!element) {
        return;
      }
      element.style.height = "auto";
      const border = element.offsetHeight - element.clientHeight;
      element.style.height = `${element.scrollHeight + border}px`;
    };

    fitHeight();
    window.addEventListener("resize", fitHeight);
    return () => window.removeEventListener("resize", fitHeight);
  }, [props.value]);

  return (
    <textarea
      style={{
        width: "100%",
        boxSizing: "border-box",
        resize: "none",
        overflow: "hidden",
        ...style,
      }}
      {...props}
      ref={ref}
    />
  );
};
