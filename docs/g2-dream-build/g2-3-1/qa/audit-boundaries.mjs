// Read-only G2.3.1 boundary audit. Only reports in this directory are written.
// Compare against the owner's actual starting commit, never a moving HEAD.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';

const BASE = 'aa54f8f32f11e1742cfd1cbe80c7219a217c2de7';
const qa = 'docs/g2-dream-build/g2-3-1/qa';
const options = { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, windowsHide: true };
const git = (...args) => execFileSync('git', args, options).trimEnd();
const sha = data => createHash('sha256').update(data).digest('hex');
const lf = text => text.replaceAll('\r\n', '\n');
const textAt = filename => lf(fs.readFileSync(filename, 'utf8'));
const baseAt = filename => lf(git('show', `${BASE}:${filename}`)) + '\n';
const sameText = (a, b) => a.trimEnd() === b.trimEnd();
const allowed = {
  'src/components/g2/HeroFilm.tsx': 'Hero only: directed film, real media, editorial films, shared Terminal observation, quiet controls.',
  'src/components/g2/hero-film.css': 'Hero only: temporal composition, reserved record/plot areas, mobile and static states.',
  'src/components/g2/HeroInstrument.tsx': 'Direct Hero dependency: wrapper around unchanged real Terminal AnalysisInstrument and model.',
  'src/components/g2/FamilyInsignia.tsx': 'Five compact family masters and accessible labels; independent from large patrons.',
  'src/components/g2/family-insignia.css': 'Compact insignia presentation only.',
  'src/components/g2/insignia-context.css': 'Scoped spacing for existing navigation, family rail and Terminal brand label.',
  'src/components/g2/Brand.tsx': 'Existing compact FamilyEmblem adapter; Wordmark, portrait data and large portrait output preserved.',
  'src/components/g2/NivarShell.tsx': 'Direct identity dependency: 16 px desktop and 24 px mobile family insignia insertions.',
  'src/components/g2/HouseChapters.tsx': 'Direct identity dependency: compact insignia inside each existing family navigation button.',
  'src/pages/terminal-brasil/TerminalBrasil.tsx': 'Direct identity dependency: 16 px Intelligence insignia in existing brand label; no functional changes.',
};

const tracked = git('ls-tree', '-r', '--format=%(objectname)%x09%(path)', BASE).split('\n').filter(Boolean).map(line => {
  const [blob, filename] = line.split('\t');
  return { path: filename, baselineGitBlob: blob };
});
const roots = ['src/', 'app/', 'public/', 'tests/'];
const configs = ['package.json', 'package-lock.json', 'vite.config.ts', 'vercel.json', 'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json', 'index.html', 'requirements.txt', 'pyproject.toml', 'alembic.ini'];
const runtime = tracked.filter(item => roots.some(root => item.path.startsWith(root)) || configs.includes(item.path));
const existing = runtime.filter(item => fs.existsSync(item.path));
// hash-object --stdin-paths applies the repository's actual clean filters. This
// compares Git blobs, without mistaking a Windows CRLF checkout for a change.
const hashes = execFileSync('git', ['hash-object', '--stdin-paths'], {
  ...options, input: existing.map(item => item.path).join('\n') + '\n', stdio: ['pipe', 'pipe', 'pipe'],
}).trimEnd().split('\n');
const actual = new Map(existing.map((item, index) => [item.path, hashes[index]]));
const comparisons = runtime.map(item => ({ ...item, currentGitBlob: actual.get(item.path) ?? null, unchanged: item.baselineGitBlob === actual.get(item.path), allowed: item.path in allowed }));
const allStatus = git('status', '--porcelain=v1', '--untracked-files=all', '-z').split('\0').filter(Boolean).map(line => ({ status: line.slice(0, 2), path: line.slice(3).replaceAll('\\', '/') }));
const baselinePaths = new Set(tracked.map(item => item.path));
// Include files committed after BASE as well as currently untracked additions.
const currentRuntimePaths = git('ls-files', '--cached', '--others', '--exclude-standard', '-z', '--', ...roots).split('\0').filter(Boolean);
const newRuntime = [...new Set(currentRuntimePaths)].filter(filename => !baselinePaths.has(filename)).map(filename => ({ status: allStatus.find(item => item.path === filename)?.status ?? 'added since baseline', path: filename }));
const addedSource = newRuntime.filter(item => item.path.startsWith('src/') || item.path.startsWith('app/') || item.path.startsWith('tests/'));
const runtimeChanged = comparisons.filter(item => !item.unchanged);
const unexpected = runtimeChanged.filter(item => !item.allowed).map(item => item.path).concat(addedSource.filter(item => !(item.path in allowed)).map(item => item.path));

const alexandria = fs.readFileSync('docs/g2-dream-build/g2-3-1/baseline/alexandria-sha256.txt', 'utf8').trim().split(/\r?\n/).map(line => {
  const match = line.match(/^([A-Fa-f0-9]{64})\s+(.+)$/);
  if (!match) throw new Error(`Malformed Alexandria baseline line: ${line}`);
  const [, expected, filename] = match;
  const current = fs.existsSync(filename) ? sha(fs.readFileSync(filename)) : null;
  return { path: filename, baselineSha256: expected.toLowerCase(), currentSha256: current, unchanged: current === expected.toLowerCase() };
});

function astNode(filename, source, predicate) {
  const parsed = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let selected;
  function visit(node) {
    if (!selected && predicate(node, parsed)) selected = node.getText(parsed);
    if (!selected) ts.forEachChild(node, visit);
  }
  visit(parsed);
  if (!selected) throw new Error(`Protected AST node absent: ${filename}`);
  return selected;
}
function blockCheck(label, filename, select) {
  const before = select(baseAt(filename));
  const after = select(textAt(filename));
  return { label, path: filename, baselineSha256: sha(before), currentSha256: sha(after), unchanged: before === after };
}
function normalizedCheck(label, filename, restoreIdentityInsertions) {
  const before = baseAt(filename).trimEnd();
  const after = restoreIdentityInsertions(textAt(filename)).trimEnd();
  return { label, path: filename, baselineSha256: sha(before), restoredCurrentSha256: sha(after), unchangedExceptDeclaredIdentityInsertion: sameText(before, after) };
}
const brand = 'src/components/g2/Brand.tsx';
const shell = 'src/components/g2/NivarShell.tsx';
const blocks = [
  blockCheck('Authored Wordmark function, including optical outlines', brand, source => astNode(brand, source, node => ts.isFunctionDeclaration(node) && node.name?.text === 'Wordmark')),
  blockCheck('Patron identity definitions including Diógenes', brand, source => astNode(brand, source, node => ts.isVariableDeclaration(node) && node.name.getText() === 'EMBLEMS')),
  blockCheck('Large portrait img output and asset paths', brand, source => astNode(brand, source, node => ts.isJsxSelfClosingElement(node) && node.tagName.getText() === 'img')),
  blockCheck('Full approved footer JSX', shell, source => astNode(shell, source, node => ts.isJsxElement(node) && node.openingElement.tagName.getText() === 'footer')),
];
const insertions = [
  normalizedCheck('All shell behavior and structure outside the two navigation symbol insertions', shell, source => source
    .replace('import { FamilyEmblem, Wordmark } from "./Brand";', 'import { Wordmark } from "./Brand";')
    .replace('<FamilyEmblem family={f} size={16} decorative />{FAMILY_NAMES[f]}', '{FAMILY_NAMES[f]}')
    .replace('<FamilyEmblem family={f} size={24} decorative />{FAMILY_NAMES[f]}', '{FAMILY_NAMES[f]}')),
  normalizedCheck('All family chapters, interactions and content outside the family-rail symbol insertion', 'src/components/g2/HouseChapters.tsx', source => source.replace('<FamilyEmblem family={f.id} size={24} decorative />', '')),
  normalizedCheck('All Terminal behavior, layout and copy outside the brand-label symbol insertion', 'src/pages/terminal-brasil/TerminalBrasil.tsx', source => source
    .replace('import { FamilyEmblem, Wordmark } from "../../components/g2/Brand";', 'import { Wordmark } from "../../components/g2/Brand";')
    .replace('<FamilyEmblem family="intelligence" size={16} decorative />', '')),
  normalizedCheck('Brand adapter outside compact identity delegation and its explanatory comment', brand, source => source
    .replace('import { FamilyInsignia, type FamilyInsigniaName } from "./FamilyInsignia";\nimport "./insignia-context.css";\n\n', '')
    .replace('/** Large patrons and compact insignias are complementary identity layers. */', '/** Patrons carry family identity; small identifiers only locate a family in the house. */')
    .replace('  if (variant !== "hero" && family in EMBLEMS && family !== "house") {\n    return <FamilyInsignia family={family as FamilyInsigniaName} size={size} className={className} decorative={decorative} />;\n  }\n', '')),
];
const groupDefinitions = {
  backend: filename => filename.startsWith('app/'),
  operator: filename => /^src\/(pages|components|lib)\/operador\//.test(filename),
  advisoryProductsAndWorkflow: filename => /^src\/pages\/(conta-de-luz-express|solar-proposal-validator|diagnostico-energetico)\//.test(filename) || /^src\/lib\/(submissoes|conversas|diagnostico)\//.test(filename) || /^src\/components\/g2\/(Advisory|advisory-)/.test(filename),
  authAndAccount: filename => /^src\/(lib\/auth|pages\/conta|pages\/auth)\//.test(filename),
  academyAndAlexandria: filename => /alexandria/i.test(filename),
  approvedPortalArchitectureAndFamilyPages: filename => filename.startsWith('src/pages/br/'),
  terminalImplementationExceptIdentityInsertion: filename => filename.startsWith('src/pages/terminal-brasil/') && filename !== 'src/pages/terminal-brasil/TerminalBrasil.tsx',
  routesAndLoading: filename => filename === 'src/main.tsx' || /^src\/.*Router\.tsx$/.test(filename) || filename === 'src/components/g2/family-path.ts',
  methodAndDiogenesFinale: filename => /^src\/components\/g2\/(MethodWorkbench\.tsx|method-workbench\.css|method-evidence\.ts|HouseFinale\.tsx|house-finale\.css)$/.test(filename),
  largePatronAssets: filename => filename.startsWith('public/g2/g21/emblems/'),
  protectedGlobalAndHouseStyles: filename => ['src/index.css', 'src/components/g2/g2.css', 'src/components/g2/g23-house.css', 'src/components/g2/house-chapters.css', 'src/pages/operador/g2-operations.css'].includes(filename),
  tests: filename => filename.startsWith('tests/'),
  rootConfiguration: filename => configs.includes(filename),
};
const groups = Object.fromEntries(Object.entries(groupDefinitions).map(([name, predicate]) => {
  const members = comparisons.filter(item => predicate(item.path));
  return [name, { total: members.length, unchanged: members.filter(item => item.unchanged).length, discrepancies: members.filter(item => !item.unchanged).map(item => item.path), paths: members.map(item => item.path) }];
}));
const routeSource = ts.createSourceFile('main.tsx', textAt('src/main.tsx'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
let routeCount = 0;
function visitRoute(node) {
  if ((ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) && node.tagName.getText(routeSource) === 'Route') routeCount++;
  ts.forEachChild(node, visitRoute);
}
visitRoute(routeSource);
const branch = git('branch', '--show-current');
const pass = branch === 'wave/nivar-g2-dream-build' && unexpected.length === 0 && alexandria.length === 209 && alexandria.every(item => item.unchanged) && blocks.every(item => item.unchanged) && insertions.every(item => item.unchangedExceptDeclaredIdentityInsertion);
const report = {
  timestamp: new Date().toISOString(), startingHead: BASE, observedHead: git('rev-parse', 'HEAD'), branch, pass,
  method: 'Compare current clean-filtered Git blobs against the literal starting commit; separately compare all 209 Alexandria raw-file SHA-256 hashes and protected AST/text blocks. No HEAD-relative diff, runtime mutation, git staging, commit or browser claim.',
  baselineCaveat: 'starting-worktree.txt was captured after early G2.3.1 documentation work. It is not used to infer ownership. The known pre-existing tracked .blend change below is outside runtime and is explicitly excluded.',
  preexistingTrackedOwnerChangeExcluded: 'docs/g2-dream-build/g2-1/material/nivar-material-study.blend',
  comparisonCounts: { trackedRuntimeAndAssets: comparisons.length, unchanged: comparisons.filter(item => item.unchanged).length, scopedChanged: runtimeChanged.filter(item => item.allowed).length, unexpected: unexpected.length },
  changedTrackedRuntime: runtimeChanged.map(item => ({ ...item, rationale: allowed[item.path] ?? null })),
  addedSource: addedSource.map(item => ({ ...item, allowed: item.path in allowed, rationale: allowed[item.path] ?? null })),
  unexpected,
  publicAssetScope: { allowedNewPrefix: 'public/g2/g231/', newG231Assets: newRuntime.filter(item => item.path.startsWith('public/g2/g231/')).map(item => item.path), preexistingOtherUntrackedAssets: newRuntime.filter(item => item.path.startsWith('public/') && !item.path.startsWith('public/g2/g231/')).map(item => item.path), changedExistingAssets: runtimeChanged.filter(item => item.path.startsWith('public/')) },
  alexandria: { total: alexandria.length, unchanged: alexandria.filter(item => item.unchanged).length, discrepancies: alexandria.filter(item => !item.unchanged) },
  protectedGroups: groups, protectedBlocks: blocks, fullFileIdentityInsertionChecks: insertions,
  mainRouteCount: routeCount,
  allowedSourceFiles: allowed,
  limitations: ['This report proves source/asset boundaries, not rendered visual correctness or service availability; browser QA is recorded separately.', 'Git blob equality accounts for configured clean filters. Alexandria is also checked using raw worktree bytes against the supplied SHA-256 baseline.', 'Group counts overlap. Use comparisonCounts for the distinct tracked-file count.', 'Observed HEAD may equal the starting HEAD while authorized edits remain uncommitted. Rerun after later source edits or before the final package.'],
};
fs.mkdirSync(qa, { recursive: true });
fs.writeFileSync(path.join(qa, 'alexandria-hash-comparison.json'), JSON.stringify(alexandria, null, 2) + '\n');
fs.writeFileSync(path.join(qa, 'boundary-file-blobs.json'), JSON.stringify(comparisons, null, 2) + '\n');
fs.writeFileSync(path.join(qa, 'boundary-and-inventory.json'), JSON.stringify(report, null, 2) + '\n');
const md = [
  '# G2.3.1 — auditoria de fronteiras', '',
  `Resultado: **${pass ? 'PASS' : 'FAIL'}**. Comparação com o início real \`${BASE}\`; HEAD observado \`${report.observedHead}\`, branch \`${report.branch}\`.`, '',
  `${comparisons.length} arquivos rastreados de código, backend, ativos, testes e configuração comparados por blob Git: ${report.comparisonCounts.unchanged} iguais, ${report.comparisonCounts.scopedChanged} alterações autorizadas, ${unexpected.length} mudanças inesperadas. ${addedSource.length} arquivos novos de código, todos enumerados abaixo.`, '',
  '**Alexandria: 209/209 hashes SHA-256 preservados.** A comparação de bytes usa a lista fornecida no baseline G2.3.1; nenhuma discrepância.', '',
  '| Fronteira protegida | Arquivos | Iguais |', '| --- | ---: | ---: |',
  ...Object.entries(groups).map(([name, value]) => `| ${name} | ${value.total} | ${value.unchanged} |`), '',
  'As contagens de grupos se sobrepõem. Além delas, os blocos Wordmark, dados dos patronos, saída dos retratos grandes e footer são iguais. Ao remover somente as inserções declaradas de identidade, NivarShell, HouseChapters, TerminalBrasil e Brand voltam integralmente ao texto do baseline. Os fluxos, handlers, conteúdo e estrutura restantes nesses arquivos estão preservados.', '',
  `O arquivo \`src/main.tsx\` está igual ao baseline, incluindo ${routeCount} elementos Route, imports e carregamento. MethodWorkbench, evidência EV-001 e finale de Diógenes permanecem iguais.`, '',
  '## Alterações autorizadas e dependências diretas', '',
  '| Arquivo | Estado | Escopo |', '| --- | --- | --- |',
  ...runtimeChanged.map(item => `| \`${item.path}\` | modificado | ${allowed[item.path] ?? '**INESPERADO**'} |`),
  ...addedSource.map(item => `| \`${item.path}\` | novo | ${allowed[item.path] ?? '**INESPERADO**'} |`), '',
  'A nova mídia pública e os masters das insígnias estão em `public/g2/g231/`; nenhum ativo público já rastreado foi alterado. A inserção de símbolos em componentes compartilhados muda a identidade compacta dos consumidores existentes, preservando os retratos grandes e o wordmark. O CSS novo de contexto se restringe à navegação, rail das famílias e rótulo de marca do Terminal.', '',
  '## Proveniência e limites', '',
  '- `boundary-file-blobs.json`: lista completa com blob do início, blob atual e igualdade por arquivo.',
  '- `boundary-and-inventory.json`: grupos, motivos, quatro comparações de arquivo integral após remoção de inserções de identidade e quatro blocos protegidos com SHA-256.',
  '- `alexandria-hash-comparison.json`: os 209 hashes originais e atuais.',
  '- `terminal-tests.log`: execução dos oito testes existentes de análise, estado de URL, exportação e persistência do Terminal.',
  '- `starting-worktree.txt` não determina posse, pois foi capturado depois do início de documentação. A modificação pré-existente `docs/g2-dream-build/g2-1/material/nivar-material-study.blend` é do owner e foi excluída.',
  '- Nenhum runtime, staging, commit, merge ou deploy foi feito por esta auditoria. Igualdade de código não substitui a verificação visual e funcional no navegador.',
  '- Reexecutar `node docs/g2-dream-build/g2-3-1/qa/audit-boundaries.mjs` após qualquer edição posterior de código ou antes do pacote final.', '',
];
if (!pass) md.push('## Falhas', '', '```json', JSON.stringify({ unexpected, blocks, insertions, alexandria: report.alexandria }, null, 2), '```', '');
fs.writeFileSync(path.join(qa, 'boundary-audit.md'), md.join('\n'));
console.log(JSON.stringify({ pass, ...report.comparisonCounts, alexandria: report.alexandria, groups: Object.fromEntries(Object.entries(groups).map(([name, value]) => [name, { total: value.total, unchanged: value.unchanged }])), protectedBlocks: blocks.map(({ label, unchanged }) => ({ label, unchanged })), identityInsertionChecks: insertions.map(({ label, unchangedExceptDeclaredIdentityInsertion }) => ({ label, unchangedExceptDeclaredIdentityInsertion })), unexpected }, null, 2));
if (!pass) process.exitCode = 1;
