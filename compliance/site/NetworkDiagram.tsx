interface Node {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  lines?: string[];
  kind: 'zone' | 'node' | 'data' | 'plane';
}

interface Flow {
  points: number[];
  dashed?: boolean;
}

interface Label {
  x: number;
  y: number;
  text: string;
}

function Diagram(props: { id: string; width: number; height: number; label: string; nodes: Node[]; flows: Flow[]; labels: Label[]; caption: string }) {
  const marker = `compliance-arrow-${props.id}`;
  return (
    <figure>
      <svg viewBox={`0 0 ${props.width} ${props.height}`} role="img" aria-label={props.label} style={{ display: 'block', width: '100%', height: 'auto', fontFamily: 'inherit' }}>
        <defs>
          <marker id={marker} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M0 0 L8 4 L0 8 z" fill="currentColor" />
          </marker>
        </defs>
        {props.nodes.map((node) => {
          const zone = node.kind === 'zone';
          return (
            <g key={`${node.x}-${node.y}-${node.title}`}>
              <rect x={node.x} y={node.y} width={node.w} height={node.h} fill={node.kind === 'data' ? '#ebebeb' : zone ? 'none' : '#ffffff'} stroke="currentColor" strokeOpacity={zone ? 0.48 : 1} strokeWidth="1" strokeDasharray={zone || node.kind === 'plane' ? '4 4' : undefined} />
              <text x={node.x + 12} y={node.y + 20} fontSize={zone ? 13 : 14} fill="currentColor" fillOpacity={zone ? 0.64 : 1}>
                {node.title}
              </text>
              {(node.lines ?? []).map((line, index) => (
                <text key={line} x={node.x + 12} y={node.y + 40 + index * 18} fontSize="13" fill="currentColor" fillOpacity={0.64}>
                  {line}
                </text>
              ))}
            </g>
          );
        })}
        {props.flows.map((flow, index) => (
          <polyline key={index} points={flow.points.join(' ')} fill="none" stroke="currentColor" strokeOpacity="0.56" strokeWidth="1" strokeDasharray={flow.dashed ? '3 3' : undefined} markerEnd={`url(#${marker})`} />
        ))}
        {props.labels.map((label) => (
          <text key={label.text} x={label.x} y={label.y} fontSize="12" fill="currentColor" fillOpacity={0.8}>
            {label.text}
          </text>
        ))}
      </svg>
      <figcaption style={{ marginTop: 8, opacity: 0.56 }}>{props.caption}</figcaption>
    </figure>
  );
}

export function SegmentationDiagram() {
  return (
    <Diagram
      id="segmentation"
      width={768}
      height={536}
      label="INTDEV network segments: the public internet reaches only the Cloudflare edge over HTTPS; the edge reaches only the Render production services; only the API reaches the production database and object storage; the AWS VPCs and development machines have no path to customer data."
      nodes={[
        { x: 168, y: 8, w: 432, h: 56, kind: 'node', title: 'Public internet', lines: ['Customers, staff, and API clients'] },
        { x: 168, y: 104, w: 432, h: 56, kind: 'node', title: 'Edge · Cloudflare', lines: ['Only HTTPS is proxied; TLS 1.3; DDoS protection'] },
        { x: 8, y: 200, w: 752, h: 96, kind: 'zone', title: 'Production services · Render (each service an isolated container with its own secrets)', lines: ['internet-apis (Oregon, 2 instances) · terminalgraph (Oregon)', 'www-users-garden (Ohio) · www-internet-v3 (Ohio) · only the HTTP port is exposed'] },
        { x: 8, y: 336, w: 368, h: 80, kind: 'data', title: 'Production data · Render PostgreSQL', lines: ['TLS and the database credential required;', 'only the API environment and admins hold it'] },
        { x: 392, y: 336, w: 368, h: 80, kind: 'data', title: 'Object storage · Amazon S3 us-west-2', lines: ['Private objects reached only through', 'short-lived presigned HTTPS URLs'] },
        { x: 8, y: 456, w: 368, h: 72, kind: 'plane', title: 'AWS VPCs · 4 US regions', lines: ['No production workload; flow logs and GuardDuty'] },
        { x: 392, y: 456, w: 368, h: 72, kind: 'plane', title: 'Development · engineers’ Macs', lines: ['Synthetic data only; no path to customer data'] },
      ]}
      flows={[
        { points: [384, 64, 384, 104] },
        { points: [384, 160, 384, 200] },
        { points: [192, 296, 192, 336] },
        { points: [576, 296, 576, 336] },
      ]}
      labels={[
        { x: 392, y: 90, text: 'HTTPS (443) only' },
        { x: 392, y: 186, text: 'HTTPS to Render origins' },
        { x: 200, y: 322, text: 'TLS + credential (API only)' },
        { x: 584, y: 322, text: 'Presigned HTTPS' },
      ]}
      caption="Network segments and the only permitted paths between them. Shaded boxes hold customer data. Dashed boxes are separated segments with no route to customer data. The configuration exports below show how each boundary is enforced."
    />
  );
}

export function ArchitectureDiagram() {
  return (
    <Diagram
      id="architecture"
      width={768}
      height={936}
      label="Detailed INTDEV production network: customers reach the Cloudflare edge; Cloudflare proxies four Render web services in Oregon and Ohio; the API in Oregon connects over TLS to Render PostgreSQL in Oregon and to Amazon S3 in us-west-2, which hold customer data; the API calls payment, email, SMS, and sign-in processors over HTTPS; GitHub drives deploys; GuardDuty in four US regions alerts eng@internet.dev."
      nodes={[
        { x: 168, y: 8, w: 432, h: 56, kind: 'node', title: 'Customers and staff · public internet', lines: ['Browsers, Terminal Graph (macOS), API clients'] },
        { x: 8, y: 104, w: 752, h: 72, kind: 'zone', title: 'Edge zone · Cloudflare global anycast network · trust boundary 1', lines: ['DNS · TLS 1.3 termination · DDoS protection · HTTP → HTTPS redirect', 'api.internet.dev · users.garden · internet.dev · terminalgraph.com'] },
        { x: 8, y: 216, w: 440, h: 312, kind: 'zone', title: 'Render · Oregon (US West) · production zone' },
        { x: 24, y: 256, w: 196, h: 112, kind: 'node', title: 'api.internet.dev', lines: ['internet-apis · Node · Pro', '2 instances, load balanced', 'API key auth, rate limits', 'Private address :10001'] },
        { x: 236, y: 256, w: 196, h: 112, kind: 'node', title: 'terminalgraph.com', lines: ['terminalgraph · Node', '1 instance', 'Site, docs, changelog', 'No customer data at rest'] },
        { x: 24, y: 400, w: 408, h: 112, kind: 'data', title: 'INTDEV DATA · PostgreSQL 15 · data zone, boundary 3', lines: ['Customer data at rest: accounts, keys, organizations,', 'credits, orders, licenses, posts, documents, analytics', 'Encrypted at rest · TLS + credential · PITR about 7 days', 'No standby replica: recovery is a point-in-time restore'] },
        { x: 464, y: 216, w: 296, h: 312, kind: 'zone', title: 'Render · Ohio (US East) · production zone' },
        { x: 480, y: 256, w: 264, h: 112, kind: 'node', title: 'users.garden', lines: ['www-users-garden · Node · 1 instance', 'Customer portal; no data at rest', 'Calls api.internet.dev over HTTPS', 'through Cloudflare'] },
        { x: 480, y: 400, w: 264, h: 112, kind: 'node', title: 'internet.dev', lines: ['www-internet-v3 · Node · 1 instance', 'Public site and compliance pages', 'Reads the public API status feeds', 'No customer data at rest'] },
        { x: 8, y: 568, w: 440, h: 136, kind: 'zone', title: 'Amazon Web Services · us-west-2 (Oregon)' },
        { x: 24, y: 604, w: 196, h: 88, kind: 'data', title: 'Amazon S3 · 3+ AZs', lines: ['Uploads and attachments', 'SSE AES-256 at rest', 'Presigned HTTPS URLs'] },
        { x: 236, y: 604, w: 196, h: 88, kind: 'node', title: 'VPC 172.31.0.0/16', lines: ['4 subnets /20, us-west-2a–d', 'Legacy EC2, all stopped', 'Flow logs · GuardDuty'] },
        { x: 464, y: 568, w: 296, h: 136, kind: 'node', title: 'Processors · HTTPS from the API', lines: ['Stripe: cards, PCI DSS Level 1', 'Mailgun email · Twilio SMS', 'Google, Apple, Bluesky sign-in', 'Google Cloud Storage uploads'] },
        { x: 8, y: 744, w: 368, h: 96, kind: 'plane', title: 'Change plane', lines: ['Engineers’ Macs (FileVault, MFA) → GitHub', 'main → pull request review → Render build', '→ zero-downtime release, auto-deploy'] },
        { x: 392, y: 744, w: 368, h: 96, kind: 'plane', title: 'Monitoring plane · 4 US AWS regions', lines: ['GuardDuty → EventBridge → SNS', '→ eng@internet.dev', 'VPC Flow Logs → CloudWatch, 365 days'] },
        { x: 8, y: 872, w: 20, h: 16, kind: 'data', title: '' },
        { x: 284, y: 872, w: 20, h: 16, kind: 'zone', title: '' },
        { x: 520, y: 872, w: 20, h: 16, kind: 'plane', title: '' },
      ]}
      flows={[
        { points: [384, 64, 384, 104] },
        { points: [300, 176, 122, 256] },
        { points: [360, 176, 334, 256] },
        { points: [520, 176, 612, 256] },
        { points: [752, 176, 752, 456, 744, 456] },
        { points: [122, 368, 122, 400] },
        { points: [24, 340, 14, 340, 14, 648, 24, 648] },
        { points: [220, 352, 228, 352, 228, 384, 456, 384, 456, 640, 464, 640] },
      ]}
      labels={[
        { x: 392, y: 90, text: 'HTTPS · TLS 1.3' },
        { x: 16, y: 198, text: 'HTTPS to origins · boundary 2' },
        { x: 130, y: 391, text: 'TLS' },
        { x: 36, y: 886, text: 'Customer data at rest' },
        { x: 312, y: 886, text: 'Region or network zone' },
        { x: 548, y: 886, text: 'Change and monitoring planes' },
        { x: 16, y: 918, text: 'Customer data is stored only in the Oregon (US West) zones: Render PostgreSQL and Amazon S3 us-west-2.' },
      ]}
      caption="Detailed production network for the INTDEV API, Users Garden, Terminal Graph, and internet.dev. Physical locations are the Render Oregon and Ohio regions, AWS us-west-2, and Cloudflare’s global edge. Redundancy: two API instances, Render point-in-time recovery, S3 storage across three or more availability zones, and Cloudflare anycast."
    />
  );
}
