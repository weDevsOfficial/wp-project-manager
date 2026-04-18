import { File, Image, FileArchive, FileText } from "lucide-react";

export function getFileIcon(type) {
  if (!type) return File;
  if (type.startsWith("image")) return Image;
  if (type.includes("zip") || type.includes("archive") || type.includes("rar"))
    return FileArchive;
  return FileText;
}

export function getAttachedLabel(file, __) {
  const type = file.fileable_type;
  if (type === "discussion_board") return __("Discussion");
  if (type === "task") return __("Task");
  if (type === "task_list") return __("Task List");
  if (type === "comment") {
    const parentType = file.fileable?.commentable_type;
    if (parentType === "task") return __("Task Comment");
    if (parentType === "discussion_board") return __("Discussion Comment");
    return __("Comment");
  }
  return "";
}
