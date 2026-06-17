import { Suspense } from "react";
import NonprofitSignupContent from "./nonprofit-signup-content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/signup/nonprofit");

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
