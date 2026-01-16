interface LoadingSpinnerProps {
  text?: string;
}

const LoadingSpinner = ({ text = "로딩 중..." }: LoadingSpinnerProps) => {
  return (
    <div className="w-full flex justify-center items-center py-10">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: "var(--accent-primary)" }}></div>
        <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {text}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
