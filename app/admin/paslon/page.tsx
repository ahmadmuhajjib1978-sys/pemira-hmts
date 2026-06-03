"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

type Candidate = {
  id: number;
  nomor_urut: number;
  ketua: string;
  wakil: string;
  foto_url: string;
  visi: string;
  misi: string;
};

export default function KelolaPaslon() {
  const [nomorUrut, setNomorUrut] = useState("");
  const [ketua, setKetua] = useState("");
  const [wakil, setWakil] = useState("");
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState("");

  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState("");

  const [candidates, setCandidates] = useState<Candidate[]>([]);

  async function ambilPaslon() {
    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .order("nomor_urut", { ascending: true });

    if (error) {
      console.log(error);
      return;
    }

    setCandidates(data || []);
  }

  useEffect(() => {
    ambilPaslon();
  }, []);

  async function simpanPaslon() {
    if (
      !nomorUrut ||
      !ketua ||
      !wakil ||
      !visi ||
      !misi ||
      !fotoFile
    ) {
      alert("Lengkapi seluruh data paslon");
      return;
    }

    const fileExt = fotoFile.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;

    const uploadResult = await supabase.storage
      .from("paslon")
      .upload(fileName, fotoFile);

    if (uploadResult.error) {
      alert(uploadResult.error.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("paslon")
      .getPublicUrl(fileName);

    const { error } = await supabase
      .from("candidates")
      .insert([
        {
          nomor_urut: Number(nomorUrut),
          ketua,
          wakil,
          foto_url: publicUrl,
          visi,
          misi,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Paslon berhasil disimpan");

    setNomorUrut("");
    setKetua("");
    setWakil("");
    setVisi("");
    setMisi("");
    setFotoFile(null);
    setPreviewFoto("");

    ambilPaslon();
  }

  async function hapusPaslon(id: number) {
    const konfirmasi = confirm(
      "Yakin ingin menghapus paslon ini?"
    );

    if (!konfirmasi) return;

    const { error } = await supabase
      .from("candidates")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    ambilPaslon();
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold text-red-700 mb-6">
        Kelola Paslon
      </h1>

      <div className="bg-white p-6 rounded-xl shadow">

        <label className="block text-black mb-2">
          Nomor Urut
        </label>

        <input
          value={nomorUrut}
          onChange={(e) => setNomorUrut(e.target.value)}
          className="w-full border p-3 rounded mb-4 text-black"
        />

        <label className="block text-black mb-2">
          Nama Ketua
        </label>

        <input
          value={ketua}
          onChange={(e) => setKetua(e.target.value)}
          className="w-full border p-3 rounded mb-4 text-black"
        />

        <label className="block text-black mb-2">
          Nama Wakil
        </label>

        <input
          value={wakil}
          onChange={(e) => setWakil(e.target.value)}
          className="w-full border p-3 rounded mb-4 text-black"
        />

        <label className="block text-black mb-2">
          Foto Paslon
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (!file) return;

            setFotoFile(file);
            setPreviewFoto(
              URL.createObjectURL(file)
            );
          }}
          className="mb-4 text-black"
        />

        {previewFoto && (
          <img
            src={previewFoto}
            alt="Preview"
            className="w-48 h-48 object-cover rounded-xl mb-4"
          />
        )}

        <label className="block text-black mb-2">
          Visi
        </label>

        <textarea
          value={visi}
          onChange={(e) => setVisi(e.target.value)}
          className="w-full border p-3 rounded mb-4 text-black"
          rows={3}
        />

        <label className="block text-black mb-2">
          Misi
        </label>

        <textarea
          value={misi}
          onChange={(e) => setMisi(e.target.value)}
          className="w-full border p-3 rounded mb-4 text-black"
          rows={5}
        />

        <button
          onClick={simpanPaslon}
          className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-lg"
        >
          Simpan Paslon
        </button>

      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

        {candidates.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow overflow-hidden"
          >

            <img
              src={item.foto_url}
              alt={item.ketua}
              className="w-full h-64 object-cover"
            />

            <div className="p-4">

              <h2 className="text-2xl font-bold text-red-700">
                Paslon {item.nomor_urut}
              </h2>

              <p className="text-black mt-2">
                <strong>Ketua:</strong> {item.ketua}
              </p>

              <p className="text-black">
                <strong>Wakil:</strong> {item.wakil}
              </p>

              <button
                onClick={() =>
                  hapusPaslon(item.id)
                }
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Hapus
              </button>

            </div>

          </div>
        ))}

      </div>

    </main>
  );
}