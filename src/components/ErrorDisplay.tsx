/**
 * ErrorDisplay - User-friendly error message component
 * Shows icon, message, and optional retry button
 */

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
  type?: "error" | "warning";
}

export default function ErrorDisplay({
  message,
  onRetry,
  type = "error",
}: ErrorDisplayProps) {
  const isError = type === "error";

  return (
    <div
      className={`p-4 rounded-lg border ${
        isError
          ? "bg-red-50 border-red-300 text-red-800"
          : "bg-yellow-50 border-yellow-300 text-yellow-800"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{isError ? "❌" : "⚠️"}</span>
        <div className="flex-1">
          <p className="font-semibold mb-1">{isError ? "Error" : "Warning"}</p>
          <p className="text-sm">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className={`mt-3 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isError
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-yellow-600 hover:bg-yellow-700 text-white"
              }`}
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
