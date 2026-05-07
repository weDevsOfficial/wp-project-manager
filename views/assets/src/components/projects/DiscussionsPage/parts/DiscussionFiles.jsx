import React from "react";
import { FileText } from "lucide-react";

export default function DiscussionFiles({ files }) {
  if (!files?.data?.length) return null;
  const images = files.data.filter((f) => f.type === "image" && (f.thumb || f.url));
  const others = files.data.filter((f) => !(f.type === "image" && (f.thumb || f.url)));
  return (
    <div className="mt-3 space-y-2">
      {images.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((f) => (
            <a
              key={f.id}
              href={f.url}
              target="_blank"
              rel="noreferrer"
              className="group relative block overflow-hidden rounded-xl border border-border/50 hover:border-pm-accent/40 transition-all hover:shadow-md"
            >
              <img
                src={f.thumb || f.url}
                alt={f.name}
                className="h-28 w-28 object-cover transition-transform group-hover:scale-105"
              />
            </a>
          ))}
        </div>
      )}
      {others.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {others.map((f) => (
            <a
              key={f.id}
              href={f.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm border border-border/50 rounded-xl px-3 py-2 hover:bg-muted/40 hover:border-pm-accent/30 transition-all group"
            >
              <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 text-pm-text-muted group-hover:text-pm-accent transition-colors" />
              </div>
              <span className="text-pm-text-primary truncate max-w-[150px] text-[13px] font-medium">
                {f.name}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
