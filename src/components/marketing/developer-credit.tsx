export function DeveloperCredit({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs text-slate-500 ${className}`.trim()}>
      Developed by{" "}
      <a
        href="https://softalyn.com"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-slate-400 hover:text-teal-400 transition-colors"
      >
        Softalyn
      </a>
    </p>
  );
}
