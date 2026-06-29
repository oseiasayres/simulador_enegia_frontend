export interface FormData {
  /** Nome completo do cliente */
  nome: string;
  /** Quantidade de kWh gerado por mês */
  kwhMes: number;
  /** Valor atual do imóvel (R$) */
  valorImovel: number;
  /** Preço atual do kWh (R$) */
  precoKwh: number;
  /** Valor mensal que o cliente pagará pela energia solar (R$) */
  mensalSolar: number;
}

export interface AcumuladoLinha {
  anos: number;
  rotulo: string;
  semSolar: number;
  comSolar: number;
  economia: number;
}

export interface Resultado {
  /** Valor mensal estimado sem energia solar */
  valorSemSolar: number;
  /** Valor mensal com energia solar (entrada) */
  valorComSolar: number;
  economiaMensal: number;
  economiaAnual: number;
  /** Economia acumulada em 5, 10, 15, 20 e 25 anos */
  economiaAcumulada: Record<5 | 10 | 15 | 20 | 25, number>;
  valorizacaoImovel: number;
  valorImovelValorizado: number;
  investimentoEstimado: number;
  paybackMeses: number;
  paybackAnos: number;
  /** Linhas do comparativo acumulado (1, 5, 10, 15, 20 e 25 anos) */
  acumulado: AcumuladoLinha[];
}
