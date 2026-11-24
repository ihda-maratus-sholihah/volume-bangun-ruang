export type ShapeId =
  | 'kubus'
  | 'balok'
  | 'prisma_segitiga'
  | 'limas_segiempat'
  | 'tabung'
  | 'kerucut'
  | 'bola';

export interface DimensionSpec {
  key: 's' | 'p' | 'l' | 't' | 'a' | 'ta' | 'r';
  label: string;
  symbol: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

export interface ShapeDefinition {
  id: ShapeId;
  name: string;
  shortDesc: string;
  formulaText: string;
  formulaNote: string;
  sisi: number;
  rusuk: number;
  titikSudut: number;
  realLifeExamples: string[];
  accentColor: string;
  dimensions: DimensionSpec[];
}

export type DimensionValues = Record<string, number>;

export const SHAPES: ShapeDefinition[] = [
  {
    id: 'kubus',
    name: 'Kubus',
    shortDesc: 'Bangun ruang dengan 6 sisi persegi yang sama besar dan 12 rusuk sama panjang.',
    formulaText: 'V = s × s × s = s³',
    formulaNote: 'Luas alas persegi (s × s) dikalikan tinggi kubus (s).',
    sisi: 6,
    rusuk: 12,
    titikSudut: 8,
    realLifeExamples: ['Dadu permainan', 'Rubrik 3×3', 'Kotak kado persegi'],
    accentColor: '#2563EB',
    dimensions: [
      { key: 's', label: 'Panjang Rusuk', symbol: 's', unit: 'cm', min: 2, max: 12, step: 1, defaultValue: 5 },
    ],
  },
  {
    id: 'balok',
    name: 'Balok',
    shortDesc: 'Bangun ruang dengan 3 pasang sisi persegi panjang yang sejajar dan sama besar.',
    formulaText: 'V = p × l × t',
    formulaNote: 'Luas alas persegi panjang (p × l) dikalikan tinggi balok (t).',
    sisi: 6,
    rusuk: 12,
    titikSudut: 8,
    realLifeExamples: ['Akuarium kaca', 'Kotak pensil', 'Kardus buku'],
    accentColor: '#0284C7',
    dimensions: [
      { key: 'p', label: 'Panjang', symbol: 'p', unit: 'cm', min: 2, max: 14, step: 1, defaultValue: 8 },
      { key: 'l', label: 'Lebar', symbol: 'l', unit: 'cm', min: 2, max: 12, step: 1, defaultValue: 5 },
      { key: 't', label: 'Tinggi', symbol: 't', unit: 'cm', min: 2, max: 12, step: 1, defaultValue: 4 },
    ],
  },
  {
    id: 'prisma_segitiga',
    name: 'Prisma Segitiga',
    shortDesc: 'Bangun ruang dengan alas dan tutup berbentuk segitiga yang kongruen.',
    formulaText: 'V = (½ × a × tₐ) × t',
    formulaNote: 'Luas alas segitiga (½ × alas × tinggi segitiga) dikalikan tinggi prisma.',
    sisi: 5,
    rusuk: 9,
    titikSudut: 6,
    realLifeExamples: ['Tenda pramuka', 'Kemasan cokelat segitiga', 'Atap rumah'],
    accentColor: '#059669',
    dimensions: [
      { key: 'a', label: 'Alas Segitiga', symbol: 'a', unit: 'cm', min: 2, max: 14, step: 1, defaultValue: 6 },
      { key: 'ta', label: 'Tinggi Segitiga', symbol: 'tₐ', unit: 'cm', min: 2, max: 12, step: 1, defaultValue: 4 },
      { key: 't', label: 'Tinggi Prisma', symbol: 't', unit: 'cm', min: 3, max: 15, step: 1, defaultValue: 10 },
    ],
  },
  {
    id: 'limas_segiempat',
    name: 'Limas Segiempat',
    shortDesc: 'Bangun ruang beralas segiempat dengan 4 sisi tegak segitiga bertemu di titik puncak.',
    formulaText: 'V = ⅓ × (p × l) × t',
    formulaNote: 'Sepertiga dari volume balok yang memiliki luas alas dan tinggi yang sama.',
    sisi: 5,
    rusuk: 8,
    titikSudut: 5,
    realLifeExamples: ['Piramida Mesir', 'Atap pendopo', 'Tumpeng kotak'],
    accentColor: '#D97706',
    dimensions: [
      { key: 'p', label: 'Panjang Alas', symbol: 'p', unit: 'cm', min: 3, max: 12, step: 1, defaultValue: 6 },
      { key: 'l', label: 'Lebar Alas', symbol: 'l', unit: 'cm', min: 3, max: 12, step: 1, defaultValue: 6 },
      { key: 't', label: 'Tinggi Limas', symbol: 't', unit: 'cm', min: 3, max: 15, step: 1, defaultValue: 9 },
    ],
  },
  {
    id: 'tabung',
    name: 'Tabung',
    shortDesc: 'Bangun ruang sisi lengkung dengan alas dan tutup lingkaran yang sejajar.',
    formulaText: 'V = π × r² × t',
    formulaNote: 'Luas alas lingkaran (π × r²) dikalikan tinggi tabung (t). Gunakan π = 22/7 jika r kelipatan 7.',
    sisi: 3,
    rusuk: 2,
    titikSudut: 0,
    realLifeExamples: ['Kaleng susu', 'Botol minum', 'Drum air'],
    accentColor: '#0EA5E9',
    dimensions: [
      { key: 'r', label: 'Jari-jari', symbol: 'r', unit: 'cm', min: 2, max: 14, step: 1, defaultValue: 7 },
      { key: 't', label: 'Tinggi Tabung', symbol: 't', unit: 'cm', min: 3, max: 16, step: 1, defaultValue: 10 },
    ],
  },
  {
    id: 'kerucut',
    name: 'Kerucut',
    shortDesc: 'Bangun ruang sisi lengkung beralas lingkaran yang mengerucut ke satu titik puncak.',
    formulaText: 'V = ⅓ × π × r² × t',
    formulaNote: 'Tepat ⅓ dari volume tabung dengan jari-jari dan tinggi yang sama.',
    sisi: 2,
    rusuk: 1,
    titikSudut: 1,
    realLifeExamples: ['Topi ulang tahun', 'Nasi tumpeng', 'Corong minyak'],
    accentColor: '#EA580C',
    dimensions: [
      { key: 'r', label: 'Jari-jari', symbol: 'r', unit: 'cm', min: 3, max: 14, step: 1, defaultValue: 7 },
      { key: 't', label: 'Tinggi Kerucut', symbol: 't', unit: 'cm', min: 3, max: 18, step: 1, defaultValue: 12 },
    ],
  },
  {
    id: 'bola',
    name: 'Bola',
    shortDesc: 'Bangun ruang sisi lengkung sempurna di mana semua titik permukaannya berjarak sama dari pusat.',
    formulaText: 'V = ⁴⁄₃ × π × r³',
    formulaNote: 'Volume bola bergantung penuh pada pangkat tiga jari-jarinya (r³).',
    sisi: 1,
    rusuk: 0,
    titikSudut: 0,
    realLifeExamples: ['Bola sepak', 'Kelereng', 'Globe dunia'],
    accentColor: '#7C3AED',
    dimensions: [
      { key: 'r', label: 'Jari-jari', symbol: 'r', unit: 'cm', min: 3, max: 14, step: 1, defaultValue: 7 },
    ],
  },
];

export function getShapeById(id: ShapeId): ShapeDefinition {
  return SHAPES.find((s) => s.id === id) ?? SHAPES[0];
}

export function getDefaultDimensions(id: ShapeId): DimensionValues {
  const shape = getShapeById(id);
  const values: DimensionValues = {};
  for (const dim of shape.dimensions) {
    values[dim.key] = dim.defaultValue;
  }
  return values;
}

export function pickPi(r: number): { value: number; label: string; isFraction: boolean } {
  if (r % 7 === 0) {
    return { value: 22 / 7, label: '22/7', isFraction: true };
  }
  return { value: 3.14, label: '3,14', isFraction: false };
}

export function calculateVolume(id: ShapeId, dims: DimensionValues): number {
  switch (id) {
    case 'kubus': {
      const s = dims.s ?? 5;
      return s * s * s;
    }
    case 'balok': {
      const p = dims.p ?? 8;
      const l = dims.l ?? 5;
      const t = dims.t ?? 4;
      return p * l * t;
    }
    case 'prisma_segitiga': {
      const a = dims.a ?? 6;
      const ta = dims.ta ?? 4;
      const t = dims.t ?? 10;
      return 0.5 * a * ta * t;
    }
    case 'limas_segiempat': {
      const p = dims.p ?? 6;
      const l = dims.l ?? 6;
      const t = dims.t ?? 9;
      return (p * l * t) / 3;
    }
    case 'tabung': {
      const r = dims.r ?? 7;
      const t = dims.t ?? 10;
      const pi = pickPi(r).value;
      return Math.round(pi * r * r * t * 100) / 100;
    }
    case 'kerucut': {
      const r = dims.r ?? 7;
      const t = dims.t ?? 12;
      const pi = pickPi(r).value;
      return Math.round(((pi * r * r * t) / 3) * 100) / 100;
    }
    case 'bola': {
      const r = dims.r ?? 7;
      const pi = pickPi(r).value;
      return Math.round(((4 / 3) * pi * r * r * r) * 100) / 100;
    }
  }
}

export function formatIndoNumber(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 2,
  }).format(rounded);
}

export function getFormulaSteps(id: ShapeId, dims: DimensionValues): string[] {
  const vol = calculateVolume(id, dims);
  switch (id) {
    case 'kubus': {
      const s = dims.s ?? 5;
      return [
        `Diketahui panjang rusuk (s) = ${s} cm`,
        `V = s × s × s`,
        `V = ${s} × ${s} × ${s} = ${formatIndoNumber(vol)} cm³`,
      ];
    }
    case 'balok': {
      const p = dims.p ?? 8;
      const l = dims.l ?? 5;
      const t = dims.t ?? 4;
      return [
        `Diketahui p = ${p} cm, l = ${l} cm, t = ${t} cm`,
        `V = p × l × t`,
        `V = ${p} × ${l} × ${t} = ${formatIndoNumber(vol)} cm³`,
      ];
    }
    case 'prisma_segitiga': {
      const a = dims.a ?? 6;
      const ta = dims.ta ?? 4;
      const t = dims.t ?? 10;
      const luasAlas = 0.5 * a * ta;
      return [
        `Luas Alas = ½ × ${a} × ${ta} = ${formatIndoNumber(luasAlas)} cm²`,
        `V = Luas Alas × t = ${formatIndoNumber(luasAlas)} × ${t}`,
        `V = ${formatIndoNumber(vol)} cm³`,
      ];
    }
    case 'limas_segiempat': {
      const p = dims.p ?? 6;
      const l = dims.l ?? 6;
      const t = dims.t ?? 9;
      const luasAlas = p * l;
      return [
        `Luas Alas = ${p} × ${l} = ${formatIndoNumber(luasAlas)} cm²`,
        `V = ⅓ × ${formatIndoNumber(luasAlas)} × ${t}`,
        `V = ${formatIndoNumber(vol)} cm³`,
      ];
    }
    case 'tabung': {
      const r = dims.r ?? 7;
      const t = dims.t ?? 10;
      const pi = pickPi(r);
      return [
        `Karena r = ${r} cm, gunakan π = ${pi.label}`,
        `V = ${pi.label} × ${r} × ${r} × ${t}`,
        `V = ${formatIndoNumber(vol)} cm³`,
      ];
    }
    case 'kerucut': {
      const r = dims.r ?? 7;
      const t = dims.t ?? 12;
      const pi = pickPi(r);
      return [
        `Karena r = ${r} cm, gunakan π = ${pi.label}`,
        `V = ⅓ × ${pi.label} × ${r} × ${r} × ${t}`,
        `V = ${formatIndoNumber(vol)} cm³`,
      ];
    }
    case 'bola': {
      const r = dims.r ?? 7;
      const pi = pickPi(r);
      return [
        `Karena r = ${r} cm, gunakan π = ${pi.label}`,
        `V = ⁴⁄₃ × ${pi.label} × ${r}³`,
        `V = ${formatIndoNumber(vol)} cm³`,
      ];
    }
  }
}
