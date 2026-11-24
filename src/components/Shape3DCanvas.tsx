import { useEffect, useRef, useState } from 'react';
import { DimensionValues, ShapeId } from '../data/shapes';

interface Shape3DCanvasProps {
  shape: ShapeId;
  dims: DimensionValues;
  fillPercent?: number;
  autoRotate?: boolean;
  heightClass?: string;
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface Face3D {
  points: Vec3[];
  fill: string;
  stroke: string;
  isFill?: boolean;
}

function rotatePoint(p: Vec3, yaw: number, pitch: number): Vec3 {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const x1 = p.x * cy - p.z * sy;
  const z1 = p.x * sy + p.z * cy;

  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const y2 = p.y * cp - z1 * sp;
  const z2 = p.y * sp + z1 * cp;

  return { x: x1, y: y2, z: z2 };
}

function project(p: Vec3, cx: number, cy: number, scale: number): { x: number; y: number; z: number } {
  const fov = 7.5;
  const factor = fov / (fov + p.z * 0.25);
  return {
    x: cx + p.x * scale * factor,
    y: cy - p.y * scale * factor,
    z: p.z,
  };
}

function addBoxFaces(
  faces: Face3D[],
  hx: number,
  hy: number,
  hz: number,
  yOffset: number,
  palette: { top: string; front: string; side: string; stroke: string },
  isFill = false
) {
  const y0 = yOffset - hy;
  const y1 = yOffset + hy;
  const v = [
    { x: -hx, y: y0, z: -hz },
    { x: hx, y: y0, z: -hz },
    { x: hx, y: y0, z: hz },
    { x: -hx, y: y0, z: hz },
    { x: -hx, y: y1, z: -hz },
    { x: hx, y: y1, z: -hz },
    { x: hx, y: y1, z: hz },
    { x: -hx, y: y1, z: hz },
  ];
  const defs: [number[], string][] = [
    [[4, 5, 6, 7], palette.top],
    [[0, 3, 2, 1], palette.side],
    [[3, 2, 6, 7], palette.front],
    [[0, 1, 5, 4], palette.front],
    [[1, 2, 6, 5], palette.side],
    [[0, 3, 7, 4], palette.side],
  ];
  for (const [idxs, fill] of defs) {
    faces.push({
      points: idxs.map((i) => v[i]),
      fill,
      stroke: palette.stroke,
      isFill,
    });
  }
}

function buildFaces(shape: ShapeId, dims: DimensionValues, fillPercent: number): {
  faces: Face3D[];
  labels: { pos: Vec3; text: string }[];
} {
  const faces: Face3D[] = [];
  const labels: { pos: Vec3; text: string }[] = [];
  const fillRatio = Math.max(0, Math.min(1, fillPercent / 100));

  if (shape === 'kubus' || shape === 'balok') {
    const pVal = shape === 'kubus' ? (dims.s ?? 5) : (dims.p ?? 8);
    const lVal = shape === 'kubus' ? (dims.s ?? 5) : (dims.l ?? 5);
    const tVal = shape === 'kubus' ? (dims.s ?? 5) : (dims.t ?? 4);
    const maxD = Math.max(pVal, lVal, tVal, 1);
    const hx = (pVal / maxD) * 1.45;
    const hz = (lVal / maxD) * 1.45;
    const hy = (tVal / maxD) * 1.45;

    if (fillRatio > 0.02) {
      const fHy = hy * fillRatio;
      addBoxFaces(
        faces,
        hx * 0.96,
        fHy,
        hz * 0.96,
        -hy + fHy,
        {
          top: 'rgba(14, 165, 233, 0.72)',
          front: 'rgba(2, 132, 199, 0.65)',
          side: 'rgba(3, 105, 161, 0.72)',
          stroke: 'rgba(2, 132, 199, 0.9)',
        },
        true
      );
    }

    addBoxFaces(faces, hx, hy, hz, 0, {
      top: 'rgba(219, 234, 254, 0.55)',
      front: 'rgba(191, 219, 254, 0.42)',
      side: 'rgba(147, 197, 253, 0.48)',
      stroke: '#1D4ED8',
    });

    if (shape === 'kubus') {
      labels.push({ pos: { x: 0, y: -hy - 0.25, z: hz + 0.15 }, text: `s = ${pVal} cm` });
    } else {
      labels.push({ pos: { x: 0, y: -hy - 0.25, z: hz + 0.15 }, text: `p = ${pVal} cm` });
      labels.push({ pos: { x: hx + 0.35, y: -hy, z: 0 }, text: `l = ${lVal} cm` });
      labels.push({ pos: { x: hx + 0.35, y: 0, z: hz }, text: `t = ${tVal} cm` });
    }
  } else if (shape === 'prisma_segitiga') {
    const a = dims.a ?? 6;
    const ta = dims.ta ?? 4;
    const t = dims.t ?? 10;
    const maxD = Math.max(a, ta, t, 1);
    const ha = (a / maxD) * 1.4;
    const hta = (ta / maxD) * 1.4;
    const hz = (t / maxD) * 1.5;

    const addPrism = (scaleFill: number, palette: { cap: string; side: string; stroke: string }, isFill = false) => {
      const yBottom = -hta;
      const yTop = yBottom + hta * 2 * scaleFill;
      const f = [
        { x: -ha, y: yBottom, z: hz },
        { x: ha, y: yBottom, z: hz },
        { x: 0, y: yTop, z: hz },
      ];
      const b = [
        { x: -ha, y: yBottom, z: -hz },
        { x: ha, y: yBottom, z: -hz },
        { x: 0, y: yTop, z: -hz },
      ];
      faces.push({ points: f, fill: palette.cap, stroke: palette.stroke, isFill });
      faces.push({ points: b, fill: palette.cap, stroke: palette.stroke, isFill });
      faces.push({ points: [f[0], f[1], b[1], b[0]], fill: palette.side, stroke: palette.stroke, isFill });
      faces.push({ points: [f[1], f[2], b[2], b[1]], fill: palette.side, stroke: palette.stroke, isFill });
      faces.push({ points: [f[2], f[0], b[0], b[2]], fill: palette.side, stroke: palette.stroke, isFill });
    };

    if (fillRatio > 0.02) {
      addPrism(fillRatio, {
        cap: 'rgba(16, 185, 129, 0.72)',
        side: 'rgba(5, 150, 105, 0.62)',
        stroke: '#047857',
      }, true);
    }

    addPrism(1, {
      cap: 'rgba(167, 243, 208, 0.55)',
      side: 'rgba(209, 250, 229, 0.45)',
      stroke: '#047857',
    });

    labels.push({ pos: { x: 0, y: -hta - 0.25, z: hz + 0.1 }, text: `a = ${a} cm` });
    labels.push({ pos: { x: -ha - 0.35, y: 0, z: hz }, text: `tₐ = ${ta} cm` });
    labels.push({ pos: { x: ha + 0.35, y: -hta + 0.2, z: 0 }, text: `t = ${t} cm` });
  } else if (shape === 'limas_segiempat') {
    const pVal = dims.p ?? 6;
    const lVal = dims.l ?? 6;
    const tVal = dims.t ?? 9;
    const maxD = Math.max(pVal, lVal, tVal, 1);
    const hx = (pVal / maxD) * 1.4;
    const hz = (lVal / maxD) * 1.4;
    const hy = (tVal / maxD) * 1.5;

    const base = [
      { x: -hx, y: -hy, z: -hz },
      { x: hx, y: -hy, z: -hz },
      { x: hx, y: -hy, z: hz },
      { x: -hx, y: -hy, z: hz },
    ];
    const apex = { x: 0, y: hy, z: 0 };

    if (fillRatio > 0.02) {
      const fY = -hy + 2 * hy * fillRatio;
      const shrink = 1 - fillRatio;
      const topFill = [
        { x: -hx * shrink, y: fY, z: -hz * shrink },
        { x: hx * shrink, y: fY, z: -hz * shrink },
        { x: hx * shrink, y: fY, z: hz * shrink },
        { x: -hx * shrink, y: fY, z: hz * shrink },
      ];
      faces.push({ points: topFill, fill: 'rgba(245, 158, 11, 0.72)', stroke: '#B45309', isFill: true });
      for (let i = 0; i < 4; i++) {
        const next = (i + 1) % 4;
        faces.push({
          points: [base[i], base[next], topFill[next], topFill[i]],
          fill: 'rgba(217, 119, 6, 0.58)',
          stroke: '#B45309',
          isFill: true,
        });
      }
    }

    faces.push({ points: base, fill: 'rgba(254, 243, 199, 0.6)', stroke: '#B45309' });
    for (let i = 0; i < 4; i++) {
      const next = (i + 1) % 4;
      faces.push({
        points: [base[i], base[next], apex],
        fill: i % 2 === 0 ? 'rgba(253, 230, 138, 0.48)' : 'rgba(252, 211, 77, 0.52)',
        stroke: '#B45309',
      });
    }

    labels.push({ pos: { x: 0, y: -hy - 0.25, z: hz + 0.1 }, text: `p = ${pVal} cm` });
    labels.push({ pos: { x: hx + 0.35, y: -hy, z: 0 }, text: `l = ${lVal} cm` });
    labels.push({ pos: { x: 0.35, y: 0.2, z: 0 }, text: `t = ${tVal} cm` });
  } else if (shape === 'tabung' || shape === 'kerucut') {
    const rVal = dims.r ?? 7;
    const tVal = dims.t ?? 10;
    const maxD = Math.max(rVal * 2, tVal, 1);
    const rad = (rVal / maxD) * 2.3;
    const hy = (tVal / maxD) * 1.5;
    const segs = 20;

    const bottomRing: Vec3[] = [];
    const topRing: Vec3[] = [];
    for (let i = 0; i < segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      bottomRing.push({ x: Math.cos(a) * rad, y: -hy, z: Math.sin(a) * rad });
      topRing.push({ x: Math.cos(a) * rad, y: hy, z: Math.sin(a) * rad });
    }

    if (shape === 'tabung') {
      if (fillRatio > 0.02) {
        const fY = -hy + 2 * hy * fillRatio;
        const fTopRing = bottomRing.map((pt) => ({ x: pt.x * 0.97, y: fY, z: pt.z * 0.97 }));
        const fBotRing = bottomRing.map((pt) => ({ x: pt.x * 0.97, y: pt.y, z: pt.z * 0.97 }));
        faces.push({ points: fTopRing, fill: 'rgba(14, 165, 233, 0.78)', stroke: '#0284C7', isFill: true });
        for (let i = 0; i < segs; i++) {
          const next = (i + 1) % segs;
          faces.push({
            points: [fBotRing[i], fBotRing[next], fTopRing[next], fTopRing[i]],
            fill: 'rgba(56, 189, 248, 0.55)',
            stroke: 'rgba(2, 132, 199, 0.45)',
            isFill: true,
          });
        }
      }
      faces.push({ points: bottomRing, fill: 'rgba(186, 230, 253, 0.48)', stroke: '#0284C7' });
      faces.push({ points: topRing, fill: 'rgba(224, 242, 254, 0.62)', stroke: '#0284C7' });
      for (let i = 0; i < segs; i++) {
        const next = (i + 1) % segs;
        faces.push({
          points: [bottomRing[i], bottomRing[next], topRing[next], topRing[i]],
          fill: 'rgba(186, 230, 253, 0.32)',
          stroke: 'rgba(2, 132, 199, 0.45)',
        });
      }
    } else {
      const apex = { x: 0, y: hy, z: 0 };
      if (fillRatio > 0.02) {
        const fY = -hy + 2 * hy * fillRatio;
        const shrink = 1 - fillRatio;
        const fTopRing = bottomRing.map((pt) => ({ x: pt.x * shrink * 0.97, y: fY, z: pt.z * shrink * 0.97 }));
        faces.push({ points: fTopRing, fill: 'rgba(249, 115, 22, 0.76)', stroke: '#C2410C', isFill: true });
        for (let i = 0; i < segs; i++) {
          const next = (i + 1) % segs;
          faces.push({
            points: [bottomRing[i], bottomRing[next], fTopRing[next], fTopRing[i]],
            fill: 'rgba(251, 146, 60, 0.58)',
            stroke: 'rgba(194, 65, 12, 0.45)',
            isFill: true,
          });
        }
      }
      faces.push({ points: bottomRing, fill: 'rgba(255, 237, 213, 0.52)', stroke: '#C2410C' });
      for (let i = 0; i < segs; i++) {
        const next = (i + 1) % segs;
        faces.push({
          points: [bottomRing[i], bottomRing[next], apex],
          fill: 'rgba(254, 215, 170, 0.36)',
          stroke: 'rgba(194, 65, 12, 0.45)',
        });
      }
    }

    labels.push({ pos: { x: rad * 0.55, y: -hy - 0.25, z: 0 }, text: `r = ${rVal} cm` });
    labels.push({ pos: { x: rad + 0.35, y: 0, z: 0 }, text: `t = ${tVal} cm` });
  } else if (shape === 'bola') {
    const rVal = dims.r ?? 7;
    const rad = 1.45;
    const stacks = 10;
    const slices = 16;

    for (let i = 0; i < stacks; i++) {
      const phi1 = (i / stacks) * Math.PI - Math.PI / 2;
      const phi2 = ((i + 1) / stacks) * Math.PI - Math.PI / 2;
      const midFrac = (i + 0.5) / stacks;
      const isFilledBand = midFrac <= fillRatio;
      for (let j = 0; j < slices; j++) {
        const theta1 = (j / slices) * Math.PI * 2;
        const theta2 = ((j + 1) / slices) * Math.PI * 2;
        const p1 = { x: Math.cos(phi1) * Math.cos(theta1) * rad, y: Math.sin(phi1) * rad, z: Math.cos(phi1) * Math.sin(theta1) * rad };
        const p2 = { x: Math.cos(phi1) * Math.cos(theta2) * rad, y: Math.sin(phi1) * rad, z: Math.cos(phi1) * Math.sin(theta2) * rad };
        const p3 = { x: Math.cos(phi2) * Math.cos(theta2) * rad, y: Math.sin(phi2) * rad, z: Math.cos(phi2) * Math.sin(theta2) * rad };
        const p4 = { x: Math.cos(phi2) * Math.cos(theta1) * rad, y: Math.sin(phi2) * rad, z: Math.cos(phi2) * Math.sin(theta1) * rad };
        faces.push({
          points: [p1, p2, p3, p4],
          fill: isFilledBand ? 'rgba(124, 58, 237, 0.55)' : 'rgba(221, 214, 254, 0.42)',
          stroke: 'rgba(109, 40, 217, 0.48)',
          isFill: isFilledBand,
        });
      }
    }
    labels.push({ pos: { x: rad * 0.65, y: 0.25, z: rad * 0.5 }, text: `r = ${rVal} cm` });
  }

  return { faces, labels };
}

export function Shape3DCanvas({
  shape,
  dims,
  fillPercent = 65,
  autoRotate = true,
  heightClass = 'h-80 sm:h-96',
}: Shape3DCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotRef = useRef({ yaw: 0.55, pitch: 0.38 });
  const draggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const dimsKey = JSON.stringify(dims);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    let animId = 0;
    let lastTime = performance.now();

    const renderFrame = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (autoRotate && !draggingRef.current && !prefersReducedMotion) {
        rotRef.current.yaw += dt * 0.45;
      }

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = Math.max(200, Math.floor(rect.width));
      const h = Math.max(200, Math.floor(rect.height));

      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      // Subtle architectural blueprint grid background
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.16)';
      ctx.lineWidth = 1;
      const gridStep = 28;
      for (let gx = 0; gx < w; gx += gridStep) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
      for (let gy = 0; gy < h; gy += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      const cx = w / 2;
      const cy = h / 2 + 12;
      const scale = Math.min(w, h) * 0.2;

      const { faces, labels } = buildFaces(shape, dims, fillPercent);
      const { yaw, pitch } = rotRef.current;

      const projectedFaces = faces
        .map((face) => {
          const pts = face.points.map((pt) => project(rotatePoint(pt, yaw, pitch), cx, cy, scale));
          const avgZ = pts.reduce((sum, p) => sum + p.z, 0) / pts.length;
          return { ...face, pts, avgZ };
        })
        .sort((a, b) => b.avgZ - a.avgZ);

      for (const face of projectedFaces) {
        ctx.beginPath();
        face.pts.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.closePath();
        ctx.fillStyle = face.fill;
        ctx.fill();
        ctx.strokeStyle = face.stroke;
        ctx.lineWidth = face.isFill ? 1 : 1.5;
        ctx.stroke();
      }

      // Draw crisp dimension labels
      ctx.font = '600 12px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (const lbl of labels) {
        const p = project(rotatePoint(lbl.pos, yaw, pitch), cx, cy, scale);
        const padX = 8;
        const textWidth = ctx.measureText(lbl.text).width;
        const boxW = textWidth + padX * 2;
        const boxH = 22;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(p.x - boxW / 2, p.y - boxH / 2, boxW, boxH, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#0F172A';
        ctx.fillText(lbl.text, p.x, p.y);
      }

      ctx.restore();
      animId = requestAnimationFrame(renderFrame);
    };

    animId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(animId);
  }, [shape, dimsKey, fillPercent, autoRotate]);

  return (
    <div className={`relative w-full ${heightClass} rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden select-none`}>
      <canvas
        ref={canvasRef}
        data-testid="shape-3d-canvas"
        aria-label={`Visualisasi 3D interaktif bangun ${shape}`}
        className={`w-full h-full block ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onPointerDown={(e) => {
          draggingRef.current = true;
          setIsDragging(true);
          lastPointerRef.current = { x: e.clientX, y: e.clientY };
          (e.currentTarget as HTMLCanvasElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!draggingRef.current) return;
          const dx = e.clientX - lastPointerRef.current.x;
          const dy = e.clientY - lastPointerRef.current.y;
          lastPointerRef.current = { x: e.clientX, y: e.clientY };
          rotRef.current.yaw += dx * 0.01;
          rotRef.current.pitch = Math.max(-1.1, Math.min(1.1, rotRef.current.pitch + dy * 0.01));
        }}
        onPointerUp={(e) => {
          draggingRef.current = false;
          setIsDragging(false);
          try {
            (e.currentTarget as HTMLCanvasElement).releasePointerCapture(e.pointerId);
          } catch {
            // Ignore
          }
        }}
        onPointerCancel={() => {
          draggingRef.current = false;
          setIsDragging(false);
        }}
      />
      <div className="pointer-events-none absolute top-3 left-3 right-3 flex items-center justify-between text-xs text-slate-600">
        <span className="bg-white/95 border border-slate-200 rounded-md px-2.5 py-1">
          Seret untuk memutar bangun 3D
        </span>
        <span className="bg-white/95 border border-slate-200 rounded-md px-2.5 py-1 font-mono-math tabular-nums">
          Isi Volume: {fillPercent}%
        </span>
      </div>
    </div>
  );
}
