// @ts-ignore
if (import.meta.hot) {
  // 1️⃣ Listen to ALL updates
  // @ts-ignore
  import.meta.hot.on("vite:beforeUpdate", async (payload) => {
    console.log(
      "[HMR] updates:",
      payload.updates.map((u: any) => u.path),
    );
  });

  // 3️⃣ Stop bubbling → prevents full page reload
  // @ts-ignore
  import.meta.hot.accept();
}
