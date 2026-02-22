import fs from "fs";
import path from "path";

export function deleteAvatarFile(avatarUrl?: string | null) {
  if (!avatarUrl) return;

  const filename = avatarUrl.replace("/uploads/users/", "");
  const filePath = path.join(process.cwd(), "uploads", "users", filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}