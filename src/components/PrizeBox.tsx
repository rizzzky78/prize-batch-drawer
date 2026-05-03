import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
          finalNames = winnerName.map(w => w || "No Winner");
        } else {
          finalNames = [winnerName || "No Winner"];
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
  }, [isRolling, winnerName, candidates, delay, baseDuration, onFinish, quantity]);

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
          "flex flex-col rounded-lg items-center justify-center p-2 shadow-md border-2 transition-colors duration-300 overflow-hidden relative",
          quantity > 1 ? "min-h-[120px] py-4" : "h-24 sm:h-26",
          isRolling
            ? "border-yellow-400 bg-yellow-50"
            : hasWinner
              ? "border-green-500 bg-green-50"
              : "border-slate-200"
        )}
      >
        <div className="absolute top-2 left-0 w-full text-center flex justify-center">
          <div className="text-[10px] bg-slate-200 py-1 px-3 font-semibold rounded-full w-fit sm:text-xs text-black tracking-wider truncate block">
            <p className="font-excon">{prizeName} {quantity > 1 && `(×${quantity})`}</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center pt-8 w-full gap-2">
          {displayedNames.map((name, i) => {
            const isWinnerSet = Array.isArray(winnerName) ? !!winnerName[i] : !!winnerName;

            return (
              <div key={i} className="flex items-center justify-center gap-2 w-full px-2 group/item relative">
                <span
                  className={cn(
                    "font-bold text-center truncate w-full uppercase",
                    isWinnerSet && !isRolling
                      ? "text-green-700 text-sm sm:text-base"
                      : "text-slate-800 text-sm"
                  )}
                >
                  {name}
                </span>

                {/* Reshuffle Button INSIDE (Only for quantity > 1) */}
                {quantity > 1 && isWinnerSet && !isRolling && allowReshuffle && onReshuffle && (
                  <button
                    onClick={() => onReshuffle(i)}
                    className="absolute right-0 opacity-0 group-hover/item:opacity-100 text-xs rounded-full cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 border border-transparent hover:border-red-200 transition-all flex items-center justify-center bg-white shadow-sm"
                    title="Reshuffle Winner"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Reshuffle Button OUTSIDE (Only for quantity === 1) */}
      {quantity === 1 && hasWinner && !isRolling && allowReshuffle && onReshuffle && (
        <div className="flex justify-center mt-2 transition-all duration-300">
          <button
            onClick={() => onReshuffle()}
            className="text-xs rounded-full cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 border border-transparent hover:border-red-200 transition-colors flex items-center gap-1"
            title="Reshuffle Winner"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 16h5v5" />
            </svg>
            Reshuffle
          </button>
        </div>
      )}
    </motion.div>
  );
};
