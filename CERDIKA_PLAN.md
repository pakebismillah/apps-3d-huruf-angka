# 🐿️ Rencana Proyek Cerdika: Aplikasi Edukasi Anak Pintar

Dokumen ini merangkum seluruh perencanaan desain, pedoman visual (Design System), karakter maskot, serta tahapan (roadmap) pengembangan aplikasi edukasi "Cerdika". Dokumen ini akan menjadi acuan utama kita selama proses pembuatan aplikasi.

---

## 🎨 1. Pedoman Visual (Design System)

Tujuan utama dari desain Cerdika adalah menciptakan antarmuka yang **premium, ramah anak, dan *bubbly*** (membal dan tidak kaku). Kita menghindari desain kaku dan menggantinya dengan efek tombol membulat, gradasi lembut, dan bayangan 3D (*soft drop shadows*).

### Palet Warna (Color Palette)
Kita menggunakan warna pastel cerah yang tidak membuat mata anak cepat lelah, dikombinasikan dengan warna teks yang tegas.

| Nama Warna | Kode Hex | Penggunaan Utama |
| :--- | :--- | :--- |
| **Vanilla Cream** | `#fdfcf0` | Latar belakang utama (Background) |
| **Soft Blue** | `#E3F2FD` | Kartu materi huruf, latar sekunder |
| **Pastel Yellow** | `#FFF9C4` | Kartu Fakta Unik, sorotan |
| **Mint Green** | `#69F0AE` | Tombol sukses ("Selesai", Benar) |
| **Bright Gold** | `#ffd740` | Tombol interaktif, Bintang penghargaan |
| **Coral Red** | `#ff5252` | Sorotan huruf pada kata, Hapus kanvas |
| **Dark Choco** | `#1c1c1c` | Warna teks utama, batas-batas (*borders*) tipis jika ada |

### Tipografi & Elemen UI
- **Font**: Membulat dan tebal (Bold/Black weight) untuk judul.
- **Tombol**: Semuanya melengkung (minimal `border-radius: 16px` hingga `35px`). Saat ditekan, tombol akan mengecil sedikit (animasi `scale: 0.95`) untuk memberi sensasi membal seperti mainan fisik.
- **Kartu**: Tanpa garis pinggir hitam kaku, diganti dengan efek bayangan yang lebar dan lembut.

---

## 🐾 2. Maskot & Karakter
Karena ini aplikasi anak-anak, kita menyediakan "Teman Belajar" yang bisa dipilih oleh anak saat pertama kali mendaftar akun.

1. 🦁 **Singa Biru** (`#64B5F6`) - Menggambarkan keberanian.
2. 🐼 **Panda Hijau** (`#69F0AE`) - Menggambarkan ketenangan dan fokus.
3. 🐰 **Kelinci Kuning** (`#FFD54F`) - Menggambarkan kelincahan dan keceriaan.
4. 🐱 **Kucing Biru Muda** (`#E3F2FD`) - Menggambarkan rasa ingin tahu.

*Catatan: Maskot ini muncul sebagai avatar di Profil dan Beranda.*

---

## 🗺️ 3. Peta Jalan Pengembangan (Roadmap)

Berikut adalah langkah-langkah yang sedang dan akan kita kerjakan:

### ✅ Fase 1: Fondasi & Sistem Akun (SELESAI)
- [x] Membuat struktur Routing (Profil -> Beranda -> Belajar).
- [x] Membuat halaman pendaftaran anak dengan pemilihan Maskot.
- [x] Mengintegrasikan **Firebase Realtime Database** untuk menyimpan data profil dan bintang secara online agar dapat disinkronkan antar perangkat (cocok untuk sekolah).

### ✅ Fase 2: Navigasi & Tampilan Premium (SELESAI)
- [x] Menyederhanakan UI: Menyembunyikan Navigasi Bawah di dalam halaman belajar agar anak tetap fokus.
- [x] Desain ulang halaman Belajar: Menerapkan gaya *glassmorphism*, gradasi lembut, kartu *bubbly*, dan animasi 3D.
- [x] Fitur Kanvas Tulis: Memastikan anak dapat mencoret huruf (*tracing*) di atas kanvas.

### ⏳ Fase 3: Integrasi Suara & Aset Offline (SEKARANG)
- [ ] Menyiapkan struktur folder `public/assets/audio/`.
- [ ] Menerapkan file MP3 offline untuk pengucapan huruf (contoh: "A").
- [ ] Menerapkan file MP3 offline untuk pengucapan kata (contoh: "A-pel").
- [ ] Memastikan audio berjalan lancar tanpa hambatan loading (tidak perlu *downloading* saat pertama kali aplikasi dibuka agar ringan dan tahan banting).

### 🚀 Fase 4: Modul Matematika & Permainan (AKAN DATANG)
- [ ] Membangun halaman "Belajar Angka" (mirip dengan modul huruf, namun fokus pada perhitungan atau pengenalan bentuk angka).
- [ ] Membangun halaman "Bermain" (kuis interaktif mencocokkan huruf/angka untuk mendapatkan lebih banyak Bintang).
- [ ] Sistem *Leveling* atau Buka Kunci (Membuka huruf/angka baru jika progres sebelumnya sudah selesai).

---

> *"Tujuan Cerdika adalah menciptakan ruang belajar mandiri di mana anak tidak merasa sedang belajar, melainkan sedang bermain dengan buku ajaib."*
