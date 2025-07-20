# 🔮 CHAT BOT Gemini API Server

## ✨ Tentang Proyek Ini

Aplikasi ini bertujuan untuk mempermudah developer dalam mengintegrasikan model generatif Google Gemini ke dalam aplikasi mereka. Daripada harus mengelola SDK dan logika pemrosesan file di sisi klien, server ini menangani semuanya dan menyediakan endpoint API yang siap pakai.

-----

## 🚀 Fitur Utama

  - **📝 Generasi dari Teks**: Hasilkan teks kreatif, ringkasan, atau jawaban berdasarkan prompt teks.
  - **🖼️ Analisis Gambar & Teks**: Kirim gambar beserta prompt teks untuk mendapatkan deskripsi, analisis, atau konten terkait.
  - **📄 Ekstraksi Dokumen & Generasi**: Unggah dokumen (seperti `.txt`, `.md`), server akan mengekstrak teksnya dan menggunakannya sebagai konteks untuk generasi konten.
  - **🎵 Transkripsi Audio & Generasi**: Unggah file audio, server akan mentranskripsikannya menjadi teks (membutuhkan integrasi Speech-to-Text) dan menggunakan hasilnya sebagai prompt untuk Gemini.
  - **🔐 Keamanan**: Gunakan variabel lingkungan (`.env`) untuk menyimpan kunci API Anda dengan aman.
  - **📦 Ringan & Cepat**: Dibangun dengan Express.js untuk performa optimal dan jejak minimal.

-----

## 🛠️ Teknologi yang Digunakan

  - [React.js + Vite](https://vite.dev/guide/)
  - [Node.js](https://nodejs.org/)
  - [Express.js](https://expressjs.com/)
  - [Google Generative AI SDK](https://github.com/google/generative-ai-js)
  - [Multer](https://github.com/expressjs/multer) untuk menangani unggahan file
  - [Dotenv](https://github.com/motdotla/dotenv) untuk manajemen variabel lingkungan

-----

## 🏁 Memulai

Ikuti langkah-langkah ini untuk menjalankan server secara lokal di mesin Anda.

### Prasyarat

  - [Node.js](https://nodejs.org/en/download/) (disarankan versi 18 atau lebih baru)
  - NPM atau Yarn

### Instalasi

**Clone repositori ini:**

    ```sh
    git clone https://github.com/Ahmadsani31/chatbot-gemini.git
    ```
### Config Backend
1.  **Masuk ke direktori proyek:**

    ```sh
    cd chatbot-gemini/backend
    ```

2.  **Install semua dependensi:**

    ```sh
    npm install
    ```

3.  **Konfigurasi Variabel Lingkungan:**

      - Buat salinan dari file `.env.example` dan beri nama `.env`.
        ```sh
        cp .env.example .env
        ```
      - Buka file `.env` dan tambahkan **Gemini API Key** Anda.
        ```env
        # Kunci API dari Google AI Studio
        GEMINI_API_KEY="MASUKKAN_KUNCI_API_ANDA_DI_SINI"

        # Port untuk server (opsional, default 3000)
        PORT=3000
        ```
        > Dapatkan API Key Anda dari [Google AI Studio](https://makersuite.google.com/app/apikey).

5.  **Jalankan Server:**

    ```sh
    npm start
    ```

    Server sekarang akan berjalan di `http://localhost:3000`.

-----

### Config Frontend
1.  **Masuk ke direktori proyek:**

    ```sh
    cd chatbot-gemini/frontend
    ```

2.  **Install semua dependensi:**

    ```sh
    npm install
    ```


3.  **Jalankan :**

    ```sh
     npm run dev 
    ```

    Server sekarang akan berjalan di `http://localhost:8080`.

-----

## 💡 Penggunaan API

Berikut adalah detail untuk setiap endpoint yang tersedia.

### 1\. Generate from Text

Menghasilkan konten berdasarkan input teks.

  - **Endpoint**: `/api/generate-from-text`
  - **Metode**: `POST`
  - **Body Request**: `JSON`
    ```json
    {
      "prompt": "Jelaskan secara singkat apa itu Node.js"
    }
    ```
  - **Contoh `curl`**:
    ```sh
    curl -X POST http://localhost:3000/api/generate-from-text \
    -H "Content-Type: application/json" \
    -d '{"prompt": "Jelaskan secara singkat apa itu Node.js"}'
    ```
  - **Contoh Respon Sukses**:
    ```json
    {
      "success": true,
      "data": "Node.js adalah lingkungan runtime JavaScript sisi server yang dibangun di atas mesin JavaScript V8 Chrome..."
    }
    ```

### 2\. Generate from Image

Menganalisis gambar dan menghasilkan konten berdasarkan prompt tambahan.

  - **Endpoint**: `/api/generate-from-image`
  - **Metode**: `POST`
  - **Body Request**: `multipart/form-data`
      - `prompt` (text): Teks pertanyaan atau instruksi terkait gambar.
      - `image` (file): File gambar yang akan diunggah (`.png`, `.jpg`, `.jpeg`, `.webp`).
  - **Contoh `curl`**:
    ```sh
    curl -X POST http://localhost:3000/api/generate-from-image \
    -F "prompt=Ada makanan apa saja di dalam gambar ini?" \
    -F "image=@/path/to/your/image.jpg"
    ```
  - **Contoh Respon Sukses**:
    ```json
    {
      "success": true,
      "data": "Di dalam gambar ini, terlihat ada beberapa jenis makanan: semangkuk salad, sepiring pasta, dan segelas jus jeruk."
    }
    ```

### 3\. Generate from Document

Mengekstrak teks dari file dokumen dan menggunakannya sebagai konteks.

  - **Endpoint**: `/api/generate-from-document`
  - **Metode**: `POST`
  - **Body Request**: `multipart/form-data`
      - `prompt` (text): Pertanyaan Anda (misal: "Buat ringkasan dari dokumen ini").
      - `document` (file): File dokumen yang didukung (misal: `.txt`).
  - **Contoh `curl`**:
    ```sh
    curl -X POST http://localhost:3000/api/generate-from-document \
    -F "prompt=Buat ringkasan 3 poin utama dari dokumen ini." \
    -F "document=@/path/to/your/document.txt"
    ```
  - **Contoh Respon Sukses**:
    ```json
    {
      "success": true,
      "data": "Berikut adalah 3 poin utama dari dokumen:\n1. Pentingnya inovasi teknologi.\n2. Dampak AI terhadap pasar kerja.\n3. Strategi adaptasi di era digital."
    }
    ```

### 4\. Generate from Audio

Mentranskripsi audio menjadi teks, lalu menggunakan teks tersebut untuk generasi konten. *(Catatan: Fungsionalitas ini memerlukan implementasi tambahan untuk Speech-to-Text)*.

  - **Endpoint**: `/api/generate-from-audio`
  - **Metode**: `POST`
  - **Body Request**: `multipart/form-data`
      - `prompt` (text): Instruksi untuk Gemini setelah audio ditranskripsi. (Contoh: "Buat daftar tugas dari rekaman suara ini").
      - `audio` (file): File audio (`.mp3`, `.wav`).
  - **Contoh `curl`**:
    ```sh
    curl -X POST http://localhost:3000/api/generate-from-audio \
    -F "prompt=Buat ringkasan dari transkrip audio ini" \
    -F "audio=@/path/to/your/meeting.mp3"
    ```
  - **Contoh Respon Sukses**:
    ```json
    {
      "success": true,
      "transcription": "Baik, rapat hari ini membahas tentang target kuartal depan...",
      "data": "Ringkasan rapat: Diskusi berfokus pada penetapan target penjualan untuk kuartal berikutnya, dengan penekanan pada ekspansi pasar di wilayah timur."
    }
    ```

-----

## 🤝 Kontribusi

Kontribusi Anda sangat kami hargai\! Jika Anda ingin berkontribusi, silakan:

1.  **Fork** repositori ini.
2.  Buat **Branch** baru (`git checkout -b fitur/FiturBaru`).
3.  **Commit** perubahan Anda (`git commit -m 'Menambahkan FiturBaru'`).
4.  **Push** ke Branch (`git push origin fitur/FiturBaru`).
5.  Buka sebuah **Pull Request**.

-----

## 📄 Lisensi

Proyek ini didistribusikan di bawah Lisensi MIT. Lihat file `LICENSE` untuk informasi lebih lanjut.

-----

Dibuat dengan ❤️ dan secangkir kopi.