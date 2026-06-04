"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router =
    useRouter();

  const [nim, setNim] =
    useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin() {
    if (!nim || !password) {
      alert(
        "Lengkapi NIM dan Password"
      );
      return;
    }

    setLoading(true);

    const {
      data: voter,
      error,
    } = await supabase
      .from("voters")
      .select("*")
      .eq("nim", nim.trim())
      .eq(
        "password",
        password.trim()
      )
      .single();

    setLoading(false);

    if (error || !voter) {
      alert(
        "NIM atau Password salah"
      );
      return;
    }

    // cek sudah memilih
    if (
      voter.sudah_memilih
    ) {
      alert(
        "Anda sudah menggunakan hak suara."
      );

      router.push(
        "/terimakasih"
      );

      return;
    }

    // simpan session
    localStorage.setItem(
      "nim",
      voter.nim
    );

    router.push(
      "/voting"
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="bg-white rounded-[30px] shadow-2xl p-10 w-full max-w-lg">

        <h1 className="text-4xl font-bold text-center text-red-700">
          Login Pemilih
        </h1>

        <p className="text-center text-gray-600 mt-2">
          Pemira HMTS FT UNRI
        </p>

        <div className="mt-8">

          <label className="font-semibold text-black">
            NIM
          </label>

          <input
            type="text"
            value={nim}
            onChange={(e) =>
              setNim(
                e.target.value
              )
            }
            className="w-full border border-gray-300 p-4 rounded-2xl mt-2 text-black"
            placeholder="Masukkan NIM"
          />

        </div>

        <div className="mt-6">

          <label className="font-semibold text-black">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full border border-gray-300 p-4 rounded-2xl mt-2 text-black"
            placeholder="Masukkan Password"
          />

        </div>

        <button
          onClick={
            handleLogin
          }
          disabled={loading}
          className="w-full bg-red-700 hover:bg-red-800 text-white py-4 rounded-2xl font-bold text-lg mt-8"
        >
          {loading
            ? "Memproses..."
            : "Masuk"}
        </button>

      </div>

    </main>
  );
}