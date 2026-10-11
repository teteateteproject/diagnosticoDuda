"use client";

import { useState, type FormEvent } from "react";
import { contactSchema, type Contact, type ContactInput } from "@/lib/schema";
import { Button } from "@/components/site/Button";
import { ArrowRightIcon } from "@/components/site/icons";
import { CONFIG } from "@/lib/config";

type Errors = Partial<Record<keyof ContactInput, string>>;

const inputCls =
  "w-full rounded-[14px] border border-line-2 bg-bg px-4 py-[13px] text-[16px] text-ink placeholder:text-ink-muted-2 focus:border-black focus:outline-none aria-[invalid]:border-black";

export function ContactStep({
  initial,
  onSubmit,
  onHoneypot,
}: {
  initial: ContactInput;
  onSubmit: (c: Contact) => void;
  onHoneypot: (v: string) => void;
}) {
  const [values, setValues] = useState<ContactInput>(initial);
  const [errors, setErrors] = useState<Errors>({});

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const errs: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContactInput;
        if (!errs[key]) errs[key] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    onSubmit(parsed.data);
  }

  function field(key: keyof ContactInput) {
    return {
      value: values[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setValues((v) => ({ ...v, [key]: e.target.value })),
      "aria-invalid": errors[key] ? true : undefined,
      "aria-describedby": errors[key] ? `${key}-error` : undefined,
    };
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rise">
      <span className="rounded-pill bg-green px-3 py-1 text-[13px] font-bold text-black">Antes de começar</span>
      <h1 className="mt-4 text-[clamp(1.75rem,3.6vw,2.3rem)] font-extrabold leading-[1.15] tracking-[-0.02em] text-ink">
        Pra quem mandamos o diagnóstico?
      </h1>
      <p className="mt-3 max-w-[34rem]">
        O resultado aparece na tela e vai por e-mail. O WhatsApp é só pra quando você quiser falar com o time{" "}
        {CONFIG.product}.
      </p>

      <div className="mt-7 grid gap-4">
        <div>
          <label htmlFor="name" className="mb-[6px] block text-[13px] font-bold uppercase tracking-wide text-ink-muted-2">
            Nome completo
          </label>
          <input id="name" type="text" autoComplete="name" placeholder="Seu nome" className={inputCls} {...field("name")} />
          {errors.name && (
            <p id="name-error" className="mt-1 text-[14px] font-semibold text-ink">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="mb-[6px] block text-[13px] font-bold uppercase tracking-wide text-ink-muted-2">
            E-mail profissional
          </label>
          <input id="email" type="email" autoComplete="email" inputMode="email" placeholder="voce@agencia.com.br" className={inputCls} {...field("email")} />
          {errors.email && (
            <p id="email-error" className="mt-1 text-[14px] font-semibold text-ink">
              {errors.email}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="whatsapp" className="mb-[6px] block text-[13px] font-bold uppercase tracking-wide text-ink-muted-2">
            WhatsApp com DDD
          </label>
          <input id="whatsapp" type="tel" autoComplete="tel" inputMode="tel" placeholder="(47) 99999-9999" className={`${inputCls} num`} {...field("whatsapp")} />
          {errors.whatsapp && (
            <p id="whatsapp-error" className="mt-1 text-[14px] font-semibold text-ink">
              {errors.whatsapp}
            </p>
          )}
        </div>

        {/* Honeypot: invisível pra humanos, bots preenchem */}
        <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="website">Site</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" onChange={(e) => onHoneypot(e.target.value)} />
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-4 max-[560px]:[&_button]:w-full">
        <Button type="submit">
          Começar <ArrowRightIcon />
        </Button>
        <span className="text-[14px] text-ink-muted-2">Seus dados ficam com o time {CONFIG.brand}. Sem spam.</span>
      </div>
    </form>
  );
}
