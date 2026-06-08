"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import { supabase } from "@/lib/supabase";

type DPT = {
  id: number;
  nama: string;
  nim: string;
  password: string;
  sudah_memilih: boolean;
  diblokir: boolean;
};

export default function DPTPage() {
  const [search, setSearch] =
    useState("");

  const [openModal, setOpenModal] =
    useState(false);

  const [selected, setSelected] =
    useState<number[]>([]);

  const [editId, setEditId] =
    useState<number | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [dpt, setDpt] =
    useState<DPT[]>([]);

  const [form, setForm] =
    useState({
      nama: "",
      nim: "",
      password: "",
    });

  useEffect(() => {
    ambilDPT();
  }, []);

  async function ambilDPT() {
    const {
      data,
      error,
    } = await supabase
      .from("voters")
      .select("*")
      .order("id", {
        ascending: true,
      });

    if (!error) {
      setDpt(
        data || []
      );
    }

    setLoading(false);
  }

  function resetForm() {
    setForm({
      nama: "",
      nim: "",
      password: "",
    });

    setEditId(null);
    setOpenModal(false);
  }

  async function handleSave() {
    if (
      !form.nama ||
      !form.nim ||
      !form.password
    ) {
      alert(
        "Lengkapi semua data!"
      );
      return;
    }

    if (editId) {
      const { error } =
        await supabase
          .from("voters")
          .update({
            nama:
              form.nama,
            nim:
              form.nim,
            password:
              form.password,
          })
          .eq(
            "id",
            editId
          );

      if (error) {
        alert(
          "Gagal update data"
        );
        return;
      }

      alert(
        "Data berhasil diupdate"
      );
    } else {
      const { error } =
        await supabase
          .from("voters")
          .insert([
            {
              nama:
                form.nama,
              nim:
                form.nim,
              password:
                form.password,
              sudah_memilih:
                false,
              diblokir:
                false,
            },
          ]);

      if (error) {
        alert(
          error.message
        );
        return;
      }

      alert(
        "DPT berhasil ditambahkan"
      );
    }

    resetForm();
    ambilDPT();
  }

  function handleEdit(
    item: DPT
  ) {
    setEditId(item.id);

    setForm({
      nama: item.nama,
      nim: item.nim,
      password:
        item.password,
    });

    setOpenModal(true);
  }

  async function handleDelete(
    id: number
  ) {
    const yakin =
      confirm(
        "Yakin ingin menghapus data ini?"
      );

    if (!yakin) return;

    await supabase
      .from("voters")
      .delete()
      .eq("id", id);

    ambilDPT();
  }

  async function handleDeleteAll() {
    const yakin =
      confirm(
        "Hapus semua DPT?"
      );

    if (!yakin) return;

    await supabase
      .from("voters")
      .delete()
      .neq("id", 0);

    ambilDPT();
  }

  async function handleBlock() {
    if (
      selected.length ===
      0
    ) {
      alert(
        "Pilih data dulu"
      );
      return;
    }

    await supabase
      .from("voters")
      .update({
        diblokir:
          true,
      })
      .in(
        "id",
        selected
      );

    alert(
      "Pemilih diblokir"
    );

    setSelected([]);
    ambilDPT();
  }

  function handleSelect(
    id: number
  ) {
    if (
      selected.includes(id)
    ) {
      setSelected(
        selected.filter(
          (item) =>
            item !== id
        )
      );
    } else {
      setSelected([
        ...selected,
        id,
      ]);
    }
  }

  function handleSelectAll() {
    if (
      selected.length ===
      dpt.length
    ) {
      setSelected([]);
    } else {
      setSelected(
        dpt.map(
          (item) =>
            item.id
        )
      );
    }
  }

  async function uploadCSV(
    file: File
  ) {
    Papa.parse(file, {
      header: true,
      complete: async (
        results
      ) => {
        const data =
          results.data.map(
            (
              item: any
            ) => ({
              nama:
                item.nama,
              nim:
                item.nim,
              password:
                item.password ||
                item.nim,
              sudah_memilih:
                false,
              diblokir:
                false,
            })
          );

        const {
          error,
        } =
          await supabase
            .from(
              "voters"
            )
            .insert(
              data
            );

        if (error) {
          alert(
            "Upload gagal"
          );
          return;
        }

        alert(
          "CSV berhasil diupload"
        );

        ambilDPT();
      },
    });
  }

  const filteredDPT =
  dpt.filter((item) =>
    (item.nama || "")
      .toLowerCase()
      .includes(
        search.toLowerCase()
      ) ||
    (item.nim || "")
      .includes(search)
  );

  if (loading) {
    return (
      <h1 className="text-center mt-10 text-black">
        Memuat DPT...
      </h1>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-5xl font-bold text-red-700 mb-8">
        Kelola DPT
      </h1>

      <div className="bg-white rounded-[30px] p-5 shadow-lg mb-6">

        <input
          type="text"
          placeholder="Cari Nama / NIM..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="w-full border rounded-2xl p-4 text-black"
        />

      </div>

      <div className="flex flex-wrap gap-4 mb-6">

        <button
          onClick={() =>
            setOpenModal(
              true
            )
          }
          className="bg-red-700 text-white px-8 py-4 rounded-2xl"
        >
          Tambahkan
        </button>

        <label className="bg-blue-600 text-white px-8 py-4 rounded-2xl cursor-pointer">
          Upload CSV
          <input
            type="file"
            hidden
            accept=".csv"
            onChange={(e) => {
              const file =
                e.target
                  .files?.[0];

              if (file)
                uploadCSV(
                  file
                );
            }}
          />
        </label>

        <button
          onClick={
            handleBlock
          }
          className="bg-yellow-500 text-white px-8 py-4 rounded-2xl"
        >
          Blokir
        </button>

        <button
          onClick={
            handleDeleteAll
          }
          className="bg-black text-white px-8 py-4 rounded-2xl"
        >
          Hapus
        </button>

      </div>

      <div className="bg-white rounded-[30px] p-6 shadow-lg overflow-x-auto">

        <table className="w-full">

          <thead>
            <tr className="border-b text-left">
              <th>
                <input
                  type="checkbox"
                  onChange={
                    handleSelectAll
                  }
                />
              </th>
              <th>No</th>
              <th>Nama</th>
              <th>NIM</th>
              <th>Password</th>
              <th>Status</th>
              <th>Opsi</th>
            </tr>
          </thead>

          <tbody>

            {filteredDPT.map(
              (
                item,
                index
              ) => (
                <tr
                  key={
                    item.id
                  }
                  className="border-b"
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(
                        item.id
                      )}
                      onChange={() =>
                        handleSelect(
                          item.id
                        )
                      }
                    />
                  </td>

                  <td>
                    {index + 1}
                  </td>

                  <td>
                    {
                      item.nama
                    }
                  </td>

                  <td>
                    {
                      item.nim
                    }
                  </td>

                  <td>
                    {
                      item.password
                    }
                  </td>

                  <td>
                    {item.diblokir
                      ? "Diblokir"
                      : item.sudah_memilih
                      ? "Sudah Memilih"
                      : "Belum Memilih"}
                  </td>

                  <td className="flex gap-2 py-4">

                    <button
                      onClick={() =>
                        handleEdit(
                          item
                        )
                      }
                      className="bg-blue-600 text-white px-4 py-2 rounded-xl"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          item.id
                        )
                      }
                      className="bg-red-700 text-white px-4 py-2 rounded-xl"
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

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center px-4 z-50">

          <div className="bg-white w-full max-w-xl rounded-[30px] p-8">

            <h2 className="text-3xl font-bold text-red-700 mb-6">
              {editId
                ? "Edit DPT"
                : "Tambah DPT"}
            </h2>

            <div className="space-y-4">

              <input
                type="text"
                placeholder="Nama"
                value={
                  form.nama
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    nama:
                      e.target
                        .value,
                  })
                }
                className="w-full border rounded-2xl p-4 text-black"
              />

              <input
                type="text"
                placeholder="NIM"
                value={
                  form.nim
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    nim:
                      e.target
                        .value,
                  })
                }
                className="w-full border rounded-2xl p-4 text-black"
              />

              <input
                type="text"
                placeholder="Password"
                value={
                  form.password
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    password:
                      e.target
                        .value,
                  })
                }
                className="w-full border rounded-2xl p-4 text-black"
              />

            </div>

            <div className="flex gap-4 mt-6">

              <button
                onClick={
                  handleSave
                }
                className="flex-1 bg-red-700 text-white py-4 rounded-2xl"
              >
                Simpan
              </button>

              <button
                onClick={() =>
                  setOpenModal(
                    false
                  )
                }
                className="flex-1 bg-gray-500 text-white py-4 rounded-2xl"
              >
                Batal
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}