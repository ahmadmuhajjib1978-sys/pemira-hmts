"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function VotingPage() {
  const router = useRouter();

  const [candidates, setCandidates] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [nim, setNim] =
    useState("");

  useEffect(() => {
    ambilPaslon();

    const voterNim =
      localStorage.getItem(
        "voter_nim"
      );

    if (!voterNim) {
      router.push("/login");
      return;
    }

    setNim(voterNim);
  }, []);

  async function ambilPaslon() {
    const { data } =
      await supabase
        .from("candidates")
        .select("*")
        .order("nomor_urut");

    if (data) {
      setCandidates(data);
    }

    setLoading(false);
  }

  async function pilihPaslon(
    candidateId: number
  ) {
    if (submitting) return;

    const konfirmasi =
      confirm(
        "Apakah Anda yakin memilih paslon ini?"
      );

    if (!konfirmasi) return;

    setSubmitting(true);

    try {
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

      if (
        voter.sudah_memilih
      ) {
        alert(
          "Anda sudah memilih"
        );

        router.push(
          "/terimakasih"
        );

        return;
      }

      // simpan vote
      const { error } =
        await supabase
          .from("votes")
          .insert({
            voter_nim: nim,
            candidate_id:
              candidateId,
          });

      if (error) {
        alert(error.message);
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

      // hapus localstorage
      localStorage.removeItem(
        "voter_nim"
      );

      // redirect terimakasih
      router.push(
        "/terimakasih"
      );
    } catch (err) {
      alert(
        "Terjadi kesalahan"
      );
      console.log(err);
    }

    setSubmitting(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen flex justify-center items-center">
        <h1>
          Memuat data...
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-center text-red-700 mb-10">
          Pilih Pasangan Calon
        </h1>

        <div className="grid md:grid-cols-2 gap-8">

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
                  className="w-full h-80 object-cover"
                />

                <div className="p-6">

                  <h2 className="text-3xl font-bold text-red-700 text-center">
                    PASLON{" "}
                    {
                      item.nomor_urut
                    }
                  </h2>

                  <div className="text-center mt-6">

                    <h3 className="text-2xl font-bold">
                      {
                        item.ketua
                      }
                    </h3>

                    <p className="text-gray-500">
                      Calon Ketua
                    </p>

                    <h3 className="text-2xl font-bold mt-5">
                      {
                        item.wakil
                      }
                    </h3>

                    <p className="text-gray-500">
                      Calon Wakil Ketua
                    </p>

                  </div>

                  <div className="mt-8">

                    <div className="bg-gray-100 rounded-2xl p-5 mb-5">
                      <h4 className="font-bold text-red-700 text-xl">
                        Visi
                      </h4>

                      <p className="mt-2">
                        {
                          item.visi
                        }
                      </p>
                    </div>

                    <div className="bg-gray-100 rounded-2xl p-5">
                      <h4 className="font-bold text-red-700 text-xl">
                        Misi
                      </h4>

                      <p className="mt-2 whitespace-pre-line">
                        {
                          item.misi
                        }
                      </p>
                    </div>

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
                    className="w-full bg-red-700 text-white p-5 rounded-2xl mt-8 text-xl font-bold hover:bg-red-800 transition"
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

      </div>

    </main>
  );
}