"use client"

import { useState, useMemo, useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";
import { SessionData, PrizeItem } from "@/data/prizes";
import { PrizeBox } from "./PrizeBox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Trophy, RotateCcw, Grip, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { shuffleWithRandomOrg } from "@/lib/random";
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
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
  const [drawingKeys, setDrawingKeys] = useState<Set<string>>(new Set());

  // Reshuffle State
  const [reshuffleTarget, setReshuffleTarget] = useState<{
    prizeId: string;
    index: number;
    key: string;
  } | null>(null);

  const { participants, winners, addWinner, resetDraw, updateWinner, sessions } =
    useStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio("/winner-sound-clap-final.mp3");
    audioRef.current.loop = false; // Playing full track with celebration
    audioRef.current.volume = 1.0;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isAnimationPlaying) {
      // Play sound
      audioRef.current
        ?.play()
        .catch((e) => console.log("Audio play failed:", e));
    } else {
      // Stop sound
      if (audioRef.current) {
        // audioRef.current.pause();
        // audioRef.current.currentTime = 0;
      }
    }
  }, [isAnimationPlaying]);

  useEffect(() => {
    // Sync active session if invalid or not set
    if (sessions.length > 0) {
      const exists = sessions.find((s) => s.id === activeSessionId);
      if (!exists) {
        setActiveSessionId(sessions[0].id);
      }
    }
  }, [sessions, activeSessionId]);

  const activeSession = useMemo(() => {
    if (sessions.length === 0) return null;
    return sessions.find((s) => s.id === activeSessionId) || sessions[0];
  }, [sessions, activeSessionId]);

  const displayBoxes = useMemo(
    () => (activeSession ? getDisplayBoxes(activeSession) : []),
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

  const isSessionComplete =
    displayBoxes.length > 0 && sessionWinnersCount === displayBoxes.length;

  const handleStartDraw = async () => {
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

    // Constraint: Minimal prize per batch draw is 4 prize
    // However, if we are just completing a session that has fewer leftovers, we probably should allow it?
    // User said: "minimal prize per batch draw is 4 prize".
    // Does this mean a SESSION must have 4 prizes? Or we can't draw if remaining < 4?
    // "including session (for batch draw prize)"
    // "minimal prize per batch draw is 4 prize, and minimal single draw is 1 prize."
    // This usually means if we are doing a "Batch Draw" (filling multiple slots), we need at least 4.
    // If a session has 3 prizes, is it a batch draw?
    // Let's assume: If the session has total prizes >= 4, it's a batch session.
    // Use case: Grand prize usually 1. Session prizes usually many (5, 10).
    // So if slotsToFill < 4, is it allowed?
    // If the session *definition* has < 4 prizes, maybe it's treated as single draws?
    // Let's enforce: If this is a simultaneous draw of ALL remaining slots, and the total session size was intended to be a batch...
    // Let's interpret strict: "minimal prize per batch draw is 4".
    // If we are drawing > 1 prize at once, it must be >= 4?
    // Or does it mean we can't define a session with 2 or 3 prizes?
    // "minimal prize per batch draw is 4 prize" -> likely means we draw 4+ at once.
    // But here we draw ALL slotsToFill at once.
    // So if slotsToFill < 4 and slotsToFill > 1, maybe block?
    // But if we have 5 prizes, draw 4, 1 left. The last 1 is a single draw.
    // So:
    // If slotsToFill > 1 AND slotsToFill < 4 -> Block?
    // "minimal single draw is 1 prize" -> implied.
    // Let's implemented: If drawing > 1, must be >= 4.
    // So you can draw 1 (Single), or 4+ (Batch). You cannot draw 2 or 3 at once.
    // if (slotsToFill.length > 1 && slotsToFill.length < 4) {
    //   alert(
    //     "Batch draw constraint: limit minimal 4 prizes per draw. (You have " +
    //     slotsToFill.length +
    //     " prizes pending)"
    //   );
    //   return;
    // }

    if (availableCandidates.length < slotsToFill.length) {
      alert(
        `Not enough participants! Need ${slotsToFill.length}, but only have ${availableCandidates.length}.`
      );
      return;
    }

    // 2. Shuffle candidates and pick winners (using Random.org)
    const shuffled = await shuffleWithRandomOrg(availableCandidates);
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
    // Audio: 9s shuffle + 5s celebration = 14s total
    const SHUFFLE_DURATION = 9000;
    const TOTAL_DURATION = 14000;

    // Trigger confetti exactly when shuffling ends (at 9s)
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
      });
      // Extra burst shortly after
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 160,
          origin: { y: 0.6 },
        });
      }, 500);
    }, SHUFFLE_DURATION);

    // Reset state after full audio duration (14s)
    setTimeout(() => {
      setIsAnimationPlaying(false);
      setDrawingKeys(new Set());
    }, TOTAL_DURATION);
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

  const handleConfirmReshuffle = async () => {
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

    // 2. Pick a new winner (using Random.org)
    const shuffled = await shuffleWithRandomOrg(availableCandidates);
    const newWinner = shuffled[0];

    // 3. Animate ONLY this box
    setDrawingKeys(new Set([reshuffleTarget.key]));
    setIsAnimationPlaying(true);
    setReshuffleTarget(null);

    // 4. Update store
    updateWinner(reshuffleTarget.prizeId, reshuffleTarget.index, newWinner);

    // 5. Reset animation state
    const SHUFFLE_DURATION = 9000;
    const TOTAL_DURATION = 14000;

    // Confetti at 9s
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
      });
    }, SHUFFLE_DURATION);

    // Cleanup at 14s
    setTimeout(() => {
      setIsAnimationPlaying(false);
      setDrawingKeys(new Set());
    }, TOTAL_DURATION);
  };

  // Calculate dynamic base duration to ensure animation always ends around 9-10s
  const drawingIndices = useMemo(() => {
    return Array.from(drawingKeys).map((k) => {
      const parts = k.split("-");
      return parseInt(parts[parts.length - 1] || "0");
    });
  }, [drawingKeys]);

  const maxDrawingIndex =
    drawingIndices.length > 0 ? Math.max(...drawingIndices) : 0;

  // Target finish time is 9000ms (draw sound ends, celebration starts)
  // formula: stopTime = base + index*500
  // we want: base + maxIndex*500 = 9000
  // so: base = 9000 - maxIndex*500
  // Minimum base of 2000s just to be safe, but typically maxIndex is small (0-4) so 9000-2000=7000 is fine.
  const dynamicBaseDuration = Math.max(3000, 9000 - maxDrawingIndex * 500);

  /* Main Draw Area */
  return (
    <div className="h-screen flex flex-col w-full">
      {/* Session Tabs */}
      <div className="max-w-7xl mx-auto">
        <div className="pt-14 relative group">
          <input
            value={useStore((state) => state.eventName)}
            onChange={(e) => useStore.getState().setEventName(e.target.value)}
            className="text-5xl text-center font-semibold text-white bg-transparent border-none outline-none focus:ring-0 placeholder:text-white/50 w-full"
            placeholder="Edit Label Acara"
          />
          <span className="absolute top-0 -right-6 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">
            <Grip className="w-4 h-4" />
          </span>
        </div>
      </div>

      <div className="p-4 overflow-y-auto min-h-[500px]">
        {!activeSession ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
            <AlertCircle className="w-16 h-16 mb-4 opacity-20" />
            <h2 className="text-xl font-semibold mb-2">No Active Session</h2>
            <p>Please add prizes in the Prize Manager below.</p>
          </div>
        ) : (
          <div className="min-w-5xl max-w-6xl mx-auto">
            <div className="flex items-center justify-between space-x-4 mb-6">
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

              <div className="flex p-4 gap-2 m-3 border border-slate-600 z-10 shadow-sm rounded-full overflow-x-auto">
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => setActiveSessionId(session.id)}
                    disabled={isAnimationPlaying}
                    className={cn(
                      "px-3 cursor-pointer flex items-center py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap",
                      activeSessionId === session.id
                        ? "bg-blue-500 text-white shadow-md"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    {session.name}
                    {/* Show progress dot */}
                    {(() => {
                      const sBoxes = getDisplayBoxes(session);
                      const sCompleted =
                        sBoxes.length > 0 &&
                        sBoxes.every((b) => (winners[b.prize.id] || [])[b.index]);
                      return sCompleted ? (
                        <Check className="ml-1 size-3 text-green-400" />
                      ) : null;
                    })()}
                  </button>
                ))}
                {/* <div className="mr-3 flex items-center text-white">
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
                </div> */}
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
                      START DRAW
                    </span>
                  )}
                </Button>
              )}
              {isSessionComplete && (
                <div className="px-5 py-3 h-15 text-sm bg-green-100 text-green-800 rounded-full flex items-center font-bold">
                  <Trophy className="w-6 h-6 mr-2" />
                  Draw Complete
                </div>
              )}
            </div>

            {/* Boxes Grid */}
            <div className="h-[60vh] flex items-center justify-center">
              <div
                title="prize boxes"
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
                      candidates={availableCandidates}
                      // Only roll if explicitly part of current draw
                      isRolling={isAnimationPlaying && drawingKeys.has(box.key)}
                      delay={idx} // Stagger effect
                      baseDuration={dynamicBaseDuration}
                      onReshuffle={() => handleReshuffleClick(box)}
                      allowReshuffle={activeSession.allowReshuffle}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}
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
