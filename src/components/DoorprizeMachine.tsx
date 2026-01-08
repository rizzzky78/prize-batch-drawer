import { useState, useMemo } from "react";
import { useStore } from "@/store/useStore";
import { PRIZE_DATA, SessionData, PrizeItem } from "@/data/prizes";
import { PrizeBox } from "./PrizeBox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Play,
  Trophy,
  RotateCcw,
  DotSquare,
  Grip,
  Check,
} from "lucide-react";
import { cn, fisherYatesShuffle } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import confetti from "canvas-confetti";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Helper to flatten prizes into display units
const getDisplayBoxes = (session: SessionData) => {
  const boxes: { prize: PrizeItem; index: number; key: string }[] = [];
  session.prizes.forEach((prize) => {
    for (let i = 0; i < prize.quantity; i++) {
      boxes.push({
        prize,
        index: i,
        key: `${prize.id}-${i}`,
      });
    }
  });
  return boxes;
};

export const DoorprizeMachine = () => {
  const [activeSessionId, setActiveSessionId] = useState<string>("sesi-1");
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
  const [drawingKeys, setDrawingKeys] = useState<Set<string>>(new Set());

  // Reshuffle State
  const [reshuffleTarget, setReshuffleTarget] = useState<{
    prizeId: string;
    index: number;
    key: string;
  } | null>(null);

  const { participants, winners, addWinner, resetDraw, updateWinner } =
    useStore();

  const activeSession =
    PRIZE_DATA.find((s) => s.id === activeSessionId) || PRIZE_DATA[0];
  const displayBoxes = useMemo(
    () => getDisplayBoxes(activeSession),
    [activeSession]
  );

  const existingWinners = new Set(Object.values(winners).flat());
  const availableCandidates = participants.filter(
    (p) => !existingWinners.has(p)
  );

  const sessionWinnersCount = displayBoxes.filter((box) => {
    const list = winners[box.prize.id] || [];
    return list[box.index] !== undefined;
  }).length;

  const isSessionComplete = sessionWinnersCount === displayBoxes.length;

  const handleStartDraw = () => {
    if (isAnimationPlaying) return;

    // 1. Identify needed slots
    const slotsToFill: { prizeId: string; index: number; key: string }[] = [];
    displayBoxes.forEach((box) => {
      const prizeWinners = winners[box.prize.id] || [];
      if (!prizeWinners[box.index]) {
        slotsToFill.push({
          prizeId: box.prize.id,
          index: box.index,
          key: box.key,
        });
      }
    });

    if (slotsToFill.length === 0) return;

    if (availableCandidates.length < slotsToFill.length) {
      alert(
        `Not enough participants! Need ${slotsToFill.length}, but only have ${availableCandidates.length}.`
      );
      return;
    }

    // 2. Shuffle candidates and pick winners
    const shuffled = fisherYatesShuffle(availableCandidates);
    const allocatedWinners: { prizeId: string; name: string }[] = [];

    slotsToFill.forEach((slot, idx) => {
      allocatedWinners.push({
        prizeId: slot.prizeId,
        name: shuffled[idx],
      });
    });

    // 3. Set drawing keys AND animation state
    setDrawingKeys(new Set(slotsToFill.map((s) => s.key)));
    setIsAnimationPlaying(true);

    // 4. Update store
    allocatedWinners.forEach(({ prizeId, name }) => {
      addWinner(prizeId, name);
    });

    // 5. Reset animation state
    const maxIndex = displayBoxes.length;

    // Extended duration for "Doorprize Utama"
    const baseDuration = activeSessionId === "utama" ? 10000 : 3000;
    const maxTime = baseDuration + maxIndex * 500 + 1000;

    setTimeout(() => {
      setIsAnimationPlaying(false);
      setDrawingKeys(new Set());

      confetti({
        particleCount: 500,
        spread: 100,
        origin: { y: 0.6 },
      });

      // Extra burst for Grand Prize
      if (activeSessionId === "utama") {
        setTimeout(() => {
          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 },
          });
        }, 500);
      }
    }, maxTime);
  };

  const handleReshuffleClick = (box: {
    prize: PrizeItem;
    index: number;
    key: string;
  }) => {
    if (isAnimationPlaying) return;
    setReshuffleTarget({
      prizeId: box.prize.id,
      index: box.index,
      key: box.key,
    });
  };

  const handleConfirmReshuffle = () => {
    if (!reshuffleTarget) return;

    // 1. Get pool of candidates excluding ALL current winners (including the one being replaced,
    // effectively, because we want a NEW winner)

    // Note: availableCandidates already filters out anyone in 'existingWinners'.
    // The current winner of this prize IS in 'existingWinners'.
    // So 'availableCandidates' are people who definitely haven't won anything yet.
    // If the requirement is "winner didn't attend", they enter back to 'not winners'?
    // Or are they disqualified?
    // Assuming we pick from 'availableCandidates' (people who haven't won yet).

    if (availableCandidates.length === 0) {
      alert("No available candidates to reshuffle!");
      setReshuffleTarget(null);
      return;
    }

    // 2. Pick a new winner
    const shuffled = fisherYatesShuffle(availableCandidates);
    const newWinner = shuffled[0];

    // 3. Animate ONLY this box
    setDrawingKeys(new Set([reshuffleTarget.key]));
    setIsAnimationPlaying(true);
    setReshuffleTarget(null);

    // 4. Update store
    updateWinner(reshuffleTarget.prizeId, reshuffleTarget.index, newWinner);

    // 5. Reset animation state
    setTimeout(() => {
      setIsAnimationPlaying(false);
      setDrawingKeys(new Set());
      // Simple confetti for reshuffle
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 },
      });
    }, 4000); // 3s base + 1s buffer
  };

  return (
    <div className="h-screen flex flex-col w-full">
      {/* Session Tabs */}
      <div className="max-w-7xl mx-auto">
        <div className="pt-14 relative group">
          <input
            value={useStore((state) => state.eventName)}
            onChange={(e) => useStore.getState().setEventName(e.target.value)}
            className="text-5xl text-center font-semibold text-white bg-transparent border-none outline-none focus:ring-0 placeholder:text-white/50 w-full"
            placeholder="Label Acara"
          />
          <span className="absolute top-0 -right-6 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">
            <Grip className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Main Draw Area */}
      <div className="p-4 overflow-y-auto min-h-[500px]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl uppercase font-bold text-white">
                {activeSession.name}
              </h2>
              <p className="text-slate-300 mt-1 text-sm">
                <span>{availableCandidates.length} potential winners left</span>
                <br />
                <span>{displayBoxes.length}</span> Items
              </p>
            </div>

            <div className="flex p-4 gap-2 m-3 border border-slate-600 z-10 shadow-sm rounded-full">
              {PRIZE_DATA.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  disabled={isAnimationPlaying}
                  className={cn(
                    "px-3 flex items-center py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap",
                    activeSessionId === session.id
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {session.name}
                  {/* Show progress dot */}
                  {(() => {
                    const sBoxes = getDisplayBoxes(session);
                    const sCompleted = sBoxes.every(
                      (b) => (winners[b.prize.id] || [])[b.index]
                    );
                    return sCompleted ? (
                      <Check className="ml-1 size-3 text-green-400" />
                    ) : null;
                  })()}
                </button>
              ))}
              <div className="flex-1"></div>
              <div className="mr-3 flex items-center text-white">
                <Popover>
                  <PopoverTrigger className="cursor-pointer">
                    <Grip className="size-5" />
                  </PopoverTrigger>
                  <PopoverContent className="flex justify-center items-center h-[140px] ">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isAnimationPlaying}
                          className="text-red-500 border-red-200 bg-red-50 hover:bg-red-100"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Reset Prizes
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reset All Prizes?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will clear all winners for ALL sessions. This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              resetDraw();
                            }}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Confirm Reset
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {!isSessionComplete && (
              <Button
                size="lg"
                onClick={handleStartDraw}
                disabled={
                  isAnimationPlaying || availableCandidates.length === 0
                }
                className={cn(
                  "cursor-pointer rounded-full h-15 px-5 text-lg shadow-xl transition-all font-bold tracking-wide",
                  isAnimationPlaying
                    ? "bg-yellow-500 scale-95"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105"
                )}
              >
                {isAnimationPlaying ? (
                  <span className="flex items-center animate-pulse">
                    Running Draw...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Play className="fill-current w-6 h-6 mr-2" />
                    DRAW BATCH
                  </span>
                )}
              </Button>
            )}
            {isSessionComplete && (
              <div className="px-5 py-3 h-15 text-sm bg-green-100 text-green-800 rounded-full flex items-center font-bold">
                <Trophy className="w-6 h-6 mr-2" />
                Batch Complete
              </div>
            )}
          </div>

          {/* Boxes Grid */}
          <div className="h-[60vh] flex items-center justify-center">
            <div
              title="prize boxes"
              // className="pt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-12"
              className="flex flex-wrap items-center justify-center gap-2"
            >
              {displayBoxes.map((box, idx) => {
                const prizeWinners = winners[box.prize.id] || [];
                const winnerName = prizeWinners[box.index]; // winner for this specific instance (0-indexed)

                return (
                  <PrizeBox
                    key={box.key}
                    activeSessionId={activeSessionId}
                    prizeName={box.prize.name}
                    winnerName={winnerName}
                    candidates={participants}
                    // Only roll if explicitly part of current draw
                    isRolling={isAnimationPlaying && drawingKeys.has(box.key)}
                    delay={idx} // Stagger effect
                    baseDuration={activeSessionId === "utama" ? 10000 : 3000}
                    onReshuffle={() => handleReshuffleClick(box)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Reshuffle Confirmation Dialog */}
      <AlertDialog
        open={!!reshuffleTarget}
        onOpenChange={(open) => !open && setReshuffleTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reshuffle Winner?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reshuffle this prize? The current winner
              will be replaced by a new random candidate. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmReshuffle}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Confirm Reshuffle
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
