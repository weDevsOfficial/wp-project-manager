import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "@hooks/useApi";
import { useI18n } from "@hooks/useI18n";
import { Button } from "@components/ui/button";
import { Skeleton } from "@components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { ArrowLeft, Activity } from "lucide-react";
import {
  formatPmDate,
  formatPmDateTime,
  extractDateStr,
  userInitials,
} from "@lib/pm-utils";

// Parse {{actor.data.display_name}} and {{meta.task_title}} placeholders
function parseMessage(activity) {
  let msg = activity.message || "";
  if (!msg) return activity.action || "";
  return msg.replace(/\{\{([^}]+)\}\}/g, (_, path) => {
    const keys = path.trim().split(".");
    let val = activity;
    for (const key of keys) {
      if (val && typeof val === "object" && key in val) val = val[key];
      else return "";
    }
    return val != null ? String(val) : "";
  });
}

// Vue 2 groups activities by date (DD MMMM format)
function groupByDate(activities) {
  const groups = [];
  let currentDate = null;
  let currentGroup = null;

  for (const act of activities) {
    const dateStr = extractDateStr(act.committed_at);
    const dateKey = dateStr
      ? new Date(dateStr).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "Unknown";

    if (dateKey !== currentDate) {
      currentDate = dateKey;
      currentGroup = { date: dateKey, items: [] };
      groups.push(currentGroup);
    }
    currentGroup.items.push(act);
  }
  return groups;
}

export default function ActivitiesPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const api = useApi();
  const { __ } = useI18n();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Vue 2: GET projects/{pid}/activities?per_page=20&page={page}
  useEffect(() => {
    setLoading(true);
    api
      .get(`projects/${projectId}/activities`, { per_page: 20, page: 1 })
      .then((res) => {
        setActivities(res.data ?? []);
        const p = res.meta?.pagination;
        setHasMore(p ? p.current_page < p.total_pages : false);
        setPage(1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [projectId]);

  const loadMore = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const res = await api.get(`projects/${projectId}/activities`, {
        per_page: 20,
        page: nextPage,
      });
      setActivities((prev) => [...prev, ...(res.data ?? [])]);
      const p = res.meta?.pagination;
      setHasMore(p ? p.current_page < p.total_pages : false);
      setPage(nextPage);
    } catch {}
    setLoadingMore(false);
  };

  // Vue 2: groups activities by date
  const grouped = useMemo(() => groupByDate(activities), [activities]);

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-5">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => navigate(`/projects/${projectId}/task-lists`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold text-pm-text-primary">
          {__("Activities")}
        </h1>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 rounded-lg" />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-16">
          <Activity className="h-14 w-14 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-pm-text-primary mb-1">
            {__("No activities yet")}
          </h3>
          <p className="text-xs text-pm-text-muted">
            {__("Project activity will appear here.")}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map((group) => (
            <div key={group.date}>
              {/* Date header */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-semibold text-pm-text-primary bg-muted/60 px-3 py-1 rounded-full">
                  {group.date}
                </span>
                <div className="flex-1 h-px bg-border/50" />
              </div>

              {/* Activities for this date */}
              <div className="space-y-0 ml-1">
                {group.items.map((act, i) => {
                  const timeStr = act.committed_at
                    ? (() => {
                        if (
                          typeof act.committed_at === "object" &&
                          act.committed_at.time
                        ) {
                          const d = new Date(
                            `1970-01-01T${act.committed_at.time}`,
                          );
                          return !isNaN(d.getTime())
                            ? d
                                .toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })
                                .toLowerCase()
                            : act.committed_at.time?.slice(0, 5) || "";
                        }
                        return "";
                      })()
                    : "";

                  return (
                    <div
                      key={act.id || i}
                      className="flex gap-3 py-2.5 relative"
                    >
                      {/* Timeline line */}
                      {i < group.items.length - 1 && (
                        <div className="absolute left-[13px] top-10 bottom-0 w-px bg-border/40" />
                      )}
                      <Avatar className="h-7 w-7 shrink-0 z-10">
                        <AvatarImage src={act.actor?.data?.avatar_url} />
                        <AvatarFallback className="text-[9px]">
                          {userInitials(act.actor?.data?.display_name ?? "?")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-pm-text-primary/80 leading-relaxed">
                          {parseMessage(act)}
                        </p>
                        {timeStr && (
                          <p className="text-[10px] text-pm-text-muted mt-0.5">
                            {timeStr}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {hasMore && (
            <div className="text-center pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? __("Loading...") : __("Load more")}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
