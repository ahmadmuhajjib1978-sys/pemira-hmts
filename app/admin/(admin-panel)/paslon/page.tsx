"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Candidate = {
  id: number;
  nomor_urut: number;
  ketua: string;
  wakil: string;
  visi: string;
  misi: string;
  foto_url: string;
};

export default function PaslonPage() {
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
    useState<File | null>(
      null
    );

  const [preview, setPreview] =
    useState("");

  const [candidates, setCandidates] =
    useState<Candidate[]>([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    ambilPaslon();
  }, []);

  async function ambilPaslon() {
    const {
      data,
      error,
    } = await supabase
      .from("candidates")
      .select("*")
      .order(
        "nomor_urut",
        {
          ascending: true,
        }
      );

    if (error) {
      console.log(error);
      return;
    }

    setCandidates(
      data || []
    );
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

    try {
      setLoading(true);

      const namaFile =
        `${Date.now()}-${foto.name}`;

      const {
        error: uploadError,
      } =
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

        setLoading(
          false
        );

        return;
      }

      const {
        data:
          publicUrlData,
      } = supabase.storage
        .from("paslon")
        .getPublicUrl(
          namaFile
        );

      const fotoUrl =
        publicUrlData.publicUrl;

      const { error } =
        await supabase
          .from(
            "candidates"
          )
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
        console.log(
          error
        );

        alert(
          "Gagal simpan paslon"
        );

        setLoading(
          false
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
      setLoading(false);
    } catch (error) {
      console.log(error);

      alert(
        "Terjadi kesalahan."
      );

      setLoading(false);
    }
  }

  async function hapusPaslon(
    id: number
  ) {
    const yakin =
      confirm(
        "Hapus paslon ini?"
      );

    if (!yakin) return;

    const { error } =
      await supabase
        .from(
          "candidates"
        )
        .delete()
        .eq("id", id);

    if (error) {
      alert(
        "Gagal menghapus paslon"
      );

      return;
    }

    ambilPaslon();
  }

  return (
    <div>

      <h1 className="text-5xl font-bold text-red-700 mb-8">
        Kelola Paslon
      </h1>

      {/* Form */}
      <div className="bg-white rounded-3xl shadow-md p-8 mb-8">

        <h2 className="text-2xl font-bold text-red-700 mb-5">
          Tambah
          Pasangan
          Calon
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          <input
            type="number"
            placeholder="Nomor Urut"
            value={
              nomorUrut
            }
            onChange={(
              e
            ) =>
              setNomorUrut(
                e.target
                  .value
              )
            }
            className="border p-4 rounded-xl text-black"
          />

          <input
            type="text"
            placeholder="Nama Calon Bupati"
            value={ketua}
            onChange={(
              e
            ) =>
              setKetua(
                e.target
                  .value
              )
            }
            className="border p-4 rounded-xl text-black"
          />

          <input
            type="text"
            placeholder="Nama Calon Wakil Bupati"
            value={wakil}
            onChange={(
              e
            ) =>
              setWakil(
                e.target
                  .value
              )
            }
            className="border p-4 rounded-xl text-black"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(
              e
            ) => {
              const file =
                e.target
                  .files?.[0];

              if (
                file
              ) {
                setFoto(
                  file
                );

                setPreview(
                  URL.createObjectURL(
                    file
                  )
                );
              }
            }}
            className="border p-4 rounded-xl text-black"
          />

          <textarea
            placeholder="Visi"
            value={visi}
            onChange={(
              e
            ) =>
              setVisi(
                e.target
                  .value
              )
            }
            className="border p-4 rounded-xl h-36 text-black"
          />

          <textarea
            placeholder="Misi"
            value={misi}
            onChange={(
              e
            ) =>
              setMisi(
                e.target
                  .value
              )
            }
            className="border p-4 rounded-xl h-36 text-black"
          />

        </div>

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-56 rounded-2xl mt-5 border"
          />
        )}

        <button
          onClick={
            simpanPaslon
          }
          disabled={
            loading
          }
          className="mt-6 bg-red-700 text-white px-6 py-3 rounded-xl"
        >
          {loading
            ? "Menyimpan..."
            : "Simpan Paslon"}
        </button>

      </div>

      {/* Data Paslon */}
      <div className="bg-white rounded-3xl shadow-md p-8">

        <h2 className="text-2xl font-bold text-red-700 mb-5">
          Data
          Pasangan
          Calon
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          {candidates.map(
            (
              item
            ) => (
              <div
                key={
                  item.id
                }
                className="border rounded-3xl p-5 shadow-lg"
              >

                <img
                  src={
                    item.foto_url
                  }
                  alt="paslon"
                  className="w-full h-72 object-cover rounded-2xl"
                />

                <h2 className="text-3xl font-bold text-red-700 mt-4">
                  Paslon{" "}
                  {
                    item.nomor_urut
                  }
                </h2>

                <p className="font-bold text-xl mt-2">
                  {
                    item.ketua
                  }
                </p>

                <p className="text-gray-600">
                  {
                    item.wakil
                  }
                </p>

                <button
                  onClick={() =>
                    hapusPaslon(
                      item.id
                    )
                  }
                  className="mt-5 bg-red-700 text-white px-5 py-3 rounded-xl"
                >
                  Hapus
                </button>

              </div>
            )
          )}

        </div>

      </div>

    </div>
  );
}