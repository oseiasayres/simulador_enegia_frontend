# Simulador de Economia com Energia Solar — Frontend

Aplicação **React + TypeScript (Vite)**, sem login e sem backend, com um formulário que
calcula a economia de um sistema fotovoltaico e gera uma **proposta comparativa em PDF**
(profissional, tema verde, com gráficos).

## Stack

- React 19 + TypeScript + Vite
- [`@react-pdf/renderer`](https://react-pdf.org/) — geração de PDF vetorial (texto nítido,
  multipágina, gráficos em SVG)

## Funcionalidades

- Formulário com 5 campos: nome do cliente, kWh/mês, valor do imóvel, preço do kWh e
  valor mensal pago na energia solar.
- Prévia do cálculo na tela em tempo real.
- Geração e download de um PDF com:
  - Capa e dados do cliente
  - Dados fixos dos painéis (marca, garantias, produção estimada)
  - Resumo financeiro completo
  - **Gráfico** comparativo mensal (Sem solar × Com solar)
  - **Tabela** comparativa acumulada (1, 5, 10, 15, 20 e 25 anos)
  - **Gráfico** de economia acumulada
  - Valorização estimada do imóvel
- Valores formatados em Real brasileiro (R$).

## Regras de cálculo

| Indicador                  | Fórmula                                         |
|----------------------------|-------------------------------------------------|
| Valor sem solar (mês)      | `kWh/mês × preço do kWh`                         |
| Economia mensal            | `valor sem solar − valor mensal solar`          |
| Economia anual             | `economia mensal × 12`                          |
| Economia acumulada         | `economia anual × anos` (5, 10, 15, 20, 25)     |
| Valorização do imóvel      | `valor do imóvel × 5%`                           |
| Imóvel valorizado          | `valor do imóvel + valorização`                 |
| Investimento estimado      | `valor mensal solar × 60 meses`                 |
| Payback                    | `investimento estimado ÷ economia mensal`       |

> Exemplo: 1.000 kWh × R$ 1,13 = R$ 1.130,00; economia mensal R$ 630,00; em 25 anos R$ 189.000,00.

## Como rodar

```bash
npm install
npm run dev
```

App em http://localhost:5173. Preencha o formulário e clique em **Gerar proposta em PDF**.

## Configuração

Edite `src/config.ts` para ajustar:
- Paleta de cores (verde padrão)
- Percentual de valorização e meses de investimento
- Dados fixos dos painéis (marca, garantias)
- Dados da empresa exibidos no rodapé do PDF (nome, telefone, e-mail)

## Estrutura

```
src/
├── config.ts                # constantes (cores, painéis, empresa)
├── types.ts                 # tipos do formulário e do resultado
├── calc.ts                  # regras de cálculo + formatação BRL
├── components/
│   └── SimuladorForm.tsx    # formulário + prévia + botão de PDF
├── pdf/
│   ├── PropostaPDF.tsx      # documento PDF (react-pdf)
│   └── BarChart.tsx         # gráfico de barras em SVG
├── App.tsx
└── main.tsx
```

## Scripts

| Comando           | Descrição                   |
|-------------------|-----------------------------|
| `npm run dev`     | Servidor de desenvolvimento |
| `npm run build`   | Build de produção (`dist/`) |
| `npm run preview` | Pré-visualiza o build       |
| `npm run lint`    | Lint (oxlint)               |
