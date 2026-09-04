import React, { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught React Error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#F5F4EF" }}>
          <div className="max-w-md w-full rounded-2xl p-8 text-center" style={{ background: "#FFFFFF", boxShadow: "0 12px 32px rgba(0,0,0,0.08)", border: "1px solid #EDEAE6" }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(200,134,10,0.10)" }}>
              <AlertTriangle size={28} color="#C8860A" />
            </div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1A1A1A", fontFamily: "var(--font-label)" }}>
              Something went wrong
            </h2>
            <p style={{ fontSize: "13px", color: "#6B7280", fontFamily: "var(--font-label)", marginTop: "6px" }}>
              {this.state.error?.message || "An unexpected error occurred while rendering this page."}
            </p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl transition-all active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #C8860A 0%, #D99A20 100%)", color: "#FFFFFF", fontSize: "13px", fontWeight: 600, fontFamily: "var(--font-label)" }}
            >
              <RefreshCw size={14} />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
