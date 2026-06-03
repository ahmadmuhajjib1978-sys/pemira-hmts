"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Candidate = {
  id: number;
  nomor_urut: number;
  ketua: string;
  wakil: string;
  foto_url: string;
  visi: string;
  misi: string;
};

export default function HalamanPaslon() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  async function ambilPaslon() {
    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .order("nomor_urut", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setCandidates(data || []);
  }

  useEffect(() => {
    ambilPaslon();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="bg-red-700 text-white py-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold">
            Pemilihan Raya HMTS FT UNRI
          </h1>

          <p className="mt-3 text-lg">
            Profil Pasangan Calon Bupati dan Wakil Bupati
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {candidates.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow text-center">
            <h2 className="text-2xl text-black font-bold">
              Belum Ada Paslon
            </h2>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">

            {candidates.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >

                <img
                  src={item.foto_url}
                  alt={item.ketua}
                  className="w-full h-96 object-cover"
                />

                <div className="p-6">

                  <div className="inline-block bg-red-700 text-white px-5 py-2 rounded-full font-bold">
                    PASLON {item.nomor_urut}
                  </div>

                  <h2 className="text-3xl font-bold text-black mt-4">
                    {item.ketua}
                  </h2>

                  <h3 className="text-xl text-gray-700">
                    {item.wakil}
                  </h3>

                  <div className="mt-6">
                    <h4 className="text-red-700 font-bold text-xl">
                      VISI
                    </h4>

                    <p className="text-black mt-2">
                      {item.visi}
                    </p>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-red-700 font-bold text-xl">
                      MISI
                    </h4>

                    <p className="text-black whitespace-pre-line mt-2">
                      {item.misi}
                    </p>
                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}