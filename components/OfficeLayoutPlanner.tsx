import styles from '@components/OfficeLayoutPlanner.module.css';
import * as React from 'react';
import * as Planner from '@common/office-planner';
import * as Geometry from '@common/office-geometry';
import * as Floor from '@common/office-plan';
import OfficePlan, { fitView, wholeView, zoomView } from '@components/OfficePlan';
import type { PlanningOverlay } from '@components/OfficePlan';
import Button from '@system/Button';
import ButtonPrimary from '@system/ButtonPrimary';
import Input from '@system/Input';
import { H5, P, SubTitle } from '@system/typography';

type Saved = { id: string; draft: Planner.Draft };
type Props = {
  desks: Planner.Desk[];
  initialDraft: Planner.Draft | null;
  viewerId: string;
  onClose: () => void;
  onReview: (draft: Planner.Draft) => Promise<string | null>;
};
const ASPECT = 3 / 2;
const button = { width: '100%', marginTop: 12, minHeight: 40 };

function readSaved(key: string): Saved[] {
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  const value: unknown = JSON.parse(raw);
  if (!Array.isArray(value) || value.length > 20) throw new Error('Saved drafts could not be read. Export your current draft before clearing browser storage.');
  const entries: unknown[] = value;
  return entries.map((item) => {
    if (!item || typeof item !== 'object' || !('id' in item) || !('draft' in item) || typeof item.id !== 'string') throw new Error('Invalid saved draft.');
    return { id: item.id, draft: Planner.parseDraft(item.draft) };
  });
}

export default function OfficeLayoutPlanner(props: Props) {
  const storageKey = `office-planner:v1:${props.viewerId}`;
  const [session, setSession] = React.useState<{ draft: Planner.Draft; undo: Planner.Draft[] }>(() => ({ draft: props.initialDraft || Planner.createDraft(props.desks, 'Alternative layout'), undo: [] }));
  const [saved, setSaved] = React.useState<Saved[]>([]);
  const [message, setMessage] = React.useState('');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [tool, setTool] = React.useState<PlanningOverlay['tool']>('move');
  const [view, setView] = React.useState(() => wholeView(ASPECT));
  const [additional, setAdditional] = React.useState(2);
  const [candidates, setCandidates] = React.useState<Planner.Candidate[]>([]);
  const [running, setRunning] = React.useState(false);
  const [reviewing, setReviewing] = React.useState(false);
  const [showBaseline, setShowBaseline] = React.useState(false);
  const controller = React.useRef<AbortController | null>(null);
  const dragging = React.useRef(false);
  const lastSaved = React.useRef('');
  const draft = session.draft;
  const report = React.useMemo(() => Planner.analyze(draft), [draft]);
  const busy = running || reviewing;
  const selectedKeys = Planner.selection(draft, selected);
  const locked = selectedKeys.some((key) => draft.locked.includes(key));
  const selectedSeats = report.clearance.filter((seat) => selectedKeys.includes(seat.key));

  React.useEffect(() => {
    try {
      setSaved(readSaved(storageKey));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not read saved drafts.');
    }
    return () => controller.current?.abort();
  }, [storageKey]);

  React.useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (JSON.stringify(draft) === lastSaved.current) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [draft]);

  const fitDesks = () => {
    if (!draft.desks.length) return;
    const xs = draft.desks.map((d) => d.x_in);
    const ys = draft.desks.map((d) => d.y_in);
    setView(fitView({ x: Math.min(...xs) - 80, y: Math.min(...ys) - 80, width: Math.max(...xs) - Math.min(...xs) + 160, height: Math.max(...ys) - Math.min(...ys) + 160 }, ASPECT));
  };

  const change = (update: (value: Planner.Draft) => Planner.Draft, remember = true, keepCandidates = false) => {
    setSession((current) => ({ draft: update(current.draft), undo: remember ? [...current.undo.slice(-39), current.draft] : current.undo }));
    if (!keepCandidates) setCandidates([]);
    setMessage('');
  };
  const unsaved = () => JSON.stringify(draft) !== lastSaved.current;
  const confirmLeave = () => !unsaved() || window.confirm('Leave this draft? Unsaved changes will be lost. Save a copy or export it to keep it.');
  const select = (keys: string[]) => setSelected(Planner.selection(draft, keys));
  const canMove = (keys: string[]) => !busy && !keys.some((key) => draft.locked.includes(key));
  const move = (keys: string[], dx: number, dy: number) => {
    if (!canMove(keys)) return;
    change((d) => ({ ...d, desks: Planner.transform(d.desks, keys, dx, dy) }), !dragging.current);
    dragging.current = true;
  };
  const settle = (keys: string[], snap: boolean, moved?: { dx: number; dy: number }) => {
    dragging.current = false;
    if (!canMove(keys)) return;
    change((d) => {
      const shift = Geometry.settle(d.desks, keys, snap, moved);
      return { ...d, desks: Planner.transform(d.desks, keys, shift.dx, shift.dy) };
    }, false);
  };
  const rotate = (keys: string[]) => {
    if (canMove(keys)) change((d) => ({ ...d, desks: Planner.transform(d.desks, keys, 0, 0, true) }));
  };
  const remove = (keys: string[]) => {
    if (!canMove(keys)) return;
    if (keys.some((key) => draft.baseline.some((d) => d.key === key))) {
      setMessage('Planning keeps existing desks and their assignments. Only newly added desks can be removed here.');
      return;
    }
    change((d) => ({ ...d, desks: d.desks.filter((desk) => !keys.includes(desk.key)), pods: d.pods.map((p) => p.filter((key) => !keys.includes(key))).filter((p) => p.length) }));
    setSelected([]);
  };
  const add = () => {
    if (draft.desks.length >= 200) return;
    const key = `new-${crypto.randomUUID()}`;
    change((d) => ({
      ...d,
      desks: [...d.desks, { key, number: Math.max(0, ...d.desks.map((desk) => desk.number)) + 1, x_in: Math.round(Math.min(Floor.WIDTH_IN - 30, Math.max(30, view.x + view.width / 2))), y_in: Math.round(Math.min(Floor.HEIGHT_IN - 30, Math.max(30, view.y + view.width / ASPECT / 2))), rotation: 0 }],
      pods: [...d.pods, [key]],
    }));
    setSelected([key]);
  };
  const draw = (rect: Geometry.Rect) => {
    if (tool === 'move' || busy) return;
    if (tool === 'area') change((d) => ({ ...d, area: rect }));
    else {
      const kind = tool;
      change((d) => ({ ...d, zones: [...d.zones, { ...rect, kind, key: crypto.randomUUID() }] }));
    }
    setTool('move');
  };
  const save = () => {
    try {
      const valid = Planner.parseDraft(draft);
      const current = readSaved(storageKey);
      if (current.length >= 20) throw new Error('Delete a saved copy before saving another (20 maximum).');
      const next = [...current, { id: crypto.randomUUID(), draft: valid }];
      localStorage.setItem(storageKey, JSON.stringify(next));
      setSaved(next);
      lastSaved.current = JSON.stringify(draft);
      setMessage('Saved in this browser. Export a copy to share or back it up.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save. Export a copy instead.');
    }
  };
  const exportDraft = () => {
    try {
      const valid = Planner.parseDraft(draft);
      const url = URL.createObjectURL(new Blob([JSON.stringify(valid, null, 2)], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'office-layout.json';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      lastSaved.current = JSON.stringify(draft);
      setMessage('Exported geometry only; no names or assignments.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not export.');
    }
  };
  const importDraft = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      if (file.size > 1000000) throw new Error('Draft file is too large.');
      const imported = Planner.parseDraft(JSON.parse(await file.text()));
      if (!confirmLeave()) return;
      change(() => imported);
      setSelected([]);
      lastSaved.current = JSON.stringify(imported);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not import draft.');
    }
  };
  const search = async () => {
    const abort = new AbortController();
    controller.current = abort;
    setRunning(true);
    setCandidates([]);
    try {
      const result = await Planner.optimize(draft, { additional, signal: abort.signal, onProgress: setMessage });
      if (abort.signal.aborted) return;
      setCandidates(result);
      setMessage(result.length ? 'Suggestions are ready. Compare them below; choosing one changes only this draft.' : 'No valid candidate found in this search. Adjust the pods, search area, or protected zones and try again.');
    } catch (error) {
      setMessage(abort.signal.aborted ? 'Search cancelled. Your draft is unchanged.' : error instanceof Error ? error.message : 'Search failed.');
    } finally {
      if (controller.current === abort) {
        controller.current = null;
        setRunning(false);
      }
    }
  };
  const review = async () => {
    if (!draft.zones.some((z) => z.kind === 'aisle') && !window.confirm('No circulation aisles are protected. Continue to review without circulation checks?')) return;
    setReviewing(true);
    try {
      const error = await props.onReview(draft);
      if (error) setMessage(error);
    } catch {
      setMessage('Could not load the live layout. Your draft is unchanged.');
    } finally {
      setReviewing(false);
    }
  };

  return (
    <section className={styles.root} aria-label="Office layout planner">
      <header className={styles.header}>
        <div>
          <SubTitle style={{ padding: 0 }}>Layout planner</SubTitle>
          <P>Explore alternatives without moving live desks. Drafts stay in this browser unless exported.</P>
        </div>
        <Button
          disabled={busy}
          onClick={() => {
            if (confirmLeave()) props.onClose();
          }}
        >
          Back to floor plan
        </Button>
      </header>
      <div className={styles.workspace}>
        <div className={styles.mapColumn}>
          <div className={styles.toolbar}>
            <Button disabled={busy} onClick={() => setTool('move')}>
              {tool === 'move' ? '✓ Move pods' : 'Move pods'}
            </Button>
            <Button disabled={busy} onClick={() => setTool('area')}>
              {tool === 'area' ? '✓ Draw search area' : 'Draw search area'}
            </Button>
            <Button disabled={busy || draft.zones.length >= 100} onClick={() => setTool('aisle')}>
              {tool === 'aisle' ? '✓ Draw aisle' : 'Draw aisle'}
            </Button>
            <Button disabled={busy || draft.zones.length >= 100} onClick={() => setTool('keep-clear')}>
              {tool === 'keep-clear' ? '✓ Draw keep-clear' : 'Draw keep-clear'}
            </Button>
          </div>
          <div className={styles.mapHelp}>{tool === 'move' ? 'Click a pod; Shift-click to select more. Arrows move · R rotates · dashed outlines show the original layout.' : 'Drag a rectangle on the map. Use several rectangles for bends. Scroll to zoom.'}</div>
          <OfficePlan aspect={ASPECT} desks={draft.desks.map((d) => ({ ...d, state: 'open', label: String(d.number) }))} editing={!busy} selected={selectedKeys} view={view} onView={setView} onSelect={select} onMoveBy={move} onSettle={settle} onRotate={rotate} onRemove={remove} planning={{ tool: busy ? 'move' : tool, zones: draft.zones, area: draft.area, baseline: showBaseline ? draft.baseline : [], locked: draft.locked, pods: draft.pods, onDraw: draw }} />
          <div className={styles.toolbar}>
            <Button onClick={() => setView(zoomView(view, 1.4, undefined, undefined, ASPECT))}>−</Button>
            <Button onClick={() => setView(zoomView(view, 1 / 1.4, undefined, undefined, ASPECT))}>+</Button>
            <Button onClick={() => setView(wholeView(ASPECT))}>Whole floor</Button>
            <Button onClick={fitDesks}>Fit desks</Button>
            <Button onClick={() => setShowBaseline(!showBaseline)}>{showBaseline ? 'Hide original' : 'Show original'}</Button>
            <Button
              disabled={!session.undo.length || busy}
              onClick={() => {
                setSession((s) => ({ draft: s.undo[s.undo.length - 1], undo: s.undo.slice(0, -1) }));
                setCandidates([]);
                setSelected([]);
              }}
            >
              Undo
            </Button>
          </div>
        </div>
        <aside className={styles.inspector}>
          <fieldset disabled={busy}>
            <label className={styles.field}>
              Draft name
              <Input value={draft.name} maxLength={80} onChange={(e) => change((d) => ({ ...d, name: e.target.value }))} />
            </label>
            <H5>
              {draft.desks.length} desks <span className={styles.subtle}>/ {draft.baseline.length} original</span>
            </H5>
            <div className={styles.summary}>
              {report.moved} moved · {report.belowTarget} below target
            </div>
            <SubTitle style={{ padding: 0, marginTop: 24 }}>{selectedKeys.length} selected</SubTitle>
            <div className={styles.toolbar}>
              <Button disabled={!selectedKeys.length || locked} onClick={() => rotate(selectedKeys)}>
                Rotate
              </Button>
              <Button disabled={!selectedKeys.length} onClick={() => change((d) => ({ ...d, locked: locked ? d.locked.filter((key) => !selectedKeys.includes(key)) : [...new Set([...d.locked, ...selectedKeys])] }))}>
                {locked ? 'Unlock' : 'Lock'}
              </Button>
            </div>
            <div className={styles.toolbar}>
              <Button disabled={selectedKeys.length < 2} onClick={() => change((d) => ({ ...d, pods: [...d.pods.filter((p) => !p.some((key) => selectedKeys.includes(key))), selectedKeys] }))}>
                Group pod
              </Button>
              <Button disabled={selectedKeys.length < 2} onClick={() => change((d) => ({ ...d, pods: [...d.pods.filter((p) => !p.some((key) => selectedKeys.includes(key))), ...selectedKeys.map((key) => [key])] }))}>
                Ungroup
              </Button>
            </div>
            <Button onClick={add} disabled={draft.desks.length >= 200} style={button}>
              Add desk
            </Button>
            <Button onClick={() => remove(selectedKeys)} disabled={!selectedKeys.length || locked} style={button}>
              Remove new desks
            </Button>
            {selectedSeats.map((seat) => (
              <div key={seat.key} className={styles.seat}>
                Desk {seat.number}: {seat.inches >= 95 ? '95+' : seat.inches} in behind{seat.loss > 0 ? ` (−${seat.loss} in)` : ''}
              </div>
            ))}
            <label className={styles.field}>
              Chair-side clearance target (in)
              <Input
                type="number"
                min={26}
                max={72}
                value={draft.clearance}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  if (Number.isInteger(n) && n >= 26 && n <= 72) change((d) => ({ ...d, clearance: n }));
                }}
              />
            </label>
            <label className={styles.field}>
              Additional desks (0 to improve spacing)
              <Input
                type="number"
                min={0}
                max={8}
                value={additional}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  if (Number.isInteger(n) && n >= 0 && n <= 8) setAdditional(n);
                }}
              />
            </label>
            <ButtonPrimary disabled={!draft.area || draft.desks.length + additional > 200} onClick={search} style={button}>
              Suggest layouts
            </ButtonPrimary>
            {!draft.area ? <p className={styles.hint}>Draw the area where desks may move or be added. Pods outside it stay fixed.</p> : null}
            <Button onClick={save} style={button}>
              Save a copy
            </Button>
            <ButtonPrimary disabled={!!report.issues.length} onClick={review} style={button}>
              Review for live layout
            </ButtonPrimary>
          </fieldset>
          {running ? (
            <Button onClick={() => controller.current?.abort()} style={button}>
              Cancel search
            </Button>
          ) : null}
          <p className={styles.status} role="status">
            {message}
          </p>
        </aside>
      </div>
      <div className={styles.details}>
        <section>
          <SubTitle style={{ padding: 0 }}>Suggestions</SubTitle>
          <p className={styles.hint}>Heuristic search, not a guaranteed best fit. No automatic route-connectivity check.</p>
          {candidates.map((candidate, index) => (
            <div className={styles.item} key={index}>
              <strong>{candidate.name}</strong>
              <p>
                {candidate.desks.length} desks ({candidate.desks.length - draft.baseline.length >= 0 ? '+' : ''}
                {candidate.desks.length - draft.baseline.length}) · {candidate.report.moved} moved
              </p>
              <p>
                {candidate.report.minimum} in minimum · {candidate.report.belowTarget} below target
              </p>
              <p>{candidate.report.clearance.filter((c) => c.loss > 0).length} seats lose clearance</p>
              <Button
                disabled={busy}
                onClick={() => {
                  change((d) => ({ ...d, desks: candidate.desks, locked: d.locked.filter((key) => candidate.desks.some((desk) => desk.key === key)), pods: [...d.pods.filter((p) => p.every((key) => candidate.desks.some((desk) => desk.key === key))), ...candidate.desks.filter((desk) => !d.pods.flat().includes(desk.key)).map((desk) => [desk.key])] }), true, true);
                  setSelected([]);
                }}
                style={button}
              >
                Use in draft
              </Button>
            </div>
          ))}
        </section>
        <section>
          <SubTitle style={{ padding: 0 }}>Protected space</SubTitle>
          <p className={styles.hint}>Blue: aisles. Gray: keep clear. Protect door swings and kitchen access yourself; dimensions are approximate.</p>
          {draft.area ? (
            <div className={styles.item}>
              Search area: {draft.area.width} × {draft.area.height} in
              <Button disabled={busy} onClick={() => change((d) => ({ ...d, area: null }))} style={button}>
                Remove search area
              </Button>
            </div>
          ) : null}
          {draft.zones.map((zone, index) => (
            <div className={styles.item} key={zone.key}>
              {index + 1}. {zone.kind === 'aisle' ? 'Aisle' : 'Keep clear'} · {zone.width} × {zone.height} in
              <Button disabled={busy} onClick={() => change((d) => ({ ...d, zones: d.zones.filter((z) => z.key !== zone.key) }))} style={button}>
                Remove zone {index + 1}
              </Button>
            </div>
          ))}
        </section>
        <section>
          <SubTitle style={{ padding: 0 }}>Geometry checks</SubTitle>
          <p className={styles.hint}>Chair-side clearance includes the chair, measured across its width, up to 95 in. A target is a preference, not a safety standard.</p>
          <p>
            {report.issues.length} conflicts · {report.belowTarget} seats below {draft.clearance} in
          </p>
          {report.issues.map((issue, i) => (
            <p className={styles.issue} key={i}>
              {issue}
            </p>
          ))}
          <details>
            <summary>Compare every seat</summary>
            {report.clearance.map((seat) => (
              <div className={styles.seat} key={seat.key}>
                Desk {seat.number}: {seat.inches >= 95 ? '95+' : seat.inches} in{seat.loss ? ` · loses ${seat.loss} in` : ''}
              </div>
            ))}
          </details>
        </section>
        <section>
          <SubTitle style={{ padding: 0 }}>Saved drafts</SubTitle>
          <p className={styles.hint}>Only in this browser and account. Export before clearing browser data.</p>
          <Button disabled={busy} onClick={exportDraft} style={button}>
            Export draft
          </Button>
          <label className={styles.field}>
            Import draft
            <input type="file" accept=".json,application/json" disabled={busy} onChange={importDraft} />
          </label>
          {saved.map((entry) => (
            <div className={styles.item} key={entry.id}>
              <strong>{entry.draft.name}</strong>
              <p>{entry.draft.desks.length} desks</p>
              <Button
                disabled={busy}
                onClick={() => {
                  if (confirmLeave()) {
                    change(() => entry.draft);
                    setSelected([]);
                    lastSaved.current = JSON.stringify(entry.draft);
                  }
                }}
                style={button}
              >
                Open copy
              </Button>
              <Button
                disabled={busy}
                onClick={() => {
                  if (!window.confirm(`Delete saved copy “${entry.draft.name}”?`)) return;
                  try {
                    const next = readSaved(storageKey).filter((s) => s.id !== entry.id);
                    localStorage.setItem(storageKey, JSON.stringify(next));
                    setSaved(next);
                  } catch {
                    setMessage('Could not delete saved copy.');
                  }
                }}
                style={button}
              >
                Delete copy
              </Button>
            </div>
          ))}
        </section>
      </div>
    </section>
  );
}
