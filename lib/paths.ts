export function safeNextPath(raw: unknown): string {
  const value = String(raw ?? "").trim();
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/login")) {
    return "/dashboard";
  }
  if (value.includes("://") || value.includes("\\")) return "/dashboard";
  return value;
}
