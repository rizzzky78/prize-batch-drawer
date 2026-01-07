import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Users, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ParticipantManager = () => {
  const [name, setName] = useState("");
  const { participants, addParticipant, removeParticipant, resetParticipants, isLocked } = useStore();

  const handleAdd = () => {
    if (name.trim()) {
      addParticipant(name.trim());
      setName("");
    }
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
          <Button
            variant="secondary"
            size="sm"
            onClick={resetParticipants}
            disabled={isLocked || participants.length === 0}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            title="Reset all participants"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pt-10 flex flex-col gap-4 overflow-hidden">
        <div className="flex gap-2">
          <Input
            placeholder={isLocked ? "Registration closed" : "Enter participant name... and then press Enter to entry"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLocked}
            className="flex-1"
          />
          <Button onClick={handleAdd} disabled={isLocked || !name.trim()} size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 -mx-4 px-4">
          {participants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400 text-sm italic">
              <Users className="w-12 h-12 mb-2 opacity-20" />
              No participants yet
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {participants.map((p, idx) => (
                <div
                  key={`${p}-${idx}`}
                  className="group flex items-center justify-between bg-slate-50 border rounded-lg px-3 py-2 text-sm hover:border-slate-300 transition-colors"
                >
                  <span className="truncate">{p}</span>
                  {!isLocked && (
                    <button
                      onClick={() => removeParticipant(p)}
                      className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
