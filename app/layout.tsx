import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "PEMIRA HMTS FT UNRI 2026/2027",

  description:
    "Website Pemilihan Raya Himpunan Mahasiswa Teknik Sipil Fakultas Teknik Universitas Riau",

  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  );
}