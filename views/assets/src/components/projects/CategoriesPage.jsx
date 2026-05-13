import { __ } from '@wordpress/i18n';
import React, { useEffect, useState, useCallback } from "react";
import { useApi } from "@hooks/useApi";
import { useToast } from "@hooks/useToast";
import { useConfirm } from "@hooks/useConfirm";
import { usePermissions } from "@hooks/usePermissions";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Checkbox } from "@components/ui/checkbox";
import { Skeleton } from "@components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@components/ui/sheet";
import { Textarea } from "@components/ui/textarea";
import {
  Plus,
  Trash2,
  Pencil,
  Tag,
  Loader2,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";

export default function CategoriesPage() {
  const api = useApi();
  const toast = useToast();
  const [ConfirmDialog, confirm] = useConfirm();
  const { canManage } = usePermissions();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Sheet state
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState("create"); // 'create' | 'edit'
  const [editingCat, setEditingCat] = useState(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [saving, setSaving] = useState(false);

  // Bulk select
  const [selected, setSelected] = useState(new Set());

  // ── Fetch ──────────────────────────────────────────

  const fetchCategories = useCallback(
    async (pg = 1) => {
      setLoading(true);
      try {
        const res = await api.get("categories", { per_page: 20, page: pg });
        setCategories(res.data ?? []);
        if (res.meta?.pagination) {
          setTotalPages(res.meta.pagination.total_pages || 1);
          setPage(pg);
        }
      } catch {}
      setLoading(false);
    },
    [api],
  );

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ── Open sheet ─────────────────────────────────────

  const openCreate = () => {
    setSheetMode("create");
    setEditingCat(null);
    setFormTitle("");
    setFormDesc("");
    setSheetOpen(true);
  };

  const openEdit = (cat) => {
    setSheetMode("edit");
    setEditingCat(cat);
    setFormTitle(cat.title);
    setFormDesc(cat.description || "");
    setSheetOpen(true);
  };

  // ── Save (create or update) ────────────────────────

  const handleSave = async () => {
    if (!formTitle.trim() || saving) return;
    setSaving(true);
    try {
      if (sheetMode === "create") {
        await api.post("categories", {
          title: formTitle.trim(),
          description: formDesc.trim(),
          categorible_type: "project",
        });
        toast.success(__("Category created", 'wedevs-project-manager'));
      } else {
        await api.post(`categories/${editingCat.id}/update`, {
          id: editingCat.id,
          title: formTitle.trim(),
          description: formDesc.trim(),
          categorible_type: "project",
        });
        toast.success(__("Category updated", 'wedevs-project-manager'));
      }
      setSheetOpen(false);
      fetchCategories(page);
    } catch {
      toast.error(
        sheetMode === "create"
          ? __("Failed to create category", 'wedevs-project-manager')
          : __("Failed to update category", 'wedevs-project-manager'),
      );
    }
    setSaving(false);
  };

  // ── Delete ─────────────────────────────────────────

  const handleDelete = async (id) => {
    const ok = await confirm(__("Are you sure?", 'wedevs-project-manager'), __("Delete Category", 'wedevs-project-manager'));
    if (!ok) return;
    try {
      await api.post(`categories/${id}/delete`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setSelected((prev) => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
      toast.success(__("Category deleted", 'wedevs-project-manager'));
    } catch {
      toast.error(__("Failed to delete category", 'wedevs-project-manager'));
    }
  };

  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    const ok = await confirm(__("Delete selected categories?", 'wedevs-project-manager'), __("Bulk Delete", 'wedevs-project-manager'));
    if (!ok) return;
    try {
      await api.post("categories/bulk-delete", {
        category_ids: Array.from(selected),
      });
      setCategories((prev) => prev.filter((c) => !selected.has(c.id)));
      setSelected(new Set());
      toast.success(__("Categories deleted", 'wedevs-project-manager'));
    } catch {
      toast.error(__("Failed to delete categories", 'wedevs-project-manager'));
    }
  };

  // ── Selection helpers ──────────────────────────────

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const toggleAll = () => {
    if (selected.size === categories.length) setSelected(new Set());
    else setSelected(new Set(categories.map((c) => c.id)));
  };

  // ── Render ─────────────────────────────────────────

  return (
    <>
    <ConfirmDialog />
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6">
      {/* Header — same pattern as ProjectsPage */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-pm-text-primary">
          {__("Categories", 'wedevs-project-manager')}
        </h1>
        {canManage && (
          <Button size="sm" className="gap-1.5" onClick={openCreate}>
            <Plus className="h-5 w-5" />
            {__("New Category", 'wedevs-project-manager')}
          </Button>
        )}
      </div>

      {/* Bulk actions bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-destructive/5 rounded-lg border border-destructive/20">
          <span className="text-sm text-pm-text-primary font-medium">
            {selected.size} {__("selected", 'wedevs-project-manager')}
          </span>
          <Button
            variant="destructive"
            size="sm"
            className="h-7 text-sm gap-1"
            onClick={handleBulkDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
            {__("Delete Selected", 'wedevs-project-manager')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-sm ml-auto"
            onClick={() => setSelected(new Set())}
          >
            {__("Clear", 'wedevs-project-manager')}
          </Button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20">
          <Tag className="h-14 w-14 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-pm-text-primary mb-1">
            {__("No categories yet", 'wedevs-project-manager')}
          </h3>
          <p className="text-sm text-pm-text-muted mb-4">
            {__("Create categories to organize your projects.", 'wedevs-project-manager')}
          </p>
          {canManage && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={openCreate}
            >
              <Plus className="h-5 w-5" />
              {__("Add Category", 'wedevs-project-manager')}
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 items-center px-4 py-2.5 bg-muted/30 border-b text-[14px] font-semibold uppercase tracking-wider text-pm-text-muted/70">
            <div className="col-span-1">
              <Checkbox
                checked={
                  selected.size === categories.length && categories.length > 0
                }
                onCheckedChange={toggleAll}
                className="h-4 w-4"
              />
            </div>
            <div className="col-span-4">{__("Name", 'wedevs-project-manager')}</div>
            <div className="col-span-5 hidden md:block">
              {__("Description", 'wedevs-project-manager')}
            </div>
            <div className="col-span-2 text-right">{__("Actions", 'wedevs-project-manager')}</div>
          </div>

          {/* Rows */}
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="grid grid-cols-12 gap-4 items-center px-4 py-3 border-b last:border-b-0 hover:bg-muted/20 transition-colors group"
            >
              <div className="col-span-1">
                <Checkbox
                  checked={selected.has(cat.id)}
                  onCheckedChange={() => toggleSelect(cat.id)}
                  className="h-4 w-4"
                />
              </div>
              <div className="col-span-4">
                <span className="text-sm font-medium text-pm-text-primary">
                  {cat.title}
                </span>
              </div>
              <div className="col-span-5 hidden md:block">
                <span className="text-sm text-pm-text-muted line-clamp-1">
                  {cat.description || "—"}
                </span>
              </div>
              <div className="col-span-2 flex items-center justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => openEdit(cat)}
                      className="gap-2 text-sm"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      {__("Edit", 'wedevs-project-manager')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(cat.id)}
                      className="gap-2 text-sm text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {__("Delete", 'wedevs-project-manager')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
            <Button
              key={pg}
              variant={pg === page ? "default" : "outline"}
              size="sm"
              className="h-8 w-8 p-0 text-sm"
              onClick={() => fetchCategories(pg)}
            >
              {pg}
            </Button>
          ))}
        </div>
      )}

      {/* Create / Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[520px] flex flex-col p-0 gap-0"
        >
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle>
              {sheetMode === "create"
                ? __("New Category", 'wedevs-project-manager')
                : __("Edit Category", 'wedevs-project-manager')}
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            <div className="space-y-2">
              <Label>
                {__("Name", 'wedevs-project-manager')} <span className="text-destructive">*</span>
              </Label>
              <Input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder={__("Category name", 'wedevs-project-manager')}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>{__("Description", 'wedevs-project-manager')}</Label>
              <Textarea
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder={__("Description (optional)", 'wedevs-project-manager')}
                className="min-h-[100px] resize-y"
              />
            </div>
          </div>

          <SheetFooter className="px-6 py-4 border-t">
            <Button variant="outline" onClick={() => setSheetOpen(false)}>
              {__("Cancel", 'wedevs-project-manager')}
            </Button>
            <Button onClick={handleSave} disabled={saving || !formTitle.trim()}>
              {saving && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
              {saving
                ? __("Saving...", 'wedevs-project-manager')
                : sheetMode === "create"
                ? __("Create Category", 'wedevs-project-manager')
                : __("Update Category", 'wedevs-project-manager')}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
    </>
  );
}
