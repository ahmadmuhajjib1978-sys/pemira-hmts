"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function VotingPage() {
  const [candidates, setCandidates] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  useEffect(() => {
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
    setLoading(false);
  }

  async function pilihPaslon(
    id: number
  ) {
    const yakin = confirm(
      "Apakah Anda yakin memilih pasangan calon ini?"
    );

    if (!yakin) return;

    setSubmitting(true);

    const nim =
      localStorage.getItem(
        "nim"
      );

    if (!nim) {
      alert(
        "Sesi login tidak ditemukan"
      );

      setSubmitting(false);

      window.location.href =
        "/login";

      return;
    }

    // cek voter
    const {
      data: voter,
    } = await supabase
      .from("voters")
      .select("*")
      .eq("nim", nim)
      .single();

    if (!voter) {
      alert(
        "Data pemilih tidak ditemukan"
      );

      setSubmitting(false);
      return;
    }

    // anti double vote
    if (
      voter.sudah_memilih
    ) {
      alert(
        "Anda sudah menggunakan hak suara."
      );

      window.location.href =
        "/terimakasih";

      return;
    }

    // simpan vote
    const { error } =
      await supabase
        .from("votes")
        .insert([
          {
            voter_nim:
              nim,
            candidate_id:
              id,
          },
        ]);

    if (error) {
      console.log(error);
      alert(
        error.message
      );

      setSubmitting(false);
      return;
    }

    // update voter
    await supabase
      .from("voters")
      .update({
        sudah_memilih:
          true,
      })
      .eq("nim", nim);

    // hapus session
    localStorage.removeItem(
      "nim"
    );

    alert(
      "Voting berhasil!"
    );

    // redirect halaman terimakasih
    window.location.href =
      "/terimakasih";
  }

  if (loading) {
    return (
      <main className="min-h-screen flex justify-center items-center bg-gray-100">
        <h1 className="text-2xl font-bold text-black">
          Memuat Pasangan Calon...
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 md:px-8 py-8">

      {/* Header */}
      <div className="text-center mb-10">

        <h1 className="text-3xl md:text-5xl font-bold text-red-800">
          PEMILIHAN RAYA HMTS FT UNRI
        </h1>

        <p className="text-gray-600 mt-3 text-sm md:text-lg px-2">
          Silakan pilih pasangan calon Bupati dan Wakil Bupati
          Himpunan Mahasiswa Teknik Sipil
          Fakultas Teknik Universitas Riau
        </p>

      </div>

      {/* Card Paslon */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {candidates.map(
          (item) => (
            <div
              key={item.id}
              className="bg-white rounded-[30px] shadow-2xl overflow-hidden border border-gray-200"
            >

              {/* Foto */}
              <div className="relative">

                <img
                  src={
                    item.foto_url
                  }
                  alt="Paslon"
                  className="w-full h-[300px] sm:h-[420px] md:h-[500px] object-cover"
                />

                <div className="absolute top-5 left-5 bg-red-700 text-white w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-2xl md:text-4xl font-bold shadow-lg">
                  {
                    item.nomor_urut
                  }
                </div>

              </div>

              {/* Content */}
              <div className="p-5 md:p-8">

                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
                  {
                    item.ketua
                  }
                </h2>

                <p className="text-center text-gray-500 text-lg mb-2">
                  Calon Bupati
                </p>

                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mt-4">
                  {
                    item.wakil
                  }
                </h2>

                <p className="text-center text-gray-500 text-lg mb-6">
                  Calon Wakil Bupati
                </p>

                {/* Visi */}
                <div className="bg-gray-100 rounded-2xl p-5 mb-5">

                  <h3 className="font-bold text-red-700 text-lg mb-2">
                    Visi
                  </h3>

                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                    {item.visi}
                  </p>

                </div>

                {/* Misi */}
                <div className="bg-gray-100 rounded-2xl p-5 mb-8">

                  <h3 className="font-bold text-red-700 text-lg mb-2">
                    Misi
                  </h3>

                  <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm md:text-base">
                    {item.misi}
                  </p>

                </div>

                {/* Tombol */}
                <button
                  onClick={() =>
                    pilihPaslon(
                      item.id
                    )
                  }
                  disabled={
                    submitting
                  }
                  className="w-full bg-red-700 hover:bg-red-800 text-white py-4 md:py-5 rounded-2xl text-lg md:text-xl font-bold transition"
                >
                  {submitting
                    ? "Memproses..."
                    : "Pilih Paslon"}
                </button>

              </div>

            </div>
          )
        )}

      </div>

    </main>
  );
}