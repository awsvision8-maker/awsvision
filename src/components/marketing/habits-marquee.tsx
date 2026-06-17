import Link from "next/link";
import { BETTER_MONEY_HABITS } from "@/lib/boa-content";
import { cn } from "@/lib/utils";

function HabitCard({
  item,
  className,
}: {
  item: (typeof BETTER_MONEY_HABITS)[number];
  className?: string;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "group block w-[min(100%,280px)] shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white hover:shadow-lg transition-shadow sm:w-[300px]",
        className
      )}
    >
      <div className={cn("relative flex h-36 items-center justify-center overflow-hidden", item.image)}>
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 40%)",
          }}
        />
        <Icon
          className="relative h-14 w-14 text-white/95 drop-shadow-lg transition-transform group-hover:scale-110"
          strokeWidth={1.5}
          aria-hidden
        />
      </div>
      <div className="p-4">
        <p className="text-sm font-medium leading-snug text-slate-900 group-hover:text-teal-700">
          {item.title}
        </p>
      </div>
    </Link>
  );
}

/** Continuous smooth auto-scroll marquee for Better Money Habits cards */
export function HabitsMarquee() {
  const items = [...BETTER_MONEY_HABITS, ...BETTER_MONEY_HABITS];

  return (
    <div
      className="relative overflow-hidden"
      aria-label="Financial education articles"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent sm:w-16" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent sm:w-16" />

      <div className="habits-marquee-track flex w-max gap-4 py-1">
        {items.map((item, index) => (
          <HabitCard key={`${item.title}-${index}`} item={item} />
        ))}
      </div>
    </div>
  );
}
