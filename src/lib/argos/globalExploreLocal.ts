export const globalExploreRoute = "argos/explore";
export const globalExplorePath = `/br/${globalExploreRoute}`;

export const globalExploreEnabled =
  import.meta.env.DEV &&
  import.meta.env.MODE === "argos-local" &&
  window.location.hostname === "127.0.0.1";
