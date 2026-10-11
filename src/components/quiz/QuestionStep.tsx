"use client";

import type { QuizQuestion } from "@/lib/questions";
import { Button, TextLink } from "@/components/site/Button";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "@/components/site/icons";

export function QuestionStep({
  question,
  index,
  total,
  value,
  textValue,
  onSelect,
  onTextChange,
  onNext,
  onBack,
}: {
  question: QuizQuestion;
  index: number; // 1-based
  total: number;
  value: string | string[] | undefined;
  textValue: string;
  onSelect: (v: string | string[]) => void;
  onTextChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const isMulti = !!question.multiple;
  const selected = Array.isArray(value) ? value : value ? [value] : [];
  const max = question.maxSelect ?? Infinity;

  const needsText =
    question.textInputId &&
    question.options.some((o) => o.hasTextInput && selected.includes(o.value)) &&
    !textValue.trim();
  const canProceed = selected.length > 0 && !needsText;

  function toggle(v: string) {
    if (!isMulti) {
      onSelect(v);
      return;
    }
    if (selected.includes(v)) {
      onSelect(selected.filter((s) => s !== v));
    } else if (selected.length < max) {
      onSelect([...selected, v]);
    }
  }

  return (
    <div key={question.id} className="rise">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-pill bg-accent px-3 py-1 text-[13px] font-bold text-accent-fg">{question.block}</span>
        <span className="num text-[14px] text-ink-muted-2">
          Pergunta {index} de {total}
        </span>
      </div>

      <h1 className="mt-4 max-w-[22ch] text-[clamp(1.5rem,3.2vw,2.1rem)] font-extrabold leading-[1.15] tracking-[-0.02em] text-ink">
        {question.question}
      </h1>
      {question.hint && <p className="mt-2 text-[14px] text-ink-muted-2">{question.hint}</p>}

      <div role={isMulti ? "group" : "radiogroup"} aria-label={question.question} className="mt-6 grid gap-3">
        {question.options.map((opt) => {
          const isSel = selected.includes(opt.value);
          const disabled = isMulti && !isSel && selected.length >= max;
          return (
            <div key={opt.value}>
              <button
                type="button"
                role={isMulti ? "checkbox" : "radio"}
                aria-checked={isSel}
                disabled={disabled}
                onClick={() => toggle(opt.value)}
                className={[
                  "flex w-full items-center justify-between gap-4 rounded-lg border px-5 py-4 text-left text-[16px] font-semibold transition-colors",
                  isSel
                    ? "border-accent bg-accent-tint text-ink"
                    : "border-line-2 bg-bg text-ink hover:border-accent disabled:opacity-40 disabled:hover:border-line-2",
                ].join(" ")}
              >
                <span>{opt.label}</span>
                <span
                  aria-hidden="true"
                  className={[
                    "flex h-6 w-6 shrink-0 items-center justify-center border-2",
                    isMulti ? "rounded-[7px]" : "rounded-full",
                    isSel ? "border-accent bg-strong text-accent" : "border-line-2 bg-bg",
                  ].join(" ")}
                >
                  {isSel && <CheckIcon className="h-[14px] w-[14px]" />}
                </span>
              </button>
              {opt.hasTextInput && isSel && question.textInputId && (
                <input
                  type="text"
                  autoFocus
                  value={textValue}
                  maxLength={120}
                  onChange={(e) => onTextChange(e.target.value)}
                  placeholder="Qual é o seu segmento?"
                  aria-label="Descreva o segmento"
                  className="mt-2 w-full rounded-btn border border-line-2 bg-bg px-4 py-[12px] text-[16px] text-ink placeholder:text-ink-muted-2 focus:border-accent focus:outline-none"
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 max-[560px]:[&_button:last-child]:w-full">
        <TextLink onClick={onBack}>
          <ArrowLeftIcon className="h-[18px] w-[18px]" /> Voltar
        </TextLink>
        <Button type="button" onClick={onNext} disabled={!canProceed}>
          {index === total ? "Ver diagnóstico" : "Próxima"} <ArrowRightIcon />
        </Button>
      </div>
    </div>
  );
}
