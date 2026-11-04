interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
  lines: string[];
  dashed?: boolean;
}

const BOXES: Box[] = [
  { x: 168, y: 8, w: 432, h: 56, lines: ['Customers and staff', 'Browsers, Terminal Graph for macOS, API clients'] },
  { x: 168, y: 104, w: 432, h: 56, lines: ['Cloudflare edge', 'DNS, TLS 1.3 termination, proxy, HTTP → HTTPS'] },
  { x: 8, y: 208, w: 232, h: 72, lines: ['users.garden', 'Render web service', 'www-users-garden (Ohio)'] },
  { x: 268, y: 208, w: 232, h: 72, lines: ['api.internet.dev', 'Render web service', 'internet-apis (Oregon)'] },
  { x: 528, y: 208, w: 232, h: 72, lines: ['terminalgraph.com', 'Render web service', 'terminalgraph (Oregon)'] },
  { x: 8, y: 336, w: 232, h: 72, lines: ['PostgreSQL', 'Render-managed, Oregon', 'private network, TLS'] },
  { x: 268, y: 336, w: 232, h: 72, lines: ['Object storage', 'Amazon S3 us-west-2', 'Google Cloud Storage'] },
  { x: 528, y: 336, w: 232, h: 72, lines: ['Processors over HTTPS', 'Stripe, Mailgun, Twilio', 'Google, Apple, Bluesky OAuth'] },
  { x: 8, y: 456, w: 368, h: 72, lines: ['Change pipeline', 'GitHub main → pull request review', '→ Render build → zero-downtime release'], dashed: true },
  { x: 392, y: 456, w: 368, h: 72, lines: ['AWS security monitoring (4 US regions)', 'GuardDuty → EventBridge → SNS → eng@', 'VPC Flow Logs → CloudWatch, 365 days'], dashed: true },
];

const LINKS: [number, number, number, number][] = [
  [384, 64, 384, 104],
  [384, 160, 124, 208],
  [384, 160, 384, 208],
  [384, 160, 644, 208],
  [240, 244, 268, 244],
  [528, 244, 500, 244],
  [384, 280, 124, 336],
  [384, 280, 384, 336],
  [384, 280, 644, 336],
];

export default function NetworkDiagram() {
  return (
    <figure>
      <svg viewBox="0 0 768 536" role="img" aria-label="INTDEV production network: customers reach Cloudflare, which proxies three Render web services; the API connects to Render PostgreSQL, object storage, and processors; GitHub drives deploys and AWS GuardDuty alerts eng@internet.dev." style={{ display: 'block', width: '100%', height: 'auto', fontFamily: 'inherit' }}>
        <defs>
          <marker id="compliance-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M0 0 L8 4 L0 8 z" fill="currentColor" />
          </marker>
        </defs>
        {LINKS.map(([x1, y1, x2, y2], index) => (
          <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeOpacity="0.4" strokeWidth="1" markerEnd="url(#compliance-arrow)" />
        ))}
        {BOXES.map((box) => (
          <g key={box.lines[0]}>
            <rect x={box.x} y={box.y} width={box.w} height={box.h} fill="#ffffff" stroke="currentColor" strokeWidth="1" strokeDasharray={box.dashed ? '4 4' : undefined} />
            {box.lines.map((line, index) => (
              <text key={line} x={box.x + 12} y={box.y + 22 + index * 20} fontSize="14" fill="currentColor" fillOpacity={index === 0 ? 1 : 0.64}>
                {line}
              </text>
            ))}
          </g>
        ))}
      </svg>
      <figcaption style={{ marginTop: 8, opacity: 0.56 }}>Production data flows for the INTDEV API, Users Garden, and Terminal Graph. Solid boxes carry customer traffic; dashed boxes are the change and monitoring planes.</figcaption>
    </figure>
  );
}
