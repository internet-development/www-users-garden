import styles from '@components/OfficePlan.module.css';

import * as Constants from '@common/constants';
import * as OfficeGeometry from '@common/office-geometry';
import * as OfficePlanData from '@common/office-plan';
import * as React from 'react';

const { WIDTH_IN, HEIGHT_IN } = OfficePlanData;
const MIN_VIEW_WIDTH = 120;
const MAX_VIEW_WIDTH = WIDTH_IN * 1.5;

export const FULL_VIEW = { x: 0, y: 0, width: WIDTH_IN };

export function zoomView(view, factor: number, x?: number, y?: number) {
  const width = Math.min(MAX_VIEW_WIDTH, Math.max(MIN_VIEW_WIDTH, view.width * factor));
  const height = (view.width * HEIGHT_IN) / WIDTH_IN;
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
  const [pixelWidth, setPixelWidth] = React.useState(1);
  viewRef.current = props.view;

  const view = props.view;
  const viewHeight = (view.width * HEIGHT_IN) / WIDTH_IN;
  const scale = pixelWidth / view.width;
  const fontSize = Math.min(10 / scale, Constants.Office.DESK_DEPTH_IN * 0.5);
  const desks = props.desks || [];
  const blocked = props.editing ? OfficeGeometry.blockedDesks(desks) : new Set<number>();

  React.useEffect(() => {
    const svg = svgRef.current as SVGSVGElement;
    const observer = new ResizeObserver(() => setPixelWidth(svg.clientWidth || 1));
    observer.observe(svg);

    // React's wheel handler is passive, so zooming needs its own listener to stop the page scroll.
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const point = toPlan(svg, event.clientX, event.clientY);
      const factor = Math.exp(event.deltaY * (event.ctrlKey ? 0.01 : 0.0015));
      props.onView(zoomView(viewRef.current, factor, point.x, point.y));
    };
    svg.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      observer.disconnect();
      svg.removeEventListener('wheel', onWheel);
    };
  }, [props.onView]);

  const onPointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current as SVGSVGElement;
    const key = (event.target as Element).closest('[data-desk]')?.getAttribute('data-desk');
    const start = toPlan(svg, event.clientX, event.clientY);
    svg.setPointerCapture(event.pointerId);

    if (key && props.editing) {
      let selected = props.selected;
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
    if (gesture && gesture.type === 'pan' && gesture.travel < 4) {
      props.onSelect(gesture.key ? [gesture.key] : []);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<SVGSVGElement>) => {
    if (event.key === 'Escape') {
      props.onSelect([]);
      return;
    }
    if (!props.editing || !props.selected.length) return;

    const step = event.shiftKey ? Constants.Office.NUDGE_SHIFT_IN : Constants.Office.NUDGE_IN;
    const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (moves[event.key]) {
      event.preventDefault();
      props.onMoveBy(props.selected, moves[event.key][0], moves[event.key][1]);
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
    const boxes = desks.filter((desk) => props.selected.includes(desk.key)).flatMap((desk) => {
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
    <div className={props.editing ? styles.editing : styles.root}>
      <svg
        ref={svgRef}
        className={styles.svg}
        viewBox={`${view.x} ${view.y} ${view.width} ${viewHeight}`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <defs>
          <pattern id="office-plan-hatch" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
            <line className={styles.hatch} x1="0" y1="0" x2="0" y2="10" />
          </pattern>
        </defs>
        <rect x={0} y={0} width={WIDTH_IN} height={HEIGHT_IN} fill="url(#office-plan-hatch)" />
        <polygon className={styles.floor} points={OfficePlanData.SUITE_POINTS} />
        <path className={styles.lines} d={OfficePlanData.LINES_PATH} />

        {props.editing
          ? desks.map((desk, index) => {
              const { walkway } = OfficeGeometry.deskParts(desk);
              return <rect key={`walkway-${desk.key}`} className={blocked.has(index) ? styles.blocked : styles.walkway} x={walkway.x} y={walkway.y} width={walkway.width} height={walkway.height} />;
            })
          : null}

        {desks.map((desk) => {
          const { desk: top, chair } = OfficeGeometry.deskParts(desk);
          const isSelected = props.selected.includes(desk.key);
          const className = isSelected || desk.state === 'mine' ? styles.deskSelected : desk.state === 'open' ? styles.deskOpen : styles.desk;
          const label = desk.label || String(desk.number);
          return (
            <g key={desk.key} data-desk={desk.key} className={styles.group}>
              <circle className={styles.chair} cx={chair.x + chair.width / 2} cy={chair.y + chair.height / 2} r={chair.width * 0.42} />
              <rect className={className} x={top.x} y={top.y} width={top.width} height={top.height} rx={1.5} />
              <text className={styles.label} x={desk.x_in} y={desk.y_in} fontSize={fontSize} dominantBaseline="central" textAnchor="middle">
                {label}
              </text>
            </g>
          );
        })}

        {selection}
      </svg>
    </div>
  );
}
