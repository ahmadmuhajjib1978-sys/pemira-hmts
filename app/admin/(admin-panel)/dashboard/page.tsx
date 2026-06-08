"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [totalDPT, setTotalDPT] =
    useState(0);

  const [sudahMemilih, setSudahMemilih] =
    useState(0);

  const [belumMemilih, setBelumMemilih] =
    useState(0);

  useEffect(() => {
    const dpt =
      JSON.parse(
        localStorage.getItem(
          "dptData"
        ) || "[]"
      );

    const total =
      dpt.length;

    const sudah =
      dpt.filter(
        (item: any) =>
          item.status ===
          "Sudah Memilih"
      ).length;

    setTotalDPT(
      total
    );

    setSudahMemilih(
      sudah
    );

    setBelumMemilih(
      total - sudah
    );
  }, []);

  return (
    <main className="p-8 bg-gray-100 min-h-screen">

      <h1 className="text-5xl font-bold text-red-700 mb-2">
        Dashboard Admin
      </h1>

      <p className="text-gray-600 mb-8">
        Himpunan Mahasiswa
        Teknik Sipil Fakultas
        Teknik Universitas
        Riau
      </p>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white rounded-[30px] p-8 shadow-lg">
          <p className="text-gray-500 text-lg">
            Total DPT
          </p>

          <h2 className="text-6xl font-bold text-red-700 mt-3">
            {totalDPT}
          </h2>
        </div>

        <div className="bg-white rounded-[30px] p-8 shadow-lg">
          <p className="text-gray-500 text-lg">
            Sudah Memilih
          </p>

          <h2 className="text-6xl font-bold text-green-600 mt-3">
            {
              sudahMemilih
            }
          </h2>
        </div>

        <div className="bg-white rounded-[30px] p-8 shadow-lg">
          <p className="text-gray-500 text-lg">
            Belum Memilih
          </p>

          <h2 className="text-6xl font-bold text-orange-500 mt-3">
            {
              belumMemilih
            }
          </h2>
        </div>

      </div>

    </main>
  );
}