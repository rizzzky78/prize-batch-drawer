"use client";

/* PrizeManager Cleanups */
import { useState, useMemo } from "react";
import { useStore } from "@/store/useStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Trash2, Plus, Gift, RotateCcw, Package, ChevronDown, ChevronUp, Check } from "lucide-react";
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
import { SessionData } from "@/data/prizes";

export const PrizeManager = () => {
  const [sessionName, setSessionName] = useState("");
  const [open, setOpen] = useState(false);
  const [prizeName, setPrizeName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [allowReshuffle, setAllowReshuffle] = useState(false);

  const sessions = useStore((state) => state.sessions);
  const addPrize = useStore((state) => state.addPrize);
  const removePrize = useStore((state) => state.removePrize);
  const resetPrizes = useStore((state) => state.resetPrizes);
  const { resetDraw } = useStore();

  // Memoize unique session names for the suggestion list
  const uniqueSessions = useMemo(() => {
    const names = sessions.map((s) => s.name);
    return Array.from(new Set(names));
  }, [sessions]);

  const handleAdd = () => {
    if (!sessionName.trim() || !prizeName.trim() || !quantity) return;
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 1) return;

    addPrize(sessionName.trim(), prizeName.trim(), qty, allowReshuffle);
    setPrizeName("");
    setQuantity("1");
    // Keep session name and reshuffle setting for faster entry
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  const totalPrizes = sessions.reduce(
    (acc, session) => acc + session.prizes.reduce((s, p) => s + p.quantity, 0),
    0
  );

  const handleSessionSelect = (name: string) => {
    setSessionName(name);
    setOpen(false);
    // Find existing session settings
    const existingSession = sessions.find(s => s.name === name);
    if (existingSession) {
      setAllowReshuffle(!!existingSession.allowReshuffle);
    }
  };

  return (
    <Card className="w-full bg-transparent border-none h-full flex flex-col border-t-4 rounded-none shadow-none border-t-slate-900/50">
      <CardHeader className="pb-3 space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2 text-xl">
            <Gift className="w-5 h-5" />
            Prize Pool
            <Badge variant="secondary" className="ml-2 text-xs font-normal">
              {totalPrizes} items
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 border-red-200 bg-red-50 hover:bg-red-100"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Winner
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50"
                  disabled={totalPrizes === 0}
                  title="Reset all prizes"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset All Prizes?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently remove all
                    sessions and prizes.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={resetPrizes}
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

      <CardContent className="flex-1 pt-4 flex flex-col gap-4 overflow-hidden">
        {/* Input Form */}
        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="col-span-1 md:col-span-4 flex flex-col gap-2">
            <Label htmlFor="session-name" className="text-white">Session Name</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <Input
                    id="session-name"
                    placeholder="Session (e.g. Sesi 1)"
                    value={sessionName}
                    onChange={(e) => {
                      setSessionName(e.target.value);
                      if (!open) setOpen(true);
                      // Reset/Update reshuffle if name changes?
                      // Better to just let them set it, or try to auto-find if exact match
                      const existing = sessions.find(s => s.name === e.target.value);
                      if (existing) setAllowReshuffle(!!existing.allowReshuffle);
                    }}
                    onFocus={() => setOpen(true)}
                    className="bg-slate-900/20 border-slate-700 text-slate-100 placeholder:text-slate-500 pr-8"
                    autoComplete="off"
                  />
                  <div className="absolute right-2 top-2.5 text-slate-500 pointer-events-none">
                    {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent
                className="w-(--radix-popover-trigger-width) p-1 bg-slate-900 border-slate-700 max-h-[200px] overflow-y-auto"
                align="start"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                {uniqueSessions.length === 0 ? (
                  <div className="p-2 text-sm text-slate-500 text-center">No previous sessions</div>
                ) : (
                  <div className="flex flex-col gap-1">
                    {uniqueSessions.filter(s => s.toLowerCase().includes(sessionName.toLowerCase())).map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSessionSelect(s)}
                        className="text-left px-2 py-1.5 text-sm text-slate-200 hover:bg-slate-800 rounded-sm transition-colors flex items-center justify-between group"
                      >
                        {s}
                        {sessionName === s && <Check className="h-3 w-3 text-emerald-500" />}
                      </button>
                    ))}
                    {uniqueSessions.filter(s => s.toLowerCase().includes(sessionName.toLowerCase())).length === 0 && (
                      <div className="p-2 text-sm text-slate-500 italic">No matching session found</div>
                    )}
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
          <div className="col-span-1 md:col-span-4 flex flex-col gap-2">
            <Label htmlFor="prize-name" className="text-white">Prize Name</Label>
            <Input
              id="prize-name"
              placeholder="Prize Name"
              value={prizeName}
              onChange={(e) => setPrizeName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-slate-900/20 border-slate-700 text-slate-100 placeholder:text-slate-500"
            />
          </div>
          <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
            <Label htmlFor="quantity" className="text-white">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              placeholder="Qty"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-slate-900/20 border-slate-700 text-slate-100 placeholder:text-slate-500"
            />
          </div>

          <div className="col-span-1 md:col-span-2 flex flex-col gap-2 items-start justify-center pb-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="allowReshuffle"
                className="h-4 w-4 rounded border-slate-700 bg-slate-900/20 text-blue-600 focus:ring-blue-600 focus:ring-offset-slate-900"
                checked={allowReshuffle}
                onChange={(e) => setAllowReshuffle(e.target.checked)}
              />
              <Label htmlFor="allowReshuffle" className="text-white cursor-pointer text-xs">Allow Reshuffle</Label>
            </div>
          </div>

          <div className="col-span-1 md:col-span-12 flex justify-end">
            <Button
              variant="secondary"
              // size="icon"
              className="w-full md:w-auto"
              onClick={handleAdd}
              disabled={!sessionName.trim() || !prizeName.trim()}
              title="Add Prize"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Prize
            </Button>
          </div>
        </div>

        {/* Prize List */}
        <ScrollArea className="flex-1 -mx-4 px-4 h-[50vh]">
          {sessions.length === 0 ? (
            <div className="h-[200px] flex flex-col items-center justify-center py-8 text-slate-500 text-sm italic">
              <Package className="w-12 h-12 mb-2 opacity-20" />
              No prizes configured
            </div>
          ) : (
            <div className="space-y-6 pb-6">
              {sessions.map((session) => (
                <div key={session.id} className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center">
                    {session.name}
                    <span className="ml-2 text-xs font-normal text-slate-300 capitalize bg-slate-700/30 px-2 py-0.5 rounded-full">
                      {session.prizes.reduce((s, p) => s + p.quantity, 0)} items
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {session.prizes.map((prize) => (
                      <div
                        key={prize.id}
                        className="group flex items-center justify-between bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <Badge
                            variant="outline"
                            className="text-yellow-400 border-yellow-400/30 h-6 w-6 flex items-center justify-center p-0 shrink-0"
                          >
                            {prize.quantity}
                          </Badge>
                          <span className="text-slate-200 truncate">
                            {prize.name}
                          </span>
                        </div>
                        <button
                          onClick={() => removePrize(prize.id)}
                          className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
