import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ButtonLink } from "@/components/site/Button";
import { ArrowRightIcon } from "@/components/site/icons";

export default function NotFound() {
  return (
    <>
      <Header tag="Página não encontrada" />
      <main className="wrap flex-1 py-[88px]">
        <div className="max-w-measure">
          <h1 className="text-[clamp(1.75rem,3.6vw,2.3rem)] font-extrabold leading-[1.15] tracking-[-0.02em] text-ink">
            Essa página não existe.
          </h1>
          <p className="mt-[22px]">O endereço pode ter mudado. O diagnóstico continua disponível no início.</p>
          <div className="mt-7">
            <ButtonLink href="/">
              Voltar ao início <ArrowRightIcon />
            </ButtonLink>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
