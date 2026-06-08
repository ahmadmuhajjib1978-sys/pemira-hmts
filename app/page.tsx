import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-red-700 text-white flex flex-col items-center justify-center p-6">

      {/* Konten utama */}
      <h1 className="text-5xl font-bold text-center">
        PEMILIHAN RAYA JURUSAN HMTS FT UNRI
      </h1>

      <p className="mt-4 text-xl text-center">
        Periode 2026/2027
      </p>

      <p className="mt-2 text-center max-w-xl">
        Selamat datang pada sistem E-Voting Pemilihan Calon Bupati dan
        Calon Wakil Bupati Himpunan Mahasiswa Teknik Sipil Fakultas Teknik
        Universitas Riau.
      </p>

      {/* Tombol login pemilih */}
      <Link href="/login">
        <button className="mt-8 bg-white text-red-700 px-6 py-3 rounded-lg font-semibold hover:scale-105 transition cursor-pointer shadow-lg">
          Login Pemilih
        </button>
      </Link>

      {/* Login admin pojok kiri bawah */}
      <div className="absolute bottom-5 left-5">
        <p className="text-sm text-white mb-2">
          Administrator E-Voting PPRJ? silahkan login segera!
        </p>

        <Link href="/admin/login">
          <button className="bg-white text-red-700 px-4 py-2 rounded-lg font-semibold hover:scale-105 transition cursor-pointer shadow-lg text-sm">
            Login Admin
          </button>
        </Link>
      </div>

    </main>
  );
}