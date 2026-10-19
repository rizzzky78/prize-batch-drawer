import { useMemo, useRef, useState } from "react";
import * as xlsx from "xlsx";
import { useTranslation } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Upload,
  FileSpreadsheet,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const FORMAT_EXAMPLE = [
  { session: "Sesi 1", name: "Emergency Lamp", quantity: 3 },
  { session: "Sesi 1", name: "Setrika Philips", quantity: 3 },
  { session: "Grand 1", name: "TV Toshiba 43inch", quantity: 1 },
];

interface PrizeImporterProps {
  onImport: (
    entries: { sessionName: string; name: string; quantity: number }[],
    allowReshuffle: boolean,
    groupWinners: boolean,
  ) => void;
  disabled?: boolean;
}

const NONE_VALUE = "__none__";

const findColumn = (headers: string[], patterns: RegExp[]) => {
  for (const pattern of patterns) {
    const match = headers.find((h) => pattern.test(h));
    if (match) return match;
  }
  return "";
};

export const PrizeImporter = ({ onImport, disabled }: PrizeImporterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [headers, setHeaders] = useState<string[]>([]);
  const [objectRows, setObjectRows] = useState<Record<string, unknown>[]>([]);
  const [sessionCol, setSessionCol] = useState("");
  const [nameCol, setNameCol] = useState("");
  const [qtyCol, setQtyCol] = useState(NONE_VALUE);
  // Rows the user has manually deselected; everything valid starts selected.
  const [excludedRows, setExcludedRows] = useState<Set<number>>(new Set());
  const [allowReshuffle, setAllowReshuffle] = useState(false);
  const [groupWinners, setGroupWinners] = useState(false);
  const [error, setError] = useState("");
  const [showGuide, setShowGuide] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslation();

  const resetState = () => {
    setHeaders([]);
    setObjectRows([]);
    setSessionCol("");
    setNameCol("");
    setQtyCol(NONE_VALUE);
    setExcludedRows(new Set());
    setAllowReshuffle(false);
    setGroupWinners(false);
    setError("");
    setShowGuide(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError("");
    setHeaders([]);
    setObjectRows([]);
    setSessionCol("");
    setNameCol("");
    setQtyCol(NONE_VALUE);
    setExcludedRows(new Set());

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const workbook = xlsx.read(arrayBuffer);
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const headerRow = (xlsx.utils.sheet_to_json(worksheet, {
        header: 1,
      })[0] || []) as string[];
      const validHeaders = headerRow.filter(
        (h) => typeof h === "string" && h.trim() !== "",
      );

      if (validHeaders.length === 0) {
        setError(t.importer.noValidHeaders);
        return;
      }

      const rows = xlsx.utils.sheet_to_json(worksheet) as Record<
        string,
        unknown
      >[];

      setHeaders(validHeaders);
      setObjectRows(rows);
      setShowGuide(false);

      setSessionCol(
        findColumn(validHeaders, [
          /^(session|sesi|group|grup|kategori|category)$/i,
        ]),
      );
      setNameCol(
        findColumn(validHeaders, [/^(prize|hadiah|item|name|nama)$/i]),
      );
      setQtyCol(
        findColumn(validHeaders, [/^(qty|quantity|jumlah)$/i]) || NONE_VALUE,
      );
    } catch (err) {
      console.error("Error parsing Excel file:", err);
      setError(t.importer.parseFail);
    }
  };

  const parsedRows = useMemo(() => {
    if (!sessionCol || !nameCol) return [];
    return objectRows.map((row, idx) => {
      const session = String(row[sessionCol] ?? "").trim();
      const name = String(row[nameCol] ?? "").trim();
      let quantity = 1;
      if (qtyCol !== NONE_VALUE) {
        const parsed = parseInt(String(row[qtyCol] ?? ""), 10);
        quantity = !isNaN(parsed) && parsed > 0 ? parsed : 1;
      }
      const valid = Boolean(session && name);
      return { idx, session, name, quantity, valid };
    });
  }, [objectRows, sessionCol, nameCol, qtyCol]);

  const validRowIndexes = useMemo(
    () => parsedRows.filter((r) => r.valid).map((r) => r.idx),
    [parsedRows],
  );

  const isSelected = (idx: number) => !excludedRows.has(idx);

  const uniqueSessions = useMemo(() => {
    const names = new Set<string>();
    parsedRows.forEach((r) => {
      if (r.valid && !excludedRows.has(r.idx)) names.add(r.session);
    });
    return Array.from(names);
  }, [parsedRows, excludedRows]);

  const selectedCount = validRowIndexes.filter((idx) => isSelected(idx)).length;

  const toggleRow = (idx: number) => {
    setExcludedRows((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const allSelected =
    validRowIndexes.length > 0 && selectedCount === validRowIndexes.length;

  const toggleSelectAll = () => {
    setExcludedRows(allSelected ? new Set(validRowIndexes) : new Set());
  };

  const handleColumnChange =
    (setter: (value: string) => void) => (value: string) => {
      setter(value);
      setExcludedRows(new Set());
    };

  const handleImport = () => {
    const entries = parsedRows
      .filter((r) => r.valid && isSelected(r.idx))
      .map((r) => ({
        sessionName: r.session,
        name: r.name,
        quantity: r.quantity,
      }));

    if (entries.length === 0) {
      setError(t.importer.noRowsSelected);
      return;
    }

    onImport(entries, allowReshuffle, groupWinners);
    setIsOpen(false);
    resetState();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetState();
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          disabled={disabled}
          className="gap-2"
          title={t.importer.importFromExcelTitle}
        >
          <FileSpreadsheet className="w-4 h-4" />
          {t.importer.importExcel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t.importer.importPrizesTitle}</DialogTitle>
          <DialogDescription>{t.importer.importPrizesDesc}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md border border-slate-700">
            <button
              type="button"
              onClick={() => setShowGuide((v) => !v)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium"
            >
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                {t.importer.acceptedFormat}
              </span>
              {showGuide ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
            {showGuide && (
              <div className="px-3 pb-3 space-y-2">
                <p className="text-xs text-muted-foreground">
                  {t.importer.prizesGuide}
                </p>
                <div className="rounded border border-slate-700 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t.importer.session}</TableHead>
                        <TableHead>{t.importer.prizeName}</TableHead>
                        <TableHead className="text-right">
                          {t.importer.quantity}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {FORMAT_EXAMPLE.map((row) => (
                        <TableRow key={`${row.session}-${row.name}`}>
                          <TableCell className="whitespace-nowrap">
                            {row.session}
                          </TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell className="text-right">
                            {row.quantity}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">
              {t.importer.selectFile}
            </Label>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="cursor-pointer w-fit"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-xs p-2 rounded flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {headers.length > 0 && (
            <>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  {t.importer.mapColumns}
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">{t.importer.sessionGroupName}</Label>
                    <Select
                      value={sessionCol}
                      onValueChange={handleColumnChange(setSessionCol)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.importer.selectColumn} />
                      </SelectTrigger>
                      <SelectContent>
                        {headers.map((h) => (
                          <SelectItem key={h} value={h}>
                            {h}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">{t.importer.prizeName}</Label>
                    <Select
                      value={nameCol}
                      onValueChange={handleColumnChange(setNameCol)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.importer.selectColumn} />
                      </SelectTrigger>
                      <SelectContent>
                        {headers.map((h) => (
                          <SelectItem key={h} value={h}>
                            {h}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">{t.importer.quantityOptional}</Label>
                    <Select
                      value={qtyCol}
                      onValueChange={handleColumnChange(setQtyCol)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.importer.selectColumn} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={NONE_VALUE}>
                          {t.importer.noneDefault}
                        </SelectItem>
                        {headers.map((h) => (
                          <SelectItem key={h} value={h}>
                            {h}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {sessionCol && nameCol && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-muted-foreground">
                      {t.importer.previewSelectRows}
                    </Label>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {uniqueSessions.map((s) => (
                        <Badge
                          key={s}
                          variant="secondary"
                          className="text-xs font-normal"
                        >
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <ScrollArea className="h-64 border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10">
                            <Checkbox
                              checked={allSelected}
                              onCheckedChange={toggleSelectAll}
                              aria-label="Select all"
                            />
                          </TableHead>
                          <TableHead>{t.importer.session}</TableHead>
                          <TableHead>{t.importer.prizeName}</TableHead>
                          <TableHead className="text-right">{t.importer.qty}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parsedRows.map((row) => (
                          <TableRow
                            key={row.idx}
                            className={!row.valid ? "opacity-40" : ""}
                          >
                            <TableCell>
                              <Checkbox
                                checked={isSelected(row.idx)}
                                onCheckedChange={() => toggleRow(row.idx)}
                                disabled={!row.valid}
                                aria-label={`Select row ${row.idx}`}
                              />
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {row.session || (
                                <span className="italic text-muted-foreground">
                                  {t.importer.missing}
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              {row.name || (
                                <span className="italic text-muted-foreground">
                                  {t.importer.missing}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {row.quantity}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                  <p className="text-xs text-muted-foreground">
                    {t.importer.rowsSelected(
                      selectedCount,
                      validRowIndexes.length,
                      uniqueSessions.length,
                    )}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-6">
                <div className="flex items-center space-x-2">
                  <Tooltip>
                    <TooltipTrigger className="flex items-center space-x-2">
                      <Checkbox
                        id="import-allow-reshuffle"
                        checked={allowReshuffle}
                        onCheckedChange={(c) => setAllowReshuffle(c === true)}
                      />
                      <Label
                        htmlFor="import-allow-reshuffle"
                        className="text-xs cursor-pointer"
                      >
                        {t.prizes.allowReshuffle}
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[250px] text-xs">
                      <p>{t.importer.allowReshuffleImportTooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center space-x-2">
                  <Tooltip>
                    <TooltipTrigger className="flex items-center space-x-2">
                      <Checkbox
                        id="import-group-winners"
                        checked={groupWinners}
                        onCheckedChange={(c) => setGroupWinners(c === true)}
                      />
                      <Label
                        htmlFor="import-group-winners"
                        className="text-xs cursor-pointer"
                      >
                        {t.prizes.groupWinners}
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[250px] text-xs">
                      <p>{t.importer.groupWinnersImportTooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={handleImport}
            disabled={!sessionCol || !nameCol || selectedCount === 0}
          >
            <Upload className="w-4 h-4 mr-2" />
            {t.importer.importPrizesButton(selectedCount)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
