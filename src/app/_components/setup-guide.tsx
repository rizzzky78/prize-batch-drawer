"use client";

import { Check } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useTranslation } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { HelpTip } from "./help-tip";

// First-run checklist; each step ticks itself off from store state.
export const SetupGuide = () => {
  const hasPrizes = useStore((s) => s.sessions.length > 0);
  const hasParticipants = useStore((s) => s.participants.length > 0);
  const hasDrawn = useStore((s) => Object.values(s.winners).some((w) => w.length > 0));
  const t = useTranslation();

  const steps = [
    { label: t.setup.step1, done: hasPrizes },
    { label: t.setup.step2, done: hasParticipants },
    { label: t.setup.step3, done: hasDrawn },
  ];

  return (
    <div className="space-y-3">
      <div>
        <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-white">
          {t.setup.title}
          <HelpTip text={t.setup.storageHint} side="right" />
        </h2>
        <p className="text-sm text-slate-400 mt-1">{t.setup.subtitle}</p>
      </div>
      <ol className="flex flex-wrap gap-2">
        {steps.map((step, i) => (
          <li
            key={i}
            className={cn(
              "flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-xs font-medium transition-colors",
              step.done
                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                : "border-white/10 bg-white/5 text-slate-300",
            )}
          >
            <span
              className={cn(
                "grid size-5 place-items-center rounded-full text-[11px] tabular-nums",
                step.done ? "bg-emerald-400 text-emerald-950" : "bg-white/10 text-slate-200",
              )}
            >
              {step.done ? <Check className="size-3" strokeWidth={3} /> : i + 1}
            </span>
            {step.label}
          </li>
        ))}
      </ol>
    </div>
  );
};
