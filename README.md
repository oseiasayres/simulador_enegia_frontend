# Simulador de Energia — Frontend

Interface em **React + TypeScript (Vite)** para o Simulador de Energia Solar. Consome a API FastAPI do backend.

## Stack

- React 19 + TypeScript
- Vite
- `fetch` nativo para chamadas à API

## Estrutura

```
src/
├── api/
│   └── client.ts          # chamadas à API
├── components/
│   └── SimuladorForm.tsx  # formulário + resultado
├── types.ts               # tipos compartilhados com a API
├── App.tsx
└── main.tsx
```

## Como rodar

```bash
npm install
cp .env.example .env        # ajuste VITE_API_URL se necessário

npm run dev
```

App em http://localhost:5173 (precisa do backend rodando em http://localhost:8000).

## Variáveis de ambiente

| Variável        | Padrão                           | Descrição              |
|-----------------|----------------------------------|------------------------|
| `VITE_API_URL`  | `http://localhost:8000/api/v1`   | URL base da API        |

## Scripts

| Comando           | Descrição                       |
|-------------------|---------------------------------|
| `npm run dev`     | Servidor de desenvolvimento     |
| `npm run build`   | Build de produção (`dist/`)     |
| `npm run preview` | Pré-visualiza o build           |
| `npm run lint`    | Lint (oxlint)                   |
