import { CONFIG, waLink } from "@/lib/config";
import { PRODUCT } from "@/products";
import { Logo } from "./Header";
import { WhatsAppIcon } from "./icons";

export function Footer() {
  return (
    <footer className="mt-[88px] border-t border-line">
      <div className="wrap flex flex-col gap-5 py-9 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Logo height={36} />
          <p className="mt-3 text-[14px] text-ink-muted-2">
            {PRODUCT.tagline} © {new Date().getFullYear()} {CONFIG.productFull}.
          </p>
        </div>
        <a
          href={waLink(`Olá! Vim do Diagnóstico ${CONFIG.product} e quero falar com o time.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[15px] font-bold text-accent-ink underline-offset-4 hover:underline"
        >
          <WhatsAppIcon className="h-[18px] w-[18px] text-accent-check" />
          {CONFIG.product} · WhatsApp {CONFIG.whatsapp.display}
        </a>
      </div>
    </footer>
  );
}
