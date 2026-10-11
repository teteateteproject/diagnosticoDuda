import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ButtonLink } from "@/components/site/Button";
import { ArrowRightIcon, CheckIcon, WhatsAppIcon } from "@/components/site/icons";
import { CONFIG, waLink } from "@/lib/config";
import { TOTAL_QUESTIONS } from "@/lib/questions";
import { PRODUCT } from "@/products";

const L = PRODUCT.landing;

const STEPS = [
  { n: "1", title: "Seus dados", text: L.step1Text },
  { n: "2", title: `${TOTAL_QUESTIONS} perguntas rápidas`, text: L.step2Text },
  { n: "3", title: "Diagnóstico na hora", text: L.step3Text },
];

export default function HomePage() {
  return (
    <>
      <Header tag="Diagnóstico gratuito" meta={`${CONFIG.totalMinutes} minutos · ${TOTAL_QUESTIONS} perguntas`} />

      <main className="wrap flex-1">
        {/* Hero */}
        <section className="hero-glow relative mt-6 overflow-hidden rounded-3xl bg-strong px-[clamp(24px,6vw,72px)] py-[clamp(40px,8vw,104px)]">
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-pill bg-accent px-[14px] py-[6px] text-[14px] font-bold text-accent-fg">
              <i className="h-[7px] w-[7px] rounded-full bg-accent-fg" aria-hidden="true" />
              Diagnóstico {CONFIG.product}
            </span>
            <h1 className="mt-6 max-w-[15ch] text-[clamp(2.4rem,6.4vw,4.4rem)] font-extrabold leading-[1.04] tracking-[-0.035em] text-on-strong">
              {L.h1}
            </h1>
            <p className="mt-5 max-w-[38rem] text-[clamp(17px,2vw,20px)] leading-[1.5] text-on-strong-body">{L.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3 max-[560px]:[&_a]:w-full">
              <ButtonLink href="/diagnostico" tone="accent">
                Começar diagnóstico <ArrowRightIcon />
              </ButtonLink>
              <a
                href="#como-funciona"
                className="inline-flex items-center rounded-btn px-[22px] py-[14px] text-[15.5px] font-bold text-on-strong-strong underline-offset-4 hover:underline"
              >
                Como funciona
              </a>
            </div>
            <div className="mt-11 flex flex-wrap gap-x-7 gap-y-2 border-t border-on-strong-line pt-4 text-[14px] text-on-strong-muted">
              <span>
                Feito por <b className="font-semibold text-on-strong-strong">time {CONFIG.product}</b>
              </span>
              <span>
                <b className="font-semibold text-on-strong-strong">{TOTAL_QUESTIONS} perguntas</b>, múltipla escolha
              </span>
              <span>Resultado imediato, sem cadastro em plataforma</span>
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section id="como-funciona" className="mt-[88px] max-w-measure">
          <h2 className="text-[clamp(1.75rem,3.6vw,2.3rem)] font-extrabold leading-[1.15] tracking-[-0.02em] text-ink">
            Como funciona
          </h2>
          <p className="mt-[22px]">{L.stepsIntro}</p>
          <div className="mt-8 grid gap-3 min-[700px]:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-xl border border-line bg-bg-s1 px-[22px] py-5">
                <span className="num inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent text-[15px] font-extrabold text-accent-fg">
                  {s.n}
                </span>
                <h3 className="mt-4 text-[17px] font-bold leading-[1.3] tracking-[-0.02em] text-ink">{s.title}</h3>
                <p className="mt-[6px] text-[15.5px] leading-[1.6]">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* O que você recebe */}
        <section className="mt-[88px] max-w-measure">
          <h2 className="text-[clamp(1.75rem,3.6vw,2.3rem)] font-extrabold leading-[1.15] tracking-[-0.02em] text-ink">
            O que você recebe
          </h2>
          <p className="mt-[22px]">{L.receiveIntro}</p>
          <ul className="mt-7 grid gap-3">
            {L.deliverables.map((d) => (
              <li key={d} className="flex items-start gap-3 text-[16px] leading-[1.6]">
                <CheckIcon className="mt-[5px] h-[18px] w-[18px] shrink-0 text-accent-check" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
          <div className="mt-7 rounded-r-lg border-l-4 border-accent bg-bg-s1 px-6 py-5">
            <div className="text-[14px] font-bold text-accent-ink">Resumindo</div>
            <p className="mt-[6px] text-[18px] font-semibold leading-[1.5] text-ink">
              {L.calloutText.replace("{n}", String(TOTAL_QUESTIONS))}
            </p>
          </div>
        </section>

        {/* Frase de impacto */}
        <section className="mt-[88px] max-w-measure">
          <p className="max-w-[30ch] border-l-4 border-accent pl-[18px] text-[27px] font-extrabold leading-[1.3] tracking-[-0.02em] text-ink">
            {L.quote}
          </p>
        </section>

        {/* CTA */}
        <section className="mt-[88px] rounded-3xl bg-cta px-[clamp(24px,5vw,56px)] py-[clamp(36px,6vw,56px)] text-cta-ink">
          <h2 className="max-w-[20ch] text-[clamp(1.7rem,4vw,2.4rem)] font-extrabold leading-[1.15] tracking-[-0.02em] text-cta-title">
            {L.ctaTitle}
          </h2>
          <p className="mt-[14px] max-w-[34rem] text-[17px] leading-[1.7]">{L.ctaText}</p>
          <div className="mt-7 flex flex-wrap gap-3 max-[560px]:[&_a]:w-full">
            <ButtonLink href="/diagnostico">
              Começar diagnóstico <ArrowRightIcon />
            </ButtonLink>
            <ButtonLink href={waLink(L.whatsappMessage)}>
              <WhatsAppIcon /> Falar com o time {CONFIG.product}
            </ButtonLink>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
