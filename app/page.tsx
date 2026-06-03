export default function Home() {
  return (
    <main className="min-h-screen bg-red-700 text-white flex flex-col items-center justify-center p-6">
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

      <button className="mt-8 bg-white text-red-700 px-6 py-3 rounded-lg font-semibold">
        Login Pemilih
      </button>
    </main>
  );
}