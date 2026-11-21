import { globalExplorePath } from "../../lib/argos/globalExploreLocal";
import { entryFor } from "./catalog";

export function explorePath(query: string, key?: string, fields: Record<string, string> = {}) {
  const params = new URLSearchParams(fields);
  if (query) params.set("q", query);
  return `${globalExplorePath}${key ? `/${key}` : ""}${params.size ? `?${params}` : ""}`;
}

export function objectPath(query: string, ref: string) {
  const entry = entryFor(ref);
  if (!entry) throw new Error(`Unknown ARGOS object: ${ref}`);
  return explorePath(query, entry.key, entry.pins);
}

// null means absent, false means malformed (including repeated URL pins).
export function readPair(params: URLSearchParams, prefix: "observation" | "document") {
  const refs = params.getAll(`${prefix}_ref`);
  const versions = params.getAll(`${prefix}_version`);
  if (!refs.length && !versions.length) return null;
  if (refs.length !== 1 || versions.length !== 1 || !refs[0] || !versions[0]) return false;
  return { ref: refs[0], version: versions[0] };
}

export function readDisclosure(params: URLSearchParams) {
  const choices = params.getAll("evidence");
  if (!choices.length) return "closed";
  return choices.length === 1 && choices[0] === "document" ? "open" : "invalid";
}
