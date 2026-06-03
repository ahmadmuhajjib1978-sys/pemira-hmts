"use client";

import Link from "next/link";

export default function TerimaKasihPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center p-6">

      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center">

        <div className="text-7xl mb-6">
          ✅
        </div>

        <h1 className="text-5xl font-bold text-red-700">
          Terima Kasih
        </h1>

        <p className="text-xl text-gray-700 mt-6 leading-relaxed">
          Hak suara Anda telah berhasil direkam
          pada sistem Pemilihan Raya
          Himpunan Mahasiswa Teknik Sipil
          Fakultas Teknik Universitas Riau.
        </p>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mt-8">

          <p className="text-red-700 font-semibold">
            Suara yang telah diberikan
            tidak dapat diubah kembali.
          </p>

        </div>

        <div className="mt-10">

          <Link
            href="/login"
            className="bg-red-700 hover:bg-red-800 text-white px-8 py-4 rounded-xl font-bold text-lg inline-block"
          >
            Kembali ke Login
          </Link>

        </div>

      </div>

    </main>
  );
}