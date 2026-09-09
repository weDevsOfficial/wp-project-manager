import { __ } from '@wordpress/i18n';
import React, { useEffect, useState } from "react";
import { useApi } from "@hooks/useApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { Plus, Search } from "lucide-react";

const api = useApi();

export default function SearchAddTask({
  projectId,
  boardId,
  onAdd,
  iconStyle,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      return;
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (query.length < 3) {
      setResults([]);
      return;
    }
    setSearching(true);
    const timer = setTimeout(() => {
      api
        .get(`projects/${projectId}/kanboard/tasks`, {
          title: query,
          per_page: 20,
        })
        .then((res) => {
          const d = res?.data ?? res;
          setResults(Array.isArray(d) ? d : Object.values(d || {}));
        })
        .catch(() => setResults([]))
        .finally(() => setSearching(false));
    }, 500);
    return () => clearTimeout(timer);
  }, [query, projectId, open]);

  const handleAdd = (taskId) => {
    onAdd(taskId, boardId);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-1 rounded-lg hover:bg-black/10 border-none outline-none shadow-none bg-transparent transition-colors"
        style={iconStyle}
        title={__("Search & add existing task", 'wedevs-project-manager')}
      >
        <Plus className="h-4 w-4" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-md max-h-[80vh] overflow-hidden flex flex-col"
          data-pm-dialog
        >
          <DialogHeader>
            <DialogTitle>{__("Add existing task", 'wedevs-project-manager')}</DialogTitle>
          </DialogHeader>

          <div className="flex items-center gap-1.5 h-11 rounded-md border border-input bg-background px-2.5 focus-within:ring-1 focus-within:ring-pm-accent/40 focus-within:border-pm-accent">
            <Search className="h-4 w-4 text-pm-text-muted shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={__("Search by title (min 3 chars)...", 'wedevs-project-manager')}
              className="flex-1 min-w-0 h-full bg-transparent text-sm placeholder:text-muted-foreground/70 focus:outline-none !border-0 !p-0 !shadow-none"
              autoFocus
            />
          </div>

          <div className="flex-1 overflow-y-auto mt-2 -mx-2 px-2">
            {query.length < 3 ? (
              <div className="text-center text-xs text-pm-text-muted py-8">
                {__("Type at least 3 characters to search", 'wedevs-project-manager')}
              </div>
            ) : searching ? (
              <div className="text-center text-xs text-pm-text-muted py-8">
                {__("Searching...", 'wedevs-project-manager')}
              </div>
            ) : results.length === 0 ? (
              <div className="text-center text-xs text-pm-text-muted py-8">
                {__("No tasks found", 'wedevs-project-manager')}
              </div>
            ) : (
              <ul className="space-y-1">
                {results.map((t) => (
                  <li key={t.id}>
                    <button
                      className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-pm-surface-muted border border-transparent hover:border-pm-border transition-colors"
                      onClick={() => handleAdd(t.id)}
                    >
                      <div className="font-medium text-pm-text-primary truncate">
                        {t.title}
                      </div>
                      {t.task_list?.data?.title && (
                        <div className="text-[11px] text-pm-text-muted mt-0.5">
                          {t.task_list.data.title}
                        </div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
