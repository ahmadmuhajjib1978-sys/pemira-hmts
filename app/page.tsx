import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-red-700 text-white flex flex-col items-center justify-center p-6">

      {/* Judul */}
      <h1 className="text-4xl md:text-6xl font-bold text-center">
        PEMILIHAN RAYA JURUSAN HMTS FT UNRI
      </h1>

      <p className="mt-4 text-xl text-center">
        Periode 2026/2027
      </p>

      <p className="mt-2 text-center max-w-2xl text-sm md:text-lg">
        Selamat datang pada sistem E-Voting Pemilihan
        Calon Bupati dan Calon Wakil Bupati
        Himpunan Mahasiswa Teknik Sipil
        Fakultas Teknik Universitas Riau.
      </p>

      {/* Tombol */}
      <div className="flex flex-col md:flex-row gap-4 mt-8">

        <Link href="/login">
          <button className="bg-white text-red-700 px-8 py-4 rounded-xl font-bold hover:scale-105 transition shadow-xl">
            Login Pemilih
          </button>
        </Link>

        <Link href="/cek-dpt">
          <button className="bg-yellow-400 text-red-700 px-8 py-4 rounded-xl font-bold hover:scale-105 transition shadow-xl">
            Cek DPT
          </button>
        </Link>

      </div>

      {/* Login Admin */}
      <div className="absolute bottom-5 left-5">

        <p className="text-sm text-white mb-2">
          Administrator E-Voting PPRJ?
          silahkan login segera!
        </p>

        <Link href="/admin/login">
          <button className="bg-white text-red-700 px-4 py-2 rounded-lg font-semibold hover:scale-105 transition shadow-lg text-sm">
            Login Admin
          </button>
        </Link>

      </div>

    </main>
  );
}