import { ShapeId } from '../data/shapes';

interface ShapeDiagramSVGProps {
  shape: ShapeId;
  labels?: Record<string, string>;
  secondShape?: {
    shape: ShapeId;
    labels?: Record<string, string>;
  };
  className?: string;
}

export function ShapeDiagramSVG({
  shape,
  labels = {},
  secondShape,
  className = 'w-full h-44',
}: ShapeDiagramSVGProps) {
  if (secondShape) {
    // Composite shape: Kubus + Limas on top (Assessment #10)
    return (
      <svg viewBox="0 0 220 180" className={className} role="img" aria-label="Diagram bangun gabungan kubus dan limas">
        {/* Bottom Kubus */}
        <polygon points="65,95 110,75 155,95 110,115" fill="#DBEAFE" stroke="#1D4ED8" strokeWidth="1.5" />
        <polygon points="65,95 110,115 110,158 65,138" fill="#BFDBFE" stroke="#1D4ED8" strokeWidth="1.5" />
        <polygon points="110,115 155,95 155,138 110,158" fill="#93C5FD" stroke="#1D4ED8" strokeWidth="1.5" />
        {/* Top Limas */}
        <polygon points="65,95 110,115 110,32" fill="#FDE68A" fillOpacity="0.85" stroke="#B45309" strokeWidth="1.5" />
        <polygon points="155,95 110,115 110,32" fill="#FCD34D" fillOpacity="0.85" stroke="#B45309" strokeWidth="1.5" />
        <line x1="110" y1="32" x2="110" y2="95" stroke="#B45309" strokeWidth="1.2" strokeDasharray="3 3" />
        <text x="115" y="68" fontSize="11" fontWeight="600" fill="#92400E" className="font-mono-math">
          t={secondShape.labels?.t ?? '5 cm'}
        </text>
        <text x="162" y="122" fontSize="11" fontWeight="600" fill="#1E3A8A" className="font-mono-math">
          s={labels.s ?? '6 cm'}
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 220 165" className={className} role="img" aria-label={`Diagram bangun ${shape}`}>
      {shape === 'kubus' && (
        <g>
          <polygon points="65,48 115,28 165,48 115,68" fill="#DBEAFE" stroke="#1D4ED8" strokeWidth="1.8" />
          <polygon points="65,48 115,68 115,126 65,106" fill="#BFDBFE" stroke="#1D4ED8" strokeWidth="1.8" />
          <polygon points="115,68 165,48 165,106 115,126" fill="#93C5FD" stroke="#1D4ED8" strokeWidth="1.8" />
          <line x1="115" y1="28" x2="115" y2="86" stroke="#1D4ED8" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
          <line x1="65" y1="106" x2="115" y2="86" stroke="#1D4ED8" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
          <line x1="165" y1="106" x2="115" y2="86" stroke="#1D4ED8" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
          {labels.s && (
            <text x="136" y="132" fontSize="12" fontWeight="600" fill="#0F172A" className="font-mono-math">
              s = {labels.s}
            </text>
          )}
        </g>
      )}

      {shape === 'balok' && (
        <g>
          <polygon points="45,55 125,35 178,56 98,76" fill="#E0F2FE" stroke="#0369A1" strokeWidth="1.8" />
          <polygon points="45,55 98,76 98,125 45,104" fill="#BAE6FD" stroke="#0369A1" strokeWidth="1.8" />
          <polygon points="98,76 178,56 178,105 98,125" fill="#7DD3FC" stroke="#0369A1" strokeWidth="1.8" />
          <text x="132" y="132" fontSize="11" fontWeight="600" fill="#0F172A" className="font-mono-math">
            p = {labels.p ?? 'p'}
          </text>
          <text x="38" y="126" fontSize="11" fontWeight="600" fill="#0F172A" className="font-mono-math">
            l = {labels.l ?? 'l'}
          </text>
          <text x="182" y="86" fontSize="11" fontWeight="600" fill="#0F172A" className="font-mono-math">
            t = {labels.t ?? 't'}
          </text>
        </g>
      )}

      {shape === 'prisma_segitiga' && (
        <g>
          <polygon points="52,115 112,115 82,62" fill="#A7F3D0" stroke="#047857" strokeWidth="1.8" />
          <polygon points="82,62 152,42 182,95 112,115" fill="#D1FAE5" stroke="#047857" strokeWidth="1.8" />
          <line x1="52" y1="115" x2="122" y2="95" stroke="#047857" strokeWidth="1.1" strokeDasharray="3 3" />
          <line x1="122" y1="95" x2="152" y2="42" stroke="#047857" strokeWidth="1.1" strokeDasharray="3 3" />
          <line x1="122" y1="95" x2="182" y2="95" stroke="#047857" strokeWidth="1.1" strokeDasharray="3 3" />
          <line x1="82" y1="62" x2="82" y2="115" stroke="#065F46" strokeWidth="1.3" strokeDasharray="3 2" />
          <text x="74" y="133" fontSize="11" fontWeight="600" fill="#0F172A" className="font-mono-math">
            a={labels.a ?? 'a'}
          </text>
          <text x="26" y="88" fontSize="11" fontWeight="600" fill="#0F172A" className="font-mono-math">
            tₐ={labels.ta ?? 'tₐ'}
          </text>
          <text x="150" y="118" fontSize="11" fontWeight="600" fill="#0F172A" className="font-mono-math">
            t={labels.t ?? 't'}
          </text>
        </g>
      )}

      {shape === 'limas_segiempat' && (
        <g>
          <polygon points="55,115 125,128 172,106 102,94" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
          <polygon points="55,115 125,128 112,30" fill="#FEF3C7" fillOpacity="0.82" stroke="#B45309" strokeWidth="1.8" />
          <polygon points="125,128 172,106 112,30" fill="#FCD34D" fillOpacity="0.85" stroke="#B45309" strokeWidth="1.8" />
          <line x1="112" y1="30" x2="113" y2="111" stroke="#92400E" strokeWidth="1.3" strokeDasharray="3 2" />
          <text x="118" y="78" fontSize="11" fontWeight="600" fill="#0F172A" className="font-mono-math">
            t={labels.t ?? 't'}
          </text>
          <text x="68" y="142" fontSize="11" fontWeight="600" fill="#0F172A" className="font-mono-math">
            p={labels.p ?? 'p'}
          </text>
          <text x="154" y="132" fontSize="11" fontWeight="600" fill="#0F172A" className="font-mono-math">
            l={labels.l ?? 'l'}
          </text>
        </g>
      )}

      {shape === 'tabung' && (
        <g>
          <path d="M68,45 L68,120 A42,14 0 0,0 152,120 L152,45 Z" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.8" />
          <ellipse cx="110" cy="45" rx="42" ry="14" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.8" />
          <ellipse cx="110" cy="120" rx="42" ry="14" fill="none" stroke="#0284C7" strokeWidth="1.2" strokeDasharray="3 3" />
          <line x1="110" y1="45" x2="152" y2="45" stroke="#0F172A" strokeWidth="1.4" />
          <circle cx="110" cy="45" r="2.5" fill="#0F172A" />
          <text x="122" y="39" fontSize="11" fontWeight="600" fill="#0F172A" className="font-mono-math">
            r={labels.r ?? 'r'}
          </text>
          <text x="160" y="88" fontSize="11" fontWeight="600" fill="#0F172A" className="font-mono-math">
            t={labels.t ?? 't'}
          </text>
        </g>
      )}

      {shape === 'kerucut' && (
        <g>
          <path d="M66,120 L110,28 L154,120 A44,14 0 0,1 66,120 Z" fill="#FED7AA" stroke="#C2410C" strokeWidth="1.8" />
          <ellipse cx="110" cy="120" rx="44" ry="14" fill="#FFEDD5" fillOpacity="0.7" stroke="#C2410C" strokeWidth="1.6" />
          <line x1="110" y1="28" x2="110" y2="120" stroke="#7C2D12" strokeWidth="1.3" strokeDasharray="3 2" />
          <line x1="110" y1="120" x2="154" y2="120" stroke="#0F172A" strokeWidth="1.4" />
          <text x="124" y="114" fontSize="11" fontWeight="600" fill="#0F172A" className="font-mono-math">
            r={labels.r ?? 'r'}
          </text>
          <text x="82" y="82" fontSize="11" fontWeight="600" fill="#0F172A" className="font-mono-math">
            t={labels.t ?? 't'}
          </text>
        </g>
      )}

      {shape === 'bola' && (
        <g>
          <defs>
            <radialGradient id="bolaGrad" cx="38%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#F5F3FF" />
              <stop offset="60%" stopColor="#C4B5FD" />
              <stop offset="100%" stopColor="#7C3AED" />
            </radialGradient>
          </defs>
          <circle cx="110" cy="82" r="52" fill="url(#bolaGrad)" stroke="#5B21B6" strokeWidth="1.8" />
          <ellipse cx="110" cy="82" rx="52" ry="15" fill="none" stroke="#4C1D95" strokeWidth="1.2" strokeDasharray="4 3" />
          <line x1="110" y1="82" x2="162" y2="82" stroke="#0F172A" strokeWidth="1.6" />
          <circle cx="110" cy="82" r="3" fill="#0F172A" />
          <text x="126" y="75" fontSize="11" fontWeight="600" fill="#0F172A" className="font-mono-math">
            r={labels.r ?? 'r'}
          </text>
        </g>
      )}
    </svg>
  );
}
