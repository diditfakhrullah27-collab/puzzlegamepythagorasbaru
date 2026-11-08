import { StoryScene } from '../types/game';

export const STORY_SCENES: StoryScene[] = [
  // -------------------------------------------------------------
  // PROLOGUE (ChallengeId 0)
  // -------------------------------------------------------------
  {
    id: 'prologue',
    challengeId: 0,
    title: 'Prolog: Misteri Gulungan Kuno Pythagoras',
    locationName: 'Taman Pythagoras & Pohon Penunjuk Arah',
    bgTheme: 'park',
    actionButtonLabel: 'MULAI PETUALANGAN RAFI ➔',
    dialogues: [
      {
        id: 'p1',
        speaker: 'Rafi',
        text: 'Halo teman-teman! Namaku Rafi, petualang matematika muda. Hari ini aku menemukan gulungan kuno misterius di perpustakaan!',
        emotion: 'excited',
        pose: 'standing',
      },
      {
        id: 'p2',
        speaker: 'Rafi',
        text: 'Di dalam gulungan ini tertulis rumus legendaris filsuf Yunani Kuno: c² = a² + b²! Konon katanya, rumus ini membuka rahasia seluruh segitiga siku-siku di alam semesta!',
        emotion: 'surprised',
        pose: 'reading_book',
      },
      {
        id: 'p3',
        speaker: 'Rafi',
        text: 'Tapi rumus ini disegel dalam 10 tantangan puzzle matematika! Maukah kamu membantuku memecahkan setiap tantangan dan membuktikan teorema Pythagoras?',
        emotion: 'happy',
        pose: 'pointing',
      },
      {
        id: 'p4',
        speaker: 'Rafi',
        text: 'Ayo siapkan penggaris, pensil, dan ketajaman logikamu! Petualangan Pythagoras kita dimulai sekarang!',
        emotion: 'happy',
        pose: 'victory_jump',
      },
    ],
  },

  // -------------------------------------------------------------
  // TANTANGAN 1 (ChallengeId 1)
  // -------------------------------------------------------------
  {
    id: 'scene_ch1',
    challengeId: 1,
    title: 'Bab 1: Menemukan Sisi Miring Hipotenusa',
    locationName: 'Taman Geometri Kuno',
    bgTheme: 'park',
    actionButtonLabel: 'KERJAKAN TANTANGAN 1 ➔',
    dialogues: [
      {
        id: 'c1_1',
        speaker: 'Rafi',
        text: 'Lihat batu prasasti di depan kita! Ada berbagai bentuk segitiga siku-siku dengan nama sisi berbeda-beda.',
        emotion: 'curious' as any,
        pose: 'pointing',
      },
      {
        id: 'c1_2',
        speaker: 'Rafi',
        text: 'Kuncinya sederhana: Sisi yang berada tepat di hadapan sudut 90° adalah sisi terpanjang (hipotenusa). Kuadrat sisi itulah yang sama dengan jumlah kuadrat dua sisi lainnya!',
        emotion: 'thinking',
        pose: 'thinking',
      },
      {
        id: 'c1_3',
        speaker: 'Rafi',
        text: 'Yuk bantu aku menyusun rumus Pythagoras yang benar untuk setiap posisi sudut siku-siku!',
        emotion: 'happy',
        pose: 'presenting',
      },
    ],
    successDialogues: [
      {
        id: 'c1_s1',
        speaker: 'Rafi',
        text: 'Hebat sekali! Kamu berhasil mengidentifikasi sisi miring pada semua segitiga! Sekarang prasasti pertama sudah menyala!',
        emotion: 'excited',
        pose: 'victory_jump',
      },
    ],
  },

  // -------------------------------------------------------------
  // TANTANGAN 2 (ChallengeId 2)
  // -------------------------------------------------------------
  {
    id: 'scene_ch2',
    challengeId: 2,
    title: 'Bab 2: Jejak Angka yang Hilang',
    locationName: 'Lembah Sisi Hilang',
    bgTheme: 'world',
    actionButtonLabel: 'KERJAKAN TANTANGAN 2 ➔',
    dialogues: [
      {
        id: 'c2_1',
        speaker: 'Rafi',
        text: 'Kita sampai di Lembah Sisi Hilang. Di tebing ini, ada ukuran-ukuran segitiga siku-siku yang terhapus cuaca!',
        emotion: 'thinking',
        pose: 'standing',
      },
      {
        id: 'c2_2',
        speaker: 'Rafi',
        text: 'Jika sisi miring dicari, kita gunakan c = √(a² + b²). Namun jika sisi siku-siku yang dicari, kita kurangkan: a = √(c² - b²)!',
        emotion: 'serious',
        pose: 'holding_pencil',
      },
      {
        id: 'c2_3',
        speaker: 'Rafi',
        text: 'Ayo kita hitung dan temukan kembali angka-angka yang hilang dengan akar kuadrat!',
        emotion: 'happy',
        pose: 'pointing',
      },
    ],
    successDialogues: [
      {
        id: 'c2_s1',
        speaker: 'Rafi',
        text: 'Brilian! Semua ukuran sisi segitiga berhasil kamu hitung dengan tepat tanpa ada kesalahan!',
        emotion: 'happy',
        pose: 'victory_jump',
      },
    ],
  },

  // -------------------------------------------------------------
  // TANTANGAN 3 (ChallengeId 3)
  // -------------------------------------------------------------
  {
    id: 'scene_ch3',
    challengeId: 3,
    title: 'Bab 3: Misteri Diagonal Persegi Panjang',
    locationName: 'Ruang Arsitektur & Teknologi',
    bgTheme: 'room',
    actionButtonLabel: 'KERJAKAN TANTANGAN 3 ➔',
    dialogues: [
      {
        id: 'c3_1',
        speaker: 'Rafi',
        text: 'Tahukah kamu? Setiap kali arsitek atau pembuat televisi mengukur layar, mereka menggunakan teorema Pythagoras!',
        emotion: 'happy',
        pose: 'presenting',
      },
      {
        id: 'c3_2',
        speaker: 'Rafi',
        text: 'Garis diagonal persegi panjang membelah ruangan menjadi dua segitiga siku-siku sempurna!',
        emotion: 'thinking',
        pose: 'reading_book',
      },
      {
        id: 'c3_3',
        speaker: 'Rafi',
        text: 'Ada meja dengan diagonal 14,5 cm dan panjang 10,5 cm. Bantu aku mencari lebar, luas, dan kelilingnya ya!',
        emotion: 'excited',
        pose: 'pointing',
      },
    ],
    successDialogues: [
      {
        id: 'c3_s1',
        speaker: 'Rafi',
        text: 'Keren! Lebar meja 10 cm, luas 105 cm², dan keliling 41 cm terhitung dengan presisi!',
        emotion: 'happy',
        pose: 'standing',
      },
    ],
  },

  // -------------------------------------------------------------
  // TANTANGAN 4 (ChallengeId 4)
  // -------------------------------------------------------------
  {
    id: 'scene_ch4',
    challengeId: 4,
    title: 'Bab 4: Rahasia Layang-Layang di Angkasa',
    locationName: 'Bukit Angin Layang-Layang',
    bgTheme: 'sky_kite',
    actionButtonLabel: 'KERJAKAN TANTANGAN 4 ➔',
    dialogues: [
      {
        id: 'c4_1',
        speaker: 'Rafi',
        text: 'Wah, angin di bukit ini sepoi-sepoi! Lihat layang-layang tradisional yang terbang tinggi di langit!',
        emotion: 'happy',
        pose: 'standing',
      },
      {
        id: 'c4_2',
        speaker: 'Rafi',
        text: 'Apakah rangka kayu layang-layang yang saling bersilangan tegak lurus itu ada hubungannya dengan Pythagoras?',
        emotion: 'curious' as any,
        pose: 'thinking',
      },
      {
        id: 'c4_3',
        speaker: 'Rafi',
        text: 'Mari kita analisis bersama apakah bangun layang-layang memenuhi unsur teorema Pythagoras!',
        emotion: 'excited',
        pose: 'pointing',
      },
    ],
    successDialogues: [
      {
        id: 'c4_s1',
        speaker: 'Rafi',
        text: 'Tepat sekali! Kedua diagonal saling tegak lurus dan membagi layang-layang menjadi 4 segitiga siku-siku!',
        emotion: 'happy',
        pose: 'arms_crossed',
      },
    ],
  },

  // -------------------------------------------------------------
  // TANTANGAN 5 (ChallengeId 5)
  // -------------------------------------------------------------
  {
    id: 'scene_ch5',
    challengeId: 5,
    title: 'Bab 5: Konstruksi Atap Trapesium',
    locationName: 'Perkampungan Tukang Kayu Tradisional',
    bgTheme: 'room',
    actionButtonLabel: 'KERJAKAN TANTANGAN 5 ➔',
    dialogues: [
      {
        id: 'c5_1',
        speaker: 'Rafi',
        text: 'Kita sampai di perkampungan perajin kayu. Pak Tukang sedang memasang rangka atap trapesium siku-siku!',
        emotion: 'happy',
        pose: 'standing',
      },
      {
        id: 'c5_2',
        speaker: 'Rafi',
        text: 'Untuk mengetahui keliling kayu yang dibutuhkan, kita harus mencari panjang sisi miringnya dulu.',
        emotion: 'thinking',
        pose: 'thinking',
      },
      {
        id: 'c5_3',
        speaker: 'Rafi',
        text: 'Caranya dengan menarik garis tinggi tegak lurus sehingga terbentuk segitiga siku-siku! Ayo kita hitung!',
        emotion: 'serious',
        pose: 'holding_pencil',
      },
    ],
    successDialogues: [
      {
        id: 'c5_s1',
        speaker: 'Rafi',
        text: 'Sisi miring 25 cm dan keliling total 110 cm berhasil ditemukan! Pak Tukang sangat berterima kasih!',
        emotion: 'happy',
        pose: 'victory_jump',
      },
    ],
  },

  // -------------------------------------------------------------
  // TANTANGAN 6 (ChallengeId 6)
  // -------------------------------------------------------------
  {
    id: 'scene_ch6',
    challengeId: 6,
    title: 'Bab 6: Puzzle Geometri Gabungan',
    locationName: 'Gedung Komposit Matematika',
    bgTheme: 'world',
    actionButtonLabel: 'KERJAKAN TANTANGAN 6 ➔',
    dialogues: [
      {
        id: 'c6_1',
        speaker: 'Rafi',
        text: 'Lihat denah lantai gedung ini! Bentuknya gabungan dari persegi panjang dan segitiga siku-siku simetris.',
        emotion: 'curious' as any,
        pose: 'pointing',
      },
      {
        id: 'c6_2',
        speaker: 'Rafi',
        text: 'Kita harus mencari sisi dalam OD terlebih dahulu sebelum bisa menghitung keliling keseluruhan bangun!',
        emotion: 'thinking',
        pose: 'reading_book',
      },
      {
        id: 'c6_3',
        speaker: 'Rafi',
        text: 'Yuk kita pecahkan puzzle komposit ini langkah demi langkah!',
        emotion: 'happy',
        pose: 'standing',
      },
    ],
    successDialogues: [
      {
        id: 'c6_s1',
        speaker: 'Rafi',
        text: 'Hebat! Panjang OD = 8 cm dan keliling persegi panjang OCDE = 28 cm terbukti akurat!',
        emotion: 'excited',
        pose: 'victory_jump',
      },
    ],
  },

  // -------------------------------------------------------------
  // TANTANGAN 7 (ChallengeId 7)
  // -------------------------------------------------------------
  {
    id: 'scene_ch7',
    challengeId: 7,
    title: 'Bab 7: Detektif Sudut Siku-Siku',
    locationName: 'Laboratorium Uji Kebalikan Teorema',
    bgTheme: 'palace',
    actionButtonLabel: 'KERJAKAN TANTANGAN 7 ➔',
    dialogues: [
      {
        id: 'c7_1',
        speaker: 'Rafi',
        text: 'Waktunya menjadi detektif matematika! Di depan kita ada segitiga ABC yang tampak seperti segitiga siku-siku.',
        emotion: 'serious',
        pose: 'standing',
      },
      {
        id: 'c7_2',
        speaker: 'Rafi',
        text: 'Tapi ingat: mata kita bisa tertipu! Kita harus membuktikannya secara matematis dengan Kebalikan Teorema Pythagoras!',
        emotion: 'thinking',
        pose: 'thinking',
      },
      {
        id: 'c7_3',
        speaker: 'Rafi',
        text: 'Jika kuadrat sisi terpanjang tidak sama dengan jumlah kuadrat sisi lainnya, maka segitiga itu BUKAN siku-siku! Mari kita buktikan!',
        emotion: 'excited',
        pose: 'pointing',
      },
    ],
    successDialogues: [
      {
        id: 'c7_s1',
        speaker: 'Rafi',
        text: 'Analisis detektifmu luar biasa! Karena 441 ≠ 389, sudut B terbukti BUKAN siku-siku!',
        emotion: 'happy',
        pose: 'arms_crossed',
      },
    ],
  },

  // -------------------------------------------------------------
  // TANTANGAN 8 (ChallengeId 8)
  // -------------------------------------------------------------
  {
    id: 'scene_ch8',
    challengeId: 8,
    title: 'Bab 8: Kawat Pancang Tiang Antena',
    locationName: 'Puncak Bukit Pemancar Telekomunikasi',
    bgTheme: 'park',
    actionButtonLabel: 'KERJAKAN TANTANGAN 8 ➔',
    dialogues: [
      {
        id: 'c8_1',
        speaker: 'Rafi',
        text: 'Brrr, dingin sekali di puncak bukit ini! Lihat tiang pemancar tinggi yang dipancang tali kawat baja ke tanah.',
        emotion: 'surprised',
        pose: 'standing',
      },
      {
        id: 'c8_2',
        speaker: 'Rafi',
        text: 'Panjang kawat baja dari puncak tiang ke patok adalah 17 meter, dan jarak patok ke kaki tiang 8 meter.',
        emotion: 'thinking',
        pose: 'pointing',
      },
      {
        id: 'c8_3',
        speaker: 'Rafi',
        text: 'Tanpa perlu memanjat tiang berbahaya ini, bisakah kamu menghitung tinggi tiangnya dengan rumus Pythagoras?',
        emotion: 'happy',
        pose: 'presenting',
      },
    ],
    successDialogues: [
      {
        id: 'c8_s1',
        speaker: 'Rafi',
        text: 'Tinggi tiang tepat 15 meter! Berkat Pythagoras, kita bisa mengukur tinggi tanpa perlu memanjat!',
        emotion: 'excited',
        pose: 'victory_jump',
      },
    ],
  },

  // -------------------------------------------------------------
  // TANTANGAN 9 (ChallengeId 9)
  // -------------------------------------------------------------
  {
    id: 'scene_ch9',
    challengeId: 9,
    title: 'Bab 9: Jembatan Gantung Jajargenjang',
    locationName: 'Jembatan Teluk Hangzhou & Gelagar Kabel',
    bgTheme: 'bridge',
    actionButtonLabel: 'KERJAKAN TANTANGAN 9 ➔',
    dialogues: [
      {
        id: 'c9_1',
        speaker: 'Rafi',
        text: 'Megah sekali jembatan kabel pancang ini! Mirip dengan Jembatan Teluk Hangzhou di Tiongkok!',
        emotion: 'surprised',
        pose: 'standing',
      },
      {
        id: 'c9_2',
        speaker: 'Rafi',
        text: 'Struktur gelagar jembatan berbentuk jajargenjang yang ditopang kabel segitiga siku-siku dengan sisi miring 37 cm dan alas 12 cm.',
        emotion: 'thinking',
        pose: 'reading_book',
      },
      {
        id: 'c9_3',
        speaker: 'Rafi',
        text: 'Ayo kita hitung tinggi tiang kabel dan keliling total rangka jembatan tersebut!',
        emotion: 'happy',
        pose: 'pointing',
      },
    ],
    successDialogues: [
      {
        id: 'c9_s1',
        speaker: 'Rafi',
        text: 'Hebat! Tinggi segitiga 35 cm dan keliling total 131 cm! Jembatan berdiri kokoh!',
        emotion: 'happy',
        pose: 'arms_crossed',
      },
    ],
  },

  // -------------------------------------------------------------
  // TANTANGAN 10 (ChallengeId 10)
  // -------------------------------------------------------------
  {
    id: 'scene_ch10',
    challengeId: 10,
    title: 'Bab 10: Gerbang Terakhir Kuil Pythagoras',
    locationName: 'Gerbang Suci Segitiga Bertingkat ABD',
    bgTheme: 'palace',
    actionButtonLabel: 'KERJAKAN TANTANGAN TERAKHIR ➔',
    dialogues: [
      {
        id: 'c10_1',
        speaker: 'Rafi',
        text: 'Kita akhirnya tiba di depan Gerbang Emas Kuil Pythagoras! Ini tantangan penentuan nomor 10!',
        emotion: 'excited',
        pose: 'standing',
      },
      {
        id: 'c10_2',
        speaker: 'Rafi',
        text: 'Kunci gerbang ini tersembunyi pada segmen garis CD di dalam dua segitiga siku-siku bertingkat (ΔABC dan ΔABD).',
        emotion: 'serious',
        pose: 'holding_pencil',
      },
      {
        id: 'c10_3',
        speaker: 'Rafi',
        text: 'Jika kita hitung panjang BC dan panjang BD, kita bisa mengurangkannya untuk membuka gerbang kuil!',
        emotion: 'thinking',
        pose: 'pointing',
      },
    ],
    successDialogues: [
      {
        id: 'c10_s1',
        speaker: 'Rafi',
        text: 'SELESAI! BC = 9 cm, BD = 16 cm, dan panjang CD tepat 7 cm! Pintu gerbang emas kuil Pythagoras terbuka lebar!',
        emotion: 'happy',
        pose: 'victory_jump',
      },
    ],
  },

  // -------------------------------------------------------------
  // EPILOGUE (ChallengeId 11)
  // -------------------------------------------------------------
  {
    id: 'epilogue',
    challengeId: 11,
    title: 'Epilog: Mahkota Sang Penjelajah Pythagoras',
    locationName: 'Puncak Kuil Kehormatan Matematika',
    bgTheme: 'palace',
    actionButtonLabel: 'SELESAIKAN & KE MENU UTAMA 👑',
    dialogues: [
      {
        id: 'ep1',
        speaker: 'Rafi',
        text: 'SELAMAT! Kita berhasil menyelesaikan seluruh 10 tantangan Ayo Berlatih 1 Teorema Pythagoras!',
        emotion: 'excited',
        pose: 'victory_jump',
      },
      {
        id: 'ep2',
        speaker: 'Rafi',
        text: 'Dari membuktikan rumus c² = a² + b², menghitung sisi hilang, aplikasi di jembatan & antena, hingga menguji sudut siku-siku, kamu sungguh luar biasa!',
        emotion: 'happy',
        pose: 'presenting',
      },
      {
        id: 'ep3',
        speaker: 'Rafi',
        text: 'Kini kamu resmi dinobatkan sebagai "Penjelajah Pythagoras Sejati"! Teruslah berpetualang dan mencintai matematika!',
        emotion: 'happy',
        pose: 'arms_crossed',
      },
    ],
  },
];
