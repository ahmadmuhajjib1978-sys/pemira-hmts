import "./globals.css";
import Image from "next/image";

export const metadata = {
  title: "Pemira HMTS FT UNRI",
  description:
    "Pemilihan Raya Himpunan Mahasiswa Teknik Sipil Fakultas Teknik Universitas Riau",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-gray-100">

        {/* HEADER PROFESIONAL */}
        <header className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white shadow-2xl border-b-4 border-yellow-400">

          <div className="max-w-7xl mx-auto px-6 py-6">

            {/* LOGO + IDENTITAS */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

              {/* KIRI */}
              <div className="flex items-center gap-5">

                <Image
                  src="/images/logo-unri.png"
                  alt="Logo Universitas Riau"
                  width={80}
                  height={80}
                  className="object-contain"
                />

                <Image
                  src="/images/logo-pemira.png"
                  alt="Logo Pemira"
                  width={85}
                  height={85}
                  className="object-contain"
                />

              </div>

              {/* TENGAH */}
              <div className="text-center">

                <h1 className="text-3xl font-extrabold uppercase tracking-wide">
                  Himpunan Mahasiswa Teknik Sipil
                </h1>

                <h2 className="text-xl font-semibold mt-1">
                  Fakultas Teknik Universitas Riau
                </h2>

                <div className="w-32 h-1 bg-yellow-400 mx-auto my-3 rounded-full" />

                <p className="text-2xl font-bold tracking-wide">
                  PEMILIHAN RAYA HMTS FT UNRI
                </p>

                <p className="text-sm text-gray-200 mt-2">
                  Sistem E-Voting Resmi Pemira HMTS FT UNRI
                </p>

              </div>

              {/* KANAN */}
              <div className="flex items-center gap-5">

                <Image
                  src="/images/logo-hmts.png"
                  alt="Logo HMTS"
                  width={80}
                  height={80}
                  className="object-contain"
                />

                <Image
                  src="/images/logo-fkmtsi.png"
                  alt="Logo FKMTSI"
                  width={80}
                  height={80}
                  className="object-contain"
                />

              </div>

            </div>

          </div>
        </header>

        {/* KONTEN */}
        <main>
          {children}
        </main>

        {/* FOOTER */}
        <footer className="bg-black text-white text-center py-5 mt-10">

          <p className="font-semibold">
            © 2026 Pemilihan Raya HMTS FT UNRI
          </p>

          <p className="text-sm text-gray-400 mt-1">
            Himpunan Mahasiswa Teknik Sipil
            Fakultas Teknik Universitas Riau
          </p>

        </footer>

      </body>
    </html>
  );
}