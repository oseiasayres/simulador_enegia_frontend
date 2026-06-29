import { MESES_INVESTIMENTO, PERCENTUAL_VALORIZACAO } from "./config";
import type { FormData, Resultado } from "./types";

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** Formata um valor numérico como Real brasileiro (R$ 1.130,00). */
export function formatBRL(valor: number): string {
  if (!Number.isFinite(valor)) return "—";
  return brl.format(valor);
}

/** Formata um valor compacto para rótulos de gráfico (R$ 1,1 mil / R$ 189 mil). */
export function formatBRLCompact(valor: number): string {
  if (!Number.isFinite(valor)) return "—";
  if (Math.abs(valor) >= 1000) {
    const mil = valor / 1000;
    const casas = Math.abs(mil) >= 100 ? 0 : 1;
    return `R$ ${mil.toLocaleString("pt-BR", {
      minimumFractionDigits: casas,
      maximumFractionDigits: casas,
    })} mil`;
  }
  return brl.format(valor);
}

/** Formata um número de kWh (1.000 kWh). */
export function formatKwh(valor: number): string {
  return `${valor.toLocaleString("pt-BR")} kWh`;
}

/**
 * Aplica todas as regras de cálculo da proposta de energia solar.
 *
 * - Valor sem solar          = kWh/mês * preço do kWh
 * - Economia mensal          = valor sem solar - valor mensal pago no solar
 * - Economia anual           = economia mensal * 12
 * - Economia acumulada       = economia anual * anos (5, 10, 15, 20, 25)
 * - Valorização do imóvel    = valor do imóvel * 5%
 * - Imóvel valorizado        = valor do imóvel + valorização
 * - Investimento estimado    = valor mensal solar * 60 meses
 * - Payback                  = investimento estimado / economia mensal
 */
export function calcular(dados: FormData): Resultado {
  const valorSemSolar = dados.kwhMes * dados.precoKwh;
  const valorComSolar = dados.mensalSolar;
  const economiaMensal = valorSemSolar - valorComSolar;
  const economiaAnual = economiaMensal * 12;

  const economiaAcumulada = {
    5: economiaAnual * 5,
    10: economiaAnual * 10,
    15: economiaAnual * 15,
    20: economiaAnual * 20,
    25: economiaAnual * 25,
  } as const;

  const valorizacaoImovel = dados.valorImovel * PERCENTUAL_VALORIZACAO;
  const valorImovelValorizado = dados.valorImovel + valorizacaoImovel;

  const investimentoEstimado = dados.mensalSolar * MESES_INVESTIMENTO;
  const paybackMeses =
    economiaMensal > 0 ? investimentoEstimado / economiaMensal : Infinity;
  const paybackAnos = paybackMeses / 12;

  const periodos = [1, 5, 10, 15, 20, 25];
  const acumulado = periodos.map((anos) => ({
    anos,
    rotulo: anos === 1 ? "1 ano" : `${anos} anos`,
    semSolar: valorSemSolar * 12 * anos,
    comSolar: valorComSolar * 12 * anos,
    economia: economiaAnual * anos,
  }));

  return {
    valorSemSolar,
    valorComSolar,
    economiaMensal,
    economiaAnual,
    economiaAcumulada,
    valorizacaoImovel,
    valorImovelValorizado,
    investimentoEstimado,
    paybackMeses,
    paybackAnos,
    acumulado,
  };
}

/** Texto amigável do payback ("≈ 48 meses (4,0 anos)"). */
export function formatPayback(res: Resultado): string {
  if (!Number.isFinite(res.paybackMeses)) return "Sem economia mensal";
  const meses = Math.round(res.paybackMeses);
  const anos = res.paybackAnos.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  return `aprox. ${meses} meses (${anos} anos)`;
}
