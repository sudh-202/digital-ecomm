import {
  File,
  FileArchive,
  FileAudio,
  FileCode,
  FileImage,
  FileText as FilePdf,
  FileSpreadsheet,
  FileText,
  FileVideo
} from "lucide-react";

type FileIconMapping = {
  [key: string]: any;
};

// Map file extensions to icons
const fileIconMap: FileIconMapping = {
  // Documents
  'doc': FileText,
  'docx': FileText,
  'txt': FileText,
  'rtf': FileText,
  'odt': FileText,

  // Spreadsheets
  'xls': FileSpreadsheet,
  'xlsx': FileSpreadsheet,
  'csv': FileSpreadsheet,
  'ods': FileSpreadsheet,

  // PDFs
  'pdf': FilePdf,

  // Images
  'jpg': FileImage,
  'jpeg': FileImage,
  'png': FileImage,
  'gif': FileImage,
  'webp': FileImage,
  'svg': FileImage,
  'bmp': FileImage,

  // Videos
  'mp4': FileVideo,
  'mov': FileVideo,
  'avi': FileVideo,
  'wmv': FileVideo,
  'webm': FileVideo,

  // Audio
  'mp3': FileAudio,
  'wav': FileAudio,
  'ogg': FileAudio,
  'm4a': FileAudio,

  // Archives
  'zip': FileArchive,
  'rar': FileArchive,
  '7z': FileArchive,
  'tar': FileArchive,
  'gz': FileArchive,

  // Code
  'js': FileCode,
  'ts': FileCode,
  'jsx': FileCode,
  'tsx': FileCode,
  'html': FileCode,
  'css': FileCode,
  'json': FileCode,
};

export function getFileIcon(filename: string): any {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  return fileIconMap[extension] || File;
}
