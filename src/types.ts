export interface SimulacaoRequest {
  consumo_mensal_kwh: number;
  tarifa_kwh: number;
  irradiacao_diaria?: number;
  eficiencia_sistema?: number;
  potencia_placa_wp?: number;
  custo_por_kwp?: number;
}

export interface SimulacaoResponse {
  potencia_necessaria_kwp: number;
  quantidade_placas: number;
  geracao_mensal_estimada_kwh: number;
  economia_mensal_reais: number;
  economia_anual_reais: number;
  investimento_estimado_reais: number;
  payback_anos: number;
}
