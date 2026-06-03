"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function HasilPublicPage() {
  const [hasil, setHasil] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    ambilData();

    const interval =
      setInterval(() => {
        ambilData();
      }, 3000);

    return () =>
      clearInterval(interval);
  }, []);

  async function ambilData() {
    const {
      data: candidates,
    } = await supabase
      .from("candidates")
      .select("*")
      .order(
        "nomor_urut",
        {
          ascending:
            true,
        }
      );

    const {
      data: votes,
    } = await supabase
      .from("votes")
      .select("*");

    if (
      !candidates ||
      !votes
    ) {
      return;
    }

    const totalVotes =
      votes.length;

    const hasilVoting =
      candidates.map(
        (paslon) => {
          const jumlahSuara =
            votes.filter(
              (vote) =>
                vote.candidate_id ===
                paslon.id
            ).length;

          const persen =
            totalVotes > 0
              ? Number(
                  (
                    (jumlahSuara /
                      totalVotes) *
                    100
                  ).toFixed(
                    1
                  )
                )
              : 0;

          return {
            ...paslon,
            suara:
              jumlahSuara,
            persen,
          };
        }
      );

    hasilVoting.sort(
      (a, b) =>
        b.suara -
        a.suara
    );

    setHasil(
      hasilVoting
    );

    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-black">
          Memuat hasil Pemira...
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 md:px-8 py-10">

      {/* Header */}
      <div className="text-center mb-12">

        <h1 className="text-3xl md:text-5xl font-bold text-red-700">
          QUICK COUNT PEMIRA
        </h1>

        <h2 className="text-xl md:text-2xl font-semibold text-black mt-3">
          HMTS FT UNRI
        </h2>

        <p className="text-gray-600 mt-3">
          Hasil sementara pemungutan suara
        </p>

      </div>

      {/* Card Paslon */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {hasil.map(
          (
            item,
            index
          ) => (
            <div
              key={item.id}
              className="bg-white rounded-[30px] shadow-2xl overflow-hidden"
            >

              {/* Foto */}
              <img
                src={
                  item.foto_url
                }
                alt="Paslon"
                className="w-full h-[280px] md:h-[400px] object-cover"
              />

              {/* Isi */}
              <div className="p-6 md:p-8">

                <div className="flex justify-between items-center">

                  <h2 className="text-2xl md:text-3xl font-bold text-red-700">
                    Paslon{" "}
                    {
                      item.nomor_urut
                    }
                  </h2>

                  {index ===
                    0 && (
                    <span className="bg-yellow-400 px-4 py-2 rounded-full font-bold">
                      🏆 Teratas
                    </span>
                  )}

                </div>

                {/* Ketua */}
                <h3 className="text-xl md:text-2xl font-bold text-black mt-5">
                  {
                    item.ketua
                  }
                </h3>

                <p className="text-gray-600">
                  Calon Ketua
                </p>

                {/* Wakil */}
                <h3 className="text-xl md:text-2xl font-bold text-black mt-4">
                  {
                    item.wakil
                  }
                </h3>

                <p className="text-gray-600">
                  Calon Wakil Ketua
                </p>

                {/* Suara */}
                <div className="mt-8">

                  <div className="flex justify-between text-black font-bold mb-3">

                    <span>
                      Perolehan
                      Suara
                    </span>

                    <span>
                      {
                        item.suara
                      }{" "}
                      suara
                    </span>

                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-300 rounded-full h-6 overflow-hidden">

                    <div
                      className="bg-red-700 h-6 transition-all duration-700"
                      style={{
                        width: `${item.persen}%`,
                      }}
                    />

                  </div>

                  <p className="text-right mt-3 text-xl font-bold text-red-700">
                    {
                      item.persen
                    }
                    %
                  </p>

                </div>

              </div>

            </div>
          )
        )}

      </div>

    </main>
  );
}