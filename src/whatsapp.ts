import { formatBRL, formatPayback } from "./calc";
import { EMPRESA } from "./config";
import type { FormData, Resultado } from "./types";

/** Código do país usado quando o número é informado sem DDI. */
const DDI_PADRAO = "55"; // Brasil

/**
 * Normaliza um telefone brasileiro para o formato E.164 sem "+"
 * (ex.: "(11) 98765-4321" -> "5511987654321"), pronto para o link do WhatsApp.
 * Retorna null se o número não tiver dígitos suficientes.
 */
export function normalizarWhatsapp(raw: string): string | null {
  let d = (raw || "").replace(/\D/g, "");
  if (!d) return null;
  // remove zeros à esquerda (ex.: "011...") antes de decidir o DDI
  d = d.replace(/^0+/, "");
  // se já veio com DDI 55 e tamanho plausível, mantém
  if (d.startsWith(DDI_PADRAO) && d.length >= 12 && d.length <= 13) return d;
  // número local: 10 dígitos (fixo) ou 11 (celular com 9) -> prefixa o DDI
  if (d.length === 10 || d.length === 11) return DDI_PADRAO + d;
  return null;
}

/** Monta a mensagem de texto da proposta para o WhatsApp do cliente. */
export function montarMensagem(
  form: FormData,
  resultado: Resultado,
  dataEmissao: string,
): string {
  const primeiroNome = form.nome.trim().split(/\s+/)[0] || "cliente";
  const linhas = [
    `Olá, ${primeiroNome}!`,
    "",
    `Segue o resumo da sua proposta de economia com energia solar (${EMPRESA.nome}), emitida em ${dataEmissao}:`,
    "",
    `- Economia mensal: ${formatBRL(resultado.economiaMensal)}`,
    `- Economia anual: ${formatBRL(resultado.economiaAnual)}`,
    `- Economia em 25 anos: ${formatBRL(resultado.economiaAcumulada[25])}`,
    `- Retorno do investimento: ${formatPayback(resultado)}`,
    `- Valorização do imóvel: ${formatBRL(resultado.valorizacaoImovel)}`,
    "",
    "Vou te enviar em seguida o PDF completo com todo o comparativo.",
    "",
    "Qualquer dúvida, estou à disposição!",
    `${EMPRESA.nome} — ${EMPRESA.telefone}`,
  ];
  return linhas.join("\n");
}

/** Gera o link wa.me com a mensagem já preenchida para o número do cliente. */
export function linkWhatsapp(numeroE164: string, mensagem: string): string {
  return `https://wa.me/${numeroE164}?text=${encodeURIComponent(mensagem)}`;
}
