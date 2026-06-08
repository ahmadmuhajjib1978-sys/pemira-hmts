"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [totalDPT, setTotalDPT] =
    useState(0);

  const [sudahMemilih, setSudahMemilih] =
    useState(0);

  const [belumMemilih, setBelumMemilih] =
    useState(0);

  const [partisipasi, setPartisipasi] =
    useState(0);

  const [paslonUnggul, setPaslonUnggul] =
    useState(
      "Belum ada suara"
    );

  const [statusVoting, setStatusVoting] =
    useState(
      "Memuat..."
    );

  useEffect(() => {
    ambilDashboard();
  }, []);

  async function ambilDashboard() {
    try {
      // DPT
      const dpt =
        JSON.parse(
          localStorage.getItem(
            "dptData"
          ) || "[]"
        );

      const total =
        dpt.length;

      const sudah =
        dpt.filter(
          (
            item: any
          ) =>
            item.status ===
            "Sudah Memilih"
        ).length;

      const belum =
        total - sudah;

      const persen =
        total > 0
          ? Math.round(
              (sudah /
                total) *
                100
            )
          : 0;

      setTotalDPT(
        total
      );

      setSudahMemilih(
        sudah
      );

      setBelumMemilih(
        belum
      );

      setPartisipasi(
        persen
      );

      // STATUS VOTING
      const {
        data: setting,
      } = await supabase
        .from(
          "voting_settings"
        )
        .select("*")
        .single();

      if (setting) {
        const now =
          new Date();

        const mulai =
          new Date(
            setting.mulai
          );

        const selesai =
          new Date(
            setting.selesai
          );

        if (
          now < mulai
        ) {
          setStatusVoting(
            "Belum Dimulai"
          );
        } else if (
          now >
          selesai
        ) {
          setStatusVoting(
            "Ditutup"
          );
        } else {
          setStatusVoting(
            "Aktif"
          );
        }
      }

      // PASLON UNGGUL
      const {
        data: candidates,
      } = await supabase
        .from(
          "candidates"
        )
        .select("*");

      const {
        data: votes,
      } = await supabase
        .from("votes")
        .select("*");

      if (
        candidates &&
        votes
      ) {
        const hasil =
          candidates.map(
            (
              item: any
            ) => ({
              ...item,
              suara:
                votes.filter(
                  (
                    vote: any
                  ) =>
                    vote.candidate_id ===
                    item.id
                ).length,
            })
          );

        hasil.sort(
          (
            a: any,
            b: any
          ) =>
            b.suara -
            a.suara
        );

        if (
          hasil.length >
            0 &&
          hasil[0]
            .suara >
            0
        ) {
          setPaslonUnggul(
            `${hasil[0].ketua} & ${hasil[0].wakil}`
          );
        }
      }
    } catch (error) {
      console.log(
        error
      );
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-red-700">
          Dashboard Admin
        </h1>

        <p className="text-gray-600 mt-2">
          Monitoring sistem
          E-Voting PEMIRA
          HMTS FT UNRI
        </p>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* Total DPT */}
        <div className="bg-white rounded-[30px] p-6 shadow-lg">
          <p className="text-gray-500 text-lg">
            Total DPT
          </p>

          <h2 className="text-5xl font-bold text-red-700 mt-3">
            {totalDPT}
          </h2>
        </div>

        {/* Sudah memilih */}
        <div className="bg-white rounded-[30px] p-6 shadow-lg">
          <p className="text-gray-500 text-lg">
            Sudah Memilih
          </p>

          <h2 className="text-5xl font-bold text-green-600 mt-3">
            {
              sudahMemilih
            }
          </h2>
        </div>

        {/* Belum memilih */}
        <div className="bg-white rounded-[30px] p-6 shadow-lg">
          <p className="text-gray-500 text-lg">
            Belum Memilih
          </p>

          <h2 className="text-5xl font-bold text-orange-500 mt-3">
            {
              belumMemilih
            }
          </h2>
        </div>

        {/* Partisipasi */}
        <div className="bg-white rounded-[30px] p-6 shadow-lg">
          <p className="text-gray-500 text-lg">
            Partisipasi
          </p>

          <h2 className="text-5xl font-bold text-blue-600 mt-3">
            {
              partisipasi
            }
            %
          </h2>
        </div>

        {/* Status voting */}
        <div className="bg-white rounded-[30px] p-6 shadow-lg">
          <p className="text-gray-500 text-lg">
            Status Voting
          </p>

          <h2 className="text-3xl font-bold text-purple-600 mt-3">
            {
              statusVoting
            }
          </h2>
        </div>

        {/* Paslon unggul */}
        <div className="bg-white rounded-[30px] p-6 shadow-lg">
          <p className="text-gray-500 text-lg">
            Paslon Unggul
          </p>

          <h2 className="text-xl font-bold text-red-700 mt-3">
            {
              paslonUnggul
            }
          </h2>
        </div>

      </div>

    </main>
  );
}