import { useState } from "react";
import { simular } from "../api/client";
import type { SimulacaoRequest, SimulacaoResponse } from "../types";

const valoresIniciais: SimulacaoRequest = {
  consumo_mensal_kwh: 500,
  tarifa_kwh: 0.95,
  irradiacao_diaria: 4.5,
  eficiencia_sistema: 0.8,
  potencia_placa_wp: 550,
  custo_por_kwp: 4000,
};

const moeda = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function SimuladorForm() {
  const [form, setForm] = useState<SimulacaoRequest>(valoresIniciais);
  const [resultado, setResultado] = useState<SimulacaoResponse | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      const r = await simular(form);
      setResultado(r);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro inesperado");
      setResultado(null);
    } finally {
      setCarregando(false);
    }
  };

  const campos: { name: keyof SimulacaoRequest; label: string; step?: string }[] = [
    { name: "consumo_mensal_kwh", label: "Consumo mensal (kWh)" },
    { name: "tarifa_kwh", label: "Tarifa (R$/kWh)", step: "0.01" },
    { name: "irradiacao_diaria", label: "Irradiação diária (HSP)", step: "0.1" },
    { name: "eficiencia_sistema", label: "Eficiência (0-1)", step: "0.05" },
    { name: "potencia_placa_wp", label: "Potência da placa (Wp)" },
    { name: "custo_por_kwp", label: "Custo por kWp (R$)" },
  ];

  return (
    <div className="card">
      <h1>☀️ Simulador de Energia Solar</h1>

      <form onSubmit={handleSubmit} className="grid">
        {campos.map((c) => (
          <label key={c.name}>
            {c.label}
            <input
              type="number"
              name={c.name}
              value={form[c.name] ?? ""}
              step={c.step ?? "1"}
              min="0"
              onChange={handleChange}
              required
            />
          </label>
        ))}
        <button type="submit" disabled={carregando}>
          {carregando ? "Calculando..." : "Simular"}
        </button>
      </form>

      {erro && <p className="erro">{erro}</p>}

      {resultado && (
        <div className="resultado">
          <h2>Resultado</h2>
          <ul>
            <li>Potência instalada: <b>{resultado.potencia_necessaria_kwp} kWp</b></li>
            <li>Quantidade de placas: <b>{resultado.quantidade_placas}</b></li>
            <li>Geração mensal: <b>{resultado.geracao_mensal_estimada_kwh} kWh</b></li>
            <li>Economia mensal: <b>{moeda(resultado.economia_mensal_reais)}</b></li>
            <li>Economia anual: <b>{moeda(resultado.economia_anual_reais)}</b></li>
            <li>Investimento: <b>{moeda(resultado.investimento_estimado_reais)}</b></li>
            <li>Payback: <b>{resultado.payback_anos} anos</b></li>
          </ul>
        </div>
      )}
    </div>
  );
}
