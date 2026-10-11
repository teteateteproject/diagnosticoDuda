import Image from "next/image";
import Link from "next/link";
import { CONFIG } from "@/lib/config";
import { PRODUCT } from "@/products";

/**
 * Logo do produto. Se `PRODUCT.logo` estiver definido (arquivo em /public),
 * renderiza a imagem; senão, um wordmark tipográfico com o nome do produto.
 */
export function Logo({ height = 44, className = "" }: { height?: number; className?: string }) {
  const logo = PRODUCT.logo;
  return (
    <Link href="/" aria-label={`${CONFIG.productFull} — início`} className={`inline-flex items-center ${className}`}>
      {logo ? (
        <Image
          src={logo.src}
          alt={CONFIG.productFull}
          width={Math.round((logo.width / logo.height) * height)}
          height={height}
          priority
          style={{ height, width: "auto" }}
        />
      ) : (
        <span className="inline-flex items-center gap-2">
          <span
            className="inline-flex items-center justify-center rounded-[10px] bg-accent font-extrabold text-accent-fg"
            style={{ width: height * 0.8, height: height * 0.8, fontSize: height * 0.46 }}
            aria-hidden="true"
          >
            {CONFIG.product[0]}
          </span>
          <span className="font-display font-extrabold tracking-[-0.03em] text-ink" style={{ fontSize: height * 0.5 }}>
            {CONFIG.productFull}
          </span>
        </span>
      )}
    </Link>
  );
}

export function Header({ tag = "Diagnóstico gratuito", meta }: { tag?: string; meta?: string }) {
  return (
    <header className="border-b border-line">
      <div className="wrap flex items-center justify-between gap-4 py-4">
        <Logo height={44} />
        <div className="flex items-center gap-3">
          <span className="rounded-pill bg-accent px-3 py-1 text-[13px] font-bold text-accent-fg">{tag}</span>
          {meta && <span className="hidden text-[14px] text-ink-muted-2 sm:inline">{meta}</span>}
        </div>
      </div>
    </header>
  );
}
