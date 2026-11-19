import type { ModelKind } from "@/lib/content";
import { seeded } from "@/lib/random";

/**
 * Lightweight SVG stand-ins shown before 3D loads, on devices that get no
 * WebGL, and if a scene ever fails. Same composition as the 3D, zero JS cost.
 */

export function MoleculeArt({ className = "" }: { className?: string }) {
  const rand = seeded(7);
  const nodes = Array.from({ length: 22 }, (_, i) => {
    const a = i * 2.4 + rand();
    const r = 40 + rand() * 120;
    return { x: 200 + Math.cos(a) * r, y: 200 + Math.sin(a) * r * 0.85, s: 6 + rand() * 12 };
  });
  return (
    <svg viewBox="0 0 400 400" className={`h-full w-full ${className}`} role="presentation">
      <defs>
        <radialGradient id="ma-ball" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#70C9E8" />
          <stop offset="100%" stopColor="#2788B9" />
        </radialGradient>
      </defs>
      {nodes.map((n, i) =>
        i > 0 ? (
          <line key={`l${i}`} x1={nodes[i - 1].x} y1={nodes[i - 1].y} x2={n.x} y2={n.y} stroke="#cfe9f4" strokeWidth="5" strokeLinecap="round" />
        ) : null,
      )}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={n.s} fill="url(#ma-ball)" />
      ))}
    </svg>
  );
}

export function GlassArt() {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" role="presentation">
      <defs>
        <linearGradient id="ga" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#70C9E8" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <circle cx="130" cy="130" r="70" fill="none" stroke="url(#ga)" strokeWidth="34" />
      <circle cx="285" cy="250" r="72" fill="url(#ga)" />
      <rect x="150" y="285" width="78" height="78" rx="22" fill="url(#ga)" transform="rotate(20 189 324)" />
    </svg>
  );
}

function Helix() {
  const rows = Array.from({ length: 18 }, (_, i) => {
    const y = 40 + i * 18;
    const t = (i / 10.5) * Math.PI * 2;
    return { y, x1: 200 + Math.sin(t) * 70, x2: 200 + Math.sin(t + 2.6) * 70 };
  });
  return (
    <g transform="rotate(18 200 200)">
      {rows.map((r, i) => (
        <g key={i}>
          <line x1={r.x1} y1={r.y} x2={r.x2} y2={r.y} stroke="#BFE6F5" strokeWidth="5" strokeLinecap="round" />
          <circle cx={r.x1} cy={r.y} r="8" fill="#2788B9" />
          <circle cx={r.x2} cy={r.y} r="8" fill="#70C9E8" />
        </g>
      ))}
    </g>
  );
}

export function ModelArt({ model }: { model: ModelKind }) {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" role="presentation">
      {model === "dna" && <Helix />}
      {model === "cell" && (
        <g>
          <circle cx="200" cy="200" r="140" fill="#eaf7fc" stroke="#cfeef9" strokeWidth="14" />
          <circle cx="200" cy="200" r="58" fill="#9fd6ec" stroke="#2788B9" strokeWidth="8" />
          <circle cx="206" cy="196" r="22" fill="#1d6d96" />
          {[[120, 140], [280, 150], [130, 270], [270, 280], [300, 210]].map(([x, y], i) => (
            <rect key={i} x={x - 16} y={y - 7} width="32" height="14" rx="7" fill="#70C9E8" transform={`rotate(${i * 37} ${x} ${y})`} />
          ))}
        </g>
      )}
      {model === "antibody" && (
        <g strokeLinecap="round" strokeWidth="34">
          <line x1="190" y1="330" x2="190" y2="210" stroke="#2788B9" />
          <line x1="214" y1="330" x2="214" y2="210" stroke="#2788B9" />
          <line x1="190" y1="200" x2="110" y2="110" stroke="#2788B9" />
          <line x1="160" y1="225" x2="90" y2="150" stroke="#70C9E8" />
          <line x1="214" y1="200" x2="294" y2="110" stroke="#2788B9" />
          <line x1="244" y1="225" x2="314" y2="150" stroke="#70C9E8" />
        </g>
      )}
      {model === "molecule" && (
        <g>
          <polygon points="200,130 255,162 255,226 200,258 145,226 145,162" fill="none" stroke="#cfe9f4" strokeWidth="9" />
          {[[200, 130], [255, 162], [255, 226], [200, 258], [145, 226], [145, 162]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="17" fill="#4d6b80" />
          ))}
          <line x1="200" y1="130" x2="200" y2="70" stroke="#cfe9f4" strokeWidth="9" />
          <circle cx="200" cy="66" r="17" fill="#2788B9" />
          <line x1="200" y1="258" x2="200" y2="320" stroke="#cfe9f4" strokeWidth="9" />
          <circle cx="200" cy="324" r="17" fill="#70C9E8" />
        </g>
      )}
    </svg>
  );
}
