import { useEffect } from "react";

/** Remove only NIVAR's own link on departure, preserving the original document identity. */
export function useNivarFavicon() {
  useEffect(() => {
    const icon = document.createElement("link");
    icon.rel = "icon";
    icon.type = "image/svg+xml";
    icon.href = "/g2/g23/brand/favicon.svg";
    document.head.appendChild(icon);
    return () => icon.remove();
  }, []);
}
