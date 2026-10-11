import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ButtonLink } from "@/components/site/Button";
import { ArrowRightIcon, CheckIcon, WhatsAppIcon } from "@/components/site/icons";
import { CONFIG, waLink } from "@/lib/config";
import { TOTAL_QUESTIONS } from "@/lib/questions";

const STEPS = [
  {
    n: "1",
    title: "Seus dados",
    text: "Nome, e-mail e WhatsApp. É pra onde mandamos o relatório e pra onde o time responde, se você quiser conversar.",
  },
  {
    n: "2",
    title: `${TOTAL_QUESTIONS} perguntas rápidas`,
    text: "Múltipla escolha sobre canais, equipe, orçamentos, follow-up e pós-viagem. Nada de campo aberto pra preencher.",
  },
  {
    n: "3",
    title: "Diagnóstico na hora",
    text: "Nível de maturidade (alta, média ou inicial), o setor onde o Frédy traz mais resultado e os próximos passos.",
  },
];

const DELIVERABLES = [
  "Pontuação de maturidade em IA da sua operação",
  "Setor de maior impacto: vendas, atendimento ou pós-viagem",
  "Três próximos passos práticos, de acordo com o seu nível",
  "Relatório pra baixar e compartilhar com os sócios",
];

export default function HomePage() {
  return (
    <>
      <Header tag="Diagnóstico gratuito" meta={`${CONFIG.totalMinutes} minutos · ${TOTAL_QUESTIONS} perguntas`} />

      <main className="wrap flex-1">
        {/* Hero */}
        <section className="hero-glow relative mt-6 overflow-hidden rounded-3xl bg-black px-[clamp(24px,6vw,72px)] py-[clamp(40px,8vw,104px)]">
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-pill bg-green px-[14px] py-[6px] text-[14px] font-bold text-black">
              <i className="h-[7px] w-[7px] rounded-full bg-black" aria-hidden="true" />
              Diagnóstico {CONFIG.product}
            </span>
            <h1 className="mt-6 max-w-[15ch] text-[clamp(2.4rem,6.4vw,4.4rem)] font-extrabold leading-[1.04] tracking-[-0.035em] text-on-black">
              Sua agência está pronta pra vender com IA?
            </h1>
            <p className="mt-5 max-w-[38rem] text-[clamp(17px,2vw,20px)] leading-[1.5] text-on-black-body">
              Em {CONFIG.totalMinutes} minutos você descobre o nível de maturidade da sua operação e em qual
              frente o {CONFIG.product} traz resultado primeiro: vendas, atendimento ou pós-viagem.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 max-[560px]:[&_a]:w-full">
              <ButtonLink href="/diagnostico" tone="green">
                Começar diagnóstico <ArrowRightIcon />
              </ButtonLink>
              <a
                href="#como-funciona"
                className="inline-flex items-center rounded-[14px] px-[22px] py-[14px] text-[15.5px] font-bold text-on-black-strong underline-offset-4 hover:underline"
              >
                Como funciona
              </a>
            </div>
            <div className="mt-11 flex flex-wrap gap-x-7 gap-y-2 border-t border-on-black-line pt-4 text-[14px] text-on-black-muted">
              <span>
                Feito por <b className="font-semibold text-on-black-strong">time {CONFIG.product}</b>
              </span>
              <span>
                <b className="font-semibold text-on-black-strong">{TOTAL_QUESTIONS} perguntas</b>, múltipla escolha
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
          <p className="mt-[22px]">
            Três etapas, nenhuma delas pede acesso ao seu WhatsApp ou ao seu CRM. Você responde, a pontuação é
            calculada e o diagnóstico aparece na tela.
          </p>
          <div className="mt-8 grid gap-3 min-[700px]:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-xl border border-line bg-bg-s1 px-[22px] py-5">
                <span className="num inline-flex h-9 w-9 items-center justify-center rounded-full bg-black text-[15px] font-extrabold text-green">
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
          <p className="mt-[22px]">
            O diagnóstico olha pra quatro coisas: quanto da sua venda já passa pelo WhatsApp, como a equipe atende
            hoje, o que acontece com orçamento parado e se existe pós-viagem. Com isso ele mostra onde está o
            dinheiro que você deixa na mesa.
          </p>
          <ul className="mt-7 grid gap-3">
            {DELIVERABLES.map((d) => (
              <li key={d} className="flex items-start gap-3 text-[16px] leading-[1.6]">
                <CheckIcon className="mt-[5px] h-[18px] w-[18px] shrink-0 text-green-check" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
          <div className="mt-7 rounded-r-lg border-l-4 border-green bg-bg-s1 px-6 py-5">
            <div className="text-[14px] font-bold text-green-ink">Resumindo</div>
            <p className="mt-[6px] text-[18px] font-semibold leading-[1.5] text-ink">
              Você responde {TOTAL_QUESTIONS} perguntas e sai sabendo se o problema é captar, responder ou fazer o
              cliente voltar.
            </p>
          </div>
        </section>

        {/* Frase de impacto */}
        <section className="mt-[88px] max-w-measure">
          <p className="max-w-[30ch] border-l-4 border-green pl-[18px] text-[27px] font-extrabold leading-[1.3] tracking-[-0.02em] text-ink">
            Lead que espera orçamento por dois dias já comprou de outra agência.
          </p>
        </section>

        {/* CTA */}
        <section className="mt-[88px] rounded-3xl bg-green px-[clamp(24px,5vw,56px)] py-[clamp(36px,6vw,56px)] text-cta-ink">
          <h2 className="max-w-[20ch] text-[clamp(1.7rem,4vw,2.4rem)] font-extrabold leading-[1.15] tracking-[-0.02em] text-black">
            Pronto pra descobrir onde sua agência perde venda?
          </h2>
          <p className="mt-[14px] max-w-[34rem] text-[17px] leading-[1.7]">
            Leva {CONFIG.totalMinutes} minutos. Se preferir pular o diagnóstico e falar direto com o time, o WhatsApp
            está aqui também.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 max-[560px]:[&_a]:w-full">
            <ButtonLink href="/diagnostico">
              Começar diagnóstico <ArrowRightIcon />
            </ButtonLink>
            <ButtonLink href={waLink(`Olá! Quero falar com o time ${CONFIG.product} sobre a minha agência.`)}>
              <WhatsAppIcon /> Falar com o time {CONFIG.product}
            </ButtonLink>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
