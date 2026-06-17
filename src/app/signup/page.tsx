import { Suspense } from "react";
import SignupPageContent from "./signup-page-content";

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
          Loading application…
        </div>
      }
    >
      <SignupPageContent />
    </Suspense>
  );
}
