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

export const getModelShape = async (contents: string) => {
  const { sphere, box, circle, cone, cylinder, poly, torus, wedge, initOCC } =
    await import("occ-tscad");

  // remove imports
  let replaced = contents.replace(/^\s*import[\s\S]*?;[\r\n]*/gm, "");
  // remove exports
  replaced = replaced.replace(/^\s*export /gm, "");

  try {
    const main = eval(replaced + "\n try{main;}catch{}");
    if (!main) {
      console.error(`code must contain "const main"`);
      return;
    }
    const oc = initOCC();
    const result = main(oc);
    return result;
  } catch (e) {
    console.error(replaced, e);
    throw e;
  }
};

export const loadModelFile = async (file: string) => {
  const resp = await fetch(`${document.baseURI}models/${file}`);
  return await resp.text();
};

export const formatDate = (d = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(d);

  const p = Object.fromEntries(parts.map((x) => [x.type, x.value]));

  return `${p.year}-${p.month.toUpperCase()}-${p.day} ${p.hour}:${p.minute}:${p.second}`;
};
