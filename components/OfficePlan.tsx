import styles from '@components/OfficePlan.module.css';

import * as Constants from '@common/constants';
import * as OfficeGeometry from '@common/office-geometry';
import * as OfficePlanData from '@common/office-plan';
import * as React from 'react';

const { WIDTH_IN, HEIGHT_IN } = OfficePlanData;
const MIN_VIEW_WIDTH = 120;
const MAX_VIEW_WIDTH = WIDTH_IN * 1.5;

export const FULL_VIEW = { x: 0, y: 0, width: WIDTH_IN };

// The view that fits a box (in inches) and centers it, for a plan drawn at `aspect` (width / height).
export function fitView(box: { x: number; y: number; width: number; height: number }, aspect: number) {
  const width = Math.max(box.width, box.height * aspect);
  return { x: box.x + box.width / 2 - width / 2, y: box.y + box.height / 2 - width / aspect / 2, width };
}

// Keeps a view from wandering more than a little past the building's edges.
export function clampView(view: { x: number; y: number; width: number }, aspect: number) {
  const pad = 24;
  const height = view.width / aspect;
  const clamp = (value: number, size: number, total: number) => (size >= total + pad * 2 ? -pad + (total + pad * 2 - size) / 2 : Math.min(Math.max(value, -pad), total + pad - size));
  return { x: clamp(view.x, view.width, WIDTH_IN), y: clamp(view.y, height, HEIGHT_IN), width: view.width };
}

export function wholeView(aspect: number) {
  const pad = 24;
  return fitView({ x: -pad, y: -pad, width: WIDTH_IN + pad * 2, height: HEIGHT_IN + pad * 2 }, aspect);
}

export function zoomView(view, factor: number, x?: number, y?: number, aspect = WIDTH_IN / HEIGHT_IN) {
  const width = Math.min(MAX_VIEW_WIDTH, Math.max(MIN_VIEW_WIDTH, view.width * factor));
  const height = view.width / aspect;
  const cx = x === undefined ? view.x + view.width / 2 : x;
  const cy = y === undefined ? view.y + height / 2 : y;
  const ratio = width / view.width;
  return { x: cx - (cx - view.x) * ratio, y: cy - (cy - view.y) * ratio, width };
}

function toPlan(svg: SVGSVGElement, clientX: number, clientY: number) {
  const point = svg.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  const result = point.matrixTransform((svg.getScreenCTM() as DOMMatrix).inverse());
  return { x: result.x, y: result.y };
}

// NOTE(@caidanw)
// Desks carry a `key` (the desk id, or a temporary key for a desk added while editing), a `state`
// (open, taken, or mine), and an optional `label`. Positions are desk centers in inches.
export default function OfficePlan(props) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const viewRef = React.useRef(props.view);
  const gestureRef = React.useRef<any>(null);
  const [pixels, setPixels] = React.useState({ width: 1, height: HEIGHT_IN / WIDTH_IN });
  viewRef.current = props.view;

  // The view keeps its width; its height follows the box the plan is drawn in, so the plan can grow
  // taller than the floor's own proportions when the column beside it is tall.
  const view = props.view;
  const pixelWidth = pixels.width;
  const viewHeight = (view.width * pixels.height) / pixels.width;
  const scale = pixelWidth / view.width;
  // Desk numbers and initials keep their size on the plan (zooming with the desks), and stay at
  // least 8px on screen when zoomed out.
  const fontSize = Math.min(Math.max(Constants.Office.DESK_DEPTH_IN * 0.4, 8 / scale), Constants.Office.DESK_DEPTH_IN * 0.6);
  const desks = props.desks || [];

  React.useEffect(() => {
    const svg = svgRef.current as SVGSVGElement;
    const observer = new ResizeObserver(() => setPixels({ width: svg.clientWidth || 1, height: svg.clientHeight || 1 }));
    observer.observe(svg);

    // React's wheel handler is passive, so zooming needs its own listener to stop the page scroll.
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const point = toPlan(svg, event.clientX, event.clientY);
      const factor = Math.exp(event.deltaY * (event.ctrlKey ? 0.01 : 0.0015));
      props.onView(zoomView(viewRef.current, factor, point.x, point.y, props.aspect || WIDTH_IN / HEIGHT_IN));
    };
    svg.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      observer.disconnect();
      svg.removeEventListener('wheel', onWheel);
    };
  }, [props.onView, props.aspect]);

  const onPointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current as SVGSVGElement;
    const key = (event.target as Element).closest('[data-desk]')?.getAttribute('data-desk');
    const start = toPlan(svg, event.clientX, event.clientY);
    svg.setPointerCapture(event.pointerId);
    svg.focus();

    if (key && props.editing) {
      let selected: string[] = props.selected;
      if (event.shiftKey) {
        selected = selected.includes(key) ? selected.filter((each) => each !== key) : [...selected, key];
      } else if (!selected.includes(key)) {
        selected = [key];
      }
      props.onSelect(selected);
      gestureRef.current = { type: 'drag', keys: selected, start, moved: { x: 0, y: 0 } };
      return;
    }

    gestureRef.current = { type: 'pan', key, clientX: event.clientX, clientY: event.clientY, view: props.view, travel: 0 };
  };

  const onPointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const gesture = gestureRef.current;
    if (!gesture) return;

    if (gesture.type === 'drag') {
      const point = toPlan(svgRef.current as SVGSVGElement, event.clientX, event.clientY);
      const x = Math.round(point.x - gesture.start.x);
      const y = Math.round(point.y - gesture.start.y);
      if (x !== gesture.moved.x || y !== gesture.moved.y) {
        props.onMoveBy(gesture.keys, x - gesture.moved.x, y - gesture.moved.y);
        gesture.moved = { x, y };
      }
      return;
    }

    const dx = event.clientX - gesture.clientX;
    const dy = event.clientY - gesture.clientY;
    gesture.travel = Math.max(gesture.travel, Math.abs(dx) + Math.abs(dy));
    props.onView({ ...gesture.view, x: gesture.view.x - dx / scale, y: gesture.view.y - dy / scale });
  };

  const onPointerUp = () => {
    const gesture = gestureRef.current;
    gestureRef.current = null;
    if (gesture && gesture.type === 'drag' && (gesture.moved.x || gesture.moved.y)) {
      props.onSettle(gesture.keys, true, { dx: gesture.moved.x, dy: gesture.moved.y });
    }
    if (gesture && gesture.type === 'pan' && gesture.travel < 4) {
      props.onSelect(gesture.key ? [gesture.key] : []);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<SVGSVGElement>) => {
    if (event.key === 'Escape') {
      props.onSelect([]);
      if (gestureRef.current?.type === 'drag') props.onSettle(gestureRef.current.keys, false);
      gestureRef.current = null;
      return;
    }
    if (!props.editing || !props.selected.length) return;

    const step = event.shiftKey ? Constants.Office.NUDGE_SHIFT_IN : Constants.Office.NUDGE_IN;
    const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (moves[event.key]) {
      event.preventDefault();
      props.onMoveBy(props.selected, moves[event.key][0], moves[event.key][1]);
      props.onSettle(props.selected, false, { dx: moves[event.key][0], dy: moves[event.key][1] });
    } else if (event.repeat) {
      return;
    } else if (event.key === 'r' || event.key === 'R') {
      props.onRotate(props.selected);
    } else if (event.key === 'Backspace' || event.key === 'Delete') {
      props.onRemove(props.selected);
    }
  };

  let selection: React.ReactNode = null;
  if (props.editing && props.selected.length) {
    const boxes = desks
      .filter((desk) => props.selected.includes(desk.key))
      .flatMap((desk) => {
        const parts = OfficeGeometry.deskParts(desk);
        return [parts.desk, parts.chair];
      });
    if (boxes.length) {
      const pad = 4;
      const x = Math.min(...boxes.map((box) => box.x)) - pad;
      const y = Math.min(...boxes.map((box) => box.y)) - pad;
      const right = Math.max(...boxes.map((box) => box.x + box.width)) + pad;
      const bottom = Math.max(...boxes.map((box) => box.y + box.height)) + pad;
      selection = <rect className={styles.selection} x={x} y={y} width={right - x} height={bottom - y} />;
    }
  }

  return (
    <div className={props.editing ? styles.editing : styles.root} style={props.aspect ? { aspectRatio: String(props.aspect) } : undefined}>
      <svg ref={svgRef} className={styles.svg} aria-label="Office floor plan" viewBox={`${view.x} ${view.y} ${view.width} ${viewHeight}`} tabIndex={0} onKeyDown={onKeyDown} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
        <defs>
          <pattern id="office-plan-hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
            <line className={styles.hatch} x1="0" y1="0" x2="0" y2="8" />
          </pattern>
        </defs>
        <rect className={styles.notOurs} x={0} y={0} width={WIDTH_IN} height={HEIGHT_IN} />
        <rect x={0} y={0} width={WIDTH_IN} height={HEIGHT_IN} fill="url(#office-plan-hatch)" />
        <path className={styles.floor} d={OfficePlanData.SUITE_PATH} />
        <path className={styles.lines} d={OfficePlanData.LINES_PATH} />
        {Constants.Office.LABELS.map((label) => (
          <text key={`${label.text}-${label.x_in}-${label.y_in}`} className={styles.area} x={label.x_in} y={label.y_in} fontSize={Math.max(Constants.Office.LABEL_IN, Constants.Office.LABEL_MIN_PX / scale)} dominantBaseline="central" textAnchor="middle" transform={label.rotate ? `rotate(${label.rotate} ${label.x_in} ${label.y_in})` : undefined}>
            {label.text}
          </text>
        ))}

        {desks.map((desk) => {
          const { desk: top, chair } = OfficeGeometry.deskParts(desk);
          const isSelected = props.selected.includes(desk.key);
          const className = desk.state === 'plain' ? styles.deskPlain : isSelected || desk.state === 'mine' ? styles.deskSelected : desk.state === 'open' ? styles.deskOpen : desk.state === 'unpaid' ? styles.deskUnpaid : styles.desk;
          const label = desk.label === null || desk.label === undefined ? String(desk.number) : desk.label;
          const conflicts: string[] = desk.conflicts || [];
          const conflictParts: Array<'desk' | 'chair'> = desk.conflictParts || [];
          const warningId = `office-conflict-${desk.key}`;
          return (
            <g
              key={desk.key}
              data-desk={desk.key}
              className={desk.state === 'plain' ? undefined : styles.group}
              role={desk.state === 'plain' ? undefined : 'button'}
              tabIndex={desk.state === 'plain' ? undefined : 0}
              aria-label={desk.state === 'plain' ? undefined : `Desk ${desk.number}`}
              aria-describedby={conflicts.length ? warningId : undefined}
              onKeyDown={(event) => {
                if (desk.state === 'plain' || (event.key !== 'Enter' && event.key !== ' ')) return;
                event.preventDefault();
                event.stopPropagation();
                props.onSelect([desk.key]);
              }}
            >
              {conflicts.length ? <title id={warningId}>{conflicts.join('\n')}</title> : null}
              <circle className={styles.chair} cx={chair.x + chair.width / 2} cy={chair.y + chair.height / 2} r={chair.width * 0.42} />
              <rect className={className} x={top.x} y={top.y} width={top.width} height={top.height} rx={1.5} />
              <text className={styles.label} x={desk.x_in} y={desk.y_in} fontSize={fontSize} dominantBaseline="central" textAnchor="middle">
                {label}
              </text>
              {conflicts.length ? (
                <g className={styles.conflict} aria-hidden="true" data-geometry-conflict={desk.key}>
                  {conflictParts.map((part) => {
                    const rect = part === 'desk' ? top : chair;
                    return <rect key={part} data-conflict-part={part} className={styles.conflictOutline} x={rect.x} y={rect.y} width={rect.width} height={rect.height} rx={part === 'desk' ? 1.5 : 0} />;
                  })}
                  <circle className={styles.conflictBadge} cx={top.x + top.width - 6 / scale} cy={top.y + 6 / scale} r={6 / scale} />
                  <text className={styles.conflictMark} x={top.x + top.width - 6 / scale} y={top.y + 6 / scale} fontSize={10 / scale} textAnchor="middle" dominantBaseline="central">
                    !
                  </text>
                </g>
              ) : null}
            </g>
          );
        })}

        {selection}
      </svg>
    </div>
  );
}
