// FORGE Wave 7 — Project Sandbox orchestrator view.
//
// Top-level view embedded under the Student Nest's "PROJECT SANDBOX"
// tab. Two-column layout: LEFT shows the project library and
// performance tracker for the selected project; RIGHT is a sticky
// underwriting form for adding the next hypothetical project.

import { useEffect, useState } from 'react';
import { C, F, S } from '@/design/tokens';
import { EditorialIdentity } from '@/components/terminal/EditorialIdentity';
import { useSandboxStore } from '@/lib/sandbox/positionState';
import { setProjectPortfolioState } from '@/services/contextProviders/studentNestContext';
import { HypotheticalProjectForm } from './HypotheticalProjectForm';
import { HypotheticalProjectLibrary } from './HypotheticalProjectLibrary';
import { ProjectPerformanceTracker } from './ProjectPerformanceTracker';

export function ProjectSandboxView() {
  const projects = useSandboxStore((s) => s.projects);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedId) return;
    if (projects[0]) setSelectedId(projects[0].id);
  }, [projects, selectedId]);

  useEffect(() => {
    setProjectPortfolioState({ projects, selectedProjectId: selectedId });
    return () => setProjectPortfolioState(null);
  }, [projects, selectedId]);

  const selected = selectedId
    ? projects.find((p) => p.id === selectedId) ?? null
    : null;

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        padding: S.xl,
        display: 'flex',
        flexDirection: 'column',
        gap: S.lg,
      }}
    >
      <div style={{ marginBottom: S.sm }}>
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: C.electricBlue,
            marginBottom: S.xs,
          }}
        >
          PROJECT SANDBOX · {projects.length} PROJECTS
        </div>
        <EditorialIdentity size="hero">Underwrite a project.</EditorialIdentity>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: S.lg,
          alignItems: 'start',
        }}
      >
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: S.lg }}
        >
          <HypotheticalProjectLibrary
            onSelect={setSelectedId}
            selectedProjectId={selectedId}
          />
          {selected && <ProjectPerformanceTracker project={selected} />}
        </div>

        <div
          style={{
            position: 'sticky',
            top: S.lg,
            display: 'flex',
            flexDirection: 'column',
            gap: S.lg,
          }}
        >
          <HypotheticalProjectForm
            onCreated={(project) => setSelectedId(project.id)}
          />
        </div>
      </div>
    </div>
  );
}
