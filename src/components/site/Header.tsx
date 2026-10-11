import Image from "next/image";
import Link from "next/link";
import { CONFIG } from "@/lib/config";
import { PRODUCT } from "@/products";

/**
 * Logo do produto. Se `PRODUCT.logo` estiver definido (SVG/PNG em /public), renderiza a imagem.
 * Sem arquivo, desenha o wordmark tipograficamente com as cores da marca:
 *  - Frédy: "Fr" navy + "édy" azul, itálico pesado
 *  - Duda:  "Duda" em preto/branco (conforme o tema) + ponto coral
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
        <Wordmark height={height} />
      )}
    </Link>
  );
}

function Wordmark({ height }: { height: number }) {
  const fontSize = Math.round(height * 0.62);
  if (PRODUCT.key === "duda") {
    return (
      <span
        className="font-display font-black tracking-[-0.04em] text-ink"
        style={{ fontSize, lineHeight: `${height}px`, display: "inline-block" }}
      >
        Duda
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            verticalAlign: "baseline",
            width: "0.22em",
            height: "0.22em",
            marginLeft: "0.06em",
            marginBottom: "0.03em",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #ff4d56 0%, #ff6b35 100%)",
          }}
        />
      </span>
    );
  }
  return (
    <span
      className="font-display font-extrabold italic leading-none tracking-[-0.045em]"
      style={{ fontSize, height, display: "inline-flex", alignItems: "center" }}
    >
      <span style={{ color: "#142138" }}>Fr</span>
      <span style={{ color: "#3ca8df" }}>édy</span>
    </span>
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
