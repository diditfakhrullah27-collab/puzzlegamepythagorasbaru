import { PracticeChallenge } from '../types/game';

export const PRACTICE_CHALLENGES: PracticeChallenge[] = [
  // -------------------------------------------------------------
  // TANTANGAN 1: Hubungan Panjang Sisi Segitiga Siku-Siku (No. 1 a-e)
  // -------------------------------------------------------------
  {
    id: 1,
    numberTitle: 'Tantangan 1: Hubungan Sisi Segitiga',
    title: 'Menyusun Rumus Pythagoras Berdasarkan Letak Sudut Siku-Siku',
    category: 'mudah',
    categoryLabel: 'Level 1: Mudah',
    description:
      'Tentukan rumus hubungan kuadrat sisi-sisi segitiga siku-siku berdasarkan sisi yang berhadapan langsung dengan sudut siku-siku (hipotenusa).',
    sourceReference: 'Global Matematika SMP Kelas VIII Halaman 36 (Ayo Berlatih 1 No. 1)',
    recommendedChapter: 1,
    subQuestions: [
      {
        id: '1a',
        label: 'Subsoal 1a',
        questionText:
          'Segitiga dengan sisi a, b, dan c (siku-siku menghadap sisi a). Manakah hubungan yang tepat?',
        type: 'formula_puzzle',
        diagramType: 'triangle',
        diagramProps: { sideA: 'a (Hipotenusa)', sideB: 'b', sideC: 'c' },
        hint: 'Sisi yang menghadap sudut siku-siku adalah sisi terpanjang (hipotenusa a). Maka kuadratnya sama dengan jumlah kuadrat dua sisi lainnya.',
        formulaChips: [
          'a² = b² + c²',
          'b² = a² + c²',
          'c² = a² + b²',
          'a² = b² - c²',
        ],
        correctAnswer: 'a² = b² + c²',
        explanation: [
          'Karena sudut siku-siku menghadap sisi a, maka a bertindak sebagai hipotenusa.',
          'Berdasarkan teorema Pythagoras: a² = b² + c².',
          'Bentuk turunan lainnya adalah b² = a² - c² atau c² = a² - b².',
        ],
      },
      {
        id: '1b',
        label: 'Subsoal 1b',
        questionText:
          'Segitiga dengan sisi p, q, dan r (siku-siku menghadap sisi r). Manakah hubungan yang tepat?',
        type: 'formula_puzzle',
        diagramType: 'triangle',
        diagramProps: { sideA: 'r (Hipotenusa)', sideB: 'p', sideC: 'q' },
        hint: 'Sisi r adalah sisi miring karena menghadap sudut siku-siku.',
        formulaChips: [
          'r² = p² + q²',
          'p² = r² + q²',
          'q² = p² + r²',
          'r² = p² - q²',
        ],
        correctAnswer: 'r² = p² + q²',
        explanation: [
          'Sudut siku-siku menghadap sisi r, sehingga r adalah hipotenusa.',
          'Hubungan Pythagoras yang berlaku: r² = p² + q².',
        ],
      },
      {
        id: '1c',
        label: 'Subsoal 1c',
        questionText:
          'Segitiga dengan sisi x, y, dan z (siku-siku menghadap sisi y). Manakah hubungan yang tepat?',
        type: 'formula_puzzle',
        diagramType: 'triangle',
        diagramProps: { sideA: 'y (Hipotenusa)', sideB: 'x', sideC: 'z' },
        hint: 'Sisi y adalah hipotenusa.',
        formulaChips: [
          'y² = x² + z²',
          'x² = y² + z²',
          'z² = x² + y²',
          'y² = x² - z²',
        ],
        correctAnswer: 'y² = x² + z²',
        explanation: [
          'Sudut siku-siku menghadap sisi y, maka y² = x² + z².',
        ],
      },
      {
        id: '1d',
        label: 'Subsoal 1d',
        questionText:
          'Segitiga dengan sisi k, l, dan m (siku-siku menghadap sisi m). Manakah rumus pengurangan untuk mencari sisi k?',
        type: 'multiple_choice',
        diagramType: 'triangle',
        diagramProps: { sideA: 'm (Hipotenusa)', sideB: 'k', sideC: 'l' },
        hint: 'Karena m adalah hipotenusa, maka sisi siku-siku k dihitung dengan mengurangkan kuadrat m dengan l.',
        options: [
          { id: 'opt_a', label: 'A', text: 'k² = m² - l²' },
          { id: 'opt_b', label: 'B', text: 'k² = m² + l²' },
          { id: 'opt_c', label: 'C', text: 'k² = l² - m²' },
          { id: 'opt_d', label: 'D', text: 'k = m + l' },
        ],
        correctAnswer: 'opt_a',
        explanation: [
          'Hubungan utama: m² = k² + l².',
          'Untuk mencari sisi siku-siku k, pindah ruaskan: k² = m² - l².',
        ],
      },
      {
        id: '1e',
        label: 'Subsoal 1e',
        questionText:
          'Segitiga dengan sisi d, e, dan f (siku-siku menghadap sisi d). Manakah hubungan yang tepat?',
        type: 'formula_puzzle',
        diagramType: 'triangle',
        diagramProps: { sideA: 'd (Hipotenusa)', sideB: 'e', sideC: 'f' },
        hint: 'Sisi d adalah sisi miring.',
        formulaChips: [
          'd² = e² + f²',
          'e² = d² + f²',
          'f² = d² + e²',
          'd² = e² - f²',
        ],
        correctAnswer: 'd² = e² + f²',
        explanation: [
          'Sisi d berhadapan dengan sudut 90°, maka d² = e² + f².',
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // TANTANGAN 2: Menghitung Panjang Sisi yang Belum Diketahui (No. 2 a-e)
  // -------------------------------------------------------------
  {
    id: 2,
    numberTitle: 'Tantangan 2: Menghitung Sisi Hilang',
    title: 'Perhitungan Panjang Sisi Menggunakan Akar Kuadrat',
    category: 'mudah',
    categoryLabel: 'Level 1: Mudah',
    description:
      'Hitung panjang salah satu sisi siku-siku atau hipotenusa yang belum diketahui pada segitiga siku-siku.',
    sourceReference: 'Global Matematika SMP Kelas VIII Halaman 36 (Ayo Berlatih 1 No. 2)',
    recommendedChapter: 3,
    subQuestions: [
      {
        id: '2a',
        label: 'Subsoal 2a',
        questionText:
          'Diketahui salah satu sisi siku-siku = 5 cm dan hipotenusa = 13 cm. Berapakah panjang sisi siku-siku q?',
        type: 'multiple_choice',
        diagramType: 'triangle',
        diagramProps: { height: 5, hyp: 13, base: 'q = ?' },
        hint: 'Gunakan pengurangan: q = √(13² - 5²).',
        options: [
          { id: '12', label: 'A', text: '12 cm' },
          { id: '10', label: 'B', text: '10 cm' },
          { id: '8', label: 'C', text: '8 cm' },
          { id: '14', label: 'D', text: '14 cm' },
        ],
        correctAnswer: '12',
        explanation: [
          'q² = 13² - 5²',
          'q² = 169 - 25 = 144',
          'q = √144 = 12 cm.',
        ],
      },
      {
        id: '2b',
        label: 'Subsoal 2b',
        questionText:
          'Diketahui sisi siku-siku = 24 cm dan hipotenusa = 26 cm. Berapakah panjang sisi siku-siku z?',
        type: 'multiple_choice',
        diagramType: 'triangle',
        diagramProps: { height: 24, hyp: 26, base: 'z = ?' },
        hint: 'z = √(26² - 24²).',
        options: [
          { id: '10', label: 'A', text: '10 cm' },
          { id: '12', label: 'B', text: '12 cm' },
          { id: '14', label: 'C', text: '14 cm' },
          { id: '16', label: 'D', text: '16 cm' },
        ],
        correctAnswer: '10',
        explanation: [
          'z² = 26² - 24²',
          'z² = 676 - 576 = 100',
          'z = √100 = 10 cm.',
        ],
      },
      {
        id: '2c',
        label: 'Subsoal 2c',
        questionText:
          'Diketahui kedua sisi siku-siku adalah 7 cm dan 24 cm. Berapakah panjang hipotenusa m?',
        type: 'multiple_choice',
        diagramType: 'triangle',
        diagramProps: { height: 7, base: 24, hyp: 'm = ?' },
        hint: 'm = √(7² + 24²).',
        options: [
          { id: '25', label: 'A', text: '25 cm' },
          { id: '26', label: 'B', text: '26 cm' },
          { id: '28', label: 'C', text: '28 cm' },
          { id: '31', label: 'D', text: '31 cm' },
        ],
        correctAnswer: '25',
        explanation: [
          'm² = 7² + 24²',
          'm² = 49 + 576 = 625',
          'm = √625 = 25 cm.',
        ],
      },
      {
        id: '2d',
        label: 'Subsoal 2d',
        questionText:
          'Diketahui hipotenusa = 12,5 cm dan salah satu sisi siku-siku = 3,5 cm. Berapakah panjang sisi siku-siku e?',
        type: 'multiple_choice',
        diagramType: 'triangle',
        diagramProps: { height: 3.5, hyp: 12.5, base: 'e = ?' },
        hint: 'e = √((12,5)² - (3,5)²).',
        options: [
          { id: '12', label: 'A', text: '12 cm' },
          { id: '11.5', label: 'B', text: '11,5 cm' },
          { id: '13', label: 'C', text: '13 cm' },
          { id: '9', label: 'D', text: '9 cm' },
        ],
        correctAnswer: '12',
        explanation: [
          'e² = (12,5)² - (3,5)²',
          'e² = 156,25 - 12,25 = 144',
          'e = √144 = 12 cm.',
        ],
      },
      {
        id: '2e',
        label: 'Subsoal 2e',
        questionText:
          'Diketahui kedua sisi siku-siku adalah 24 cm dan 32 cm. Berapakah panjang hipotenusa a?',
        type: 'multiple_choice',
        diagramType: 'triangle',
        diagramProps: { height: 24, base: 32, hyp: 'a = ?' },
        hint: 'a = √(24² + 32²). Tips: perhatikan kelipatan triple (3, 4, 5) × 8!',
        options: [
          { id: '40', label: 'A', text: '40 cm' },
          { id: '36', label: 'B', text: '36 cm' },
          { id: '44', label: 'C', text: '44 cm' },
          { id: '56', label: 'D', text: '56 cm' },
        ],
        correctAnswer: '40',
        explanation: [
          'a² = 24² + 32²',
          'a² = 576 + 1024 = 1600',
          'a = √1600 = 40 cm.',
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // TANTANGAN 3: Persegi Panjang & Diagonal (No. 3)
  // -------------------------------------------------------------
  {
    id: 3,
    numberTitle: 'Tantangan 3: Diagonal Persegi Panjang',
    title: 'Aplikasi Pythagoras pada Persegi Panjang',
    category: 'sedang',
    categoryLabel: 'Level 2: Sedang',
    description:
      'Persegi panjang memiliki panjang diagonal 14,5 cm dan panjang 10,5 cm. Tentukan lebar, luas, dan kelilingnya.',
    sourceReference: 'Global Matematika SMP Kelas VIII Halaman 36 (Ayo Berlatih 1 No. 3)',
    recommendedChapter: 4,
    subQuestions: [
      {
        id: '3a',
        label: 'Subsoal 3a: Lebar',
        questionText:
          'Panjang diagonal d = 14,5 cm dan panjang p = 10,5 cm. Berapakah lebar (l) persegi panjang tersebut?',
        type: 'multiple_choice',
        diagramType: 'rectangle',
        diagramProps: { length: 10.5, diag: 14.5 },
        hint: 'l = √(d² - p²) = √((14,5)² - (10,5)²).',
        options: [
          { id: '10', label: 'A', text: '10 cm' },
          { id: '9.5', label: 'B', text: '9,5 cm' },
          { id: '11', label: 'C', text: '11 cm' },
          { id: '12', label: 'D', text: '12 cm' },
        ],
        correctAnswer: '10',
        explanation: [
          'l² = (14,5)² - (10,5)²',
          'l² = 210,25 - 110,25 = 100',
          'l = √100 = 10 cm.',
        ],
      },
      {
        id: '3b',
        label: 'Subsoal 3b: Luas & Keliling',
        questionText:
          'Jika panjang p = 10,5 cm dan lebar l = 10 cm, berapakah luas dan keliling persegi panjang tersebut?',
        type: 'multiple_choice',
        diagramType: 'rectangle',
        diagramProps: { length: 10.5, width: 10 },
        hint: 'Luas = p × l dan Keliling = 2 × (p + l).',
        options: [
          { id: 'opt_1', label: 'A', text: 'Luas = 105 cm² dan Keliling = 41 cm' },
          { id: 'opt_2', label: 'B', text: 'Luas = 100 cm² dan Keliling = 42 cm' },
          { id: 'opt_3', label: 'C', text: 'Luas = 110 cm² dan Keliling = 40 cm' },
          { id: 'opt_4', label: 'D', text: 'Luas = 105 cm² dan Keliling = 20,5 cm' },
        ],
        correctAnswer: 'opt_1',
        explanation: [
          'Luas = p × l = 10,5 cm × 10 cm = 105 cm².',
          'Keliling = 2 × (p + l) = 2 × (10,5 + 10) = 2 × 20,5 = 41 cm.',
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // TANTANGAN 4: Layang-layang & Teorema Pythagoras (No. 4)
  // -------------------------------------------------------------
  {
    id: 4,
    numberTitle: 'Tantangan 4: Geometri Layang-Layang',
    title: 'Analisis Diagonal Tegak Lurus pada Layang-layang',
    category: 'menantang',
    categoryLabel: 'Level 3: Menantang',
    description:
      'Apakah dua pasang sisi dan diagonal-diagonal yang saling tegak lurus pada bangun layang-layang memenuhi unsur teorema Pythagoras? Jelaskan pendapat kalian.',
    sourceReference: 'Global Matematika SMP Kelas VIII Halaman 36 (Ayo Berlatih 1 No. 4)',
    recommendedChapter: 2,
    subQuestions: [
      {
        id: '4a',
        label: 'Subsoal 4a',
        questionText:
          'Apakah sifat diagonal layang-layang yang berpotongan tegak lurus memenuhi unsur teorema Pythagoras?',
        type: 'multiple_choice',
        diagramType: 'kite',
        hint: 'Kedua diagonal layang-layang berpotongan tegak lurus membentuk 4 segitiga siku-siku di dalamnya.',
        options: [
          {
            id: 'ya',
            label: 'A',
            text: 'Ya, karena kedua diagonal berpotongan tegak lurus (90°) dan membagi layang-layang menjadi 4 segitiga siku-siku',
          },
          {
            id: 'tidak',
            label: 'B',
            text: 'Tidak, karena layang-layang bukan merupakan segitiga',
          },
          {
            id: 'hanya_sama_sisi',
            label: 'C',
            text: 'Hanya berlaku jika keempat sisinya sama panjang',
          },
        ],
        correctAnswer: 'ya',
        explanation: [
          'Ya, memenuhi! Pada bangun layang-layang, kedua diagonal saling berpotongan tegak lurus (membentuk sudut 90°).',
          'Hal ini membagi layang-layang menjadi 4 buah segitiga siku-siku.',
          'Sisi luar layang-layang bertindak sebagai sisi miring (hipotenusa), dan setengah panjang diagonal bertindak sebagai sisi siku-siku.',
          'Rumus: (sisi layang-layang)² = (½ d₁)² + (½ d₂)²',
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // TANTANGAN 5: Trapesium ABCD (No. 5)
  // -------------------------------------------------------------
  {
    id: 5,
    numberTitle: 'Tantangan 5: Keliling Trapesium',
    title: 'Menghitung Sisi Miring dan Keliling Trapesium',
    category: 'sedang',
    categoryLabel: 'Level 2: Sedang',
    description:
      'Perhatikan Trapesium ABCD (AB || CD, AD tegak lurus AB). Diketahui AB = 34 cm, AD = 24 cm, CD = 27 cm. Tentukan keliling bangun tersebut.',
    sourceReference: 'Global Matematika SMP Kelas VIII Halaman 36 (Ayo Berlatih 1 No. 5)',
    recommendedChapter: 4,
    subQuestions: [
      {
        id: '5a',
        label: 'Subsoal 5a: Sisi Miring BC',
        questionText:
          'Tarik garis tinggi CE tegak lurus AB. Panjang EB = 34 - 27 = 7 cm, dan tinggi CE = 24 cm. Berapakah panjang sisi miring BC?',
        type: 'multiple_choice',
        diagramType: 'trapezoid',
        diagramProps: { ab: 34, cd: 27, ad: 24 },
        hint: 'BC = √(CE² + EB²) = √(24² + 7²).',
        options: [
          { id: '25', label: 'A', text: '25 cm' },
          { id: '26', label: 'B', text: '26 cm' },
          { id: '28', label: 'C', text: '28 cm' },
          { id: '31', label: 'D', text: '31 cm' },
        ],
        correctAnswer: '25',
        explanation: [
          'Panjang EB = AB - CD = 34 - 27 = 7 cm.',
          'Tinggi CE = AD = 24 cm.',
          'BC² = 24² + 7² = 576 + 49 = 625',
          'BC = √625 = 25 cm.',
        ],
      },
      {
        id: '5b',
        label: 'Subsoal 5b: Keliling Total',
        questionText:
          'Berapakah keliling total trapesium ABCD tersebut?',
        type: 'multiple_choice',
        diagramType: 'trapezoid',
        hint: 'Keliling = AB + BC + CD + AD = 34 + 25 + 27 + 24.',
        options: [
          { id: '110', label: 'A', text: '110 cm' },
          { id: '108', label: 'B', text: '108 cm' },
          { id: '112', label: 'C', text: '112 cm' },
          { id: '115', label: 'D', text: '115 cm' },
        ],
        correctAnswer: '110',
        explanation: [
          'Keliling = AB + BC + CD + AD',
          '= 34 + 25 + 27 + 24 = 110 cm.',
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // TANTANGAN 6: Bangun Datar Gabungan (No. 6)
  // -------------------------------------------------------------
  {
    id: 6,
    numberTitle: 'Tantangan 6: Bangun Datar Gabungan',
    title: 'Analisis Keliling Bangun Komposit',
    category: 'menantang',
    categoryLabel: 'Level 3: Menantang',
    description:
      'Perhatikan gambar bangun datar gabungan dengan ED = 10 cm, OE = 6 cm. Tentukan panjang OD dan keliling bangun gabungan.',
    sourceReference: 'Global Matematika SMP Kelas VIII Halaman 36 (Ayo Berlatih 1 No. 6)',
    recommendedChapter: 4,
    subQuestions: [
      {
        id: '6a',
        label: 'Subsoal 6a: Panjang OD',
        questionText:
          'Pada segitiga siku-siku OED (siku-siku di O), jika hipotenusa ED = 10 cm dan OE = 6 cm, berapakah panjang OD?',
        type: 'multiple_choice',
        diagramType: 'composite',
        hint: 'OD = √(10² - 6²).',
        options: [
          { id: '8', label: 'A', text: '8 cm' },
          { id: '7', label: 'B', text: '7 cm' },
          { id: '9', label: 'C', text: '9 cm' },
          { id: '6', label: 'D', text: '6 cm' },
        ],
        correctAnswer: '8',
        explanation: [
          'OD² = ED² - OE²',
          'OD² = 10² - 6² = 100 - 36 = 64',
          'OD = √64 = 8 cm.',
        ],
      },
      {
        id: '6b',
        label: 'Subsoal 6b: Keliling Persegi Panjang OCDE',
        questionText:
          'Jika panjang OD = 8 cm dan OE = 6 cm, berapakah keliling persegi panjang OCDE?',
        type: 'multiple_choice',
        diagramType: 'composite',
        hint: 'Keliling = 2 × (panjang + lebar) = 2 × (8 + 6).',
        options: [
          { id: '28', label: 'A', text: '28 cm' },
          { id: '24', label: 'B', text: '24 cm' },
          { id: '48', label: 'C', text: '48 cm' },
          { id: '32', label: 'D', text: '32 cm' },
        ],
        correctAnswer: '28',
        explanation: [
          'Keliling = 2 × (8 + 6) = 2 × 14 = 28 cm.',
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // TANTANGAN 7: Segitiga ABC - Uji Siku-Siku (No. 7)
  // -------------------------------------------------------------
  {
    id: 7,
    numberTitle: 'Tantangan 7: Pembuktian Sudut Siku-Siku',
    title: 'Kebalikan Teorema Pythagoras pada Segitiga',
    category: 'menantang',
    categoryLabel: 'Level 3: Menantang',
    description:
      'Perhatikan ΔABC dengan AB = 10 cm, AD = 6 cm, BC = 17 cm. Tentukan panjang BD dan buktikan apakah ∠B siku-siku!',
    sourceReference: 'Global Matematika SMP Kelas VIII Halaman 36 (Ayo Berlatih 1 No. 7)',
    recommendedChapter: 5,
    subQuestions: [
      {
        id: '7a',
        label: 'Subsoal 7a: Panjang BD dan CD',
        questionText:
          'Pada ΔABD (siku-siku di D), AB = 10 cm, AD = 6 cm. Berapakah panjang BD? Dan pada ΔBCD dengan BC = 17 cm, berapakah CD?',
        type: 'multiple_choice',
        diagramType: 'triangle',
        hint: 'BD = √(10² - 6²) dan CD = √(17² - BD²).',
        options: [
          { id: 'opt_1', label: 'A', text: 'BD = 8 cm dan CD = 15 cm' },
          { id: 'opt_2', label: 'B', text: 'BD = 7 cm dan CD = 16 cm' },
          { id: 'opt_3', label: 'C', text: 'BD = 8 cm dan CD = 12 cm' },
        ],
        correctAnswer: 'opt_1',
        explanation: [
          'BD = √(10² - 6²) = √(100 - 36) = √64 = 8 cm.',
          'CD = √(17² - 8²) = √(289 - 64) = √225 = 15 cm.',
        ],
      },
      {
        id: '7b',
        label: 'Subsoal 7b: Uji Kebalikan Pythagoras',
        questionText:
          'Panjang AC = AD + CD = 6 + 15 = 21 cm. Apakah ∠B merupakan sudut siku-siku?',
        type: 'multiple_choice',
        diagramType: 'triangle',
        hint: 'Bandingkan AC² (21²) dengan (AB² + BC²) = (10² + 17²).',
        options: [
          {
            id: 'bukan',
            label: 'A',
            text: 'Bukan siku-siku, karena AC² (441) ≠ AB² + BC² (389)',
          },
          {
            id: 'ya',
            label: 'B',
            text: 'Ya, siku-siku',
          },
        ],
        correctAnswer: 'bukan',
        explanation: [
          'AC² = 21² = 441.',
          'AB² + BC² = 10² + 17² = 100 + 289 = 389.',
          'Karena 441 ≠ 389, maka ΔABC BUKAN segitiga siku-siku di B (melainkan segitiga tumpul karena AC² > AB² + BC²).',
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // TANTANGAN 8: Tiang Tegak dan Tali Patok (No. 8)
  // -------------------------------------------------------------
  {
    id: 8,
    numberTitle: 'Tantangan 8: Tiang Antena & Tali Patok',
    title: 'Aplikasi Nyata: Menghitung Tinggi Tiang',
    category: 'sedang',
    categoryLabel: 'Level 2: Sedang',
    description:
      'Sebuah tiang tegak berdiri di atas tanah. Seutas tali diikatkan pada ujung atas tiang dan patok di tanah. Jika tali = 17 m dan jarak patok = 8 m, tentukan tinggi tiang.',
    sourceReference: 'Global Matematika SMP Kelas VIII Halaman 36 (Ayo Berlatih 1 No. 8)',
    recommendedChapter: 4,
    subQuestions: [
      {
        id: '8a',
        label: 'Subsoal 8a',
        questionText:
          'Berapakah tinggi tiang tersebut?',
        type: 'multiple_choice',
        diagramType: 'pole',
        hint: 'Tinggi = √((Panjang Tali)² - (Jarak Patok)²) = √(17² - 8²).',
        options: [
          { id: '15', label: 'A', text: '15 meter' },
          { id: '14', label: 'B', text: '14 meter' },
          { id: '16', label: 'C', text: '16 meter' },
          { id: '18', label: 'D', text: '18 meter' },
        ],
        correctAnswer: '15',
        explanation: [
          'Tali adalah hipotenusa (17 m), jarak patok adalah alas (8 m).',
          'Tinggi tiang = √(17² - 8²)',
          '= √(289 - 64) = √225 = 15 meter.',
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // TANTANGAN 9: Jajargenjang & Segitiga Siku-Siku (No. 9)
  // -------------------------------------------------------------
  {
    id: 9,
    numberTitle: 'Tantangan 9: Jajargenjang & Segitiga',
    title: 'Perhitungan Keliling Bangun Bertingkat',
    category: 'menantang',
    categoryLabel: 'Level 3: Menantang',
    description:
      'Perhatikan gambar jajargenjang dan segitiga siku-siku. Sisi miring segitiga = 37 cm dan alas = 12 cm. Tentukan keliling bangun tersebut.',
    sourceReference: 'Global Matematika SMP Kelas VIII Halaman 36 (Ayo Berlatih 1 No. 9)',
    recommendedChapter: 4,
    subQuestions: [
      {
        id: '9a',
        label: 'Subsoal 9a: Tinggi Segitiga (Sisi Miring Jajargenjang)',
        questionText:
          'Berapakah sisi tegak segitiga siku-siku tersebut jika hipotenusa = 37 cm dan alas = 12 cm?',
        type: 'multiple_choice',
        diagramType: 'parallelogram',
        hint: 't = √(37² - 12²).',
        options: [
          { id: '35', label: 'A', text: '35 cm' },
          { id: '34', label: 'B', text: '34 cm' },
          { id: '36', label: 'C', text: '36 cm' },
          { id: '30', label: 'D', text: '30 cm' },
        ],
        correctAnswer: '35',
        explanation: [
          't² = 37² - 12² = 1369 - 144 = 1225',
          't = √1225 = 35 cm.',
          'Sisi tegak ini sekaligus menjadi sisi miring/sejajar dari jajargenjang.',
        ],
      },
      {
        id: '9b',
        label: 'Subsoal 9b: Keliling Gabungan Bangun',
        questionText:
          'Berapakah keliling total sisi terluar gabungan bangun tersebut?',
        type: 'multiple_choice',
        diagramType: 'parallelogram',
        hint: 'Keliling = (2 × 35) + (2 × 12) + 37.',
        options: [
          { id: '131', label: 'A', text: '131 cm' },
          { id: '128', label: 'B', text: '128 cm' },
          { id: '135', label: 'C', text: '135 cm' },
          { id: '142', label: 'D', text: '142 cm' },
        ],
        correctAnswer: '131',
        explanation: [
          'Keliling total = (2 × 35) + (2 × 12) + 37',
          '= 70 + 24 + 37 = 131 cm.',
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // TANTANGAN 10: Segitiga ABD dengan Titik C (No. 10)
  // -------------------------------------------------------------
  {
    id: 10,
    numberTitle: 'Tantangan 10: Segitiga Segmen Bersarang',
    title: 'Menghitung Segmen Garis CD pada Segitiga ABD',
    category: 'menantang',
    categoryLabel: 'Level 3: Menantang',
    description:
      'Perhatikan segitiga siku-siku ABD di mana C terletak pada garis BD. Jika AB = 12 cm, AC = 15 cm, dan AD = 20 cm, tentukan panjang segmen garis CD.',
    sourceReference: 'Global Matematika SMP Kelas VIII Halaman 36 (Ayo Berlatih 1 No. 10)',
    recommendedChapter: 3,
    subQuestions: [
      {
        id: '10a',
        label: 'Subsoal 10a: Panjang BC',
        questionText:
          'Pada segitiga siku-siku ABC (siku-siku di B), jika AB = 12 cm dan AC = 15 cm, berapakah panjang BC?',
        type: 'multiple_choice',
        diagramType: 'triangle',
        hint: 'BC = √(15² - 12²).',
        options: [
          { id: '9', label: 'A', text: '9 cm' },
          { id: '8', label: 'B', text: '8 cm' },
          { id: '10', label: 'C', text: '10 cm' },
          { id: '11', label: 'D', text: '11 cm' },
        ],
        correctAnswer: '9',
        explanation: [
          'BC² = 15² - 12² = 225 - 144 = 81',
          'BC = √81 = 9 cm.',
        ],
      },
      {
        id: '10b',
        label: 'Subsoal 10b: Panjang BD',
        questionText:
          'Pada segitiga siku-siku ABD yang lebih besar (siku-siku di B), jika AB = 12 cm dan AD = 20 cm, berapakah panjang BD?',
        type: 'multiple_choice',
        diagramType: 'triangle',
        hint: 'BD = √(20² - 12²).',
        options: [
          { id: '16', label: 'A', text: '16 cm' },
          { id: '15', label: 'B', text: '15 cm' },
          { id: '18', label: 'C', text: '18 cm' },
          { id: '14', label: 'D', text: '14 cm' },
        ],
        correctAnswer: '16',
        explanation: [
          'BD² = 20² - 12² = 400 - 144 = 256',
          'BD = √256 = 16 cm.',
        ],
      },
      {
        id: '10c',
        label: 'Subsoal 10c: Panjang Segmen CD',
        questionText:
          'Jika BD = 16 cm dan BC = 9 cm, berapakah panjang segmen CD?',
        type: 'multiple_choice',
        diagramType: 'triangle',
        hint: 'CD = BD - BC.',
        options: [
          { id: '7', label: 'A', text: '7 cm' },
          { id: '6', label: 'B', text: '6 cm' },
          { id: '8', label: 'C', text: '8 cm' },
          { id: '5', label: 'D', text: '5 cm' },
        ],
        correctAnswer: '7',
        explanation: [
          'Panjang CD = BD - BC',
          '= 16 cm - 9 cm = 7 cm.',
        ],
      },
    ],
  },
];
