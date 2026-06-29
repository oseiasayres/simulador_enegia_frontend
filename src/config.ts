// Paleta de cores — verde como cor padrão do sistema e do PDF
export const CORES = {
  verdeEscuro: "#14532d",
  verde: "#1f7a3d",
  verdeMedio: "#2e9e54",
  verdeClaro: "#dcfce7",
  verdeFundo: "#f0fdf4",
  cinzaTexto: "#374151",
  cinzaClaro: "#6b7280",
  cinzaLinha: "#e5e7eb",
  branco: "#ffffff",
  vermelho: "#dc2626",
} as const;

// Percentual de valorização do imóvel
export const PERCENTUAL_VALORIZACAO = 0.05; // 5%

// Meses considerados para o investimento estimado (payback)
export const MESES_INVESTIMENTO = 60;

// Dados fixos dos painéis exibidos no PDF
export const PAINEIS = {
  marca: "JA Solar / Canadian Solar (TIER 1)",
  garantia: "25 anos de geração e 10 anos contra defeitos de fabricação",
  garantiaInversor: "10 anos",
  garantiaInstalacao: "1 ano",
} as const;

// Dados da empresa exibidos no rodapé do PDF (ajuste conforme necessário)
export const EMPRESA = {
  nome: "Energia Solar",
  slogan: "Proposta comercial do sistema fotovoltaico",
  telefone: "(00) 00000-0000",
  email: "contato@energiasolar.com.br",
} as const;
