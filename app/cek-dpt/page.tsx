"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function CekDPTPage() {
  const [nim, setNim] =
    useState("");

  const [nama, setNama] =
    useState("");

  const [hasil, setHasil] =
    useState<any>(null);

  const [tidakTerdaftar, setTidakTerdaftar] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  async function cekDPT() {
    if (!nim || !nama) {
      alert(
        "Isi NIM dan Nama Lengkap"
      );
      return;
    }

    setLoading(true);
    setTidakTerdaftar(false);
    setHasil(null);

    const {
      data,
      error,
    } = await supabase
      .from("voters")
      .select("*")
      .eq("nim", nim)
      .ilike(
        "nama",
        nama
      )
      .single();

    if (error || !data) {
      setTidakTerdaftar(
        true
      );

      setLoading(false);
      return;
    }

    setHasil(data);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-red-700 p-6 text-white">

      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">

          <h1 className="text-3xl md:text-5xl font-bold">
            CEK DAFTAR PEMILIH TETAP
          </h1>

          <p className="mt-2 text-lg">
            PEMIRA HMTS FT UNRI
          </p>

        </div>

        {/* Form */}
        <div className="bg-white rounded-[30px] p-8 shadow-2xl">

          <div className="space-y-4">

            <input
              type="text"
              placeholder="Masukkan NIM"
              value={nim}
              onChange={(e) =>
                setNim(
                  e.target.value
                )
              }
              className="w-full border rounded-xl p-4 text-black"
            />

            <input
              type="text"
              placeholder="Nama Lengkap"
              value={nama}
              onChange={(e) =>
                setNama(
                  e.target.value
                )
              }
              className="w-full border rounded-xl p-4 text-black"
            />

            <button
              onClick={
                cekDPT
              }
              className="bg-red-700 hover:bg-red-800 text-white px-8 py-4 rounded-xl font-bold w-full"
            >
              {loading
                ? "Mengecek..."
                : "CEK"}
            </button>

          </div>

        </div>

        {/* Terdaftar */}
        {hasil && (
          <div className="bg-green-100 border-4 border-green-500 rounded-[30px] p-8 mt-8 text-black shadow-2xl">

            <h2 className="text-2xl font-bold text-green-700">
              ✅ Selamat!
              Data kamu terdaftar
              di DPT Pemira HMTS FT UNRI
            </h2>

            <div className="mt-5 space-y-2 text-lg">

              <p>
                <span className="font-bold">
                  Nama:
                </span>{" "}
                {
                  hasil.nama
                }
              </p>

              <p>
                <span className="font-bold">
                  NIM:
                </span>{" "}
                {
                  hasil.nim
                }
              </p>

              <p>
                <span className="font-bold">
                  Status:
                </span>{" "}
                {
                  hasil.status
                }
              </p>

            </div>

          </div>
        )}

        {/* Tidak Terdaftar */}
        {tidakTerdaftar && (
          <div className="bg-red-100 border-4 border-red-500 rounded-[30px] p-8 mt-8 text-black shadow-2xl">

            <h2 className="text-2xl font-bold text-red-700">
              ❌ Waduh...
              Data kamu tidak
              terdaftar di DPT
              Pemira HMTS FT UNRI
            </h2>

            <p className="mt-4 text-lg">
              Jangan khawatir!
              Segera datang ke
              Sekretariat Pemira HMTS
              FT UNRI atau
              Sekretariat HMTS FT UNRI.
            </p>

          </div>
        )}

        <div className="mt-8 text-center">

          <Link href="/">
            <button className="bg-white text-red-700 px-6 py-3 rounded-xl font-bold">
              Kembali
            </button>
          </Link>

        </div>

      </div>

    </main>
  );
}