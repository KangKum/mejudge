import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="w-full h-screen flex flex-col justify-center items-center"
          style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
        >
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--text-emphasis)" }}>
            문제가 발생했습니다
          </h1>
          <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
            페이지를 표시하는 중 오류가 발생했습니다.
          </p>
          <button
            className="btn-primary px-6 py-2"
            onClick={() => window.location.reload()}
          >
            페이지 새로고침
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
