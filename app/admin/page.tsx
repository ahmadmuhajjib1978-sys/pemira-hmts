"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Admin = {
  id: number;
  nama: string;
  nim: string;
  username: string;
  password: string;
  ktm: string;
};

export default function LoginAdminPage() {
  const router =
    useRouter();

  const [username,
    setUsername] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  function loginAdmin() {
    setLoading(true);

    // cek data admin
    let adminData =
      localStorage.getItem(
        "adminData"
      );

    // kalau kosong buat admin utama
    if (!adminData) {
      const defaultAdmin =
        [
          {
            id: 1,
            nama:
              "Administrator Utama",
            nim:
              "25071101978",
            username:
              "admin",
            password:
              "admin123",
            ktm: "",
          },
        ];

      localStorage.setItem(
        "adminData",
        JSON.stringify(
          defaultAdmin
        )
      );

      adminData =
        JSON.stringify(
          defaultAdmin
        );
    }

    const admins:
      Admin[] =
      JSON.parse(
        adminData
      );

    const admin =
      admins.find(
        (item) =>
          item.username
            .trim() ===
            username.trim() &&
          item.password ===
            password
      );

    if (!admin) {
      alert(
        "Username atau password admin salah"
      );

      setLoading(false);
      return;
    }

    // simpan session
    localStorage.setItem(
      "adminLogin",
      "true"
    );

    localStorage.setItem(
      "adminNama",
      admin.nama
    );

    localStorage.setItem(
      "adminUsername",
      admin.username
    );

    alert(
      "Login berhasil"
    );

    router.push(
      "/admin/dashboard"
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center items-center px-4">

      <div className="bg-white p-10 rounded-[35px] shadow-2xl w-full max-w-lg">

        <h1 className="text-5xl font-bold text-center text-red-700">
          Login Admin
        </h1>

        <p className="text-center text-gray-500 mt-3 mb-8">
          PEMIRA HMTS FT UNRI
        </p>

        <label className="block text-black font-semibold mb-2">
          Username
        </label>

        <input
          type="text"
          value={
            username
          }
          onChange={(e) =>
            setUsername(
              e.target
                .value
            )
          }
          placeholder="Masukkan Username"
          className="w-full border rounded-2xl p-4 text-black mb-5"
        />

        <label className="block text-black font-semibold mb-2">
          Password
        </label>

        <input
          type="password"
          value={
            password
          }
          onChange={(e) =>
            setPassword(
              e.target
                .value
            )
          }
          placeholder="Masukkan Password"
          className="w-full border rounded-2xl p-4 text-black mb-8"
        />

        <button
          onClick={
            loginAdmin
          }
          disabled={
            loading
          }
          className="w-full bg-red-700 hover:bg-red-800 text-white py-4 rounded-2xl text-xl font-bold"
        >
          {loading
            ? "Memproses..."
            : "Masuk Admin"}
        </button>

      </div>

    </main>
  );
}