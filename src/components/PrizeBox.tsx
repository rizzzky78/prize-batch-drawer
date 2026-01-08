import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PrizeBoxProps {
  prizeName: string;
  winnerName?: string;
  isRolling: boolean;
  candidates: string[];
  delay?: number; // Delay before stopping to create staggered effect
  baseDuration?: number; // Base duration for the shuffle
  onFinish?: () => void;
  onReshuffle?: () => void;
  activeSessionId: string;
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
}: PrizeBoxProps) => {
  const [displayedName, setDisplayedName] = useState<string>("???");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRolling) {
      // Start shuffling
      intervalRef.current = setInterval(() => {
        if (candidates.length > 0) {
          const randomName =
            candidates[Math.floor(Math.random() * candidates.length)];
          setDisplayedName(randomName);
        } else {
          setDisplayedName("...");
        }
      }, 80); // Speed of shuffle

      // Stop shuffling after delay
      const timeout = setTimeout(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayedName(winnerName || "No Winner");
        onFinish?.();
      }, baseDuration + delay * 500); // Base time + stagger

      return () => {
        clearTimeout(timeout);
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    } else if (winnerName) {
      // If not rolling but has winner (persisted state), show winner
      setDisplayedName(winnerName);
    } else {
      setDisplayedName("????");
    }
  }, [isRolling, winnerName, candidates, delay, baseDuration, onFinish]);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-[250px]"
    >
      <Card
        className={cn(
          "flex flex-col rounded-none items-center justify-center p-2 h-24 sm:h-26 shadow-md border-2 transition-colors duration-300 overflow-hidden relative",
          isRolling
            ? "border-yellow-400 bg-yellow-50"
            : winnerName
            ? "border-green-500 bg-green-50"
            : "border-slate-200"
        )}
      >
        <div className="absolute top-3 left-0 w-full text-center flex justify-center">
          <div className="text-[10px] bg-slate-200 py-1 px-3 font-semibold rounded-full w-fit sm:text-xs text-black uppercase tracking-wider truncate block">
            <span>{prizeName}</span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center pt-3 w-full">
          <span
            className={cn(
              "font-bold text-center px-2 truncate w-full uppercase",
              winnerName && !isRolling
                ? "text-green-700 text-sm sm:text-base"
                : "text-slate-800 text-sm"
            )}
          >
            {displayedName}
          </span>
        </div>
      </Card>

      {/* Reshuffle Button for Grand/Super Grand */}
      {winnerName &&
        !isRolling &&
        (activeSessionId.startsWith("grand") ||
          activeSessionId.startsWith("super")) &&
        onReshuffle && (
          <div className="flex justify-center mt-2 transition-all duration-300">
            <button
              onClick={onReshuffle}
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
