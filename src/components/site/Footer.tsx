import Image from "next/image";
import { CONFIG, waLink } from "@/lib/config";
import { WhatsAppIcon } from "./icons";

export function Footer() {
  return (
    <footer className="mt-[88px] border-t border-line">
      <div className="wrap flex flex-col gap-5 py-9 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Image
            src="/teteatete-logo.png"
            alt={CONFIG.brand}
            width={151}
            height={46}
            style={{ height: 46, width: "auto" }}
          />
          <p className="mt-3 text-[14px] text-ink-muted-2">
            Marketing de conversa: Frédy.app e Duda.app. © {new Date().getFullYear()} {CONFIG.brand}.
          </p>
        </div>
        <a
          href={waLink(`Olá! Vim do Diagnóstico ${CONFIG.product} e quero falar com o time.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[15px] font-bold text-green-ink underline-offset-4 hover:underline"
        >
          <WhatsAppIcon className="h-[18px] w-[18px] text-green-check" />
          {CONFIG.product} · WhatsApp {CONFIG.whatsapp.display}
        </a>
      </div>
    </footer>
  );
}
