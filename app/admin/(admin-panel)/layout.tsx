"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] =
    useState(true);

  const router =
    useRouter();

  function logout() {
    localStorage.removeItem(
      "adminLogin"
    );

    router.push(
      "/admin/login"
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside
        className={`bg-red-800 text-white transition-all duration-300 ${
          open
            ? "w-72"
            : "w-20"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-red-700">

          {open && (
            <h1 className="font-bold text-2xl">
              PEMIRA HMTS
            </h1>
          )}

          <button
            onClick={() =>
              setOpen(!open)
            }
          >
            {open ? (
              <X size={28} />
            ) : (
              <Menu size={28} />
            )}
          </button>
        </div>

        <nav className="p-4 flex flex-col gap-3">

          <Link href="/admin/dashboard">
            Dashboard
          </Link>

          <Link href="/admin/dpt">
            Kelola DPT
          </Link>

          <Link href="/admin/paslon">
            Kelola Paslon
          </Link>

          <Link href="/admin/admin-user">
            Kelola Admin
          </Link>

          <Link href="/admin/hasil">
            Hasil Voting
          </Link>

          <button
            onClick={logout}
            className="bg-black rounded-lg p-3 mt-5"
          >
            Logout
          </button>

        </nav>
      </aside>

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}