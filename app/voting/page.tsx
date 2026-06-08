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

export default function VotingPage() {
  const [candidates, setCandidates] =
    useState<Candidate[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [namaPemilih, setNamaPemilih] =
    useState("");

  useEffect(() => {
    cekLogin();
    ambilPaslon();
    ambilNamaPemilih();
  }, []);

  async function cekLogin() {
    const nim =
      localStorage.getItem(
        "nim"
      );

    if (!nim) {
      alert(
        "Silakan login terlebih dahulu."
      );

      window.location.href =
        "/login";

      return;
    }

    const {
      data: voter,
    } = await supabase
      .from("voters")
      .select("*")
      .eq("nim", nim)
      .single();

    if (!voter) {
      alert(
        "Data pemilih tidak ditemukan."
      );

      localStorage.removeItem(
        "nim"
      );

      window.location.href =
        "/login";

      return;
    }

    // Cek blokir
    if (
      voter.diblokir
    ) {
      alert(
        "Akun Anda sedang diblokir administrator."
      );

      localStorage.removeItem(
        "nim"
      );

      window.location.href =
        "/login";

      return;
    }

    // Sudah memilih
    if (
      voter.sudah_memilih
    ) {
      alert(
        "Anda sudah menggunakan hak suara."
      );

      window.location.href =
        "/terimakasih";
    }
  }

  async function ambilNamaPemilih() {
    const nim =
      localStorage.getItem(
        "nim"
      );

    if (!nim) return;

    const { data } =
      await supabase
        .from("voters")
        .select("nama")
        .eq("nim", nim)
        .single();

    if (data) {
      setNamaPemilih(
        data.nama
      );
    }
  }

  async function ambilPaslon() {
    const { data, error } =
      await supabase
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

      alert(
        "Gagal memuat pasangan calon."
      );

      return;
    }

    setCandidates(
      data || []
    );

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
        "Sesi login tidak ditemukan."
      );

      window.location.href =
        "/login";

      return;
    }

    // Ambil data voter
    const {
      data: voter,
      error: voterError,
    } = await supabase
      .from("voters")
      .select("*")
      .eq("nim", nim)
      .single();

    if (
      voterError ||
      !voter
    ) {
      alert(
        "Data pemilih tidak ditemukan."
      );

      setSubmitting(false);
      return;
    }

    // Blokir
    if (
      voter.diblokir
    ) {
      alert(
        "Akun Anda sedang diblokir administrator."
      );

      setSubmitting(false);
      return;
    }

    // Anti double vote
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

    try {
      // Simpan suara
      const {
        error: voteError,
      } = await supabase
        .from("votes")
        .insert([
          {
            voter_nim:
              nim,
            candidate_id:
              id,
          },
        ]);

      if (voteError) {
        console.log(
          voteError
        );

        alert(
          "Gagal menyimpan suara."
        );

        setSubmitting(
          false
        );

        return;
      }

      // Update status voter
      await supabase
        .from("voters")
        .update({
          sudah_memilih:
            true,
        })
        .eq("nim", nim);

      // Hapus session login
      localStorage.removeItem(
        "nim"
      );

      alert(
        "Voting berhasil!"
      );

      window.location.href =
        "/terimakasih";
    } catch (err) {
      console.log(err);

      alert(
        "Terjadi kesalahan."
      );

      setSubmitting(
        false
      );
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex justify-center items-center bg-gray-100">
        <h1 className="text-2xl font-bold text-black">
          Memuat Pasangan
          Calon...
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 md:px-8 py-8">

      {/* Header */}
      <div className="text-center mb-8">

        <h1 className="text-3xl md:text-5xl font-bold text-red-800">
          PEMILIHAN RAYA HMTS FT UNRI
        </h1>

        <p className="text-gray-600 mt-3 text-sm md:text-lg">
          Silakan pilih pasangan calon
          Bupati dan Wakil Bupati
          Himpunan Mahasiswa Teknik Sipil
          Fakultas Teknik Universitas Riau
        </p>

      </div>

      {/* Sapaan */}
      <div className="bg-white rounded-[25px] shadow-lg p-6 mb-8 border border-gray-200 text-center">

        <h2 className="text-2xl md:text-3xl font-bold text-red-700">
          Selamat Datang,{" "}
          {namaPemilih}
          👋
        </h2>

        <p className="text-gray-600 mt-2 text-sm md:text-lg">
          Silakan gunakan hak suara
          Anda dengan bijak pada
          Pemilihan Raya Himpunan
          Mahasiswa Teknik Sipil
          Fakultas Teknik Universitas
          Riau.
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
                  Calon Wakil
                  Bupati
                </p>

                <div className="bg-gray-100 rounded-2xl p-5 mb-5">

                  <h3 className="font-bold text-red-700 text-lg mb-2">
                    Visi
                  </h3>

                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                    {
                      item.visi
                    }
                  </p>

                </div>

                <div className="bg-gray-100 rounded-2xl p-5 mb-8">

                  <h3 className="font-bold text-red-700 text-lg mb-2">
                    Misi
                  </h3>

                  <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm md:text-base">
                    {
                      item.misi
                    }
                  </p>

                </div>

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