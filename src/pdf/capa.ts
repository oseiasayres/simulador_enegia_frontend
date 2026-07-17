import { PDFDocument } from "pdf-lib";

// A capa do contrato mora no repo do backend; o front busca pela mesma origem
// (o Caddy faz o proxy de /api), então não há CORS envolvido.
const CAPA_URL = "/api/v1/simulacao/capa";

/** Devolve a proposta com a capa do contrato como página 1. */
export async function anexarCapa(proposta: Blob): Promise<Blob> {
  const resp = await fetch(CAPA_URL);
  if (!resp.ok) {
    throw new Error(`capa indisponível (HTTP ${resp.status})`);
  }

  const [capa, corpo] = await Promise.all([
    resp.arrayBuffer().then((b) => PDFDocument.load(b)),
    proposta.arrayBuffer().then((b) => PDFDocument.load(b)),
  ]);

  const final = await PDFDocument.create();
  for (const doc of [capa, corpo]) {
    const paginas = await final.copyPages(doc, doc.getPageIndices());
    for (const pagina of paginas) final.addPage(pagina);
  }

  // Cópia para um buffer próprio: o save() devolve Uint8Array<ArrayBufferLike>,
  // que o Blob não aceita direto.
  return new Blob([new Uint8Array(await final.save())], { type: "application/pdf" });
}
