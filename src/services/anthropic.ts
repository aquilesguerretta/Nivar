// ORACLE — Anthropic API client.
//
// Wave 2: all calls route through the FastAPI proxy at `/api/ai/complete`.
// The proxy holds the ANTHROPIC_API_KEY server-side; the browser never
// sees it. The proxy is non-streaming (single JSON request → single JSON
// response), so we simulate progressive rendering client-side by emitting
// text in word-sized chunks. When the proxy upgrades to SSE, swap the
// inner loop for a stream reader without touching the public API.

import { BASE_SYSTEM_PROMPT } from '@/lib/prompts/systemPrompt';

const ENDPOINT = '/api/ai/complete';

// Sprint default — stays in sync with the Wave 2 brief.
const DEFAULT_MODEL = 'claude-sonnet-4-20250514';
const DEFAULT_MAX_TOKENS = 1000;

// Word-streaming rate. ~24 chunks/sec ≈ comfortable read speed without
// looking instant-response on a slow network.
const SIMULATED_STREAM_DELAY_MS = 18;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface StreamChunk {
  type: 'text' | 'done' | 'error';
  text?: string;
  error?: string;
}

interface StreamOptions {
  model?: string;
  maxTokens?: number;
  /**
   * If provided, replaces the default system message. Wave 2 callers
   * (`useAIChat`) pass the contextual prompt built by `buildSystemPrompt`.
   */
  systemPrompt?: string;
  /** Disables client-side word streaming — yields the full text as one chunk. */
  disableSimulatedStream?: boolean;
  /** Abort signal — propagates to fetch and aborts any in-flight stream. */
  signal?: AbortSignal;
}

interface AnthropicTextBlock {
  type: 'text';
  text: string;
}
interface AnthropicResponse {
  content?: AnthropicTextBlock[];
  error?: { message?: string; type?: string };
  // The proxy may also forward `{ detail: '...' }` from FastAPI errors.
  detail?: unknown;
}

export async function* streamChat(
  messages: ChatMessage[],
  contextBlock: string,
  options: StreamOptions = {},
): AsyncGenerator<StreamChunk> {
  const {
    model = DEFAULT_MODEL,
    maxTokens = DEFAULT_MAX_TOKENS,
    systemPrompt,
    disableSimulatedStream,
    signal,
  } = options;

  const system = systemPrompt
    ? systemPrompt
    : `${BASE_SYSTEM_PROMPT}\n\n--- CURRENT CONTEXT ---\n${contextBlock}`;

  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        system,
        messages,
      }),
      signal,
    });
  } catch (err) {
    yield {
      type: 'error',
      error:
        err instanceof Error
          ? `Network error contacting AI service: ${err.message}`
          : 'Network error contacting AI service.',
    };
    return;
  }

  let payload: AnthropicResponse;
  try {
    payload = (await response.json()) as AnthropicResponse;
  } catch {
    yield {
      type: 'error',
      error: `AI service returned an invalid response (status ${response.status}).`,
    };
    return;
  }

  if (!response.ok) {
    const detail =
      typeof payload.detail === 'string'
        ? payload.detail
        : payload.error?.message ?? `Request failed (status ${response.status}).`;
    yield { type: 'error', error: detail };
    return;
  }

  const fullText = (payload.content ?? [])
    .filter((b): b is AnthropicTextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');

  if (!fullText) {
    yield { type: 'error', error: 'AI service returned an empty response.' };
    return;
  }

  if (disableSimulatedStream) {
    yield { type: 'text', text: fullText };
    yield { type: 'done' };
    return;
  }

  // Simulated streaming — split on whitespace, preserving the spacing.
  const tokens = splitForStreaming(fullText);
  for (const token of tokens) {
    if (signal?.aborted) {
      yield { type: 'error', error: 'Aborted.' };
      return;
    }
    yield { type: 'text', text: token };
    if (SIMULATED_STREAM_DELAY_MS > 0) {
      await new Promise<void>((r) => setTimeout(r, SIMULATED_STREAM_DELAY_MS));
    }
  }
  yield { type: 'done' };
}

/**
 * Tokenise text into stream-sized chunks. Splits between words while
 * preserving the spaces — concatenating all chunks reproduces the input.
 * Long unbroken runs (e.g. URLs) are emitted as a single chunk to avoid
 * unnatural mid-word breaks.
 */
function splitForStreaming(text: string): string[] {
  const chunks: string[] = [];
  // Match: any run of non-whitespace, then any run of whitespace (including
  // none). This guarantees concatenation reconstructs the input.
  const re = /\S+\s*|\s+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    chunks.push(m[0]);
  }
  return chunks;
}
