"use client";

export default function PaslonPage() {
  return (
    <div>
      <h1 className="text-5xl font-bold text-red-700 mb-8">
        Kelola Paslon
      </h1>

      {/* Form tambah paslon */}
      <div className="bg-white rounded-3xl shadow-md p-8 mb-8">

        <h2 className="text-2xl font-bold text-red-700 mb-5">
          Tambah Pasangan Calon
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          <input
            type="text"
            placeholder="Nama Calon Bupati"
            className="border p-4 rounded-xl"
          />

          <input
            type="text"
            placeholder="Nama Calon Wakil Bupati"
            className="border p-4 rounded-xl"
          />

          <textarea
            placeholder="Visi"
            className="border p-4 rounded-xl h-36"
          />

          <textarea
            placeholder="Misi"
            className="border p-4 rounded-xl h-36"
          />

          <input
            type="file"
            className="border p-4 rounded-xl"
          />

        </div>

        <button
          className="mt-6 bg-red-700 text-white px-6 py-3 rounded-xl"
        >
          Simpan Paslon
        </button>
      </div>

      {/* Data paslon */}
      <div className="bg-white rounded-3xl shadow-md p-8">

        <h2 className="text-2xl font-bold text-red-700 mb-5">
          Data Pasangan Calon
        </h2>

        <p className="text-gray-500">
          Data pasangan calon akan tampil di sini.
        </p>

      </div>
    </div>
  );
}