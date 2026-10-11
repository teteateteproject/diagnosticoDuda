"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { quizQuestions, TOTAL_QUESTIONS } from "@/lib/questions";
import { generateDiagnosis, type Answers, type Diagnosis } from "@/lib/scoring";
import type { Contact, ContactInput } from "@/lib/schema";
import { CONFIG } from "@/lib/config";
import { Logo } from "@/components/site/Header";
import { ContactStep } from "./ContactStep";
import { QuestionStep } from "./QuestionStep";
import { ResultStep, type SaveState } from "./ResultStep";

const CONTACT_STEP = 0;
const RESULT_STEP = TOTAL_QUESTIONS + 1;
const STORAGE_KEY = "fredy-diagnostico:v1";

interface Persisted {
  step: number;
  contact: ContactInput;
  answers: Answers;
  startedAt: number;
}

const EMPTY: Persisted = {
  step: CONTACT_STEP,
  contact: { name: "", email: "", whatsapp: "" },
  answers: {},
  startedAt: 0,
};

function load(): Persisted {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const p = JSON.parse(raw) as Partial<Persisted>;
    const step = Math.min(Math.max(Number(p.step) || 0, CONTACT_STEP), TOTAL_QUESTIONS);
    return { ...EMPTY, ...p, step };
  } catch {
    return EMPTY;
  }
}

export function QuizFlow() {
  const [state, setState] = useState<Persisted>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("saving");
  const honeypot = useRef("");
  const topRef = useRef<HTMLDivElement>(null);

  // Restaura progresso (refresh não perde o que já respondeu)
  useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage indisponível: segue sem persistir */
    }
  }, [state, hydrated]);

  useEffect(() => {
    if (hydrated) topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [state.step, hydrated]);

  const { step, contact, answers } = state;
  const question = step >= 1 && step <= TOTAL_QUESTIONS ? quizQuestions[step - 1] : null;
  const progress = step === CONTACT_STEP ? 0 : step >= RESULT_STEP ? 100 : ((step - 1) / TOTAL_QUESTIONS) * 100;

  const handleContact = useCallback((c: Contact) => {
    setState((s) => ({
      ...s,
      contact: { name: c.name, email: c.email, whatsapp: c.whatsapp },
      step: 1,
      startedAt: s.startedAt || Date.now(),
    }));
  }, []);

  const setAnswer = useCallback((id: string, value: string | string[]) => {
    setState((s) => ({ ...s, answers: { ...s.answers, [id]: value } }));
  }, []);

  const submitLead = useCallback(
    async (finalAnswers: Answers, c: ContactInput, startedAt: number) => {
      setSaveState("saving");
      try {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            contact: c,
            answers: finalAnswers,
            website: honeypot.current || undefined,
            startedAt: startedAt || undefined,
          }),
        });
        if (!res.ok) {
          setSaveState("error");
          return;
        }
        const data = (await res.json().catch(() => ({}))) as { persisted?: boolean };
        setSaveState(data.persisted ? "saved" : "local");
      } catch {
        setSaveState("error");
      }
    },
    [],
  );

  const next = useCallback(() => {
    if (step < TOTAL_QUESTIONS) {
      setState((s) => ({ ...s, step: s.step + 1 }));
      return;
    }
    const result = generateDiagnosis(answers);
    setDiagnosis(result);
    setState((s) => ({ ...s, step: RESULT_STEP }));
    void submitLead(answers, contact, state.startedAt);
  }, [step, answers, contact, state.startedAt, submitLead]);

  const back = useCallback(() => {
    setState((s) => ({ ...s, step: Math.max(CONTACT_STEP, s.step - 1) }));
  }, []);

  const restart = useCallback(() => {
    setDiagnosis(null);
    setSaveState("saving");
    setState({ ...EMPTY, startedAt: Date.now() });
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const stepLabel = useMemo(() => {
    if (step === CONTACT_STEP) return "Seus dados";
    if (step >= RESULT_STEP) return "Resultado";
    return `${step} de ${TOTAL_QUESTIONS}`;
  }, [step]);

  return (
    <div ref={topRef} className="flex min-h-dvh flex-col">
      <header className="no-print sticky top-0 z-10 border-b border-line bg-bg/95 backdrop-blur">
        <div className="wrap flex items-center justify-between gap-4 py-3">
          <Logo height={36} />
          <div className="flex items-center gap-3">
            <span className="hidden text-[14px] font-semibold text-ink sm:inline">Diagnóstico {CONFIG.product}</span>
            <span className="num rounded-pill bg-accent px-3 py-1 text-[13px] font-bold text-accent-fg">{stepLabel}</span>
          </div>
        </div>
        <div className="h-[3px] w-full bg-bg-s2" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} aria-label="Progresso do diagnóstico">
          <div className="h-full bg-accent transition-[width] duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <main className="wrap flex-1 py-10">
        <div className="mx-auto w-full max-w-[44rem] print-page">
          {!hydrated ? (
            <div className="h-64" aria-busy="true" />
          ) : step === CONTACT_STEP ? (
            <ContactStep initial={contact} onSubmit={handleContact} onHoneypot={(v) => (honeypot.current = v)} />
          ) : question ? (
            <QuestionStep
              question={question}
              index={step}
              total={TOTAL_QUESTIONS}
              value={answers[question.id]}
              textValue={question.textInputId ? String(answers[question.textInputId] ?? "") : ""}
              onSelect={(v) => setAnswer(question.id, v)}
              onTextChange={(v) => question.textInputId && setAnswer(question.textInputId, v)}
              onNext={next}
              onBack={back}
            />
          ) : diagnosis ? (
            <ResultStep diagnosis={diagnosis} answers={answers} contactName={contact.name} saveState={saveState} onRestart={restart} />
          ) : null}
        </div>
      </main>

      <footer className="no-print border-t border-line">
        <div className="wrap flex flex-wrap items-center justify-between gap-2 py-5 text-[13px] text-ink-muted-2">
          <span>
            © {new Date().getFullYear()} {CONFIG.productFull} · Diagnóstico {CONFIG.product}
          </span>
          <Link href="/" className="font-bold text-accent-ink underline-offset-4 hover:underline">
            Voltar ao início
          </Link>
        </div>
      </footer>
    </div>
  );
}
