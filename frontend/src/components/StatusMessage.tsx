type StatusMessageProps = {
    tone?: "neutral" | "error" | "warning";
    children: React.ReactNode;
};

const toneStyles = {
    neutral: "border-gray-50 bg-gray-50 text-gray-600",
    warning: "border-amber-100 bg-amber-100 text-amber-600",
    error: "border-red-100 bg-red-100 text-red-600",
};

export function StatusMessage({
    tone = "neutral",
    children,
}: StatusMessageProps) {
    return (
        <div
            className={`rounded-full border p-10 text-center text-lg font-medium ${toneStyles[tone]}`}
        >
            {children}

        </div>
    );
}
