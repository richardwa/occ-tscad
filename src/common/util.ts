export const formatDate = (date?: Date | string) => {
  if (!date) return "";

  if (typeof date === "string") {
    date = new Date(date);
  }

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
};

export function setExtension(filename: string, newExt: string): string {
  // Remove existing extension if any
  const baseName = filename.replace(/\.[^/.]+$/, "");
  // Ensure newExt doesn't have a leading dot
  const cleanExt = newExt.startsWith(".") ? newExt.slice(1) : newExt;
  return `${baseName}.${cleanExt}`;
}
