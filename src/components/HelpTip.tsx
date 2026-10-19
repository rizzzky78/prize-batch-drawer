"use client";

import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Wraps any control (even a disabled one) with an explanatory tooltip.
// The span is needed because disabled buttons don't fire pointer events.
export const Hint = ({
  text,
  side = "top",
  children,
}: {
  text: string;
  side?: "top" | "right" | "bottom" | "left";
  children: React.ReactNode;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <span className="inline-flex">{children}</span>
    </TooltipTrigger>
    <TooltipContent side={side} sideOffset={6} className="max-w-[280px] text-xs leading-relaxed">
      {text}
    </TooltipContent>
  </Tooltip>
);

// Small "i" icon that explains a control on hover / keyboard focus.
export const HelpTip = ({
  text,
  side = "top",
  className,
}: {
  text: string;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button
        type="button"
        aria-label={text}
        className={cn(
          "inline-flex size-4 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:text-sky-300 focus-visible:text-sky-300 focus-visible:outline-none cursor-help",
          className,
        )}
      >
        <Info className="size-3.5" />
      </button>
    </TooltipTrigger>
    <TooltipContent side={side} sideOffset={6} className="max-w-[280px] text-xs leading-relaxed">
      {text}
    </TooltipContent>
  </Tooltip>
);
