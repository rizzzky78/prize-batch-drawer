"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { useTranslation } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Languages, Check } from "lucide-react";
import { cn } from "@/lib/utils";

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
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="bg-slate-800/80 backdrop-blur-sm border-slate-700 text-white hover:text-white hover:bg-slate-700 shadow-xl z-50 cursor-pointer transition-all hover:scale-105"
          title={t.language.changeTitle}
        >
          {t.language.trigger}
          <Languages className="w-3 h-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-40 p-1 bg-slate-900 border-slate-700 rounded-2xl"
      >
        {LANGUAGES.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => {
              setLanguage(code);
              setOpen(false);
            }}
            className="w-full text-left px-2 py-1.5 text-sm text-slate-200 hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-between"
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
