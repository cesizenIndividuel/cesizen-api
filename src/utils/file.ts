import fs from "fs";
import path from "path";

export function deleteUploadedFile(fileUrl?: string | null) {
  if (!fileUrl) return;

  const filePath = path.join(process.cwd(), fileUrl.replace(/^\/+/, ""));

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}