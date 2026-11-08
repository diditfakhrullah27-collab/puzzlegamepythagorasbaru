import { ShapeInfo } from '../types/game';
export type { ShapeInfo };

export const GEOMETRY_SHAPES: ShapeInfo[] = [
  {
    id: 'right_triangle',
    name: 'Segitiga Siku-Siku',
    image: '/assets/geometry/shape_right_triangle.png',
    areaFormula: 'L = ½ × a × t',
    perimeterFormula: 'K = a + t + c',
    description:
      'Segitiga dengan salah satu sudutnya bernilai tepat 90° (sudut siku-siku). Sisi di hadapan sudut siku-siku disebut hipotenusa (sisi miring) dan merupakan sisi terpanjang.',
    properties: [
      'Memiliki satu sudut tepat 90°',
      'Memenuhi rumus Teorema Pythagoras: c² = a² + b²',
      'Sisi tegak dan sisi mendatar saling tegak lurus',
      'Sudut-sudut lancipnya berjumlah 90°',
    ],
    exampleData: {
      labelA: 'Alas (a) dalam cm:',
      defaultA: 6,
      labelB: 'Tinggi (t) dalam cm:',
      defaultB: 8,
      calcArea: (a, b) => 0.5 * a * b,
    },
  },
  {
    id: 'square',
    name: 'Persegi',
    image: '/assets/geometry/shape_square.png',
    areaFormula: 'L = s × s = s²',
    perimeterFormula: 'K = 4 × s',
    description:
      'Bangun datar beraturan dengan empat sisi sama panjang dan empat sudut siku-siku. Dalam pembuktian Pythagoras, luas persegi pada sisi miring sama dengan jumlah luas persegi pada kedua sisi lainnya.',
    properties: [
      'Semua 4 sisinya memiliki panjang yang persis sama',
      'Semua 4 sudutnya berukuran 90°',
      'Kedua diagonalnya sama panjang dan saling berpotongan tegak lurus',
      'Membagi menjadi dua segitiga siku-siku sama kaki melalui diagonal',
    ],
    exampleData: {
      labelA: 'Panjang Sisi (s) dalam cm:',
      defaultA: 5,
      labelB: 'Sisi Pengali:',
      defaultB: 5,
      calcArea: (s) => s * s,
    },
  },
  {
    id: 'rectangle',
    name: 'Persegi Panjang',
    image: '/assets/geometry/shape_rectangle.png',
    areaFormula: 'L = p × l',
    perimeterFormula: 'K = 2 × (p + l)',
    description:
      'Bangun datar dengan dua pasang sisi sejajar yang sama panjang dan empat sudut siku-siku. Garis diagonal persegi panjang membaginya menjadi dua segitiga siku-siku yang kongruen.',
    properties: [
      'Sisi yang berhadapan sama panjang dan sejajar',
      'Semua 4 sudutnya adalah sudut siku-siku 90°',
      'Kedua diagonalnya sama panjang: d = √(p² + l²)',
      'Memiliki 2 simetri lipat dan 2 simetri putar',
    ],
    exampleData: {
      labelA: 'Panjang (p) dalam cm:',
      defaultA: 10.5,
      labelB: 'Lebar (l) dalam cm:',
      defaultB: 10,
      calcArea: (p, l) => p * l,
    },
  },
  {
    id: 'trapezoid',
    name: 'Trapesium',
    image: '/assets/geometry/shape_trapezoid.png',
    areaFormula: 'L = ½ × (a + b) × t',
    perimeterFormula: 'K = a + b + c + d',
    description:
      'Bangun datar segi empat yang memiliki tepat sepasang sisi sejajar. Dalam pembuktian Garfield, trapesium siku-siku disusun dari tiga segitiga siku-siku untuk membuktikan rumus Pythagoras.',
    properties: [
      'Memiliki tepat satu pasang sisi yang sejajar',
      'Pada trapesium siku-siku, salah satu kaki tegak lurus sisi sejajar',
      'Garis tinggi tegak lurus terhadap kedua sisi sejajar',
      'Jumlah sudut yang berdekatan di antara sisi sejajar adalah 180°',
    ],
    exampleData: {
      labelA: 'Sisi Sejajar Atas (a) cm:',
      defaultA: 27,
      labelB: 'Sisi Sejajar Bawah (b) cm:',
      defaultB: 34,
      labelC: 'Tinggi (t) cm:',
      defaultC: 24,
      calcArea: (a, b, t = 24) => 0.5 * (a + b) * t,
    },
  },
  {
    id: 'parallelogram',
    name: 'Jajargenjang',
    image: '/assets/geometry/shape_parallelogram.png',
    areaFormula: 'L = a × t',
    perimeterFormula: 'K = 2 × (a + b)',
    description:
      'Bangun datar segi empat dengan dua pasang sisi berhadapan yang sejajar dan sama panjang. Tinggi jajargenjang dapat dihitung menggunakan segitiga siku-siku dari sisi miringnya.',
    properties: [
      'Sisi-sisi yang berhadapan sejajar dan sama panjang',
      'Sudut-sudut yang berhadapan sama besar',
      'Kedua diagonal saling membagi dua sama panjang',
      'Tinggi dicari dengan teorema Pythagoras: t = √(sisi miring² - alas proyeksi²)',
    ],
    exampleData: {
      labelA: 'Alas (a) dalam cm:',
      defaultA: 20,
      labelB: 'Tinggi (t) dalam cm:',
      defaultB: 12,
      calcArea: (a, t) => a * t,
    },
  },
  {
    id: 'isosceles_triangle',
    name: 'Segitiga Sama Kaki',
    image: '/assets/geometry/shape_isosceles_triangle.png',
    areaFormula: 'L = ½ × a × t',
    perimeterFormula: 'K = 2 × s + a',
    description:
      'Segitiga yang memiliki dua sisi sama panjang. Garis tinggi yang ditarik dari puncak ke alas membagi segitiga ini menjadi dua segitiga siku-siku yang kongruen.',
    properties: [
      'Memiliki dua sisi yang sama panjang (kaki-kaki)',
      'Memiliki dua sudut alas yang sama besar',
      'Garis tinggi membagi sisi alas menjadi dua bagian sama panjang',
      'Tinggi segitiga: t = √(sisi kaki² - (½ alas)²)',
    ],
    exampleData: {
      labelA: 'Alas (a) dalam cm:',
      defaultA: 6,
      labelB: 'Tinggi (t) dalam cm:',
      defaultB: 4,
      calcArea: (a, t) => 0.5 * a * t,
    },
  },
];
