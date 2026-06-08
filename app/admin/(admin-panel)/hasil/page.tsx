"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { generateWordHasil } from "@/lib/generateWordHasil";

type Candidate = {
  id: number;
  nomor_urut: number;
  ketua: string;
  wakil: string;
  foto_url: string;
  suara: number;
  persentase: number;
};

export default function HasilPage() {
  const [loading, setLoading] =
    useState(true);

  const [candidates, setCandidates] =
    useState<Candidate[]>(
      []
    );

  const [totalVotes, setTotalVotes] =
    useState(0);

  const [totalDPT, setTotalDPT] =
    useState(0);

  const [partisipasi, setPartisipasi] =
    useState(0);

  useEffect(() => {
    ambilData();
  }, []);

  async function ambilData() {
    try {
      // kandidat
      const {
        data:
          candidateData,
        error:
          candidateError,
      } = await supabase
        .from(
          "candidates"
        )
        .select("*")
        .order(
          "nomor_urut",
          {
            ascending:
              true,
          }
        );

      if (
        candidateError
      ) {
        throw candidateError;
      }

      // votes
      const {
        data: votes,
        error:
          voteError,
      } = await supabase
        .from("votes")
        .select("*");

      if (
        voteError
      ) {
        throw voteError;
      }

      // total dpt
      const {
        count:
          dptCount,
        error:
          dptError,
      } = await supabase
        .from(
          "voters"
        )
        .select(
          "*",
          {
            count:
              "exact",
            head: true,
          }
        );

      if (
        dptError
      ) {
        throw dptError;
      }

      const totalSuara =
        votes?.length ??
        0;

      const totalDPTValue =
        dptCount ??
        0;

      const persen =
        totalDPTValue >
        0
          ? Math.round(
              (totalSuara /
                totalDPTValue) *
                100
            )
          : 0;

      const hasilPaslon =
        (
          candidateData ??
          []
        ).map(
          (
            item
          ) => {
            const suara =
              votes?.filter(
                (
                  vote: any
                ) =>
                  vote.candidate_id ===
                  item.id
              )
                .length ??
              0;

            const persentase =
              totalSuara >
              0
                ? Math.round(
                    (suara /
                      totalSuara) *
                      100
                  )
                : 0;

            return {
              ...item,
              suara,
              persentase,
            };
          }
        );

      setCandidates(
        hasilPaslon
      );

      setTotalVotes(
        totalSuara
      );

      setTotalDPT(
        totalDPTValue
      );

      setPartisipasi(
        persen
      );

      setLoading(
        false
      );
    } catch (
      error
    ) {
      console.error(
        error
      );

      alert(
        "Gagal mengambil data hasil voting."
      );
    }
  }

  async function handleDownloadWord() {
    try {
      await generateWordHasil(
        {
          totalDPT,
          totalPemilih:
            totalVotes,
          partisipasi,
          candidates:
            candidates.map(
              (
                item
              ) => ({
                nomor_urut:
                  item.nomor_urut,
                ketua:
                  item.ketua,
                wakil:
                  item.wakil,
                suara:
                  item.suara,
                persentase:
                  item.persentase,
              })
            ),
        }
      );
    } catch (
      error
    ) {
      console.error(
        error
      );

      alert(
        "Gagal membuat dokumen hasil voting."
      );
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h1 className="text-2xl font-bold text-black">
          Memuat hasil
          voting...
        </h1>
      </div>
    );
  }

  return (
    <main className="p-6">

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">

        <div>
          <h1 className="text-4xl font-bold text-red-700">
            Hasil Voting
          </h1>

          <p className="text-gray-600 mt-2">
            Monitoring realtime
            hasil PEMIRA HMTS
            FT UNRI
          </p>
        </div>

        <button
          onClick={
            handleDownloadWord
          }
          className="bg-red-700 hover:bg-red-800 text-white px-6 py-4 rounded-2xl font-bold shadow-lg"
        >
          Download
          Hasil Word
        </button>

      </div>

      {/* Statistik */}
      <div className="grid md:grid-cols-3 gap-5 mb-8">

        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <p className="text-gray-500">
            Total Suara
          </p>

          <h2 className="text-5xl font-bold text-red-700 mt-2">
            {
              totalVotes
            }
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <p className="text-gray-500">
            Total DPT
          </p>

          <h2 className="text-5xl font-bold text-blue-700 mt-2">
            {
              totalDPT
            }
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <p className="text-gray-500">
            Partisipasi
          </p>

          <h2 className="text-5xl font-bold text-green-700 mt-2">
            {
              partisipasi
            }
            %
          </h2>
        </div>

      </div>

      {/* Paslon */}
      <div className="space-y-6">

        {[...candidates]
          .sort(
            (
              a,
              b
            ) =>
              b.suara -
              a.suara
          )
          .map(
            (
              item,
              index
            ) => (
              <div
                key={
                  item.id
                }
                className="bg-white rounded-3xl shadow-xl p-6 flex flex-col md:flex-row gap-6"
              >

                <img
                  src={
                    item.foto_url
                  }
                  alt="paslon"
                  className="w-full md:w-52 h-64 object-cover rounded-2xl"
                />

                <div className="flex-1">

                  <p className="text-gray-500">
                    Ranking #
                    {index +
                      1}
                  </p>

                  <h2 className="text-4xl font-bold text-red-700">
                    Paslon{" "}
                    {
                      item.nomor_urut
                    }
                  </h2>

                  <p className="text-2xl font-bold mt-3">
                    {
                      item.ketua
                    }
                  </p>

                  <p className="text-xl text-gray-600">
                    {
                      item.wakil
                    }
                  </p>

                  <div className="w-full bg-gray-200 rounded-full h-5 mt-5 overflow-hidden">

                    <div
                      className="bg-red-700 h-5"
                      style={{
                        width: `${item.persentase}%`,
                      }}
                    />

                  </div>

                  <div className="flex justify-between mt-3">

                    <span className="text-4xl font-bold text-red-700">
                      {
                        item.suara
                      }
                    </span>

                    <span className="text-xl font-bold text-gray-700">
                      {
                        item.persentase
                      }
                      %
                    </span>

                  </div>

                </div>

              </div>
            )
          )}

      </div>

    </main>
  );
}