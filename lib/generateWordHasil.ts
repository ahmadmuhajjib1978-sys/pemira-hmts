import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

type Candidate = {
  nomor_urut: number;
  ketua: string;
  wakil: string;
  suara: number;
  persentase: number;
};

type GenerateWordProps = {
  totalDPT: number;
  totalPemilih: number;
  partisipasi: number;
  candidates: Candidate[];
};

export async function generateWordHasil({
  totalDPT,
  totalPemilih,
  partisipasi,
  candidates,
}: GenerateWordProps) {
  try {
    // ambil template word
    const response =
      await fetch(
        "/template/template-hasil.docx"
      );

    if (!response.ok) {
      throw new Error(
        "Template Word tidak ditemukan."
      );
    }

    const content =
      await response.arrayBuffer();

    const zip =
      new PizZip(
        content
      );

    const doc =
      new Docxtemplater(
        zip,
        {
          paragraphLoop:
            true,
          linebreaks:
            true,
        }
      );

    // cari pemenang
    const pemenang =
      [...candidates].sort(
        (
          a,
          b
        ) =>
          b.suara -
          a.suara
      )[0];

    // buat isi hasil
    const tabelHasil =
      candidates
        .map(
          (
            item
          ) =>
            `Paslon ${item.nomor_urut}
Ketua : ${item.ketua}
Wakil : ${item.wakil}
Jumlah Suara : ${item.suara}
Persentase : ${item.persentase}%`
        )
        .join(
          "\n\n"
        );

    // inject ke template word
    doc.render({
      total_dpt:
        totalDPT,
      total_pemilih:
        totalPemilih,
      belum_memilih:
        totalDPT -
        totalPemilih,
      partisipasi,
      tabel_hasil:
        tabelHasil,
      pemenang:
        pemenang
          ?.nomor_urut ??
        "-",
      suara_pemenang:
        pemenang
          ?.suara ?? 0,
      persen_pemenang:
        pemenang
          ?.persentase ??
        0,
    });

    // generate file
    const blob =
      doc
        .getZip()
        .generate({
          type:
            "blob",
          mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

    // download otomatis
    const url =
      window.URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href =
      url;

    link.download =
      "Hasil_PEMIRA_HMTS.docx";

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    window.URL.revokeObjectURL(
      url
    );
  } catch (error) {
    console.error(
      error
    );

    alert(
      "Gagal membuat file hasil voting."
    );
  }
}