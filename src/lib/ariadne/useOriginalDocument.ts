import { useEffect, useState } from "react";

export const originalDocumentMessage = {
  session:
    "Sessão indisponível. Entre novamente em outra aba e tente carregar o original aqui.",
  unavailable: "Original indisponível neste contexto.",
  retry: "Não foi possível carregar o original agora. Tente novamente.",
} as const;

type Failure = keyof typeof originalDocumentMessage;
type Original =
  | { href: string; failure?: never }
  | { href?: never; failure: Failure };

export function useOriginalDocument(request: string | File | undefined) {
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState<{
    request: typeof request;
    attempt: number;
    original: Original;
  }>();

  useEffect(() => {
    setLoaded(undefined);
    if (!request) return;
    const controller = new AbortController();
    let href = "";
    const publish = (original: Original) => {
      if (!controller.signal.aborted) setLoaded({ request, attempt, original });
    };

    async function load() {
      try {
        let blob: Blob;
        if (typeof request === "string") {
          const response = await fetch(request, {
            cache: "no-store",
            credentials: "include",
            signal: controller.signal,
          });
          if (!response.ok) {
            const status = response.status;
            publish({
              failure:
                status === 401
                  ? "session"
                  : status === 403 || status === 404
                    ? "unavailable"
                    : "retry",
            });
            return;
          }
          blob = await response.blob();
        } else if (request) {
          blob = request;
        } else {
          return;
        }
        if (controller.signal.aborted) return;
        href = URL.createObjectURL(blob);
        publish({ href });
      } catch {
        publish({ failure: "retry" });
      }
    }

    void load();
    return () => {
      controller.abort();
      if (href) URL.revokeObjectURL(href);
    };
  }, [request, attempt]);

  // Ignore a reply for different source context or for the previous attempt.
  const current =
    loaded && loaded.request === request && loaded.attempt === attempt
      ? loaded.original
      : undefined;
  return {
    href: current?.href,
    failure: current?.failure,
    retry: () => setAttempt((previous) => previous + 1),
  };
}
