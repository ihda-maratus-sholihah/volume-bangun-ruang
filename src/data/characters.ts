export type CharacterId = 'kiko' | 'bara' | 'rara' | 'mimi' | 'tobi';

export interface CharacterInfo {
  id: CharacterId;
  name: string;
  role: string;
  gameTitle: string;
  gameDesc: string;
  imageSrc: string;
  accentBg: string;
  accentText: string;
  quote: string;
}

export const CHARACTERS: Record<CharacterId, CharacterInfo> = {
  kiko: {
    id: 'kiko',
    name: 'Kiko si Kucing Arsitek',
    role: 'Ahli Konstruksi Kubus & Balok',
    gameTitle: 'Susun Kubus Satuan',
    gameDesc: 'Susun balok dan kubus dari kubus satuan 3D sesuai target ukuran dan volume yang diminta Kiko.',
    imageSrc: '/src/assets/images/char_kiko_cat_1795556279701.jpg',
    accentBg: 'bg-amber-50',
    accentText: 'text-amber-800',
    quote: 'Setiap lapisan kubus satuan membantu kita memahami rumus p × l × t!',
  },
  bara: {
    id: 'bara',
    name: 'Bara si Beruang Insinyur',
    role: 'Spesialis Takaran Cairan',
    gameTitle: 'Isi Tangki & Takaran',
    gameDesc: 'Tuangkan air ke dalam wadah tabung, kerucut, dan balok hingga mencapai volume target tanpa meluap.',
    imageSrc: '/src/assets/images/char_bara_bear_1795556279961.jpg',
    accentBg: 'bg-sky-50',
    accentText: 'text-sky-800',
    quote: 'Tahukah kamu? Tiga kerucut penuh tepat mengisi satu tabung berukuran sama!',
  },
  rara: {
    id: 'rara',
    name: 'Rara si Rubah Cepat',
    role: 'Penjelajah Rumus Kilat',
    gameTitle: 'Tangkap Bangun & Rumus',
    gameDesc: 'Gerakkan Rara untuk menangkap kotak bangun ruang dan rumus volume yang cocok dengan tantangan di layar!',
    imageSrc: '/src/assets/images/char_rara_fox_1795556280226.jpg',
    accentBg: 'bg-teal-50',
    accentText: 'text-teal-800',
    quote: 'Fokus dan cekatan! Hitung cepat sebelum kotaknya menyentuh tanah!',
  },
  mimi: {
    id: 'mimi',
    name: 'Mimi si Burung Hantu Bijak',
    role: 'Penjaga Kartu Geometri',
    gameTitle: 'Memori Kartu 3D',
    gameDesc: 'Buka dan pasangkan kartu bangun ruang dengan nilai volume atau rumus yang tepat dengan langkah sesedikit mungkin.',
    imageSrc: '/src/assets/images/char_mimi_owl_1795556280769.jpg',
    accentBg: 'bg-emerald-50',
    accentText: 'text-emerald-800',
    quote: 'Ingatan tajam dan ketelitian rumus adalah kunci membuka semua pasangan kartu!',
  },
  tobi: {
    id: 'tobi',
    name: 'Pak Tobi si Penyu Profesor',
    role: 'Pemandu Labirin Geometri',
    gameTitle: 'Petualangan Labirin Volume',
    gameDesc: 'Lalui 5 pos gerbang labirin dengan memecahkan teka-teki ukuran yang hilang dan soal cerita volume.',
    imageSrc: '/src/assets/images/char_tobi_turtle_1795556281662.jpg',
    accentBg: 'bg-blue-50',
    accentText: 'text-blue-800',
    quote: 'Jangan terburu-buru! Tulis apa yang diketahui terlebih dahulu sebelum menghitung.',
  },
};

export const CHARACTER_LIST: CharacterInfo[] = [
  CHARACTERS.kiko,
  CHARACTERS.bara,
  CHARACTERS.rara,
  CHARACTERS.mimi,
  CHARACTERS.tobi,
];
