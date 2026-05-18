import React from "react";

export default function DiscussionFiles({ files }) {
  if (!files?.data?.length) return null;
  return (
    <div className="mt-3 flex gap-2 flex-wrap">
      {files.data.map((f) => (
        <a
          key={f.id}
          href={f.url}
          target="_blank"
          rel="noreferrer"
          title={f.name}
          className="block overflow-hidden rounded-md border border-border/50 hover:border-pm-accent/40 transition-all no-underline"
        >
          <img
            src={f.thumb || f.url}
            alt={f.name}
            className="h-20 w-20 object-cover"
          />
        </a>
      ))}
    </div>
  );
}
