import { Apple } from "lucide-react";
import { cn } from "@/lib/utils";

function GooglePlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3.6 1.8c-.3.2-.6.6-.6 1.1v18.2c0 .5.3.9.6 1.1l.1.1 10.2-10.2v-.2L3.7 1.7l-.1.1z" />
      <path d="M16.9 12.9 6.7 23.1c.4.2.9.2 1.4-.1l11.5-6.6-2.7-3.5z" />
      <path d="M20.6 10.4 18.1 8.5 15.2 11.4l1.7 1.7 3.7-2.7z" />
      <path d="M6.7.9c-.5-.3-1-.3-1.4-.1l11.5 6.6 2.9-2.9L7.5.8c-.3-.2-.6-.2-.8.1z" />
    </svg>
  );
}

interface AppStoreBadgesProps {
  className?: string;
  appStoreHref?: string;
  playStoreHref?: string;
}

export function AppStoreBadges({
  className,
  appStoreHref = "#",
  playStoreHref = "#",
}: AppStoreBadgesProps) {
  const badgeClass =
    "inline-flex items-center gap-3 rounded-xl bg-white px-5 py-3 text-slate-900 shadow-sm hover:bg-slate-100 transition-colors min-w-[168px]";

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <a href={appStoreHref} className={badgeClass} aria-label="Download on the App Store">
        <Apple className="h-8 w-8 shrink-0" strokeWidth={1.25} />
        <div className="text-left">
          <p className="text-[10px] font-medium leading-tight text-slate-600">Download on the</p>
          <p className="text-base font-semibold leading-tight">App Store</p>
        </div>
      </a>
      <a href={playStoreHref} className={badgeClass} aria-label="Get it on Google Play">
        <GooglePlayIcon className="h-7 w-7 shrink-0" />
        <div className="text-left">
          <p className="text-[10px] font-medium leading-tight text-slate-600">Get it on</p>
          <p className="text-base font-semibold leading-tight">Google Play</p>
        </div>
      </a>
    </div>
  );
}
