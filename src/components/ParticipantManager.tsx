"use client"

import { useState } from "react";
import { useStore } from "@/store/useStore";
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
        alert("The input participant name was duplicate.");
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
    <Card className="w-full bg-transparent border-none h-full flex flex-col border-t-4 rounded-none shadow-none border-t-slate-900">
      <CardHeader className="pb-3 space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2 text-xl">
            <Users className="w-5 h-5" />
            Participants
            <Badge variant="secondary" className="ml-2 text-xs font-normal">
              {participants.length} total
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <ParticipantImporter onImport={handleImport} />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={participants.length === 0}
                  className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50"
                  title="Reset all participants"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Participants?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently remove all
                    non-winning participants from the list. Winners will remain.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={resetParticipants}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Yes, Reset All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pt-10 flex flex-col gap-4 overflow-hidden">
        <div className="flex gap-2">
          <Input
            placeholder="Enter participant name... and then press Enter to entry"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button
            variant="outline"
            onClick={handleAdd}
            disabled={!name.trim()}
            size="icon"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 -mx-4 px-4 h-[80vh]">
          {participants.length === 0 ? (
            <div className="h-[400px] flex flex-col items-center justify-center py-8 text-slate-400 text-sm italic">
              <Users className="w-12 h-12 mb-2 opacity-20" />
              No participants yet
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {participants.map((p, idx) => {
                // Check if this participant is a winner using the precomputed set
                const isWinner = allWinners.has(p);

                return (
                  <div
                    key={`${p}-${idx}`}
                    className={`group flex items-center justify-between px-3 py-2 text-sm border transition-colors ${isWinner
                      ? "bg-amber-50 border-amber-500 text-amber-900 shadow-sm font-medium"
                      : "bg-slate-50 border-slate-200 hover:border-slate-300"
                      }`}
                  >
                    <span className="truncate flex items-center gap-1.5">
                      {isWinner && <span className="text-amber-500 text-xs">👑</span>}
                      {p}
                    </span>
                    {!isWinner && (
                      <button
                        onClick={() => removeParticipant(p)}
                        className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove participant"
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
    </Card >
  );
};
