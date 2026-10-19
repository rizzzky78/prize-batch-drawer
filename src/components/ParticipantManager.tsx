"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { useTranslation } from "@/lib/translations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Users, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ParticipantImporter } from "./ParticipantImporter";
import { HelpTip, Hint } from "./HelpTip";
import { cn } from "@/lib/utils";

export const ParticipantManager = () => {
  const [name, setName] = useState("");
  const {
    participants,
    addParticipant,
    addParticipants,
    removeParticipant,
    resetParticipants,
    isLocked,
    winners,
  } = useStore();
  const t = useTranslation();

  const allWinners = new Set<string>();

  Object.values(winners).forEach((list) => {
    if (Array.isArray(list)) {
      list.forEach((w) => allWinners.add(String(w)));
    }
  });

  const handleAdd = () => {
    const trimmedName = name.trim();
    if (trimmedName) {
      if (
        participants.some((p) => p.toLowerCase() === trimmedName.toLowerCase())
      ) {
        alert(t.participants.duplicateAlert);
        return;
      }
      addParticipant(trimmedName);
      setName("");
    }
  };

  const handleImport = (names: string[]) => {
    addParticipants(names);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <Card className="w-full bg-white/[0.03] rounded-3xl ring-1 ring-white/10 h-full flex flex-col shadow-none">
      <CardHeader className="pb-3 space-y-1">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-white flex items-center gap-2 text-xl">
            <span className="grid place-items-center size-9 rounded-xl bg-sky-400/15 text-sky-300 ring-1 ring-sky-300/20">
              <Users className="w-5 h-5" />
            </span>
            {t.participants.title}
            <Badge variant="secondary" className="ml-1 text-xs font-normal tabular-nums">
              {participants.length} {t.participants.total}
            </Badge>
            {allWinners.size > 0 && (
              <Badge className="text-xs font-normal bg-amber-400/15 text-amber-200 tabular-nums gap-1">
                👑 {allWinners.size}
                <HelpTip text={t.help.winnerMark} className="text-amber-200/70 hover:text-amber-100" />
              </Badge>
            )}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <ParticipantImporter onImport={handleImport} />
            <AlertDialog>
              <Hint text={t.help.resetParticipants}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={participants.length === 0}
                    className="cursor-pointer"
                    aria-label={t.participants.resetAllTitle}
                  >
                    <RotateCcw className="w-4 h-4" />
                    {t.participants.reset}
                  </Button>
                </AlertDialogTrigger>
              </Hint>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t.participants.resetTitle}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t.participants.resetDesc}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={resetParticipants}
                    className="bg-rose-600 text-white hover:bg-rose-500"
                  >
                    {t.participants.resetConfirm}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pt-2 flex flex-col gap-4 overflow-hidden">
        <div className="flex gap-2 rounded-2xl bg-black/20 ring-1 ring-white/5 p-2 pl-3 items-center">
          <HelpTip text={t.help.participantInput} />
          <Input
            placeholder={t.participants.inputPlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label={t.participants.inputPlaceholder}
            className="flex-1 bg-transparent border-0 text-white placeholder:text-slate-500 focus-visible:ring-0 shadow-none"
          />
          <Button onClick={handleAdd} disabled={!name.trim()} size="icon" className="cursor-pointer" aria-label={t.participants.title}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="-mx-4 px-4 h-[60vh]">
          {participants.length === 0 ? (
            <div className="h-[400px] flex flex-col items-center justify-center py-8 text-slate-500 text-sm rounded-2xl border border-dashed border-white/10">
              <Users className="w-10 h-10 mb-3 opacity-40" />
              {t.participants.empty}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 pb-4">
              {participants.map((p, idx) => {
                // Check if this participant is a winner using the precomputed set
                const isWinner = allWinners.has(p);

                return (
                  <div
                    key={`${p}-${idx}`}
                    className={cn(
                      "group rounded-xl flex items-center justify-between px-3 py-2 text-sm ring-1 transition-colors",
                      isWinner
                        ? "bg-amber-400/10 ring-amber-300/40 text-amber-100 font-medium"
                        : "bg-white/[0.04] ring-white/10 text-slate-200 hover:bg-white/[0.07]",
                    )}
                  >
                    <span className="truncate flex items-center gap-1.5">
                      {isWinner && (
                        <span className="text-xs">👑</span>
                      )}
                      {p}
                    </span>
                    {!isWinner && (
                      <button
                        onClick={() => removeParticipant(p)}
                        className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity cursor-pointer"
                        aria-label={t.participants.removeTitle}
                        title={t.participants.removeTitle}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
