import { ShapeId } from '../data/shapes';

export interface CubeLevel {
  level: number;
  title: string;
  prompt: string;
  targetP: number;
  targetL: number;
  targetT: number;
  targetVolume: number;
  gridMaxX: number;
  gridMaxY: number;
  maxHeight: number;
}

export const CUBE_LEVELS: CubeLevel[] = [
  {
    level: 1,
    title: 'Kubus Dasar',
    prompt: 'Susunlah sebuah kubus berukuran 2 × 2 × 2 kubus satuan!',
    targetP: 2,
    targetL: 2,
    targetT: 2,
    targetVolume: 8,
    gridMaxX: 4,
    gridMaxY: 4,
    maxHeight: 4,
  },
  {
    level: 2,
    title: 'Balok Mendatar',
    prompt: 'Buatlah balok dengan panjang 3, lebar 2, dan tinggi 2 kubus satuan (Volume = 12).',
    targetP: 3,
    targetL: 2,
    targetT: 2,
    targetVolume: 12,
    gridMaxX: 4,
    gridMaxY: 4,
    maxHeight: 4,
  },
  {
    level: 3,
    title: 'Menara Balok',
    prompt: 'Susun balok tegak berukuran 2 × 2 × 4 = 16 kubus satuan!',
    targetP: 2,
    targetL: 2,
    targetT: 4,
    targetVolume: 16,
    gridMaxX: 4,
    gridMaxY: 4,
    maxHeight: 5,
  },
  {
    level: 4,
    title: 'Kubus Sempurna 27',
    prompt: 'Bangun kubus raksasa bervolume 27 kubus satuan (rusuk 3 × 3 × 3)!',
    targetP: 3,
    targetL: 3,
    targetT: 3,
    targetVolume: 27,
    gridMaxX: 4,
    gridMaxY: 4,
    maxHeight: 4,
  },
  {
    level: 5,
    title: 'Gedung Balok Arsitek',
    prompt: 'Selesaikan proyek terakhir: balok 4 × 3 × 2 = 24 kubus satuan!',
    targetP: 4,
    targetL: 3,
    targetT: 2,
    targetVolume: 24,
    gridMaxX: 4,
    gridMaxY: 4,
    maxHeight: 4,
  },
];

export function sumGridVolume(heights: number[][]): number {
  let total = 0;
  for (const row of heights) {
    for (const h of row) {
      total += h;
    }
  }
  return total;
}

export function checkCubeLevelMatch(heights: number[][], level: CubeLevel): {
  totalCubes: number;
  isExactShape: boolean;
  isVolumeOnly: boolean;
} {
  const totalCubes = sumGridVolume(heights);
  if (totalCubes !== level.targetVolume) {
    return { totalCubes, isExactShape: false, isVolumeOnly: false };
  }

  // Check if occupied cells form a contiguous rectangle of (targetP x targetL) or (targetL x targetP) with uniform height targetT
  let minX = Infinity;
  let maxX = -1;
  let minY = Infinity;
  let maxY = -1;
  let nonZeroCount = 0;
  let allSameHeight = true;

  for (let y = 0; y < heights.length; y++) {
    for (let x = 0; x < heights[y].length; x++) {
      const h = heights[y][x];
      if (h > 0) {
        nonZeroCount++;
        if (h !== level.targetT) allSameHeight = false;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (nonZeroCount === 0 || !allSameHeight) {
    return { totalCubes, isExactShape: false, isVolumeOnly: true };
  }

  const spanX = maxX - minX + 1;
  const spanY = maxY - minY + 1;
  const isFilledRect = nonZeroCount === spanX * spanY;
  const matchesDims =
    (spanX === level.targetP && spanY === level.targetL) ||
    (spanX === level.targetL && spanY === level.targetP);

  return {
    totalCubes,
    isExactShape: isFilledRect && matchesDims,
    isVolumeOnly: !(isFilledRect && matchesDims),
  };
}

export interface TankChallenge {
  id: number;
  title: string;
  shape: ShapeId;
  dimsLabel: string;
  capacity: number;
  targetFill: number;
  scoops: { label: string; volume: number }[];
  hint: string;
}

export const TANK_CHALLENGES: TankChallenge[] = [
  {
    id: 1,
    title: 'Tangki Balok Akuarium',
    shape: 'balok',
    dimsLabel: 'p = 10 cm · l = 5 cm · t = 10 cm (Kapasitas 500 cm³)',
    capacity: 500,
    targetFill: 350,
    scoops: [
      { label: 'Gelas 50 cm³', volume: 50 },
      { label: 'Gelas 100 cm³', volume: 100 },
      { label: 'Gelas 200 cm³', volume: 200 },
    ],
    hint: 'Gabungkan gelas 200 + 100 + 50 untuk mencapai tepat 350 cm³!',
  },
  {
    id: 2,
    title: 'Eksperimen Kerucut & Tabung',
    shape: 'tabung',
    dimsLabel: 'Tabung r = 7 cm, t = 10 cm (Kapasitas ≈ 1.540 cm³)',
    capacity: 1540,
    targetFill: 1540,
    scoops: [
      { label: 'Kerucut (⅓ Tabung ≈ 513 cm³)', volume: 513.34 },
      { label: 'Gelas Kecil 250 cm³', volume: 250 },
    ],
    hint: 'Gunakan 3 kali takaran Kerucut (3 × ⅓ = 1 Tabung penuh)!',
  },
  {
    id: 3,
    title: 'Tangki Kubus Laboratorium',
    shape: 'kubus',
    dimsLabel: 'Kubus s = 10 cm (Kapasitas 1.000 cm³ = 1 Liter)',
    capacity: 1000,
    targetFill: 750,
    scoops: [
      { label: 'Takaran 150 cm³', volume: 150 },
      { label: 'Takaran 300 cm³', volume: 300 },
      { label: 'Takaran 450 cm³', volume: 450 },
    ],
    hint: '750 cm³ = 300 + 450 atau 5 × 150 cm³.',
  },
  {
    id: 4,
    title: 'Wadah Prisma Segitiga',
    shape: 'prisma_segitiga',
    dimsLabel: 'Alas Δ = 10 cm, tₐ = 8 cm, t = 15 cm (Kapasitas 600 cm³)',
    capacity: 600,
    targetFill: 450,
    scoops: [
      { label: 'Gelas 100 cm³', volume: 100 },
      { label: 'Gelas 150 cm³', volume: 150 },
      { label: 'Gelas 250 cm³', volume: 250 },
    ],
    hint: 'Volume prisma = (½ × 10 × 8) × 15 = 600 cm³. Target isi ¾ = 450 cm³.',
  },
];

export interface MemoryPair {
  pairId: string;
  frontLabel: string;
  frontSub: string;
  shape: ShapeId;
  matchLabel: string;
  matchSub: string;
}

export const MEMORY_PAIRS: MemoryPair[] = [
  {
    pairId: 'kubus-4',
    frontLabel: 'Kubus s = 4 cm',
    frontSub: 'V = s³',
    shape: 'kubus',
    matchLabel: '64 cm³',
    matchSub: '4 × 4 × 4',
  },
  {
    pairId: 'balok-532',
    frontLabel: 'Balok 5 × 3 × 2 cm',
    frontSub: 'V = p × l × t',
    shape: 'balok',
    matchLabel: '30 cm³',
    matchSub: '5 × 3 × 2',
  },
  {
    pairId: 'prisma-645',
    frontLabel: 'Prisma Δ a=6, tₐ=4, t=5',
    frontSub: 'V = ½ × a × tₐ × t',
    shape: 'prisma_segitiga',
    matchLabel: '60 cm³',
    matchSub: '12 × 5',
  },
  {
    pairId: 'limas-665',
    frontLabel: 'Limas alas 6×6, t=5',
    frontSub: 'V = ⅓ × p × l × t',
    shape: 'limas_segiempat',
    matchLabel: '60 cm³ (Limas)',
    matchSub: '⅓ × 36 × 5',
  },
  {
    pairId: 'tabung-710',
    frontLabel: 'Tabung r = 7, t = 10',
    frontSub: 'V = 22/7 × r² × t',
    shape: 'tabung',
    matchLabel: '1.540 cm³',
    matchSub: '154 × 10',
  },
  {
    pairId: 'kerucut-76',
    frontLabel: 'Kerucut r = 7, t = 6',
    frontSub: 'V = ⅓ × 22/7 × r² × t',
    shape: 'kerucut',
    matchLabel: '308 cm³',
    matchSub: '⅓ × 154 × 6',
  },
];

export interface MazeStage {
  stage: number;
  gateName: string;
  guardianTitle: string;
  shape: ShapeId;
  dims: Record<string, string>;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  tip: string;
}

export const MAZE_STAGES: MazeStage[] = [
  {
    stage: 1,
    gateName: 'Gerbang Kubus Pertama',
    guardianTitle: 'Penjaga Batu Kubus',
    shape: 'kubus',
    dims: { s: '6 cm' },
    question: 'Sebuah kubus memiliki panjang rusuk 6 cm. Berapakah volumenya?',
    options: ['36 cm³', '108 cm³', '216 cm³', '256 cm³'],
    correctIndex: 2,
    tip: 'Volume kubus = s × s × s = 6 × 6 × 6.',
  },
  {
    stage: 2,
    gateName: 'Jembatan Balok Misteri',
    guardianTitle: 'Penjaga Jembatan',
    shape: 'balok',
    dims: { p: '9 cm', l: '? cm', t: '4 cm' },
    question: 'Volume sebuah balok 180 cm³. Panjangnya 9 cm dan tingginya 4 cm. Berapakah lebarnya?',
    options: ['4 cm', '5 cm', '6 cm', '8 cm'],
    correctIndex: 1,
    tip: 'Lebar = Volume ÷ (p × t) = 180 ÷ (9 × 4) = 180 ÷ 36.',
  },
  {
    stage: 3,
    gateName: 'Lembah Prisma & Limas',
    guardianTitle: 'Penjaga Piramida',
    shape: 'limas_segiempat',
    dims: { p: '8 cm', l: '6 cm', t: '10 cm' },
    question: 'Hitunglah volume limas segiempat dengan panjang alas 8 cm, lebar 6 cm, dan tinggi 10 cm!',
    options: ['160 cm³', '240 cm³', '320 cm³', '480 cm³'],
    correctIndex: 0,
    tip: 'Jangan lupa faktor ⅓ pada limas: V = ⅓ × (8 × 6) × 10.',
  },
  {
    stage: 4,
    gateName: 'Menara Air Tabung',
    guardianTitle: 'Insinyur Menara',
    shape: 'tabung',
    dims: { r: '14 cm', t: '10 cm' },
    question: 'Sebuah menara air tabung berjari-jari 14 cm dan tinggi 10 cm (π = 22/7). Berapa volumenya?',
    options: ['3.080 cm³', '4.400 cm³', '6.160 cm³', '12.320 cm³'],
    correctIndex: 2,
    tip: 'V = (22/7) × 14 × 14 × 10 = 44 × 14 × 10.',
  },
  {
    stage: 5,
    gateName: 'Kastil Terakhir Raja Kerucut',
    guardianTitle: 'Raja Geometri',
    shape: 'kerucut',
    dims: { r: '7 cm', t: '15 cm' },
    question: 'Tantangan terakhir! Sebuah kerucut berjari-jari 7 cm dan tinggi 15 cm (π = 22/7). Berapa volumenya?',
    options: ['550 cm³', '770 cm³', '1.540 cm³', '2.310 cm³'],
    correctIndex: 1,
    tip: 'V = ⅓ × (22/7) × 7 × 7 × 15 = 154 × 5.',
  },
];
