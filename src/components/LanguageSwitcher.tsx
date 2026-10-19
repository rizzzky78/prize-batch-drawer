"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { useTranslation } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Languages, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Hint } from "./HelpTip";

const LANGUAGES: { code: "id" | "en"; label: string }[] = [
  { code: "id", label: "Indonesia" },
  { code: "en", label: "English" },
];

export const LanguageSwitcher = () => {
  const [open, setOpen] = useState(false);
  const language = useStore((state) => state.language);
  const setLanguage = useStore((state) => state.setLanguage);
  const t = useTranslation();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Hint text={t.help.language}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="cursor-pointer border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 hover:text-white"
            aria-label={t.language.changeTitle}
          >
            <Languages className="w-4 h-4 text-sky-300" />
            {t.language.trigger}
          </Button>
        </PopoverTrigger>
      </Hint>
      <PopoverContent
        align="end"
        className="w-40 p-1 rounded-2xl"
      >
        {LANGUAGES.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => {
              setLanguage(code);
              setOpen(false);
            }}
            className="w-full text-left px-2 py-1.5 text-sm text-slate-200 hover:bg-white/10 rounded-xl cursor-pointer transition-colors flex items-center justify-between"
          >
            {label}
            <Check
              className={cn(
                "h-3 w-3 text-emerald-500",
                language === code ? "opacity-100" : "opacity-0",
              )}
            />
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
};
