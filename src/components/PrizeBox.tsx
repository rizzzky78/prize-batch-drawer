import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/translations";
import { RefreshCw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface PrizeBoxProps {
  prizeName: string;
  winnerName?: string | (string | undefined)[];
  isRolling: boolean;
  candidates: string[];
  delay?: number; // Delay before stopping to create staggered effect
  baseDuration?: number; // Base duration for the shuffle
  onFinish?: () => void;
  onReshuffle?: (index?: number) => void;
  activeSessionId: string;
  allowReshuffle?: boolean;
  quantity?: number;
}

export const PrizeBox = ({
  prizeName,
  winnerName,
  isRolling,
  candidates,
  delay = 0,
  baseDuration = 3000,
  activeSessionId,
  onFinish,
  onReshuffle,
  allowReshuffle,
  quantity = 1,
}: PrizeBoxProps) => {
  const [displayedNames, setDisplayedNames] = useState<string[]>(Array(quantity).fill("???"));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const t = useTranslation();

  useEffect(() => {
    if (isRolling) {
      // Start shuffling
      intervalRef.current = setInterval(() => {
        if (candidates.length > 0) {
          const newNames = Array.from({ length: quantity }).map(() =>
            candidates[Math.floor(Math.random() * candidates.length)]
          );
          setDisplayedNames(newNames);
        } else {
          setDisplayedNames(Array(quantity).fill("..."));
        }
      }, 80); // Speed of shuffle

      // Stop shuffling after delay
      const timeout = setTimeout(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        let finalNames: string[] = [];
        if (Array.isArray(winnerName)) {
          finalNames = winnerName.map(w => w || t.doorprize.noWinner);
        } else {
          finalNames = [winnerName || t.doorprize.noWinner];
        }
        setDisplayedNames(finalNames);
        onFinish?.();
      }, baseDuration + delay * 500); // Base time + stagger

      return () => {
        clearTimeout(timeout);
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    } else {
      let finalNames: string[] = [];
      if (Array.isArray(winnerName)) {
        finalNames = winnerName.map(w => w || "???");
      } else {
        finalNames = [winnerName || "???"];
      }
      setDisplayedNames(finalNames);
    }
  }, [isRolling, winnerName, candidates, delay, baseDuration, onFinish, quantity, t]);

  const hasWinner = Array.isArray(winnerName)
    ? winnerName.some(w => !!w)
    : !!winnerName;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn("w-[200px]", quantity > 1 ? "w-[240px]" : "")}
    >
      <Card
        className={cn(
          "flex flex-col gap-0 rounded-2xl items-center justify-center p-2 ring-0 border transition-all duration-300 overflow-hidden relative backdrop-blur-sm",
          quantity > 1 ? "min-h-[120px] py-4" : "h-24 sm:h-26",
          isRolling
            ? "border-amber-300/80 bg-amber-300/10 shadow-[0_0_32px_-6px] shadow-amber-300/50"
            : hasWinner
              ? "border-emerald-400/60 bg-emerald-400/10 shadow-[0_0_24px_-10px] shadow-emerald-400/60"
              : "border-white/10 bg-white/[0.04]"
        )}
      >
        <div className="absolute top-2 left-0 w-full text-center flex justify-center px-2">
          <div
            className={cn(
              "text-[10px] py-1 px-3 font-semibold rounded-full max-w-full sm:text-xs tracking-wider truncate block",
              isRolling
                ? "bg-amber-300 text-amber-950"
                : hasWinner
                  ? "bg-emerald-400 text-emerald-950"
                  : "bg-white/10 text-slate-200"
            )}
          >
            <p className="font-excon truncate">{prizeName} {quantity > 1 && `(×${quantity})`}</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center pt-8 w-full gap-2">
          {displayedNames.map((name, i) => {
            const isWinnerSet = Array.isArray(winnerName) ? !!winnerName[i] : !!winnerName;

            return (
              <div key={i} className="flex items-center justify-center gap-2 w-full px-2 group/item relative">
                <span
                  className={cn(
                    "font-bold text-center truncate w-full uppercase tabular-nums",
                    isRolling
                      ? "text-amber-100 text-sm"
                      : isWinnerSet
                        ? "text-emerald-200 text-sm sm:text-base"
                        : "text-slate-500 text-sm"
                  )}
                >
                  {name}
                </span>

                {/* Reshuffle Button INSIDE (Only for quantity > 1) */}
                {quantity > 1 && isWinnerSet && !isRolling && allowReshuffle && onReshuffle && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => onReshuffle(i)}
                        aria-label={t.doorprize.reshuffleWinnerAction}
                        className="absolute right-0 opacity-0 group-hover/item:opacity-100 focus-visible:opacity-100 rounded-full cursor-pointer text-rose-300 hover:text-white hover:bg-rose-500 p-1.5 transition-all flex items-center justify-center bg-slate-900/90 ring-1 ring-white/10"
                      >
                        <RefreshCw className="size-3" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[240px] text-xs">{t.help.reshuffle}</TooltipContent>
                  </Tooltip>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Reshuffle Button OUTSIDE (Only for quantity === 1) */}
      {quantity === 1 && hasWinner && !isRolling && allowReshuffle && onReshuffle && (
        <div className="flex justify-center mt-2 transition-all duration-300">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onReshuffle()}
                className="text-xs rounded-full cursor-pointer text-rose-300 hover:text-white hover:bg-rose-500/80 px-2.5 py-1 ring-1 ring-rose-300/20 transition-colors flex items-center gap-1"
              >
                <RefreshCw className="size-3" />
                {t.doorprize.reshuffle}
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-[240px] text-xs">{t.help.reshuffle}</TooltipContent>
          </Tooltip>
        </div>
      )}
    </motion.div>
  );
};
