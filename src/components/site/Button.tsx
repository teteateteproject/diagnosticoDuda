import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/**
 * Button do design system: fundo black, texto branco 800 15.5px, raio 14px,
 * ícone 19px em green, hover translateY(-1px).
 * `tone="green"` é a variante pra uso SOBRE blocos pretos (black sobre green, 11:1).
 */
const base =
  "inline-flex items-center justify-center gap-[9px] rounded-[14px] px-[22px] py-[14px] text-[15.5px] font-extrabold leading-none no-underline transition-transform duration-200 hover:-translate-y-px disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed [&_svg]:h-[19px] [&_svg]:w-[19px]";

const tones = {
  black: "bg-black text-white [&_svg]:text-green",
  green: "bg-green text-black [&_svg]:text-black",
} as const;

type Tone = keyof typeof tones;

type Common = { tone?: Tone; className?: string; children: ReactNode };

export function Button({
  tone = "black",
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
  tone = "black",
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

/** Ação leve: link em green-ink (não existe botão secundário no sistema) */
export function TextLink({
  className = "",
  children,
  ...rest
}: { className?: string; children: ReactNode } & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-2 text-[15px] font-bold text-green-ink underline-offset-4 hover:underline ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
