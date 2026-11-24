import { useState } from 'react';
import { RotateCw, Pause, Play, ArrowRight } from 'lucide-react';
import {
  calculateVolume,
  DimensionValues,
  formatIndoNumber,
  getDefaultDimensions,
  getFormulaSteps,
  getShapeById,
  ShapeId,
  SHAPES,
} from '../data/shapes';
import { Shape3DCanvas } from './Shape3DCanvas';
import { playClick } from '../utils/sound';

interface ExploreLabProps {
  exploredShapes: ShapeId[];
  onExploreShape: (shapeId: ShapeId) => void;
  onNavigate: (tab: 'games' | 'assessment') => void;
}

export function ExploreLab({ exploredShapes, onExploreShape, onNavigate }: ExploreLabProps) {
  const [selectedId, setSelectedId] = useState<ShapeId>('kubus');
  const [dims, setDims] = useState<DimensionValues>(() => getDefaultDimensions('kubus'));
  const [fillPercent, setFillPercent] = useState<number>(75);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  const shape = getShapeById(selectedId);
  const volume = calculateVolume(selectedId, dims);
  const steps = getFormulaSteps(selectedId, dims);
  const filledVolume = (volume * fillPercent) / 100;

  const handleSelectShape = (id: ShapeId) => {
    playClick();
    setSelectedId(id);
    setDims(getDefaultDimensions(id));
    onExploreShape(id);
  };

  const handleDimChange = (key: string, value: number) => {
    setDims((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetDims = () => {
    playClick();
    setDims(getDefaultDimensions(selectedId));
    setFillPercent(75);
  };

  return (
    <section className="space-y-8">
      {/* Compact Hero Intro */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 border-b border-slate-200 pb-6">
        <div className="max-w-2xl space-y-2">
          <p className="text-sm font-medium text-blue-700">
            Laboratorium Geometri Interaktif · {exploredShapes.length} dari {SHAPES.length} Bangun Dijelajahi
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 [text-wrap:balance]">
            Eksplorasi Volume Bangun Ruang Secara 3D
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Putar model 3D, geser ukuran rusuk atau jari-jari, dan amati bagaimana perubahan dimensi memengaruhi volume bangun ruang secara langsung.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('games')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm font-semibold hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
          >
            Mainkan 5 Permainan
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('assessment')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0"
          >
            Kerjakan 10 Asesmen
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Shape Selector Tabs */}
      <div role="tablist" aria-label="Pilih bangun ruang" className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200">
        {SHAPES.map((item) => {
          const isActive = item.id === selectedId;
          const isVisited = exploredShapes.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleSelectShape(item.id)}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
                isActive
                  ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <span>{item.name}</span>
              {isVisited && (
                <span className="text-xs text-emerald-700 font-medium" aria-label="Sudah dijelajahi">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Two-Zone Educational Sandbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Zone (60% -> 7 cols): 3D Stage */}
        <div className="lg:col-span-7 space-y-4">
          <Shape3DCanvas
            shape={selectedId}
            dims={dims}
            fillPercent={fillPercent}
            autoRotate={autoRotate}
            heightClass="h-80 sm:h-[420px]"
          />

          {/* Stage Controls Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <label htmlFor="fill-slider" className="font-semibold text-slate-800">
                  Simulasi Isi Volume
                </label>
                <span className="font-mono-math text-sm font-semibold text-blue-700 tabular-nums">
                  {fillPercent}% ({formatIndoNumber(filledVolume)} cm³)
                </span>
              </div>
              <input
                id="fill-slider"
                type="range"
                min={0}
                max={100}
                step={5}
                value={fillPercent}
                onChange={(e) => setFillPercent(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setAutoRotate((v) => !v);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 whitespace-nowrap shrink-0"
              >
                {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {autoRotate ? 'Jeda Putar' : 'Putar Otomatis'}
              </button>
              <button
                type="button"
                onClick={handleResetDims}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 whitespace-nowrap shrink-0"
              >
                <RotateCw className="w-3.5 h-3.5" />
                Reset Ukuran
              </button>
            </div>
          </div>
        </div>

        {/* Right Zone (40% -> 5 cols): Concept & Parameter Deck */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
          <div className="space-y-1.5 border-b border-slate-100 pb-4">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-2xl font-bold text-slate-900">{shape.name}</h2>
              <span className="text-xs font-medium text-slate-500">
                {shape.sisi} Sisi · {shape.rusuk} Rusuk · {shape.titikSudut} Titik Sudut
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{shape.shortDesc}</p>
          </div>

          {/* Dimension Sliders */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Atur Ukuran Bangun</h3>
            {shape.dimensions.map((dim) => {
              const val = dims[dim.key] ?? dim.defaultValue;
              const inputId = `dim-${shape.id}-${dim.key}`;
              return (
                <div key={dim.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <label htmlFor={inputId} className="font-medium text-slate-700">
                      {dim.label} ({dim.symbol})
                    </label>
                    <span className="font-mono-math font-semibold text-slate-900 tabular-nums">
                      {val} {dim.unit}
                    </span>
                  </div>
                  <input
                    id={inputId}
                    type="range"
                    min={dim.min}
                    max={dim.max}
                    step={dim.step}
                    value={val}
                    onChange={(e) => handleDimChange(dim.key, Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
              );
            })}
          </div>

          {/* Live Volume & Step-by-Step Formula */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <span className="text-xs font-semibold text-slate-600">Rumus Baku</span>
              <span className="font-mono-math text-sm font-semibold text-blue-700">
                {shape.formulaText}
              </span>
            </div>

            <div className="space-y-1.5">
              {steps.map((step, idx) => (
                <p key={idx} className="text-sm text-slate-700 font-mono-math leading-snug">
                  {idx + 1}. {step}
                </p>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between">
              <span className="text-sm font-semibold text-slate-700">Hasil Volume</span>
              <span
                data-testid="explore-volume-output"
                className="text-2xl font-bold font-mono-math text-blue-700 tabular-nums"
              >
                {formatIndoNumber(volume)} cm³
              </span>
            </div>
          </div>

          {/* Real-world note */}
          <div className="text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800">Catatan Konsep</p>
            <p>{shape.formulaNote}</p>
            <p className="pt-1 text-slate-500">
              Contoh benda: {shape.realLifeExamples.join(' · ')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
