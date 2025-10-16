/**
 * LoadingSteps - Shows step-by-step progress for multi-step operations
 */

interface Step {
  label: string;
  status: "pending" | "active" | "complete";
}

interface LoadingStepsProps {
  steps: Step[];
}

export default function LoadingSteps({ steps }: LoadingStepsProps) {
  return (
    <div className="p-4 bg-blue-50 border border-blue-300 rounded-lg">
      <div className="space-y-2">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-3">
            {step.status === "complete" && (
              <span className="text-green-600 text-xl">✓</span>
            )}
            {step.status === "active" && (
              <span className="text-blue-600 text-xl animate-pulse">●</span>
            )}
            {step.status === "pending" && (
              <span className="text-gray-400 text-xl">○</span>
            )}
            <span
              className={`text-sm ${
                step.status === "complete"
                  ? "text-green-700 font-semibold"
                  : step.status === "active"
                  ? "text-blue-700 font-semibold"
                  : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
