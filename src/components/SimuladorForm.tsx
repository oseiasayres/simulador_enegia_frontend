import { useMemo, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { calcular, formatBRL, formatPayback } from "../calc";
import { PropostaPDF } from "../pdf/PropostaPDF";
import type { FormData } from "../types";

type CampoNumerico = Exclude<keyof FormData, "nome">;

const valoresIniciais: FormData = {
  nome: "",
  kwhMes: 1000,
  valorImovel: 500000,
  precoKwh: 1.13,
  mensalSolar: 500,
};

const campos: {
  name: CampoNumerico;
  label: string;
  prefixo?: string;
  sufixo?: string;
  step: string;
}[] = [
  { name: "kwhMes", label: "Quantidade de kWh gerado por mês", sufixo: "kWh", step: "1" },
  { name: "valorImovel", label: "Valor atual do imóvel", prefixo: "R$", step: "0.01" },
  { name: "precoKwh", label: "Preço atual do kWh", prefixo: "R$", step: "0.01" },
  {
    name: "mensalSolar",
    label: "Valor mensal pago na energia solar",
    prefixo: "R$",
    step: "0.01",
  },
];

function dataHoje(): string {
  return new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function SimuladorForm() {
  const [form, setForm] = useState<FormData>(valoresIniciais);
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const resultado = useMemo(() => calcular(form), [form]);
  const economiaNegativa = resultado.economiaMensal <= 0;

  const handleNome = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, nome: e.target.value }));

  const handleNumero = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value === "" ? 0 : Number(value) }));
  };

  const gerarPDF = async () => {
    setErro(null);
    if (!form.nome.trim()) {
      setErro("Informe o nome completo do cliente.");
      return;
    }
    setGerando(true);
    try {
      const blob = await pdf(
        <PropostaPDF dados={form} resultado={resultado} dataEmissao={dataHoje()} />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Proposta Energia Solar - ${form.nome.trim()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Falha ao gerar o PDF.");
    } finally {
      setGerando(false);
    }
  };

  return (
    <div className="card">
      <header className="card-header">
        <span className="badge">☀️ Energia Solar</span>
        <h1>Simulação de Economia com Energia Solar</h1>
        <p>Preencha os dados do cliente e gere a proposta comparativa em PDF.</p>
      </header>

      <form
        className="grid"
        onSubmit={(e) => {
          e.preventDefault();
          gerarPDF();
        }}
      >
        <label className="full">
          Nome completo do cliente
          <input
            type="text"
            value={form.nome}
            onChange={handleNome}
            placeholder="Ex.: Maria da Silva"
            required
          />
        </label>

        {campos.map((c) => (
          <label key={c.name}>
            {c.label}
            <div className="input-wrap">
              {c.prefixo && <span className="affix">{c.prefixo}</span>}
              <input
                type="number"
                name={c.name}
                value={form[c.name] === 0 ? "" : form[c.name]}
                step={c.step}
                min="0"
                onChange={handleNumero}
                required
              />
              {c.sufixo && <span className="affix affix-right">{c.sufixo}</span>}
            </div>
          </label>
        ))}

        <button type="submit" className="full" disabled={gerando}>
          {gerando ? "Gerando PDF..." : "Gerar proposta em PDF"}
        </button>
      </form>

      {erro && <p className="erro">{erro}</p>}

      <section className="preview">
        <h2>Prévia do cálculo</h2>
        {economiaNegativa && (
          <p className="alerta">
            ⚠️ O valor pago na energia solar é maior ou igual à conta atual — não há
            economia mensal com os valores informados.
          </p>
        )}
        <ul>
          <li>
            <span>Conta atual (sem solar)</span>
            <b>{formatBRL(resultado.valorSemSolar)}/mês</b>
          </li>
          <li>
            <span>Economia mensal</span>
            <b className="green">{formatBRL(resultado.economiaMensal)}</b>
          </li>
          <li>
            <span>Economia anual</span>
            <b className="green">{formatBRL(resultado.economiaAnual)}</b>
          </li>
          <li>
            <span>Economia em 25 anos</span>
            <b className="green">{formatBRL(resultado.economiaAcumulada[25])}</b>
          </li>
          <li>
            <span>Retorno do investimento</span>
            <b>{formatPayback(resultado)}</b>
          </li>
          <li>
            <span>Valorização do imóvel (5%)</span>
            <b>{formatBRL(resultado.valorizacaoImovel)}</b>
          </li>
        </ul>
      </section>
    </div>
  );
}
