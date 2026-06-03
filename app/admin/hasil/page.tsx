"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function HasilVotingPage() {
  const router = useRouter();

  const [hasil, setHasil] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [totalDPT, setTotalDPT] =
    useState(0);

  const [sudahMemilih, setSudahMemilih] =
    useState(0);

  useEffect(() => {
    cekAdmin();
  }, []);

  async function cekAdmin() {
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

    await ambilData();

    setInterval(() => {
      ambilData();
    }, 3000);
  }

  async function ambilData() {
    const { data: candidates } =
      await supabase
        .from("candidates")
        .select("*")
        .order("nomor_urut");

    const { data: votes } =
      await supabase
        .from("votes")
        .select("*");

    const { data: voters } =
      await supabase
        .from("voters")
        .select("*");

    if (
      !candidates ||
      !votes ||
      !voters
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
                  ).toFixed(1)
                )
              : 0;

          return {
            ...paslon,
            suara:
              jumlahSuara,
            persen,
            nama:
              "Paslon " +
              paslon.nomor_urut,
          };
        }
      );

    hasilVoting.sort(
      (a, b) =>
        b.suara -
        a.suara
    );

    const sudah =
      voters.filter(
        (v) =>
          v.sudah_memilih
      ).length;

    setHasil(
      hasilVoting
    );

    setTotalDPT(
      voters.length
    );

    setSudahMemilih(
      sudah
    );

    setLoading(false);
  }

  const partisipasi =
    totalDPT > 0
      ? (
          (sudahMemilih /
            totalDPT) *
          100
        ).toFixed(1)
      : 0;

  const golput =
    totalDPT -
    sudahMemilih;

  function downloadPDF() {
    const doc =
      new jsPDF();

    doc.setFontSize(18);

    doc.text(
      "HASIL PEMIRA HMTS FT UNRI",
      14,
      20
    );

    doc.setFontSize(11);

    doc.text(
      "Himpunan Mahasiswa Teknik Sipil",
      14,
      30
    );

    doc.text(
      "Fakultas Teknik Universitas Riau",
      14,
      36
    );

    doc.text(
      `Tanggal Cetak: ${new Date().toLocaleString(
        "id-ID"
      )}`,
      14,
      45
    );

    doc.text(
      `Total DPT: ${totalDPT}`,
      14,
      60
    );

    doc.text(
      `Sudah Memilih: ${sudahMemilih}`,
      14,
      68
    );

    doc.text(
      `Partisipasi: ${partisipasi}%`,
      14,
      76
    );

    doc.text(
      `Golput: ${golput}`,
      14,
      84
    );

    autoTable(doc, {
      startY: 95,
      head: [
        [
          "Ranking",
          "Paslon",
          "Ketua",
          "Wakil",
          "Suara",
          "Persentase",
        ],
      ],
      body: hasil.map(
        (
          item,
          index
        ) => [
          index + 1,
          item.nomor_urut,
          item.ketua,
          item.wakil,
          item.suara,
          `${item.persen}%`,
        ]
      ),
    });

    doc.save(
      "Hasil_PEMIRA_HMTS.pdf"
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen flex justify-center items-center">
        <h1 className="text-2xl font-bold text-black">
          Memuat hasil voting...
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <div className="flex justify-between items-center mb-10">

        <div>

          <h1 className="text-4xl font-bold text-red-700">
            Dashboard Hasil Voting
          </h1>

          <p className="text-gray-600 mt-2">
            Monitoring realtime Pemira HMTS FT UNRI
          </p>

        </div>

        <button
          onClick={
            downloadPDF
          }
          className="bg-red-700 hover:bg-red-800 text-white px-6 py-4 rounded-xl font-bold"
        >
          Download PDF
        </button>

      </div>

      {/* Statistik */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">

        <div className="bg-white rounded-3xl shadow-xl p-6">
          <h3 className="text-gray-500">
            Total DPT
          </h3>

          <p className="text-5xl font-bold text-red-700 mt-3">
            {totalDPT}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6">
          <h3 className="text-gray-500">
            Sudah Memilih
          </h3>

          <p className="text-5xl font-bold text-green-600 mt-3">
            {sudahMemilih}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6">
          <h3 className="text-gray-500">
            Partisipasi
          </h3>

          <p className="text-5xl font-bold text-blue-600 mt-3">
            {partisipasi}%
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6">
          <h3 className="text-gray-500">
            Golput
          </h3>

          <p className="text-5xl font-bold text-orange-500 mt-3">
            {golput}
          </p>
        </div>

      </div>

      {/* Grafik */}
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-10">

        <h2 className="text-2xl font-bold text-black mb-6">
          Grafik Perolehan Suara
        </h2>

        <div className="h-[400px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart data={hasil}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nama" />
              <YAxis />
              <Tooltip />

              <Bar
                dataKey="suara"
                radius={[
                  12,
                  12,
                  0,
                  0,
                ]}
              />
            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </main>
  );
}