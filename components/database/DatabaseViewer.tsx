"use client";

import { useEffect, useState, useRef } from "react";
import {
  getDatabaseRows,
  deleteDatabaseRow,
  updateDatabaseRow,
} from "@/app/actions/database";
import {
  StarCard,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/StarCard";
import { Loader2, Database, Trash2, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAlert } from "@/context/AlertContext";
import { Textarea } from "@/components/ui/textarea";

interface DatabaseViewerProps {
  modelName: string;
}

export function DatabaseViewer({ modelName }: DatabaseViewerProps) {
  const [rows, setRows] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const { showAlert } = useAlert();

  // Edit State
  const [editingRow, setEditingRow] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  // Helper to identify primary key
  const getPrimaryKey = (row: any) => {
    if ("id" in row) return "id";
    if ("guildId" in row) return "guildId";
    if ("keyHash" in row) return "keyHash";
    // Fallback to first key if nothing else matches (risky but better than nothing)
    return Object.keys(row)[0];
  };

  const fetchRows = async (pageNum: number, reset = false) => {
    if (loading) return;
    setLoading(true);
    setError(null);

    const result = await getDatabaseRows(modelName, pageNum);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setRows((prev) =>
      reset || pageNum === 1 ? result.data : [...prev, ...result.data]
    );
    setHasMore(result.hasMore ?? false);
    setLoading(false);
  };

  useEffect(() => {
    fetchRows(1, true);
  }, [modelName]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => {
            const nextPage = prev + 1;
            fetchRows(nextPage);
            return nextPage;
          });
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading]);

  const handleDelete = async (row: any) => {
    if (!confirm("Are you sure you want to delete this row?")) return;

    const keyField = getPrimaryKey(row);
    const value = row[keyField];

    const result = await deleteDatabaseRow(modelName, keyField, value);

    if (result.error) {
      showAlert({
        type: "error",
        title: "Delete Failed",
        message: result.error,
      });
    } else {
      showAlert({
        type: "success",
        title: "Success",
        message: "Row deleted successfully",
      });
      // Remove from local state
      setRows((prev) => prev.filter((r) => r[keyField] !== value));
    }
  };

  const handleEditClick = (row: any) => {
    setEditingRow(row);
    setEditFormData({ ...row });
  };

  const handleEditChange = (key: string, value: string) => {
    setEditFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSaveEdit = async () => {
    setIsSaving(true);
    const keyField = getPrimaryKey(editingRow);
    const idValue = editingRow[keyField];

    // Process data: coerce types to match original row types
    const processedData: any = {};
    const errors: string[] = [];

    Object.keys(editingRow).forEach((key) => {
      const originalValue = editingRow[key];
      let newValue = editFormData[key];
      const originalType = typeof originalValue;

      // Skip null/undefined original values - just pass through the new value
      if (originalValue === null || originalValue === undefined) {
        processedData[key] = newValue;
        return;
      }

      // Handle object/JSON fields
      if (originalType === "object") {
        if (typeof newValue === "string") {
          try {
            processedData[key] = JSON.parse(newValue);
          } catch (e) {
            errors.push(`${key}: Invalid JSON format`);
            processedData[key] = newValue;
          }
        } else {
          processedData[key] = newValue;
        }
        return;
      }

      // Handle number fields
      if (originalType === "number") {
        const parsed = Number(newValue);
        if (isNaN(parsed)) {
          errors.push(`${key}: Expected a number`);
          processedData[key] = newValue;
        } else {
          processedData[key] = parsed;
        }
        return;
      }

      // Handle boolean fields
      if (originalType === "boolean") {
        if (newValue === "true" || newValue === true) {
          processedData[key] = true;
        } else if (newValue === "false" || newValue === false) {
          processedData[key] = false;
        } else {
          errors.push(`${key}: Expected true or false`);
          processedData[key] = newValue;
        }
        return;
      }

      // Default: keep as string
      processedData[key] = newValue;
    });

    if (errors.length > 0) {
      showAlert({
        type: "error",
        title: "Validation Error",
        message: errors.join(", "),
      });
      setIsSaving(false);
      return;
    }

    const result = await updateDatabaseRow(
      modelName,
      keyField,
      idValue,
      processedData
    );

    if (result.error) {
      showAlert({
        type: "error",
        title: "Update Failed",
        message: result.error,
      });
    } else {
      showAlert({
        type: "success",
        title: "Success",
        message: "Row updated successfully",
      });
      setRows((prev) =>
        prev.map((r) => (r[keyField] === idValue ? { ...processedData } : r))
      );
      setEditingRow(null);
    }
    setIsSaving(false);
  };

  if (error) {
    return <div className="text-red-400 p-4">Error: {error}</div>;
  }

  if (rows.length === 0 && !loading) {
    return (
      <div className="text-zinc-400 p-4">No data found in {modelName}</div>
    );
  }

  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

  return (
    <div className="space-y-6">
      <StarCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-zinc-400" />
            {modelName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto rounded-lg border border-zinc-800">
            <table className="w-full text-sm text-left text-zinc-400">
              <thead className="text-xs text-zinc-200 uppercase bg-zinc-900/50">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="px-6 py-3 border-b border-zinc-800"
                    >
                      {col}
                    </th>
                  ))}
                  <th className="px-6 py-3 border-b border-zinc-800 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="bg-zinc-950/30 border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors"
                  >
                    {columns.map((col) => (
                      <td
                        key={`${idx}-${col}`}
                        className="px-6 py-4 whitespace-nowrap max-w-[300px] truncate"
                        title={
                          typeof row[col] === "object"
                            ? JSON.stringify(row[col])
                            : String(row[col])
                        }
                      >
                        {typeof row[col] === "object"
                          ? JSON.stringify(row[col])
                          : String(row[col])}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                          onClick={() => handleEditClick(row)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          onClick={() => handleDelete(row)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {loading && (
            <div className="flex justify-center p-4">
              <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
            </div>
          )}

          <div ref={observerTarget} className="h-4" />
        </CardContent>
      </StarCard>

      <Dialog
        open={!!editingRow}
        onOpenChange={(open) => !open && setEditingRow(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Row</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {editingRow &&
              Object.keys(editingRow).map((key) => {
                const isPrimaryKey = key === getPrimaryKey(editingRow);
                let value = editFormData[key];
                const originalValue = editingRow[key];
                const isObject =
                  typeof originalValue === "object" && originalValue !== null;

                if (isObject && typeof value !== "string") {
                  value = JSON.stringify(value, null, 2);
                }

                return (
                  <div
                    key={key}
                    className="grid grid-cols-4 items-center gap-4"
                  >
                    <Label htmlFor={key} className="text-right text-zinc-400">
                      {key}
                    </Label>
                    <div className="col-span-3">
                      {isObject ? (
                        <Textarea
                          id={key}
                          value={value ?? ""}
                          onChange={(e) =>
                            handleEditChange(key, e.target.value)
                          }
                          className="font-mono text-xs"
                          rows={4}
                        />
                      ) : (
                        <Input
                          id={key}
                          value={value ?? ""}
                          onChange={(e) =>
                            handleEditChange(key, e.target.value)
                          }
                          disabled={isPrimaryKey}
                          className={isPrimaryKey ? "opacity-50" : ""}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingRow(null)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
