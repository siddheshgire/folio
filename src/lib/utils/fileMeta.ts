export interface FileTypeMeta {
  category: "pdf" | "presentation" | "document" | "archive" | "code" | "image" | "audio" | "generic";
  label: string;
  badgeBg: string;
  badgeText: string;
  borderCol: string;
  iconBg: string;
}

export function getFileMeta(filename: string): FileTypeMeta {
  const ext = filename.split(".").pop()?.toLowerCase() || "";

  if (ext === "pdf") {
    return {
      category: "pdf",
      label: "PDF",
      badgeBg: "bg-rose-500/15",
      badgeText: "text-rose-400",
      borderCol: "border-rose-500/30",
      iconBg: "bg-rose-500/20 text-rose-400",
    };
  }

  if (["ppt", "pptx", "key"].includes(ext)) {
    return {
      category: "presentation",
      label: "PPT / SLIDES",
      badgeBg: "bg-amber-500/15",
      badgeText: "text-amber-400",
      borderCol: "border-amber-500/30",
      iconBg: "bg-amber-500/20 text-amber-400",
    };
  }

  if (["doc", "docx", "txt", "rtf", "odt"].includes(ext)) {
    return {
      category: "document",
      label: "DOCX",
      badgeBg: "bg-blue-500/15",
      badgeText: "text-blue-400",
      borderCol: "border-blue-500/30",
      iconBg: "bg-blue-500/20 text-blue-400",
    };
  }

  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) {
    return {
      category: "archive",
      label: "ZIP ARCHIVE",
      badgeBg: "bg-purple-500/15",
      badgeText: "text-purple-400",
      borderCol: "border-purple-500/30",
      iconBg: "bg-purple-500/20 text-purple-400",
    };
  }

  if (["py", "java", "cpp", "c", "js", "ts", "html", "css", "sql", "json"].includes(ext)) {
    return {
      category: "code",
      label: ext.toUpperCase() + " CODE",
      badgeBg: "bg-emerald-500/15",
      badgeText: "text-emerald-400",
      borderCol: "border-emerald-500/30",
      iconBg: "bg-emerald-500/20 text-emerald-400",
    };
  }

  if (["png", "jpg", "jpeg", "webp", "gif", "svg"].includes(ext)) {
    return {
      category: "image",
      label: "IMAGE",
      badgeBg: "bg-pink-500/15",
      badgeText: "text-pink-400",
      borderCol: "border-pink-500/30",
      iconBg: "bg-pink-500/20 text-pink-400",
    };
  }

  return {
    category: "generic",
    label: ext ? ext.toUpperCase() : "FILE",
    badgeBg: "bg-gray-500/15",
    badgeText: "text-gray-300",
    borderCol: "border-gray-500/30",
    iconBg: "bg-gray-500/20 text-gray-300",
  };
}
