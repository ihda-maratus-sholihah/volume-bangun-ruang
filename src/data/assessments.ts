import { ShapeId } from './shapes';

export interface DiagramSpec {
  shape: ShapeId;
  labels: Record<string, string>;
  secondShape?: {
    shape: ShapeId;
    labels: Record<string, string>;
  };
}

export interface AssessmentQuestion {
  id: number;
  topic: string;
  difficulty: 'Dasar' | 'Menengah' | 'HOTS';
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string[];
  diagram: DiagramSpec;
}

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 1,
    topic: 'Volume Kubus',
    difficulty: 'Dasar',
    question: 'Sebuah kotak mainan berbentuk kubus memiliki panjang rusuk 8 cm. Berapakah volume kotak mainan tersebut?',
    options: ['64 cm³', '384 cm³', '512 cm³', '576 cm³'],
    correctIndex: 2,
    explanation: [
      'Diketahui panjang rusuk kubus (s) = 8 cm.',
      'Rumus volume kubus: V = s × s × s.',
      'V = 8 × 8 × 8 = 512 cm³.',
    ],
    diagram: {
      shape: 'kubus',
      labels: { s: '8 cm' },
    },
  },
  {
    id: 2,
    topic: 'Volume Balok',
    difficulty: 'Dasar',
    question: 'Sebuah balok kayu berukuran panjang 12 cm, lebar 6 cm, dan tinggi 5 cm. Berapakah volume balok tersebut?',
    options: ['180 cm³', '360 cm³', '300 cm³', '420 cm³'],
    correctIndex: 1,
    explanation: [
      'Diketahui p = 12 cm, l = 6 cm, dan t = 5 cm.',
      'Rumus volume balok: V = p × l × t.',
      'V = 12 × 6 × 5 = 360 cm³.',
    ],
    diagram: {
      shape: 'balok',
      labels: { p: '12 cm', l: '6 cm', t: '5 cm' },
    },
  },
  {
    id: 3,
    topic: 'Mencari Tinggi Balok',
    difficulty: 'Menengah',
    question: 'Volume sebuah balok adalah 480 cm³. Jika panjangnya 10 cm dan lebarnya 8 cm, berapakah tinggi balok tersebut?',
    options: ['5 cm', '6 cm', '8 cm', '12 cm'],
    correctIndex: 1,
    explanation: [
      'Diketahui V = 480 cm³, p = 10 cm, l = 8 cm.',
      't = V ÷ (p × l) = 480 ÷ (10 × 8).',
      't = 480 ÷ 80 = 6 cm.',
    ],
    diagram: {
      shape: 'balok',
      labels: { p: '10 cm', l: '8 cm', t: '? cm' },
    },
  },
  {
    id: 4,
    topic: 'Volume Prisma Segitiga',
    difficulty: 'Menengah',
    question: 'Sebuah prisma segitiga memiliki alas segitiga berukuran alas 6 cm dan tinggi segitiga 4 cm. Jika tinggi prisma 15 cm, berapakah volumenya?',
    options: ['120 cm³', '180 cm³', '240 cm³', '360 cm³'],
    correctIndex: 1,
    explanation: [
      'Luas alas segitiga = ½ × a × tₐ = ½ × 6 × 4 = 12 cm².',
      'Volume prisma = Luas alas × tinggi prisma.',
      'V = 12 × 15 = 180 cm³.',
    ],
    diagram: {
      shape: 'prisma_segitiga',
      labels: { a: '6 cm', ta: '4 cm', t: '15 cm' },
    },
  },
  {
    id: 5,
    topic: 'Volume Limas Segiempat',
    difficulty: 'Menengah',
    question: 'Sebuah limas segiempat beralas persegi panjang berukuran 9 cm × 6 cm dan memiliki tinggi 10 cm. Berapakah volume limas tersebut?',
    options: ['180 cm³', '270 cm³', '360 cm³', '540 cm³'],
    correctIndex: 0,
    explanation: [
      'Luas alas = p × l = 9 × 6 = 54 cm².',
      'Rumus volume limas: V = ⅓ × Luas alas × t.',
      'V = ⅓ × 54 × 10 = 18 × 10 = 180 cm³.',
    ],
    diagram: {
      shape: 'limas_segiempat',
      labels: { p: '9 cm', l: '6 cm', t: '10 cm' },
    },
  },
  {
    id: 6,
    topic: 'Volume Tabung',
    difficulty: 'Menengah',
    question: 'Sebuah kaleng susu berbentuk tabung berjari-jari 7 cm dan tinggi 20 cm. Gunakan π = 22/7, berapakah volume kaleng tersebut?',
    options: ['1.540 cm³', '2.860 cm³', '3.080 cm³', '6.160 cm³'],
    correctIndex: 2,
    explanation: [
      'Diketahui r = 7 cm, t = 20 cm, π = 22/7.',
      'V = π × r² × t = (22/7) × 7 × 7 × 20.',
      'V = 22 × 7 × 20 = 154 × 20 = 3.080 cm³.',
    ],
    diagram: {
      shape: 'tabung',
      labels: { r: '7 cm', t: '20 cm' },
    },
  },
  {
    id: 7,
    topic: 'Volume Kerucut',
    difficulty: 'Menengah',
    question: 'Sebuah kerucut memiliki jari-jari alas 7 cm dan tinggi 12 cm (π = 22/7). Berapakah volume kerucut itu?',
    options: ['308 cm³', '616 cm³', '924 cm³', '1.848 cm³'],
    correctIndex: 1,
    explanation: [
      'Diketahui r = 7 cm, t = 12 cm, π = 22/7.',
      'V = ⅓ × π × r² × t = ⅓ × (22/7) × 7 × 7 × 12.',
      'V = ⅓ × 154 × 12 = 154 × 4 = 616 cm³.',
    ],
    diagram: {
      shape: 'kerucut',
      labels: { r: '7 cm', t: '12 cm' },
    },
  },
  {
    id: 8,
    topic: 'Volume Bola',
    difficulty: 'Menengah',
    question: 'Sebuah bola memiliki jari-jari 21 cm (π = 22/7). Berapakah volume bola tersebut?',
    options: ['19.404 cm³', '29.106 cm³', '38.808 cm³', '48.510 cm³'],
    correctIndex: 2,
    explanation: [
      'Diketahui r = 21 cm, π = 22/7.',
      'V = ⁴⁄₃ × π × r³ = ⁴⁄₃ × (22/7) × 21 × 21 × 21.',
      'V = 4 × 22 × 21 × 21 = 88 × 441 = 38.808 cm³.',
    ],
    diagram: {
      shape: 'bola',
      labels: { r: '21 cm' },
    },
  },
  {
    id: 9,
    topic: 'Soal Cerita Akuarium',
    difficulty: 'HOTS',
    question: 'Sebuah akuarium balok berukuran panjang 50 cm, lebar 30 cm, dan tinggi 40 cm baru diisi air sebanyak ¾ bagian. Berapa liter air di dalam akuarium? (1 liter = 1.000 cm³)',
    options: ['40 liter', '45 liter', '50 liter', '60 liter'],
    correctIndex: 1,
    explanation: [
      'Volume penuh akuarium = 50 × 30 × 40 = 60.000 cm³ = 60 liter.',
      'Air hanya terisi ¾ bagian: ¾ × 60 liter = 45 liter.',
    ],
    diagram: {
      shape: 'balok',
      labels: { p: '50 cm', l: '30 cm', t: '40 cm' },
    },
  },
  {
    id: 10,
    topic: 'Bangun Ruang Gabungan',
    difficulty: 'HOTS',
    question: 'Sebuah tugu miniatur terdiri dari kubus dengan rusuk 6 cm dan di atasnya terdapat limas segiempat beralas sama (6 cm × 6 cm) dengan tinggi limas 5 cm. Berapakah volume total bangun gabungan tersebut?',
    options: ['216 cm³', '256 cm³', '276 cm³', '306 cm³'],
    correctIndex: 2,
    explanation: [
      'Volume kubus = 6 × 6 × 6 = 216 cm³.',
      'Volume limas = ⅓ × (6 × 6) × 5 = ⅓ × 36 × 5 = 60 cm³.',
      'Volume gabungan = 216 + 60 = 276 cm³.',
    ],
    diagram: {
      shape: 'kubus',
      labels: { s: '6 cm' },
      secondShape: {
        shape: 'limas_segiempat',
        labels: { p: '6 cm', l: '6 cm', t: '5 cm' },
      },
    },
  },
];
