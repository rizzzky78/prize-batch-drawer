"use client";

/* PrizeManager Cleanups */
import { useState, useMemo } from "react";
import { useStore } from "@/store/useStore";
import { useTranslation } from "@/lib/translations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Trash2,
  Plus,
  Gift,
  RotateCcw,
  Package,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { HelpTip, Hint } from "./help-tip";
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
import { PrizeImporter } from "./prize-importer";

export const PrizeManager = () => {
  const [sessionName, setSessionName] = useState("");
  const [open, setOpen] = useState(false);
  const [prizeName, setPrizeName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [allowReshuffle, setAllowReshuffle] = useState(false);
  const [groupWinners, setGroupWinners] = useState(false);
  const sessions = useStore((state) => state.sessions);
  const addPrize = useStore((state) => state.addPrize);
  const importPrizes = useStore((state) => state.importPrizes);
  const removePrize = useStore((state) => state.removePrize);
  const resetPrizes = useStore((state) => state.resetPrizes);

  const { resetDraw } = useStore();
  const t = useTranslation();

  // Memoize unique session names for the suggestion list
  const uniqueSessions = useMemo(() => {
    const names = sessions.map((s) => s.name);
    return Array.from(new Set(names));
  }, [sessions]);

  const handleAdd = () => {
    if (!sessionName.trim() || !prizeName.trim() || !quantity) return;
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 1) return;

    addPrize(
      sessionName.trim(),
      prizeName.trim(),
      qty,
      allowReshuffle,
      groupWinners,
    );
    setPrizeName("");
    setQuantity("1");
    // Keep session name and reshuffle setting for faster entry
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  const handleImportPrizes = (
    entries: { sessionName: string; name: string; quantity: number }[],
    importAllowReshuffle: boolean,
    importGroupWinners: boolean,
  ) => {
    importPrizes(entries, importAllowReshuffle, importGroupWinners);
  };

  const totalPrizes = sessions.reduce(
    (acc, session) => acc + session.prizes.reduce((s, p) => s + p.quantity, 0),
    0,
  );

  const handleSessionSelect = (name: string) => {
    setSessionName(name);
    setOpen(false);
    // Find existing session settings
    const existingSession = sessions.find((s) => s.name === name);
    if (existingSession) {
      setAllowReshuffle(!!existingSession.allowReshuffle);
      setGroupWinners(!!existingSession.groupWinners);
    }
  };

  const inputClass =
    "bg-black/20 border-white/10 text-slate-100 placeholder:text-slate-500 focus-visible:border-primary";

  return (
    <Card className="w-full bg-white/[0.03] rounded-3xl ring-1 ring-white/10 h-full flex flex-col shadow-none">
      <CardHeader className="pb-3 space-y-1">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-white flex items-center gap-2 text-xl">
            <span className="grid place-items-center size-9 rounded-xl bg-amber-400/15 text-amber-300 ring-1 ring-amber-300/20">
              <Gift className="w-5 h-5" />
            </span>
            {t.prizes.title}
            <Badge variant="secondary" className="ml-1 text-xs font-normal tabular-nums">
              {totalPrizes} {t.prizes.items}
            </Badge>
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <PrizeImporter onImport={handleImportPrizes} />
            <AlertDialog>
              <Hint text={t.help.resetWinner}>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="cursor-pointer border-amber-300/30 bg-transparent text-amber-200 hover:bg-amber-300/10 hover:text-amber-100"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {t.prizes.resetWinner}
                  </Button>
                </AlertDialogTrigger>
              </Hint>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t.prizes.resetAllHeading}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t.prizes.resetWinnerDesc}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      resetDraw();
                    }}
                    className="bg-rose-600 text-white hover:bg-rose-500"
                  >
                    {t.prizes.confirmReset}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
              <Hint text={t.help.resetPrizes}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="cursor-pointer"
                    disabled={totalPrizes === 0}
                    aria-label={t.prizes.resetAllTitle}
                  >
                    <Trash2 className="w-4 h-4" />
                    {t.participants.reset}
                  </Button>
                </AlertDialogTrigger>
              </Hint>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t.prizes.resetAllHeading}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t.prizes.resetAllDesc}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
                  <AlertDialogAction onClick={resetPrizes} className="bg-rose-600 text-white hover:bg-rose-500">
                    {t.prizes.resetAllConfirm}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pt-2 flex flex-col gap-6 overflow-hidden">
        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end rounded-2xl bg-black/20 ring-1 ring-white/5 p-4">
          <div className="col-span-1 md:col-span-3 flex flex-col gap-2">
            <Label htmlFor="session-name" className="text-slate-200 gap-1.5">
              {t.prizes.sessionName}
              <HelpTip text={t.help.sessionName} />
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <Input
                    id="session-name"
                    placeholder={t.prizes.sessionPlaceholder}
                    value={sessionName}
                    onChange={(e) => {
                      setSessionName(e.target.value);
                      if (!open) setOpen(true);
                      // Reset/Update reshuffle if name changes?
                      // Better to just let them set it, or try to auto-find if exact match
                      const existing = sessions.find(
                        (s) => s.name === e.target.value,
                      );
                      if (existing) {
                        setAllowReshuffle(!!existing.allowReshuffle);
                        setGroupWinners(!!existing.groupWinners);
                      }
                    }}
                    onFocus={() => setOpen(true)}
                    className={cn(inputClass, "pr-8")}
                    autoComplete="off"
                  />
                  <div className="absolute right-2 top-2.5 text-slate-500 pointer-events-none">
                    {open ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent
                className="w-(--radix-popover-trigger-width) p-1 max-h-[200px] overflow-y-auto"
                align="start"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                {uniqueSessions.length === 0 ? (
                  <div className="p-2 text-sm text-slate-400 text-center">
                    {t.prizes.noPreviousSessions}
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    {uniqueSessions
                      .filter((s) =>
                        s.toLowerCase().includes(sessionName.toLowerCase()),
                      )
                      .map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSessionSelect(s)}
                          className="text-left px-2 py-1.5 text-sm text-slate-200 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-between group cursor-pointer"
                        >
                          {s}
                          {sessionName === s && (
                            <Check className="h-3 w-3 text-emerald-400" />
                          )}
                        </button>
                      ))}
                    {uniqueSessions.filter((s) =>
                      s.toLowerCase().includes(sessionName.toLowerCase()),
                    ).length === 0 && (
                      <div className="p-2 text-sm text-slate-400 italic">
                        {t.prizes.noMatchingSession}
                      </div>
                    )}
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
          <div className="col-span-1 md:col-span-3 flex flex-col gap-2">
            <Label htmlFor="prize-name" className="text-slate-200 gap-1.5">
              {t.prizes.prizeName}
              <HelpTip text={t.help.prizeName} />
            </Label>
            <Input
              id="prize-name"
              placeholder={t.prizes.prizeName}
              value={prizeName}
              onChange={(e) => setPrizeName(e.target.value)}
              onKeyDown={handleKeyDown}
              className={inputClass}
            />
          </div>
          <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
            <Label htmlFor="quantity" className="text-slate-200 gap-1.5">
              {t.prizes.quantity}
              <HelpTip text={t.help.quantity} />
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              placeholder={t.prizes.quantityPlaceholder}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              onKeyDown={handleKeyDown}
              className={inputClass}
            />
          </div>

          <div className="col-span-1 md:col-span-2 flex flex-col gap-2.5 justify-center pb-1">
            <div className="flex items-center gap-2">
              <Checkbox
                id="allowReshuffle"
                checked={allowReshuffle}
                onCheckedChange={(c) => setAllowReshuffle(c === true)}
              />
              <Label htmlFor="allowReshuffle" className="text-slate-200 cursor-pointer text-xs">
                {t.prizes.allowReshuffle}
              </Label>
              <HelpTip text={`${t.prizes.allowReshuffleTooltip} ${t.help.sessionSettings}`} />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="groupWinners"
                checked={groupWinners}
                onCheckedChange={(c) => setGroupWinners(c === true)}
              />
              <Label htmlFor="groupWinners" className="text-slate-200 cursor-pointer text-xs">
                {t.prizes.groupWinners}
              </Label>
              <HelpTip text={`${t.prizes.groupWinnersTooltip} ${t.help.sessionSettings}`} />
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 flex justify-end">
            <Button
              className="w-full md:w-auto cursor-pointer"
              onClick={handleAdd}
              disabled={!sessionName.trim() || !prizeName.trim()}
            >
              <Plus className="w-4 h-4" />
              {t.prizes.addPrize}
            </Button>
          </div>
        </div>

        {/* Prize List */}
        <ScrollArea className="flex-1 -mx-4 px-4 h-[50vh]">
          {sessions.length === 0 ? (
            <div className="h-[200px] flex flex-col items-center justify-center py-8 text-slate-500 text-sm rounded-2xl border border-dashed border-white/10">
              <Package className="w-10 h-10 mb-3 opacity-40" />
              {t.prizes.empty}
            </div>
          ) : (
            <div className="space-y-6 pb-6">
              {sessions.map((session) => (
                <div key={session.id} className="space-y-2.5">
                  <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex flex-wrap items-center gap-2">
                    {session.name}
                    <span className="text-[11px] font-normal normal-case text-slate-400 bg-white/5 ring-1 ring-white/10 px-2 py-0.5 rounded-full tabular-nums">
                      {session.prizes.reduce((s, p) => s + p.quantity, 0)}{" "}
                      {t.prizes.items}
                    </span>
                    {session.allowReshuffle && (
                      <span className="text-[11px] font-normal normal-case text-sky-300 bg-sky-400/10 px-2 py-0.5 rounded-full">
                        {t.prizes.allowReshuffle}
                      </span>
                    )}
                    {session.groupWinners && (
                      <span className="text-[11px] font-normal normal-case text-violet-300 bg-violet-400/10 px-2 py-0.5 rounded-full">
                        {t.prizes.groupWinners}
                      </span>
                    )}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {session.prizes.map((prize) => (
                      <div
                        key={prize.id}
                        className="group flex items-center justify-between bg-white/[0.04] ring-1 ring-white/10 rounded-xl px-3 py-2.5 text-sm hover:bg-white/[0.07] transition-colors"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <span className="grid place-items-center h-6 min-w-6 px-1.5 rounded-lg bg-amber-400/15 text-amber-300 text-xs font-semibold tabular-nums shrink-0">
                            {prize.quantity}
                          </span>
                          <span className="text-slate-200 truncate">
                            {prize.name}
                          </span>
                        </div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => removePrize(prize.id)}
                              aria-label={t.help.removePrize}
                              className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity ml-2 shrink-0 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="text-xs">{t.help.removePrize}</TooltipContent>
                        </Tooltip>
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
