import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");

export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cx("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)} {...props} />;
}

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50";

const buttonVariants = {
  primary: "bg-plum-700 text-white shadow-[0_8px_24px_-10px_rgb(103_38_128/0.7)] hover:bg-plum-800",
  secondary: "bg-white text-plum-800 ring-1 ring-plum-200 hover:bg-plum-50 hover:ring-plum-300",
  light: "bg-white text-plum-800 hover:bg-plum-50",
  ghost: "text-plum-700 hover:bg-plum-50",
} as const;

const buttonSizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-13 px-7 text-base",
} as const;

type ButtonStyle = { variant?: keyof typeof buttonVariants; size?: keyof typeof buttonSizes };

export const buttonClass = ({ variant = "primary", size = "md" }: ButtonStyle = {}, className?: string) =>
  cx(buttonBase, buttonVariants[variant], buttonSizes[size], className);

export function ButtonLink({ variant, size, className, href, ...props }: ButtonStyle & ComponentProps<typeof Link>) {
  return <Link href={href} className={buttonClass({ variant, size }, className)} {...props} />;
}

export function Eyebrow({ children, className, tone = "plum" }: { children: ReactNode; className?: string; tone?: "plum" | "light" }) {
  return (
    <p
      className={cx(
        "inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase",
        tone === "plum" ? "text-blush-600" : "text-blush-300",
        className,
      )}
    >
      <span aria-hidden="true" className="h-px w-6 bg-current" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Heading = "h2",
  id,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
  id?: string;
  className?: string;
}) {
  return (
    <div className={cx(align === "center" && "mx-auto text-center", "max-w-3xl", className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Heading id={id} className="mt-3 text-3xl leading-tight font-bold tracking-tight text-plum-900 sm:text-4xl">
        {title}
      </Heading>
      {description && <p className="mt-4 text-lg leading-relaxed text-muted">{description}</p>}
    </div>
  );
}
