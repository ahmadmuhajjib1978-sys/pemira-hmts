"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  function handleLogin() {
    if (
      username === "admin" &&
      password === "admin123"
    ) {
      localStorage.setItem(
        "adminLogin",
        "true"
      );

      alert(
        "Login admin berhasil"
      );

      window.location.href =
        "/admin/dashboard";

      return;
    }

    alert(
      "Username atau password salah"
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">

        <h1 className="text-4xl font-bold text-center text-red-700">
          Login Admin
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Pemira HMTS FT UNRI
        </p>

        <label className="block mb-2 text-black font-medium">
          Username
        </label>

        <input
          type="text"
          value={username}
          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }
          className="w-full border border-gray-300 rounded-xl p-4 mb-5 text-black"
          placeholder="Masukkan username"
        />

        <label className="block mb-2 text-black font-medium">
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
          className="w-full border border-gray-300 rounded-xl p-4 mb-8 text-black"
          placeholder="Masukkan password"
        />

        <button
          onClick={
            handleLogin
          }
          className="w-full bg-red-700 hover:bg-red-800 text-white py-4 rounded-xl text-lg font-bold"
        >
          Login Admin
        </button>

      </div>
    </main>
  );
}