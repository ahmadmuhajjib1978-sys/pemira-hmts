"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [nim, setNim] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function login() {
    setLoading(true);

    // Ambil setting voting
    const {
      data: setting,
      error: settingError,
    } = await supabase
      .from("voting_settings")
      .select("*")
      .single();

    if (
      settingError ||
      !setting
    ) {
      alert(
        "Pengaturan voting belum tersedia"
      );

      setLoading(false);
      return;
    }

    const sekarang =
      new Date();

    const mulai =
      new Date(
        setting.mulai
      );

    const selesai =
      new Date(
        setting.selesai
      );

    // Belum mulai
    if (sekarang < mulai) {
      alert(
        "Voting belum dimulai."
      );

      setLoading(false);
      return;
    }

    // Sudah selesai
    if (
      sekarang > selesai
    ) {
      alert(
        "Voting telah ditutup."
      );

      setLoading(false);
      return;
    }

    // Login voter
    const {
      data,
      error,
    } = await supabase
      .from("voters")
      .select("*")
      .eq("nim", nim)
      .eq(
        "password",
        password
      )
      .single();

    if (
      error ||
      !data
    ) {
      alert(
        "NIM atau Password salah"
      );

      setLoading(false);
      return;
    }

    // Anti double vote
    if (
      data.sudah_memilih
    ) {
      alert(
        "Anda sudah menggunakan hak suara."
      );

      setLoading(false);
      return;
    }

    localStorage.setItem(
      "nim",
      data.nim
    );

    alert(
      "Login berhasil"
    );

    window.location.href =
      "/voting";
  }

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center items-center px-4 py-8">

      <div className="bg-white shadow-2xl rounded-[30px] p-8 md:p-10 w-full max-w-md">

        <h1 className="text-3xl md:text-4xl font-bold text-center text-red-700">
          Login Pemilih
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Pemira HMTS FT UNRI
        </p>

        <label className="block mb-2 font-medium text-black">
          NIM
        </label>

        <input
          type="text"
          placeholder="Masukkan NIM"
          value={nim}
          onChange={(e) =>
            setNim(
              e.target.value
            )
          }
          className="w-full border border-gray-300 rounded-2xl p-4 mb-5 focus:outline-none focus:ring-2 focus:ring-red-700 text-black"
        />

        <label className="block mb-2 font-medium text-black">
          Password
        </label>

        <input
          type="password"
          placeholder="Masukkan Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="w-full border border-gray-300 rounded-2xl p-4 mb-8 focus:outline-none focus:ring-2 focus:ring-red-700 text-black"
        />

        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-red-700 hover:bg-red-800 active:scale-95 text-white py-4 rounded-2xl text-lg font-bold transition"
        >
          {loading
            ? "Memproses..."
            : "Login"}
        </button>

      </div>

    </main>
  );
}