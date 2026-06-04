"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Papa from "papaparse";

export default function DPTPage() {
  const [voters, setVoters] =
    useState<any[]>([]);

  const [nim, setNim] =
    useState("");

  const [nama, setNama] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    ambilVoters();
  }, []);

  async function ambilVoters() {
    const { data } =
      await supabase
        .from("voters")
        .select("*")
        .order("nim", {
          ascending: true,
        });

    setVoters(data || []);
  }

  async function tambahPemilih() {
    if (
      !nim ||
      !nama ||
      !password
    ) {
      alert(
        "Lengkapi semua data!"
      );
      return;
    }

    setLoading(true);

    const { error } =
      await supabase
        .from("voters")
        .insert([
          {
            nim,
            nama,
            password,
            sudah_memilih:
              false,
          },
        ]);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert(
      "Pemilih berhasil ditambahkan!"
    );

    setNim("");
    setNama("");
    setPassword("");

    ambilVoters();
  }

  async function hapusPemilih(
    id: number
  ) {
    const yakin = confirm(
      "Yakin ingin menghapus pemilih ini?"
    );

    if (!yakin) return;

    await supabase
      .from("voters")
      .delete()
      .eq("id", id);

    ambilVoters();
  }

  async function uploadCSV(
    event: any
  ) {
    const file =
      event.target.files[0];

    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

      complete: async (
        results
      ) => {
        const data =
          results.data.map(
            (
              item: any
            ) => ({
              nim:
                item.nim ||
                item.NIM,
              nama:
                item.nama ||
                item.Nama,
              password:
                item.password ||
                item.Password,
              sudah_memilih:
                false,
            })
          );

        const { error } =
          await supabase
            .from(
              "voters"
            )
            .insert(data);

        if (error) {
          alert(
            error.message
          );
          return;
        }

        alert(
          "Upload CSV berhasil!"
        );

        ambilVoters();
      },
    });
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">

      {/* Header */}
      <div className="mb-8">

        <h1 className="text-5xl font-bold text-red-700">
          Kelola DPT
        </h1>

        <p className="text-gray-700 mt-2 text-lg">
          Data Pemilih Tetap
          Pemira HMTS FT UNRI
        </p>

      </div>

      {/* Form Tambah */}
      <div className="bg-white rounded-[30px] shadow-xl p-8">

        <h2 className="text-3xl font-bold text-black mb-6">
          Tambah Pemilih
        </h2>

        <div className="grid md:grid-cols-3 gap-5">

          <input
            type="text"
            placeholder="Masukkan NIM"
            value={nim}
            onChange={(e) =>
              setNim(
                e.target.value
              )
            }
            className="border border-gray-300 p-4 rounded-2xl bg-white text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
          />

          <input
            type="text"
            placeholder="Masukkan Nama"
            value={nama}
            onChange={(e) =>
              setNama(
                e.target.value
              )
            }
            className="border border-gray-300 p-4 rounded-2xl bg-white text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
          />

          <input
            type="text"
            placeholder="Masukkan Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="border border-gray-300 p-4 rounded-2xl bg-white text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
          />

        </div>

        <div className="flex flex-wrap gap-4 mt-8">

          <button
            onClick={
              tambahPemilih
            }
            disabled={
              loading
            }
            className="bg-red-700 hover:bg-red-800 text-white px-8 py-4 rounded-2xl font-bold text-lg transition"
          >
            {loading
              ? "Memproses..."
              : "Tambah Pemilih"}
          </button>

          <label className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-bold text-lg cursor-pointer transition">

            Upload CSV DPT

            <input
              type="file"
              accept=".csv"
              hidden
              onChange={
                uploadCSV
              }
            />
          </label>

        </div>

      </div>

      {/* Tabel */}
      <div className="bg-white rounded-[30px] shadow-xl p-8 mt-10 overflow-auto">

        <h2 className="text-3xl font-bold text-black mb-6">
          Daftar Pemilih
        </h2>

        <table className="w-full border-collapse">

          <thead>

            <tr className="bg-red-700 text-white">

              <th className="p-5 text-center">
                NIM
              </th>

              <th className="p-5 text-center">
                Nama
              </th>

              <th className="p-5 text-center">
                Password
              </th>

              <th className="p-5 text-center">
                Status
              </th>

              <th className="p-5 text-center">
                Aksi
              </th>

            </tr>

          </thead>

          <tbody>

            {voters.map(
              (item) => (
                <tr
                  key={
                    item.id
                  }
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >

                  <td className="p-5 text-black font-medium text-center">
                    {item.nim}
                  </td>

                  <td className="p-5 text-black font-medium text-center">
                    {item.nama}
                  </td>

                  <td className="p-5 text-black font-medium text-center">
                    {
                      item.password
                    }
                  </td>

                  <td className="p-5 text-center">

                    <span
                      className={`font-bold ${
                        item.sudah_memilih
                          ? "text-green-600"
                          : "text-orange-500"
                      }`}
                    >
                      {item.sudah_memilih
                        ? "Sudah Memilih"
                        : "Belum Memilih"}
                    </span>

                  </td>

                  <td className="p-5 text-center">

                    <button
                      onClick={() =>
                        hapusPemilih(
                          item.id
                        )
                      }
                      className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl font-semibold transition"
                    >
                      Hapus
                    </button>

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </main>
  );
}