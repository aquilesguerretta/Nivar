if (import.meta.env.DEV && import.meta.env.MODE === "argos-local" && location.hostname === "127.0.0.1") {
  void import("./mount.tsx");
}
