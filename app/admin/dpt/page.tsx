"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function KelolaDPT() {
  const router = useRouter();

  const [nim, setNim] = useState("");
  const [nama, setNama] = useState("");
  const [password, setPassword] =
    useState("");

  const [voters, setVoters] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    cekAdmin();
  }, []);

  async function cekAdmin() {
    const admin =
      localStorage.getItem(
        "adminLogin"
      );

    if (!admin) {
      router.push(
        "/admin/login"
      );
      return;
    }

    await ambilPemilih();

    setLoading(false);
  }

  async function ambilPemilih() {
    const { data, error } =
      await supabase
        .from("voters")
        .select("*")
        .order("id", {
          ascending: false,
        });

    if (error) {
      console.log(error);
      return;
    }

    setVoters(data || []);
  }

  async function simpanPemilih() {
    if (
      !nim ||
      !nama ||
      !password
    ) {
      alert(
        "Lengkapi data terlebih dahulu"
      );
      return;
    }

    const { error } =
      await supabase
        .from("voters")
        .insert([
          {
            nim,
            nama,
            password,
            sudah_memilih: false,
          },
        ]);

    if (error) {
      console.log(error);
      alert(error.message);
      return;
    }

    alert(
      "Pemilih berhasil ditambahkan"
    );

    setNim("");
    setNama("");
    setPassword("");

    ambilPemilih();
  }

  async function hapusPemilih(
    id: number
  ) {
    const yakin = confirm(
      "Yakin ingin menghapus pemilih ini?"
    );

    if (!yakin) return;

    const { error } =
      await supabase
        .from("voters")
        .delete()
        .eq("id", id);

    if (error) {
      alert(
        "Gagal menghapus data"
      );
      return;
    }

    ambilPemilih();
  }

  if (loading) {
    return (
      <main className="min-h-screen flex justify-center items-center">
        <h1 className="text-2xl font-bold text-black">
          Memuat...
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-red-700">
          Kelola DPT
        </h1>

        <p className="text-gray-600 mt-2">
          Data Pemilih Tetap Pemira HMTS FT UNRI
        </p>

      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">

        <h2 className="text-2xl font-bold text-black mb-6">
          Tambah Pemilih
        </h2>

        <div className="grid md:grid-cols-3 gap-4">

          <input
            type="text"
            placeholder="Masukkan NIM"
            value={nim}
            onChange={(e) =>
              setNim(
                e.target.value
              )
            }
            className="border border-gray-300 rounded-xl p-4 text-black"
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
            className="border border-gray-300 rounded-xl p-4 text-black"
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
            className="border border-gray-300 rounded-xl p-4 text-black"
          />

        </div>

        <button
          onClick={
            simpanPemilih
          }
          className="bg-red-700 hover:bg-red-800 text-white px-8 py-4 rounded-xl font-bold mt-6"
        >
          Tambah Pemilih
        </button>

      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8 overflow-auto">

        <h2 className="text-2xl font-bold text-black mb-6">
          Daftar Pemilih
        </h2>

        <table className="w-full">

          <thead>
            <tr className="bg-red-700 text-white">

              <th className="p-4">
                NIM
              </th>

              <th className="p-4">
                Nama
              </th>

              <th className="p-4">
                Password
              </th>

              <th className="p-4">
                Status
              </th>

              <th className="p-4">
                Aksi
              </th>

            </tr>
          </thead>

          <tbody>

            {voters.map(
              (item) => (
                <tr
                  key={item.id}
                  className="border-b"
                >

                  <td className="p-4 text-black">
                    {item.nim}
                  </td>

                  <td className="p-4 text-black">
                    {item.nama}
                  </td>

                  <td className="p-4 text-black">
                    {item.password}
                  </td>

                  <td className="p-4 text-black">

                    {item.sudah_memilih
                      ? "Sudah Memilih"
                      : "Belum Memilih"}

                  </td>

                  <td className="p-4">

                    <button
                      onClick={() =>
                        hapusPemilih(
                          item.id
                        )
                      }
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
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