import Link from "next/link";

export type SeoLink = { label: string; href: string };

const DEFAULT_CLUSTER: SeoLink[] = [
  { label: "Investment management", href: "/investment-management" },
  { label: "Wealth management", href: "/wealth-management" },
  { label: "Portfolio management", href: "/portfolio-management" },
  { label: "Investment advisory", href: "/investment-advisory" },
  { label: "Financial planning", href: "/financial-planning" },
  { label: "Serving Texas", href: "/serving-texas" },
  { label: "Dallas", href: "/serving-texas/dallas" },
  { label: "Houston", href: "/serving-texas/houston" },
  { label: "Guides", href: "/guides" },
  { label: "Rates", href: "/rates" },
];

/** Shared internal-link cluster for topical SEO strength */
export function SeoRelatedLinks({
  title = "Explore AWS Vision",
  links,
}: {
  title?: string;
  links?: SeoLink[];
}) {
  const items = links?.length ? links : DEFAULT_CLUSTER;
  return (
    <aside className="border-t border-slate-200 bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {items.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="inline-flex rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 transition hover:border-teal-300 hover:text-teal-800"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
