import { test } from "node:test";
import assert from "node:assert/strict";
import { indexValue, makeAnalysis, analysisCsv, noteAnchors, observationInWindow, selectionForWindow, selectionForDailySeries } from "../../src/pages/terminal-brasil/analysis.ts";
import { parseSavedWorkspaces, parseWorkspace, serializeWorkspace } from "../../src/pages/terminal-brasil/workspace-state.ts";
import { getSeries, SAMPLE_VERSION } from "../../src/pages/terminal-brasil/sample.ts";

test("URL roundtrip preserves analytical scope and selected observation", () => {
  const state = parseWorkspace(new URLSearchParams("region=nordeste&period=30d&metric=storage&compare=norte,sul&start=11&end=24&observation=18&view=table&scale=index&tone=paper&source=sample&note=0"));
  assert.deepEqual(parseWorkspace(new URLSearchParams(serializeWorkspace(state).split("?")[1])), state);
});
test("untrusted URL cannot supply invalid entities, inverted bounds or a data value", () => {
  const state = parseWorkspace(new URLSearchParams("region=javascript:evil&period=1year&metric=fake&compare=norte,norte,fake,sudesteCentroOeste&start=20&end=2&observation=Infinity&value=999999"));
  assert.equal(state.region, "sudesteCentroOeste");
  assert.deepEqual(state.compare, ["norte"]);
  assert.deepEqual([state.start, state.end, state.observation], [0, 23, undefined]);
  assert.ok(!serializeWorkspace(state).includes("999999"));
});
test("narrowing a daily window preserves observations and uses first visible value as index baseline", () => {
  const long = makeAnalysis(["nordeste", "sul"], "30d", "price", 23, 29, "index");
  const week = makeAnalysis(["nordeste", "sul"], "7d", "price", 0, 6, "index");
  for (let region = 0; region < long.length; region++) {
    assert.deepEqual(long[region].observations.map(({ timestamp, value }) => ({ timestamp, value })), week[region].observations.map(({ timestamp, value }) => ({ timestamp, value })));
    assert.deepEqual(long[region].values, week[region].values);
    assert.equal(long[region].values[0], 100);
  }
});
test("zero, missing or nonfinite normalization bases stay absent", () => {
  assert.equal(indexValue(9, 0), null);
  assert.equal(indexValue(null, 100), null);
  assert.equal(indexValue(9, null), null);
  assert.equal(indexValue(Infinity, 100), null);
  assert.equal(indexValue(120, 100), 120);
});
test("CSV exports displayed series/window with raw evidence and explicit transformation", () => {
  const models = makeAnalysis(["norte", "sul"], "30d", "storage", 27, 29, "index");
  const csv = analysisCsv(models, "storage", "30d", "index");
  const rows = csv.split("\r\n");
  assert.equal(rows.length, 7);
  assert.ok(rows.every(row => row.includes("valor_original") || row.includes("DEMONSTRACAO_SINTETICA")));
  assert.ok(rows[1].includes('"100";"indice_base_100"'));
  assert.ok(rows[1].includes(getSeries("norte", "30d", "storage")[27].timestamp));
  assert.ok(rows[1].includes('"valor / primeira_observacao_visivel * 100"'));
});
test("browser records are versioned and cannot navigate to arbitrary destinations", () => {
  assert.deepEqual(parseSavedWorkspaces("not json"), []);
  const good = { id: "view-1", name: "Reservas", url: "/br/terminal?region=sul&metric=storage", savedAt: "2026-09-12", dataset: SAMPLE_VERSION };
  const values = parseSavedWorkspaces(JSON.stringify([good, { ...good, url: "https://example.com" }, { ...good, dataset: "old" }]));
  assert.equal(values.length, 1);
  assert.ok(values[0].url.startsWith("/br/terminal?"));
  assert.equal(parseWorkspace(new URLSearchParams(values[0].url.split("?")[1])).region, "sul");
});

test("cropping the Sul week retains the selected note timestamp and never relocates its anchors", () => {
  const week = getSeries("sul", "7d", "price");
  const notes = noteAnchors(week);
  assert.deepEqual(notes.map(point => point.label), ["06/09", "08/09", "09/09"]);
  assert.equal(notes[1].value, 200.78);
  const included = selectionForWindow(week, notes[1].index, 3, 6); // 07–10 September
  assert.equal(included.moved, false);
  assert.equal(included.point.timestamp, "2026-09-08");
  assert.equal(included.point.value, 200.78);
  assert.equal(observationInWindow(notes[0].index, 3, 6), false);
  assert.equal(observationInWindow(notes[1].index, 3, 6), true);
  const excluded = selectionForWindow(week, notes[1].index, 5, 6); // 09–10 September
  assert.equal(excluded.moved, true); // UI must announce a new ordinary observation.
  assert.equal(excluded.point.timestamp, "2026-09-09");
  assert.equal(excluded.point.value, 195.38);
  assert.equal(notes[1].timestamp, "2026-09-08");
  assert.equal(observationInWindow(notes[1].index, 5, 6), false);
});

test("daily preset changes preserve a note-backed instant even when note indices differ", () => {
  const week = getSeries("sul", "7d", "price");
  const month = getSeries("sul", "30d", "price");
  const selectedNote = noteAnchors(week)[1];
  const inMonth = selectionForDailySeries(selectedNote, month);
  assert.equal(inMonth.moved, false);
  assert.equal(inMonth.point.index, 27);
  assert.equal(inMonth.point.value, 200.78);
  assert.equal(inMonth.point.timestamp, selectedNote.timestamp);
  assert.notEqual(noteAnchors(month)[1].timestamp, selectedNote.timestamp);
  const backInWeek = selectionForDailySeries(inMonth.point, week);
  assert.deepEqual(backInWeek, { point: selectedNote, moved: false });
  const outsideWeek = selectionForDailySeries(month[0], week);
  assert.deepEqual(outsideWeek, { point: week[0], moved: true });
});
