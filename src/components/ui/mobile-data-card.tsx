import { cn } from "@/lib/utils";

export interface MobileDataField {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}

interface MobileDataCardProps {
  title: React.ReactNode;
  fields: MobileDataField[];
  badge?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

/** Stacked field card for tables on phone / small tablet */
export function MobileDataCard({
  title,
  fields,
  badge,
  className,
  onClick,
  selected,
}: MobileDataCardProps) {
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-colors",
        selected && "border-teal-500 bg-teal-50 ring-2 ring-teal-500/20",
        onClick && "cursor-pointer hover:border-slate-300",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="font-semibold text-slate-900 leading-snug">{title}</div>
        {badge}
      </div>
      <dl className="mt-3 space-y-2">
        {fields.map((field) => (
          <div key={field.label} className="flex items-start justify-between gap-3 text-sm">
            <dt className="shrink-0 text-slate-500">{field.label}</dt>
            <dd
              className={cn(
                "text-right font-medium text-slate-900 break-words",
                field.highlight && "font-bold text-teal-700"
              )}
            >
              {field.value}
            </dd>
          </div>
        ))}
      </dl>
    </Tag>
  );
}
