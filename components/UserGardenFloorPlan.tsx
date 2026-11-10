import styles from '@components/UserGardenFloorPlan.module.css';

import * as Constants from '@common/constants';
import * as OfficeGeometry from '@common/office-geometry';
import * as OfficePlanData from '@common/office-plan';
import * as React from 'react';

import Button from '@system/Button';
import ButtonPrimary from '@system/ButtonPrimary';
import CheckmarkItem from '@system/documents/CheckmarkItem';
import Cross from '@system/svg/Cross';
import Input from '@system/Input';
import OfficePlan, { FULL_VIEW, zoomView } from '@components/OfficePlan';
import Select from '@system/Select';

import { H5, P, SubTitle } from '@system/typography';

const NEW_NAME = '__new-name__';
const NAME_PREFIX = 'name:';
const FULL_WIDTH_BUTTON = { height: 48, marginTop: 12, width: '100%' };

function initials(text: string) {
  const words = text.split(/[\s._@-]+/).filter(Boolean);
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  return text.slice(0, 2).toUpperCase();
}

// The best name an account has: the name on its profile, its username, or the start of its email.
function personName(user) {
  if (!user) return '';
  const name = user.name || (user.data && typeof user.data.name === 'string' ? user.data.name.trim() : '');
  return name || user.username || (user.email || '').split('@')[0];
}

function accountLabel(user) {
  return `${personName(user)} (${user.email})`;
}

function holderOf(desk) {
  if (desk.name) return desk.name;
  if (desk.user) return personName(desk.user);
  return '';
}

// NOTE(@caidanw)
// Partner is the team plan ("sections for your company or team" on Upgrades), so desks held by a
// partner account count as a team's, alongside desks held by a typed name. Admins are people.
function isTeamDesk(desk) {
  if (desk.name) return true;
  const level = desk.user ? Number(desk.user.level) : 0;
  return level >= Constants.Users.tiers.PARTNER && level < Constants.Users.tiers.ADMIN;
}

// Plan names match the Upgrades page; prices are a fallback for when Stripe can't be reached.
const PLANS = [
  { level: Constants.Users.tiers.ADMIN, name: 'Admin', price: '' },
  { level: Constants.Users.tiers.PARTNER, name: 'Partner', price: '$2,790' },
  { level: Constants.Users.tiers.GENERAL_CO_WORKING, name: 'Collaborator', price: '$404' },
  { level: Constants.Users.tiers.PAYING, name: 'Professional', price: '$8.99' },
];

function planOf(level) {
  return PLANS.find((plan) => Number(level) >= plan.level) || { level: 0, name: 'Free', price: '' };
}

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatCents(cents) {
  const dollars = cents / 100;
  return `$${dollars.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(dollars) ? 0 : 2, maximumFractionDigits: 2 })}`;
}

// NOTE(@caidanw)
// Reads POST /api/users/subscriptions/get-by-user-id. That route lists only active subscriptions,
// and Stripe moves a subscription off active as soon as a renewal payment fails, so no active
// subscription means the current period isn't paid. A failed request means we don't know.
function billingOf(response) {
  if (!response || response.error) return { state: 'unknown' };
  if (!response.data || !response.data.length) return { state: 'unpaid' };
  const until = Math.max(...response.data.map((each) => new Date(each.current_period_end).getTime()));
  const item = response.data.flatMap((each) => each.items || []).find((each) => each.amount_cents);
  return { state: 'paid', until, cents: item ? item.amount_cents : null };
}

// NOTE(@caidanw)
// Admins are INTDEV staff. Their desks aren't paid for, so they skip the payment check.
function isStaff(desk) {
  return Boolean(desk.user && Number(desk.user.level) >= Constants.Users.tiers.ADMIN);
}

function isTaken(desk) {
  return Boolean(desk.taken || desk.user_id || desk.name);
}

// The view that frames every desk, with room for the walkways around them.
function deskView(desks) {
  if (!desks || !desks.length) return FULL_VIEW;
  const pad = 72;
  const xs = desks.map((desk) => desk.x_in);
  const ys = desks.map((desk) => desk.y_in);
  const x = Math.min(...xs) - pad;
  const y = Math.min(...ys) - pad;
  const width = Math.max(Math.max(...xs) - x + pad, ((Math.max(...ys) - y + pad) * OfficePlanData.WIDTH_IN) / OfficePlanData.HEIGHT_IN);
  return { x, y, width };
}

function CrossItem(props) {
  return (
    <div className={styles.crossItem}>
      <span className={styles.crossLeft}>
        <Cross height="16px" />
      </span>
      <span className={styles.crossRight}>{props.children}</span>
    </div>
  );
}

function NoteItem(props) {
  return (
    <div className={styles.crossItem}>
      <span className={styles.noteLeft}>–</span>
      <span className={styles.crossRight}>{props.children}</span>
    </div>
  );
}

function DeskList(props) {
  return (
    <div className={styles.list}>
      {props.desks.map((desk) => (
        <div key={desk.id} className={props.selected.includes(desk.id) ? styles.itemSelected : styles.item} onClick={() => props.onSelect([desk.id])}>
          <span className={styles.itemNumber}>{desk.number}</span>
          <span className={styles.itemText}>
            <span className={styles.itemName}>{props.label(desk)}</span>
            {props.detail && props.detail(desk) ? <span className={props.alert && props.alert(desk) ? styles.itemAlert : styles.itemDetail}>{props.detail(desk)}</span> : null}
          </span>
        </div>
      ))}
    </div>
  );
}

function AdminDesk(props) {
  const desk = props.desk;
  const [choice, setChoice] = React.useState(desk.name ? NAME_PREFIX + desk.name : desk.user_id || '');
  const [name, setName] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  const options = [{ value: '', label: 'Open' }];
  props.names.forEach((each) => options.push({ value: NAME_PREFIX + each, label: each }));
  if (desk.user && !props.accounts.some((each) => each.id === desk.user_id)) options.push({ value: desk.user_id, label: accountLabel(desk.user) });
  props.accounts.forEach((each) => options.push({ value: each.id, label: accountLabel(each) }));
  options.push({ value: NEW_NAME, label: 'Type a name' });

  const holder = props.accounts.find((each) => each.id === desk.user_id);
  const billing = (desk.user_id && props.billing[desk.user_id]) || { state: 'loading' };
  const plan = planOf(desk.user ? desk.user.level : 0);
  const staff = isStaff(desk);
  const price = billing.state === 'paid' && billing.cents ? formatCents(billing.cents) : plan.price;

  const save = async (updates) => {
    setSaving(true);
    await props.onUpdate(updates);
    setSaving(false);
  };

  const onSave = () => {
    if (choice === NEW_NAME) {
      if (name.trim()) save({ name: name.trim() });
      return;
    }
    if (choice.startsWith(NAME_PREFIX)) {
      save({ name: choice.slice(NAME_PREFIX.length) });
      return;
    }
    save(choice ? { user_id: choice } : { user_id: null, name: null });
  };

  return (
    <>
      <SubTitle style={{ padding: 0 }}>Desk {desk.number}</SubTitle>
      <H5 style={{ marginTop: 24 }}>{holderOf(desk) || 'Open'}</H5>
      {desk.user ? <div className={styles.panelDetail}>{desk.user.email}</div> : null}
      <div className={styles.holderSelect}>
        <Select options={options} value={choice} onChange={(event) => setChoice(event.target.value)} style={{ marginTop: 24 }} />
      </div>
      {choice === NEW_NAME ? (
        <Input autoComplete="off" onChange={(event) => setName(event.target.value)} placeholder="Name" style={{ marginTop: 12 }} value={name} />
      ) : null}
      <ButtonPrimary loading={saving} onClick={onSave} style={FULL_WIDTH_BUTTON}>
        Save
      </ButtonPrimary>
      {isTaken(desk) ? (
        <Button onClick={() => save({ user_id: null, name: null })} style={FULL_WIDTH_BUTTON}>
          Unassign
        </Button>
      ) : null}
      {billing.state === 'unpaid' && desk.user ? (
        <Button href={`mailto:${desk.user.email}?subject=${encodeURIComponent(`Your desk at INTDEV`)}`} style={FULL_WIDTH_BUTTON}>
          Email {personName(desk.user)}
        </Button>
      ) : null}
      <div className={styles.checks}>
        {isTaken(desk) && desk.assigned_at ? <CheckmarkItem>Taken since {formatDate(desk.assigned_at)}</CheckmarkItem> : null}
        {staff ? <CheckmarkItem>INTDEV staff</CheckmarkItem> : null}
        {desk.user_id && !staff ? holder ? <CheckmarkItem>Approved for a desk</CheckmarkItem> : <CrossItem>Not approved for a desk</CrossItem> : null}
        {desk.user && !staff ? (
          <CheckmarkItem>
            {plan.name}
            {price ? `, ${price} / mo` : ''}
          </CheckmarkItem>
        ) : null}
        {desk.user && !staff && billing.state === 'paid' ? <CheckmarkItem>Paid through {formatDate(billing.until)}</CheckmarkItem> : null}
        {desk.user && !staff && billing.state === 'unpaid' ? <CrossItem>No active subscription</CrossItem> : null}
        {desk.user && !staff && billing.state === 'unknown' ? <NoteItem>Couldn't check payment</NoteItem> : null}
        {desk.name ? <NoteItem>Billed outside users.garden</NoteItem> : null}
        {props.blocked ? <CrossItem>Walkway is blocked</CrossItem> : <CheckmarkItem>Walkway is clear</CheckmarkItem>}
      </div>
    </>
  );
}

export default function UserGardenFloorPlan(props) {
  const isAdmin = props.viewer.level >= Constants.Users.tiers.ADMIN;
  const [desks, setDesks] = React.useState<any[] | null>(null);
  const [tenants, setTenants] = React.useState<any[]>([]);
  const [draft, setDraft] = React.useState<any[] | null>(null);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [view, setView] = React.useState(FULL_VIEW);
  const [saving, setSaving] = React.useState(false);
  const [billing, setBilling] = React.useState<Record<string, any>>({});
  const [staff, setStaff] = React.useState<any[]>([]);
  const checked = React.useRef(new Set<string>());

  // Admins see whether each account holding a desk has paid for the current period.
  const loadBilling = (next) => {
    if (!isAdmin || !next) return;
    const ids = [...new Set<string>(next.filter((desk) => desk.user_id && !isStaff(desk)).map((desk) => desk.user_id))].filter((id) => !checked.current.has(id));
    ids.forEach((id) => {
      checked.current.add(id);
      props.onGetUserSubscriptions({ id }).then((response) => setBilling((current) => ({ ...current, [id]: billingOf(response) })));
    });
  };

  const load = async () => {
    const response = await props.onGetOfficeDesks();
    const next = response ? response.data : null;
    setDesks(next);
    setStaff(response && response.staff ? response.staff : []);
    loadBilling(next);
    return next;
  };

  React.useEffect(() => {
    load().then((next) => setView(deskView(next)));
    if (isAdmin) {
      props.onGetAllTenants().then((response) => setTenants(response && response.data ? response.data : []));
    }
  }, []);

  // Only accounts approved for a desk get numbers; everyone else gets positions alone.
  const canSeeDesks = Boolean(desks && desks.length && desks[0].number !== undefined);
  const editing = draft !== null;
  const source = editing ? draft : desks || [];
  const blocked = OfficeGeometry.blockedDesks(source);
  const blockedIds = new Set([...blocked].map((index) => source[index].id));
  const isUnpaid = (desk) => Boolean(desk.user_id && billing[desk.user_id] && billing[desk.user_id].state === 'unpaid');
  const planDesks = source.map((desk) => {
    const holder = holderOf(desk);
    return {
      ...desk,
      key: desk.key || desk.id,
      state: !canSeeDesks ? 'plain' : desk.mine ? 'mine' : isUnpaid(desk) ? 'unpaid' : isTaken(desk) ? 'taken' : 'open',
      label: !canSeeDesks ? '' : holder ? initials(holder) : null,
    };
  });

  // Approved applicants with a co-working or partner plan, plus staff, who never need to apply.
  const approved = tenants.filter((each) => Number(each.tier) === 2 && Number(each.level) >= Constants.Users.tiers.GENERAL_CO_WORKING);
  const accounts = [...staff, ...approved.filter((each) => !staff.some((member) => member.id === each.id))];
  const selectedDesk = !editing && selected.length === 1 ? (desks || []).find((desk) => desk.id === selected[0]) : null;
  const selectedIndex = selectedDesk ? source.indexOf(selectedDesk) : -1;
  const isWhole = view.width >= OfficePlanData.WIDTH_IN;

  const onMoveBy = (keys, dx, dy) => {
    setDraft((current) =>
      (current || []).map((desk) =>
        keys.includes(desk.key)
          ? { ...desk, x_in: Math.min(OfficePlanData.WIDTH_IN, Math.max(0, desk.x_in + dx)), y_in: Math.min(OfficePlanData.HEIGHT_IN, Math.max(0, desk.y_in + dy)) }
          : desk
      )
    );
  };

  const onSettle = (keys, snap, moved?) => {
    setDraft((current) => {
      if (!current) return current;
      const { dx, dy } = OfficeGeometry.settle(current, keys, snap, moved);
      if (!dx && !dy) return current;
      return current.map((desk) => (keys.includes(desk.key) ? { ...desk, x_in: desk.x_in + dx, y_in: desk.y_in + dy } : desk));
    });
  };

  const onRotate = (keys) => {
    setDraft((current) => (current || []).map((desk) => (keys.includes(desk.key) ? { ...desk, rotation: (desk.rotation + 90) % 360 } : desk)));
    onSettle(keys, false);
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

  const onSaveLayout = async () => {
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

  const onUpdateDesk = async (id, updates) => {
    const response = await props.onUpdateOfficeDesk({ id, updates });
    if (!response) alert('Something went wrong');
    await load();
  };

  const openDesks = (desks || []).filter((desk) => !isTaken(desk));
  const unpaidCount = (desks || []).filter(isUnpaid).length;
  const teamDesks = (desks || []).filter((desk) => isTaken(desk) && isTeamDesk(desk));
  const memberDesks = (desks || []).filter((desk) => desk.user_id && !isTeamDesk(desk));
  const names = [...new Set((desks || []).map((desk) => desk.name).filter(Boolean))].sort();

  let panel: React.ReactNode = null;
  if (editing) {
    panel = (
      <>
        <SubTitle style={{ padding: 0 }}>Edit layout</SubTitle>
        <H5 style={{ marginTop: 24 }}>
          {selected.length}
          <span className={styles.subtle}> selected</span>
        </H5>
        <Button onClick={onAdd} style={{ ...FULL_WIDTH_BUTTON, marginTop: 24 }}>
          Add desk
        </Button>
        <Button disabled={!selected.length} onClick={() => onRotate(selected)} style={FULL_WIDTH_BUTTON}>
          Rotate
        </Button>
        <Button disabled={!selected.length} onClick={() => onRemove(selected)} style={FULL_WIDTH_BUTTON}>
          Remove
        </Button>
        <ButtonPrimary loading={saving} onClick={onSaveLayout} style={{ ...FULL_WIDTH_BUTTON, marginTop: 48 }}>
          Save layout
        </ButtonPrimary>
        <Button onClick={() => (setDraft(null), setSelected([]))} style={FULL_WIDTH_BUTTON}>
          Cancel
        </Button>
      </>
    );
  } else if (selectedDesk && isAdmin) {
    panel = <AdminDesk key={`${selectedDesk.id}-${selectedDesk.user_id}-${selectedDesk.name}`} accounts={accounts} billing={billing} names={names} blocked={blocked.has(selectedIndex)} desk={selectedDesk} onUpdate={(updates) => onUpdateDesk(selectedDesk.id, updates)} />;
  } else if (selectedDesk) {
    panel = (
      <>
        <SubTitle style={{ padding: 0 }}>Desk {selectedDesk.number}</SubTitle>
        <H5 style={{ marginTop: 24 }}>{selectedDesk.mine ? 'Yours' : isTaken(selectedDesk) ? 'Taken' : 'Open'}</H5>
      </>
    );
  } else {
    panel = (
      <>
        <SubTitle style={{ padding: 0 }}>Desks</SubTitle>
        <H5 style={{ marginTop: 24 }}>
          {openDesks.length} open<span className={styles.subtle}> / {(desks || []).length}</span>
        </H5>
      </>
    );
  }

  return (
    <>
      <header className={styles.header}>
        <SubTitle>Floor plan</SubTitle>
        <P style={{ marginTop: 6 }}>
          See the desks at the Internet Development Studio Company office in Seattle, WA. Collaborators and partners with an approved workspace can also see which desks are open.
        </P>
      </header>

      <div className={styles.row}>
        <div className={styles.container}>
          <div className={canSeeDesks ? styles.planColumn : styles.planColumnWide}>
            <div className={styles.planContent}>
              <div className={styles.planHeader}>
                <SubTitle style={{ padding: 0 }}>Suite 301</SubTitle>
                <div className={styles.controls}>
                  <Button onClick={() => setView(zoomView(view, 1.4))} style={{ padding: 0, width: 34 }}>
                    −
                  </Button>
                  <Button onClick={() => setView(zoomView(view, 1 / 1.4))} style={{ padding: 0, width: 34 }}>
                    +
                  </Button>
                  <Button onClick={() => setView(isWhole ? deskView(desks) : FULL_VIEW)}>{isWhole ? 'Desks' : 'Whole floor'}</Button>
                </div>
              </div>
              <OfficePlan
                desks={planDesks}
                editing={editing}
                selected={selected}
                view={view}
                onView={setView}
                onSelect={canSeeDesks ? setSelected : () => {}}
                onMoveBy={onMoveBy}
                onSettle={onSettle}
                onRotate={onRotate}
                onRemove={onRemove}
              />
            </div>
          </div>
          {canSeeDesks ? (
            <div className={styles.column}>
              <div className={styles.content}>{panel}</div>
            </div>
          ) : null}
        </div>
      </div>

      {canSeeDesks ? (
        <div className={styles.row}>
          <div className={styles.container}>
            <div className={styles.column}>
              <div className={styles.content}>
                <SubTitle style={{ padding: 0 }}>Open</SubTitle>
                <H5 style={{ marginTop: 24 }}>
                  {openDesks.length}
                  <span className={styles.subtle}> desks</span>
                </H5>
                <DeskList desks={openDesks} label={() => 'Open'} detail={(desk) => (blockedIds.has(desk.id) ? 'Walkway blocked' : 'Walkway clear')} onSelect={setSelected} selected={selected} />
              </div>
            </div>
            {isAdmin ? (
              <>
                <div className={styles.column}>
                  <div className={styles.content}>
                    <SubTitle style={{ padding: 0 }}>Members</SubTitle>
                    <H5 style={{ marginTop: 24 }}>
                      {memberDesks.length}
                      <span className={styles.subtle}> desks</span>
                    </H5>
                    <DeskList desks={memberDesks} label={holderOf} detail={(desk) => (isUnpaid(desk) ? 'No active subscription' : isStaff(desk) ? `Staff · ${desk.user.email}` : desk.user && desk.user.email)} alert={isUnpaid} onSelect={setSelected} selected={selected} />
                  </div>
                </div>
                <div className={styles.column}>
                  <div className={styles.content}>
                    <SubTitle style={{ padding: 0 }}>Teams</SubTitle>
                    <H5 style={{ marginTop: 24 }}>
                      {teamDesks.length}
                      <span className={styles.subtle}> desks</span>
                    </H5>
                    <DeskList desks={teamDesks} label={holderOf} detail={(desk) => (isUnpaid(desk) ? 'No active subscription' : desk.user ? desk.user.email : 'No account')} alert={isUnpaid} onSelect={setSelected} selected={selected} />
                  </div>
                </div>
                <div className={styles.column}>
                  <div className={styles.content}>
                    <SubTitle style={{ padding: 0 }}>Layout</SubTitle>
                    <H5 style={{ marginTop: 24 }}>
                      {(desks || []).length}
                      <span className={styles.subtle}> desks</span>
                    </H5>
                    {editing ? (
                      <Button visual style={{ ...FULL_WIDTH_BUTTON, marginTop: 24 }}>
                        Editing
                      </Button>
                    ) : (
                      <Button onClick={() => (setDraft((desks || []).map((desk) => ({ ...desk, key: desk.id }))), setSelected([]))} style={{ ...FULL_WIDTH_BUTTON, marginTop: 24 }}>
                        Edit layout
                      </Button>
                    )}
                    <div className={styles.checks}>
                      <CheckmarkItem>{source.length - blocked.size} walkways are clear</CheckmarkItem>
                      {blocked.size ? <CrossItem>{blocked.size} walkways are blocked</CrossItem> : null}
                      {unpaidCount ? <CrossItem>{unpaidCount} desks are unpaid</CrossItem> : null}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
