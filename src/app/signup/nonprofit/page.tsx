import { Suspense } from "react";
import NonprofitSignupContent from "./nonprofit-signup-content";

export default function NonprofitSignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
          Loading application…
        </div>
      }
    >
      <NonprofitSignupContent />
    </Suspense>
  );
}
