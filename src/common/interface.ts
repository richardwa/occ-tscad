export const apiPath = "/api";

export type ServerApi = {
  listFiles: () => Promise<string[]>;
};

export const fetchJson = <T extends keyof ServerApi>(
  key: T,
  ...params: Parameters<ServerApi[T]>
) => {
  // handle demo mode in github pages
  if (document.location.hostname.endsWith("github.io")) {
    if (key === "listFiles") {
      return [
        "test-2d.ts",
        "test-cut.ts",
        "test-fillet.ts",
        "test-intersect.ts",
        "test-revolve.ts",
        "test-union.ts",
        "test-xyz.ts",
      ];
    }
  }

  return fetch(`${apiPath}/${key}`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  }).then((res) => res.json()) as ReturnType<ServerApi[T]>;
};
