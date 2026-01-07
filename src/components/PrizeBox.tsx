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
}

export const PrizeBox = ({
  prizeName,
  winnerName,
  isRolling,
  candidates,
  delay = 0,
  baseDuration = 3000,
  onFinish,
}: PrizeBoxProps) => {
  const [displayedName, setDisplayedName] = useState<string>("???");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRolling) {
      // Start shuffling
      intervalRef.current = setInterval(() => {
        if (candidates.length > 0) {
          const randomName = candidates[Math.floor(Math.random() * candidates.length)];
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
      setDisplayedName("READY");
    }
  }, [isRolling, winnerName, candidates, delay, baseDuration, onFinish]);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "flex flex-col rounded-3xl items-center justify-center p-2 h-24 sm:h-32 shadow-md border-2 transition-colors duration-300 overflow-hidden relative",
        isRolling ? "border-yellow-400 bg-yellow-50" : winnerName ? "border-green-500 bg-green-50" : "border-slate-200"
      )}>
        <div className="absolute top-3 left-0 w-full text-center flex justify-center">
          <div className="text-[10px] bg-slate-300 py-1 px-3 font-semibold rounded-full w-fit sm:text-xs text-black uppercase tracking-wider truncate block">
            <span>
              {prizeName}
            </span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center pt-3 w-full">
          <span className={cn(
            "font-bold text-center px-2 truncate w-full uppercase",
            winnerName && !isRolling ? "text-green-700 text-sm sm:text-base" : "text-slate-800 text-sm"
          )}>
            {displayedName}
          </span>
        </div>
      </Card>
    </motion.div>
  );
};
