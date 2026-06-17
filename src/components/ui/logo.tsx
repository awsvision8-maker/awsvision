import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site-data";

const SIZES = {
  xs: "h-8 w-auto",
  sm: "h-10 w-auto",
  md: "h-12 w-auto",
  lg: "h-16 w-auto",
  xl: "h-20 w-auto",
} as const;

interface LogoProps {
  size?: keyof typeof SIZES;
  className?: string;
  href?: string | null;
  priority?: boolean;
}

export function Logo({
  size = "sm",
  className,
  href = "/",
  priority = false,
}: LogoProps) {
  const image = (
    <Image
      src="/logo.png"
      alt={`${SITE.name} — ${SITE.tagline}`}
      width={512}
      height={512}
      priority={priority}
      className={cn(SIZES[size], "object-contain", className)}
    />
  );

  if (href === null) {
    return image;
  }

  return (
    <Link href={href} className="inline-flex shrink-0 items-center">
      {image}
    </Link>
  );
}
