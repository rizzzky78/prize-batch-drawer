import { useState, useRef } from "react";
import * as xlsx from "xlsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Upload, FileSpreadsheet, Check, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ParticipantImporterProps {
  onImport: (names: string[]) => void;
  disabled?: boolean;
}

export const ParticipantImporter = ({
  onImport,
  disabled,
}: ParticipantImporterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError("");
    setHeaders([]);
    setPreviewData([]);
    setSelectedColumn("");

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const workbook = xlsx.read(arrayBuffer);
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length > 0) {
        const headerRow = jsonData[0] as string[];
        // Filter out empty headers and ensure they are strings
        const validHeaders = headerRow.filter(
          (h) => typeof h === "string" && h.trim() !== ""
        );

        if (validHeaders.length === 0) {
          setError("No valid headers found in the Excel file.");
          return;
        }

        setHeaders(validHeaders);
        // Get preview data (next 5 rows)
        setPreviewData(jsonData.slice(1, 6));

        // Auto-select if there's a column named "Name" or "Nama" (case insensitive)
        const nameCol = validHeaders.find(h => /^(name|nama)$/i.test(h));
        if (nameCol) setSelectedColumn(nameCol);
      } else {
        setError("The Excel file appears to be empty.");
      }
    } catch (err) {
      console.error("Error parsing Excel file:", err);
      setError("Failed to parse the Excel file. Please ensure it is a valid .xlsx file.");
    }
  };

  const handleImport = async () => {
    if (!file || !selectedColumn) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = xlsx.read(arrayBuffer);
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet);

      const importedNames = jsonData
        .map((row: any) => row[selectedColumn])
        .filter((name) => typeof name === "string" && name.trim() !== "")
        .map((name) => String(name).trim());

      if (importedNames.length === 0) {
        setError("No valid names found in the selected column.");
        return;
      }

      onImport(importedNames);
      setIsOpen(false);
      resetState();
    } catch (err) {
      console.error("Error importing data:", err);
      setError("Failed to import data.");
    }
  };

  const resetState = () => {
    setFile(null);
    setHeaders([]);
    setPreviewData([]);
    setSelectedColumn("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Popover open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetState();
    }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="gap-2"
          title="Import from Excel"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Import Excel
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 sm:w-96 p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium leading-none">Import Participants</h4>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-upload" className="text-xs font-medium text-slate-500">
              1. Select Excel File
            </Label>
            <div className="flex gap-2">
              <Input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                className="cursor-pointer border border-slate-500/50 rounded-xl w-fit"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-xs p-2 rounded flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {headers.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs font-medium text-slate-500">
                2. Select Name Column
              </Label>
              <ScrollArea className="h-40 border rounded-md p-2 bg-black/90 text-white">
                <RadioGroup value={selectedColumn} onValueChange={setSelectedColumn}>
                  {headers.map((header) => (
                    <div key={header} className="flex items-center space-x-2 py-1">
                      <RadioGroupItem value={header} id={`col-${header}`} />
                      <Label htmlFor={`col-${header}`} className="text-sm cursor-pointer font-normal">
                        {header}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </ScrollArea>
              {previewData.length > 0 && selectedColumn && (
                <p className="text-xs text-slate-500 italic">
                  Preview: {previewData[0]?.[selectedColumn] || "(no preview)"}, ...
                </p>
              )}
            </div>
          )}

          <Button
            className="w-full"
            onClick={handleImport}
            disabled={!file || !selectedColumn}
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Participants
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
