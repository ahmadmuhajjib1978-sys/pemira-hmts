"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router =
    useRouter();

  const [
    username,
    setUsername,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  function handleLogin() {
    if (
      username ===
        "admin" &&
      password ===
        "admin123"
    ) {
      localStorage.setItem(
        "adminLogin",
        "true"
      );

      router.push(
        "/admin/dashboard"
      );
    } else {
      alert(
        "Username atau password admin salah"
      );
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="bg-white rounded-[30px] shadow-2xl p-10 w-full max-w-lg">

        <h1 className="text-4xl font-bold text-center text-red-700">
          Login Admin
        </h1>

        <p className="text-center text-gray-600 mt-2">
          PEMIRA HMTS FT UNRI
        </p>

        <div className="mt-8">

          <label className="font-semibold text-black">
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
            className="w-full border border-gray-300 p-4 rounded-2xl mt-2 text-black"
            placeholder="Masukkan Username"
          />

        </div>

        <div className="mt-6">

          <label className="font-semibold text-black">
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
            className="w-full border border-gray-300 p-4 rounded-2xl mt-2 text-black"
            placeholder="Masukkan Password"
          />

        </div>

        <button
          onClick={
            handleLogin
          }
          className="w-full bg-red-700 hover:bg-red-800 text-white py-4 rounded-2xl font-bold text-lg mt-8"
        >
          Masuk Admin
        </button>

      </div>

    </main>
  );
}