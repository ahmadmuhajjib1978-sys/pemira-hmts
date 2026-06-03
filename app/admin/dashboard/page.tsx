"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function DashboardAdmin() {
  const router = useRouter();

  const [totalDPT, setTotalDPT] =
    useState(0);

  const [sudahMemilih, setSudahMemilih] =
    useState(0);

  const [belumMemilih, setBelumMemilih] =
    useState(0);

  useEffect(() => {
    const admin =
      localStorage.getItem(
        "adminLogin"
      );

    if (!admin) {
      router.push("/admin/login");
      return;
    }

    ambilStatistik();
  }, []);

  async function ambilStatistik() {
    const { data: voters } =
      await supabase
        .from("voters")
        .select("*");

    if (!voters) return;

    const total =
      voters.length;

    const sudah =
      voters.filter(
        (v) =>
          v.sudah_memilih === true
      ).length;

    const belum =
      total - sudah;

    setTotalDPT(total);
    setSudahMemilih(sudah);
    setBelumMemilih(belum);
  }

  function logoutAdmin() {
    localStorage.removeItem(
      "adminLogin"
    );

    alert(
      "Logout berhasil"
    );

    router.push(
      "/admin/login"
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <aside className="w-72 bg-red-900 text-white p-6 shadow-2xl">

        <h1 className="text-3xl font-bold mb-8">
          PEMIRA HMTS
        </h1>

        <nav className="space-y-3">

          <Link
            href="/admin/dashboard"
            className="block w-full p-4 rounded-xl bg-red-700 hover:bg-red-600 transition"
          >
            Dashboard
          </Link>

          <Link
            href="/admin/dpt"
            className="block w-full p-4 rounded-xl hover:bg-red-700 transition"
          >
            Kelola DPT
          </Link>

          <Link
            href="/admin/paslon"
            className="block w-full p-4 rounded-xl hover:bg-red-700 transition"
          >
            Kelola Paslon
          </Link>

          <Link
            href="/admin/hasil"
            className="block w-full p-4 rounded-xl hover:bg-red-700 transition"
          >
            Hasil Suara
          </Link>

          <button
            onClick={
              logoutAdmin
            }
            className="w-full text-left p-4 rounded-xl bg-black hover:bg-gray-900 transition mt-10"
          >
            Logout
          </button>

        </nav>

      </aside>

      {/* Content */}
      <section className="flex-1 p-10">

        <h1 className="text-4xl font-bold text-red-800">
          Dashboard Admin
        </h1>

        <p className="text-gray-600 mt-2">
          Himpunan Mahasiswa Teknik Sipil
          Fakultas Teknik Universitas Riau
        </p>

        {/* Statistik */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">

          <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-gray-500">
              Total DPT
            </h2>

            <p className="text-5xl font-bold text-red-700 mt-3">
              {totalDPT}
            </p>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-gray-500">
              Sudah Memilih
            </h2>

            <p className="text-5xl font-bold text-green-600 mt-3">
              {sudahMemilih}
            </p>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-gray-500">
              Belum Memilih
            </h2>

            <p className="text-5xl font-bold text-orange-500 mt-3">
              {belumMemilih}
            </p>

          </div>

        </div>

        {/* Menu Cepat */}
        <div className="grid md:grid-cols-2 gap-6 mt-10">

          <Link
            href="/admin/dpt"
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition"
          >

            <h2 className="text-2xl font-bold text-red-700">
              Kelola DPT
            </h2>

            <p className="text-gray-600 mt-3">
              Tambah, hapus, edit
              dan upload data pemilih tetap.
            </p>

          </Link>

          <Link
            href="/admin/paslon"
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition"
          >

            <h2 className="text-2xl font-bold text-red-700">
              Kelola Paslon
            </h2>

            <p className="text-gray-600 mt-3">
              Tambahkan pasangan calon,
              foto, visi dan misi.
            </p>

          </Link>

          <Link
            href="/admin/hasil"
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition"
          >

            <h2 className="text-2xl font-bold text-red-700">
              Hasil Voting
            </h2>

            <p className="text-gray-600 mt-3">
              Monitoring realtime
              hasil Pemira HMTS FT UNRI.
            </p>

          </Link>

        </div>

      </section>

    </main>
  );
}