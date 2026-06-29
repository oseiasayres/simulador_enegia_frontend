import type { SimulacaoRequest, SimulacaoResponse } from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1";

export async function simular(dados: SimulacaoRequest): Promise<SimulacaoResponse> {
  const resp = await fetch(`${API_URL}/simulacao`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });

  if (!resp.ok) {
    const detail = await resp.text();
    throw new Error(`Erro ${resp.status}: ${detail}`);
  }

  return resp.json() as Promise<SimulacaoResponse>;
}
