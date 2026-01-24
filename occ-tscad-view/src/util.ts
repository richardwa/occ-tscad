export function setExtension(filename: string, newExt: string): string {
  // Remove existing extension if any
  const baseName = filename.replace(/\.[^/.]+$/, "");
  // Ensure newExt doesn't have a leading dot
  const cleanExt = newExt.startsWith(".") ? newExt.slice(1) : newExt;
  return `${baseName}.${cleanExt}`;
}

export function downloadBinaryFile(internalUrl: string, fileName: string) {
  // Create a download link
  const link = document.createElement("a");

  // Set the download attribute with the file name
  link.download = fileName;

  // Create a URL for the Blob and set it as the href attribute
  link.href = internalUrl;

  // Append the link to the document
  document.body.appendChild(link);

  // Trigger a click event on the link to start the download
  link.click();

  // Remove the link from the document
  document.body.removeChild(link);
}
