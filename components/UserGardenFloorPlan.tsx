import styles from '@components/UserGardenFloorPlan.module.css';

import * as Constants from '@common/constants';
import * as OfficePlanData from '@common/office-plan';
import * as React from 'react';

import OfficePlan, { FULL_VIEW, zoomView } from '@components/OfficePlan';
import Select from '@system/Select';
import SmallButton from '@system/documents/SmallButton';
import StandardHeader from '@components/StandardHeader';
import StandardLayout from '@components/StandardLayout';
import StandardLayoutSection from '@components/StandardLayoutSection';
import Table from '@system/Table';

const NEW_NAME = '__new-name__';
const CURRENT_NAME = '__current-name__';

function initials(text: string) {
  const words = text.split(/[\s._@-]+/).filter(Boolean);
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  return text.slice(0, 2).toUpperCase();
}

function holderOf(desk) {
  if (desk.name) return desk.name;
  if (desk.user) return desk.user.email;
  return '';
}

function isTaken(desk) {
  return Boolean(desk.taken || desk.user_id || desk.name);
}

export default function UserGardenFloorPlan(props) {
  const isAdmin = props.viewer.level >= Constants.Users.tiers.ADMIN;
  const [desks, setDesks] = React.useState<any[] | null>(null);
  const [tenants, setTenants] = React.useState<any[]>([]);
  const [draft, setDraft] = React.useState<any[] | null>(null);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [view, setView] = React.useState(FULL_VIEW);
  const [saving, setSaving] = React.useState(false);

  const load = async () => {
    const response = await props.onGetOfficeDesks();
    setDesks(response ? response.data : null);
  };

  React.useEffect(() => {
    load();
    if (isAdmin) {
      props.onGetAllTenants().then((response) => setTenants(response && response.data ? response.data : []));
    }
  }, []);

  const editing = draft !== null;
  const source = editing ? draft : desks || [];
  const planDesks = source.map((desk) => {
    const holder = holderOf(desk);
    return {
      ...desk,
      key: desk.key || desk.id,
      state: desk.mine ? 'mine' : isTaken(desk) ? 'taken' : 'open',
      label: holder ? initials(holder) : null,
    };
  });

  const onMoveBy = (keys, dx, dy) => {
    setDraft((current) =>
      (current || []).map((desk) =>
        keys.includes(desk.key)
          ? { ...desk, x_in: Math.min(OfficePlanData.WIDTH_IN, Math.max(0, desk.x_in + dx)), y_in: Math.min(OfficePlanData.HEIGHT_IN, Math.max(0, desk.y_in + dy)) }
          : desk
      )
    );
  };

  const onRotate = (keys) => {
    setDraft((current) => (current || []).map((desk) => (keys.includes(desk.key) ? { ...desk, rotation: (desk.rotation + 90) % 360 } : desk)));
  };

  const onRemove = (keys) => {
    if (!draft) return;
    const held = draft.filter((desk) => keys.includes(desk.key) && isTaken(desk));
    if (held.length && !window.confirm(`Desk ${held.map((desk) => desk.number).join(', ')} has someone at it. Remove it anyway?`)) {
      return;
    }
    setDraft((current) => (current || []).filter((desk) => !keys.includes(desk.key)));
    setSelected([]);
  };

  const onAdd = () => {
    if (!draft) return;
    const key = `new-${Date.now()}`;
    const number = Math.max(0, ...draft.map((desk) => desk.number)) + 1;
    const height = (view.width * OfficePlanData.HEIGHT_IN) / OfficePlanData.WIDTH_IN;
    setDraft([...draft, { key, number, x_in: Math.round(view.x + view.width / 2), y_in: Math.round(view.y + height / 2), rotation: 0 }]);
    setSelected([key]);
  };

  const onSave = async () => {
    if (!draft || !desks) return;
    setSaving(true);
    const before = new Map<string, any>(desks.map((desk) => [desk.id, desk]));
    const kept = new Set(draft.filter((desk) => desk.id).map((desk) => desk.id));
    let ok = true;

    for (const desk of desks) {
      if (!kept.has(desk.id)) ok = !!(await props.onDeleteOfficeDesk({ id: desk.id })) && ok;
    }
    for (const desk of draft) {
      const fields = { number: desk.number, x_in: desk.x_in, y_in: desk.y_in, rotation: desk.rotation };
      if (!desk.id) {
        ok = !!(await props.onCreateOfficeDesk(fields)) && ok;
        continue;
      }
      const old = before.get(desk.id);
      if (old.number !== desk.number || old.x_in !== desk.x_in || old.y_in !== desk.y_in || old.rotation !== desk.rotation) {
        ok = !!(await props.onUpdateOfficeDesk({ id: desk.id, updates: fields })) && ok;
      }
    }

    if (!ok) alert('Something went wrong');
    await load();
    setDraft(null);
    setSelected([]);
    setSaving(false);
  };

  const onAssign = async (desk, value) => {
    let updates: Record<string, any> | null = null;
    if (value === '') updates = { user_id: null, name: null };
    else if (value === NEW_NAME) {
      const name = window.prompt('Who holds this desk?', desk.name || '');
      if (!name || !name.trim()) return;
      updates = { name: name.trim() };
    } else if (value !== CURRENT_NAME) updates = { user_id: value };

    if (!updates) return;
    const response = await props.onUpdateOfficeDesk({ id: desk.id, updates });
    if (!response) alert('Something went wrong');
    await load();
  };

  const accounts = tenants.filter((each) => Number(each.tier) === 2 && Number(each.level) >= Constants.Users.tiers.GENERAL_CO_WORKING);

  const toolbar = editing ? (
    <div className={styles.toolbar}>
      <SmallButton onClick={onAdd}>Add desk</SmallButton>
      <SmallButton disabled={!selected.length} onClick={() => onRotate(selected)}>Rotate</SmallButton>
      <SmallButton disabled={!selected.length} onClick={() => onRemove(selected)}>Remove</SmallButton>
      <span className={styles.gap} />
      <SmallButton onClick={() => (setDraft(null), setSelected([]))}>Cancel</SmallButton>
      <SmallButton loading={saving} onClick={onSave} style={{ background: 'var(--theme-primary)', borderColor: 'var(--theme-primary)', color: 'var(--color-white)' }}>
        Save
      </SmallButton>
    </div>
  ) : (
    <div className={styles.toolbar}>
      <SmallButton onClick={() => setView(zoomView(view, 1.4))}>−</SmallButton>
      <SmallButton onClick={() => setView(zoomView(view, 1 / 1.4))}>+</SmallButton>
      <SmallButton onClick={() => setView(FULL_VIEW)}>Fit</SmallButton>
      {isAdmin && desks ? (
        <>
          <span className={styles.gap} />
          <SmallButton onClick={() => (setDraft(desks.map((desk) => ({ ...desk, key: desk.id }))), setSelected([]))}>Edit layout</SmallButton>
        </>
      ) : null}
    </div>
  );

  return (
    <StandardLayout style={{ maxWidth: 'none' }}>
      <StandardHeader title="Floor plan" />

      <StandardLayoutSection title="Suite 301">
        {toolbar}
        <OfficePlan
          desks={desks ? planDesks : []}
          editing={editing}
          selected={selected}
          view={view}
          onView={setView}
          onSelect={setSelected}
          onMoveBy={onMoveBy}
          onRotate={onRotate}
          onRemove={onRemove}
        />
      </StandardLayoutSection>

      {isAdmin && desks && !editing ? (
        <StandardLayoutSection title="Desks">
          <Table
            data={desks.map((desk) => {
              const options = [{ value: '', label: 'Open' }];
              if (desk.name) options.push({ value: CURRENT_NAME, label: desk.name });
              if (desk.user && !accounts.some((each) => each.id === desk.user_id)) options.push({ value: desk.user_id, label: desk.user.email });
              accounts.forEach((each) => options.push({ value: each.id, label: each.email }));
              options.push({ value: NEW_NAME, label: 'Type a name' });
              const value = desk.name ? CURRENT_NAME : desk.user_id || '';
              const isSelected = selected.includes(desk.id);

              return {
                id: desk.id,
                data: [
                  <div className={isSelected ? styles.selectedNumber : styles.number}>{desk.number}</div>,
                  <Select options={options} value={value} onChange={(event) => onAssign(desk, event.target.value)} style={{ width: 320 }} />,
                ],
              };
            })}
            headings={['DESK', 'HELD BY']}
            customWidth="80px 1fr"
            style={{ marginTop: 24, maxWidth: 480 }}
          />
        </StandardLayoutSection>
      ) : null}
    </StandardLayout>
  );
}
