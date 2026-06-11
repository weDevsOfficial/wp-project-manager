import React from "react";
import CommentAttachment from "@components/common/CommentAttachment";

export default function DiscussionFiles({ files }) {
  if (!files?.data?.length) return null;
  return (
    <div className="mt-3 flex gap-2 flex-wrap">
      {files.data.map((f) => (
        <CommentAttachment key={f.id} file={f} />
      ))}
    </div>
  );
}
