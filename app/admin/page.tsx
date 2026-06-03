"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function KelolaPaslon() {
  const router = useRouter();

  const [nomorUrut, setNomorUrut] =
    useState("");

  const [ketua, setKetua] =
    useState("");

  const [wakil, setWakil] =
    useState("");

  const [visi, setVisi] =
    useState("");

  const [misi, setMisi] =
    useState("");

  const [foto, setFoto] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState("");

  const [candidates, setCandidates] =
    useState<any[]>([]);

  useEffect(() => {
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

    ambilPaslon();
  }, []);

  async function ambilPaslon() {
    const { data, error } =
      await supabase
        .from("candidates")
        .select("*")
        .order("nomor_urut", {
          ascending: true,
        });

    if (error) {
      console.log(error);
      return;
    }

    setCandidates(data || []);
  }

  async function simpanPaslon() {
    if (
      !nomorUrut ||
      !ketua ||
      !wakil ||
      !visi ||
      !misi ||
      !foto
    ) {
      alert(
        "Lengkapi semua data"
      );
      return;
    }

    const namaFile =
      `${Date.now()}-${foto.name}`;

    const { error: uploadError } =
      await supabase.storage
        .from("paslon")
        .upload(
          namaFile,
          foto
        );

    if (uploadError) {
      alert(
        "Upload foto gagal"
      );
      return;
    }

    const {
      data: publicUrlData,
    } = supabase.storage
      .from("paslon")
      .getPublicUrl(
        namaFile
      );

    const fotoUrl =
      publicUrlData.publicUrl;

    const { error } =
      await supabase
        .from("candidates")
        .insert([
          {
            nomor_urut:
              nomorUrut,
            ketua,
            wakil,
            visi,
            misi,
            foto_url:
              fotoUrl,
          },
        ]);

    if (error) {
      alert(
        "Gagal simpan paslon"
      );
      return;
    }

    alert(
      "Paslon berhasil ditambahkan"
    );

    setNomorUrut("");
    setKetua("");
    setWakil("");
    setVisi("");
    setMisi("");
    setFoto(null);
    setPreview("");

    ambilPaslon();
  }

  async function hapusPaslon(
    id: number
  ) {
    const yakin = confirm(
      "Hapus paslon ini?"
    );

    if (!yakin) return;

    await supabase
      .from("candidates")
      .delete()
      .eq("id", id);

    ambilPaslon();
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold text-red-700 mb-8">
        Kelola Paslon
      </h1>

      <div className="bg-white p-8 rounded-3xl shadow-xl mb-8">

        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="number"
            placeholder="Nomor Urut"
            value={nomorUrut}
            onChange={(e) =>
              setNomorUrut(
                e.target.value
              )
            }
            className="border rounded-xl p-4 text-black"
          />

          <input
            type="text"
            placeholder="Nama Ketua"
            value={ketua}
            onChange={(e) =>
              setKetua(
                e.target.value
              )
            }
            className="border rounded-xl p-4 text-black"
          />

          <input
            type="text"
            placeholder="Nama Wakil"
            value={wakil}
            onChange={(e) =>
              setWakil(
                e.target.value
              )
            }
            className="border rounded-xl p-4 text-black"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file =
                e.target.files?.[0];

              if (file) {
                setFoto(file);

                setPreview(
                  URL.createObjectURL(
                    file
                  )
                );
              }
            }}
            className="border rounded-xl p-4 text-black"
          />

        </div>

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-64 rounded-xl mt-6 border"
          />
        )}

        <textarea
          placeholder="Visi"
          value={visi}
          onChange={(e) =>
            setVisi(
              e.target.value
            )
          }
          className="w-full border rounded-xl p-4 mt-4 text-black"
          rows={4}
        />

        <textarea
          placeholder="Misi"
          value={misi}
          onChange={(e) =>
            setMisi(
              e.target.value
            )
          }
          className="w-full border rounded-xl p-4 mt-4 text-black"
          rows={5}
        />

        <button
          onClick={
            simpanPaslon
          }
          className="bg-red-700 text-white px-8 py-4 rounded-xl font-bold mt-6"
        >
          Simpan Paslon
        </button>

      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {candidates.map(
          (item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl shadow-xl overflow-hidden"
            >

              <img
                src={
                  item.foto_url
                }
                alt="Paslon"
                className="w-full h-72 object-cover"
              />

              <div className="p-6">

                <h2 className="text-2xl font-bold text-red-700">
                  Paslon{" "}
                  {
                    item.nomor_urut
                  }
                </h2>

                <p className="text-black mt-3">
                  Ketua:
                  {" "}
                  {item.ketua}
                </p>

                <p className="text-black">
                  Wakil:
                  {" "}
                  {item.wakil}
                </p>

                <button
                  onClick={() =>
                    hapusPaslon(
                      item.id
                    )
                  }
                  className="bg-red-600 text-white px-5 py-3 rounded-xl mt-5"
                >
                  Hapus
                </button>

              </div>

            </div>
          )
        )}

      </div>

    </main>
  );
}