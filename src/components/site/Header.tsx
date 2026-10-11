import Image from "next/image";
import Link from "next/link";
import { CONFIG } from "@/lib/config";

export function Logo({ height = 50, className = "" }: { height?: number; className?: string }) {
  const width = Math.round((760 / 231) * height);
  return (
    <Link href="/" aria-label={`${CONFIG.brand} — início`} className={`inline-flex ${className}`}>
      <Image
        src="/teteatete-logo.png"
        alt={CONFIG.brand}
        width={width}
        height={height}
        priority
        style={{ height, width: "auto" }}
      />
    </Link>
  );
}

export function Header({ tag = "Diagnóstico gratuito", meta }: { tag?: string; meta?: string }) {
  return (
    <header className="border-b border-line">
      <div className="wrap flex items-center justify-between gap-4 py-4">
        <Logo height={50} className="max-[560px]:[&_img]:!h-10" />
        <div className="flex items-center gap-3">
          <span className="rounded-pill bg-green px-3 py-1 text-[13px] font-bold text-black">{tag}</span>
          {meta && <span className="hidden text-[14px] text-ink-muted-2 sm:inline">{meta}</span>}
        </div>
      </div>
    </header>
  );
}
