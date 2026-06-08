"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Admin = {
  id: number;
  nama: string;
  nim: string;
  username: string;
  password: string;
  ktm: string;
};

export default function AdminUserPage() {
  const [admins, setAdmins] =
    useState<Admin[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [openModal, setOpenModal] =
    useState(false);

  const [editId, setEditId] =
    useState<number | null>(
      null
    );

  const [search, setSearch] =
    useState("");

  const [form, setForm] =
    useState({
      nama: "",
      nim: "",
      username: "",
      password: "",
      ktm: "",
    });

  useEffect(() => {
    ambilAdmin();
  }, []);

  async function ambilAdmin() {
    const {
      data,
      error,
    } = await supabase
      .from("admins")
      .select("*")
      .order("id", {
        ascending: true,
      });

    if (!error) {
      setAdmins(
        data || []
      );
    }

    setLoading(false);
  }

  function resetForm() {
    setForm({
      nama: "",
      nim: "",
      username: "",
      password: "",
      ktm: "",
    });

    setEditId(null);
    setOpenModal(false);
  }

  async function handleSave() {
    if (
      !form.nama ||
      !form.nim ||
      !form.username ||
      !form.password
    ) {
      alert(
        "Lengkapi semua data admin!"
      );
      return;
    }

    if (editId) {
      const { error } =
        await supabase
          .from("admins")
          .update({
            ...form,
          })
          .eq(
            "id",
            editId
          );

      if (error) {
        alert(
          "Gagal update admin"
        );
        return;
      }

      alert(
        "Admin berhasil diupdate"
      );
    } else {
      const { error } =
        await supabase
          .from("admins")
          .insert([
            form,
          ]);

      if (error) {
        alert(
          error.message
        );
        return;
      }

      alert(
        "Admin berhasil ditambahkan"
      );
    }

    resetForm();
    ambilAdmin();
  }

  function handleEdit(
    item: Admin
  ) {
    setEditId(item.id);

    setForm({
      nama: item.nama,
      nim: item.nim,
      username:
        item.username,
      password:
        item.password,
      ktm: item.ktm,
    });

    setOpenModal(true);
  }

  async function handleDelete(
    id: number
  ) {
    const yakin =
      confirm(
        "Yakin ingin menghapus admin ini?"
      );

    if (!yakin) return;

    await supabase
      .from("admins")
      .delete()
      .eq("id", id);

    ambilAdmin();
  }

  const filteredAdmins =
    admins.filter(
      (item) =>
        item.nama
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        item.username
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        item.nim.includes(
          search
        )
    );

  if (loading) {
    return (
      <h1 className="text-center mt-10 text-black">
        Memuat data admin...
      </h1>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-5xl font-bold text-red-700 mb-8">
        Kelola Admin
      </h1>

      {/* SEARCH + BUTTON */}
      <div className="bg-white p-5 rounded-[30px] shadow-lg mb-8">

        <div className="flex flex-col md:flex-row gap-4">

          <input
            type="text"
            placeholder="Cari admin..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="flex-1 border rounded-2xl p-4 text-black"
          />

          <button
            onClick={() =>
              setOpenModal(
                true
              )
            }
            className="bg-red-700 hover:bg-red-800 text-white px-8 py-4 rounded-2xl font-bold"
          >
            Tambah Admin
          </button>

        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[30px] shadow-lg overflow-x-auto p-6">

        <table className="w-full">

          <thead>
            <tr className="border-b text-left text-gray-700">
              <th className="py-4">
                No
              </th>
              <th>
                Nama
              </th>
              <th>
                NIM
              </th>
              <th>
                Username
              </th>
              <th>
                Password
              </th>
              <th>
                KTM
              </th>
              <th>
                Opsi
              </th>
            </tr>
          </thead>

          <tbody>

            {filteredAdmins.map(
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
                  <td className="py-5">
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
                      item.username
                    }
                  </td>

                  <td>
                    {
                      item.password
                    }
                  </td>

                  <td>
                    {item.ktm ? (
                      <a
                        href={
                          item.ktm
                        }
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        Lihat KTM
                      </a>
                    ) : (
                      "-"
                    )}
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
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">

          <div className="bg-white w-full max-w-2xl rounded-[30px] p-8 shadow-2xl">

            <h2 className="text-3xl font-bold text-red-700 mb-6">
              {editId
                ? "Edit Admin"
                : "Tambah Admin"}
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <input
                type="text"
                placeholder="Nama Lengkap"
                value={form.nama}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nama:
                      e.target.value,
                  })
                }
                className="border rounded-2xl p-4 text-black"
              />

              <input
                type="text"
                placeholder="NIM"
                value={form.nim}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nim:
                      e.target.value,
                  })
                }
                className="border rounded-2xl p-4 text-black"
              />

              <input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={(e) =>
                  setForm({
                    ...form,
                    username:
                      e.target.value,
                  })
                }
                className="border rounded-2xl p-4 text-black"
              />

              <input
                type="text"
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password:
                      e.target.value,
                  })
                }
                className="border rounded-2xl p-4 text-black"
              />

            </div>

            <div className="mt-5">

              <label className="block text-black font-semibold mb-2">
                Upload KTM
              </label>

              <input
                type="text"
                placeholder="Masukkan link KTM (opsional)"
                value={form.ktm}
                onChange={(e) =>
                  setForm({
                    ...form,
                    ktm:
                      e.target.value,
                  })
                }
                className="w-full border rounded-2xl p-4 text-black"
              />

            </div>

            <div className="flex gap-4 mt-8">

              <button
                onClick={
                  handleSave
                }
                className="flex-1 bg-red-700 hover:bg-red-800 text-white py-4 rounded-2xl font-bold"
              >
                Simpan
              </button>

              <button
                onClick={() =>
                  setOpenModal(
                    false
                  )
                }
                className="flex-1 bg-gray-500 text-white py-4 rounded-2xl font-bold"
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