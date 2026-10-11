import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/**
 * Botão primário (tokens btn/btn-fg/btn-icon, raio radius-btn) e variante `accent`
 * pra uso sobre o bloco forte (hero). Cores e raio vêm do tema do produto.
 */
const base =
  "inline-flex items-center justify-center gap-[9px] rounded-btn px-[22px] py-[14px] text-[15.5px] font-extrabold leading-none no-underline transition-transform duration-200 hover:-translate-y-px disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed [&_svg]:h-[19px] [&_svg]:w-[19px]";

const tones = {
  primary: "bg-btn text-btn-fg [&_svg]:text-btn-icon",
  accent: "bg-accent text-accent-fg [&_svg]:text-accent-fg",
} as const;

type Tone = keyof typeof tones;

type Common = { tone?: Tone; className?: string; children: ReactNode };

export function Button({
  tone = "primary",
  className = "",
  children,
  ...rest
}: Common & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button className={`${base} ${tones[tone]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  tone = "primary",
  className = "",
  children,
  href,
  ...rest
}: Common & { href: string } & Omit<ComponentProps<typeof Link>, "className" | "children" | "href">) {
  const external = /^https?:\/\//.test(href);
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${tones[tone]} ${className}`}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={`${base} ${tones[tone]} ${className}`} {...rest}>
      {children}
    </Link>
  );
}

/** Ação leve: link em accent-ink */
export function TextLink({
  className = "",
  children,
  ...rest
}: { className?: string; children: ReactNode } & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-2 text-[15px] font-bold text-accent-ink underline-offset-4 hover:underline ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
