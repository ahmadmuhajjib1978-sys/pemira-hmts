import "./globals.css";

export const metadata = {
  title: "PEMIRA HMTS FT UNRI",
  description:
    "Website E-Voting PEMIRA HMTS FT UNRI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  );
}