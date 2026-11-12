interface WErrorProps {
  error: string;
}

export const WError = ({ error }: WErrorProps) => {
  return <p role="alert">Error: {error}</p>;
};
