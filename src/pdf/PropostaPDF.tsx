import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import { CORES, EMPRESA, PAINEIS, PERCENTUAL_VALORIZACAO } from "../config";
import {
  formatBRL,
  formatBRLCompact,
  formatKwh,
  formatPayback,
} from "../calc";
import type { FormData, Resultado } from "../types";
import { BarChart } from "./BarChart";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: CORES.cinzaTexto,
    paddingBottom: 56,
  },
  // Cabeçalho
  header: {
    backgroundColor: CORES.verde,
    paddingVertical: 26,
    paddingHorizontal: 32,
  },
  headerKicker: {
    color: CORES.verdeClaro,
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 6,
    fontFamily: "Helvetica-Bold",
  },
  headerTitle: {
    color: CORES.branco,
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    lineHeight: 1.2,
  },
  headerSub: {
    color: CORES.verdeClaro,
    fontSize: 10,
    marginTop: 6,
  },
  body: {
    paddingHorizontal: 32,
    paddingTop: 18,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  metaText: { fontSize: 9, color: CORES.cinzaClaro },
  // Cards de destaque
  cards: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: CORES.verdeFundo,
    borderWidth: 1,
    borderColor: CORES.verdeClaro,
    borderRadius: 6,
    padding: 10,
  },
  cardLabel: { fontSize: 7.5, color: CORES.cinzaClaro, marginBottom: 4 },
  cardValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: CORES.verdeEscuro,
  },
  // Seções
  section: { marginBottom: 18 },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: CORES.verdeEscuro,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: CORES.verde,
  },
  // Linhas de info
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: CORES.cinzaLinha,
  },
  rowLabel: { fontSize: 9.5, color: CORES.cinzaClaro },
  rowValue: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: CORES.cinzaTexto,
  },
  rowHighlight: { backgroundColor: CORES.verdeFundo },
  rowValueGreen: { color: CORES.verde },
  // Tabela
  table: { borderWidth: 1, borderColor: CORES.cinzaLinha, borderRadius: 4 },
  th: {
    flexDirection: "row",
    backgroundColor: CORES.verde,
  },
  thCell: {
    color: CORES.branco,
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
    padding: 6,
  },
  tr: { flexDirection: "row", borderTopWidth: 1, borderTopColor: CORES.cinzaLinha },
  trAlt: { backgroundColor: CORES.verdeFundo },
  td: { fontSize: 8.5, padding: 6, color: CORES.cinzaTexto },
  tdBold: { fontFamily: "Helvetica-Bold", color: CORES.verdeEscuro },
  // Gráfico
  chartBox: {
    borderWidth: 1,
    borderColor: CORES.cinzaLinha,
    borderRadius: 4,
    padding: 10,
    alignItems: "center",
  },
  legend: { flexDirection: "row", justifyContent: "center", gap: 18, marginTop: 6 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 9, height: 9, borderRadius: 2 },
  legendText: { fontSize: 8, color: CORES.cinzaClaro },
  // Destaque valorização
  valorizacaoBox: {
    backgroundColor: CORES.verdeEscuro,
    borderRadius: 6,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  valBlock: { alignItems: "center", flex: 1 },
  valLabel: { fontSize: 8, color: CORES.verdeClaro, marginBottom: 4 },
  valValue: { fontSize: 13, fontFamily: "Helvetica-Bold", color: CORES.branco },
  // Rodapé
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: CORES.verdeEscuro,
    paddingVertical: 10,
    paddingHorizontal: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: { color: CORES.verdeClaro, fontSize: 8 },
});

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

interface Props {
  dados: FormData;
  resultado: Resultado;
  dataEmissao: string;
}

export function PropostaPDF({ dados, resultado, dataEmissao }: Props) {
  const pctValorizacao = `${(PERCENTUAL_VALORIZACAO * 100).toLocaleString("pt-BR")}%`;

  const comparativoMensal = [
    { label: "Sem energia solar", value: resultado.valorSemSolar, color: CORES.cinzaClaro },
    { label: "Com energia solar", value: resultado.valorComSolar, color: CORES.verde },
  ];

  const acumuladoChart = [5, 10, 15, 20, 25].map((anos) => ({
    label: `${anos} anos`,
    value: resultado.economiaAcumulada[anos as 5],
    color: CORES.verdeMedio,
  }));

  return (
    <Document
      title={`Proposta Energia Solar - ${dados.nome}`}
      author={EMPRESA.nome}
    >
      <Page size="A4" style={styles.page}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.headerKicker}>PROPOSTA COMERCIAL</Text>
          <Text style={styles.headerTitle}>
            Simulação de Economia com Energia Solar
          </Text>
          <Text style={styles.headerSub}>{EMPRESA.slogan}</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.meta}>
            <Text style={styles.metaText}>Cliente: {dados.nome}</Text>
            <Text style={styles.metaText}>Emissão: {dataEmissao}</Text>
          </View>

          {/* Cards de destaque */}
          <View style={styles.cards}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Economia mensal</Text>
              <Text style={styles.cardValue}>{formatBRL(resultado.economiaMensal)}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Economia anual</Text>
              <Text style={styles.cardValue}>{formatBRL(resultado.economiaAnual)}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Em 25 anos</Text>
              <Text style={styles.cardValue}>
                {formatBRL(resultado.economiaAcumulada[25])}
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Retorno (payback)</Text>
              <Text style={styles.cardValue}>{formatPayback(resultado)}</Text>
            </View>
          </View>

          {/* Dados do cliente */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dados do Cliente</Text>
            <InfoRow label="Nome completo" value={dados.nome} />
            <InfoRow
              label="Produção estimada mensal"
              value={formatKwh(dados.kwhMes)}
            />
            <InfoRow label="Preço atual do kWh" value={formatBRL(dados.precoKwh)} />
            <InfoRow label="Valor atual do imóvel" value={formatBRL(dados.valorImovel)} />
            <InfoRow
              label="Valor mensal na energia solar"
              value={formatBRL(dados.mensalSolar)}
            />
          </View>

          {/* Dados fixos dos painéis */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Painéis Solares e Garantias</Text>
            <InfoRow label="Marca dos painéis" value={PAINEIS.marca} />
            <InfoRow label="Garantia dos painéis" value={PAINEIS.garantia} />
            <InfoRow label="Garantia do inversor" value={PAINEIS.garantiaInversor} />
            <InfoRow label="Garantia da instalação" value={PAINEIS.garantiaInstalacao} />
            <InfoRow
              label="Produção estimada de energia"
              value={`${formatKwh(dados.kwhMes)}/mês  •  ${formatKwh(dados.kwhMes * 12)}/ano`}
            />
          </View>

          {/* Resumo financeiro */}
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Resumo Financeiro</Text>
            <InfoRow
              label="Valor mensal estimado SEM energia solar"
              value={formatBRL(resultado.valorSemSolar)}
            />
            <InfoRow
              label="Valor mensal COM energia solar"
              value={formatBRL(resultado.valorComSolar)}
            />
            <View style={[styles.row, styles.rowHighlight]}>
              <Text style={styles.rowLabel}>Economia mensal</Text>
              <Text style={[styles.rowValue, styles.rowValueGreen]}>
                {formatBRL(resultado.economiaMensal)}
              </Text>
            </View>
            <View style={[styles.row, styles.rowHighlight]}>
              <Text style={styles.rowLabel}>Economia anual</Text>
              <Text style={[styles.rowValue, styles.rowValueGreen]}>
                {formatBRL(resultado.economiaAnual)}
              </Text>
            </View>
            <InfoRow
              label="Tempo estimado de retorno (payback)"
              value={formatPayback(resultado)}
            />
            <InfoRow
              label={`Valorização estimada do imóvel (${pctValorizacao})`}
              value={formatBRL(resultado.valorizacaoImovel)}
            />
            <InfoRow
              label="Novo valor estimado do imóvel"
              value={formatBRL(resultado.valorImovelValorizado)}
            />
          </View>

          {/* Comparativo mensal */}
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Comparativo Mensal</Text>
            <View style={styles.chartBox}>
              <BarChart
                data={comparativoMensal}
                height={180}
                formatValue={formatBRL}
              />
              <View style={styles.legend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: CORES.cinzaClaro }]} />
                  <Text style={styles.legendText}>Sem energia solar</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: CORES.verde }]} />
                  <Text style={styles.legendText}>Com energia solar</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Comparativo acumulado */}
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Comparativo Acumulado</Text>
            <View style={styles.table}>
              <View style={styles.th}>
                <Text style={[styles.thCell, { flex: 1.2 }]}>Período</Text>
                <Text style={[styles.thCell, { flex: 2, textAlign: "right" }]}>
                  Sem energia solar
                </Text>
                <Text style={[styles.thCell, { flex: 2, textAlign: "right" }]}>
                  Com energia solar
                </Text>
                <Text style={[styles.thCell, { flex: 2, textAlign: "right" }]}>
                  Economia acumulada
                </Text>
              </View>
              {resultado.acumulado.map((l, i) => (
                <View
                  key={l.anos}
                  style={i % 2 === 1 ? [styles.tr, styles.trAlt] : styles.tr}
                >
                  <Text style={[styles.td, { flex: 1.2 }]}>{l.rotulo}</Text>
                  <Text style={[styles.td, { flex: 2, textAlign: "right" }]}>
                    {formatBRL(l.semSolar)}
                  </Text>
                  <Text style={[styles.td, { flex: 2, textAlign: "right" }]}>
                    {formatBRL(l.comSolar)}
                  </Text>
                  <Text
                    style={[styles.td, styles.tdBold, { flex: 2, textAlign: "right" }]}
                  >
                    {formatBRL(l.economia)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Gráfico de economia acumulada */}
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Economia Acumulada ao Longo dos Anos</Text>
            <View style={styles.chartBox}>
              <BarChart data={acumuladoChart} formatValue={formatBRLCompact} />
            </View>
          </View>

          {/* Valorização do imóvel */}
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Valorização do Imóvel</Text>
            <View style={styles.valorizacaoBox}>
              <View style={styles.valBlock}>
                <Text style={styles.valLabel}>Valor atual</Text>
                <Text style={styles.valValue}>{formatBRL(dados.valorImovel)}</Text>
              </View>
              <View style={styles.valBlock}>
                <Text style={styles.valLabel}>Valorização ({pctValorizacao})</Text>
                <Text style={styles.valValue}>
                  + {formatBRL(resultado.valorizacaoImovel)}
                </Text>
              </View>
              <View style={styles.valBlock}>
                <Text style={styles.valLabel}>Novo valor estimado</Text>
                <Text style={styles.valValue}>
                  {formatBRL(resultado.valorImovelValorizado)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Rodapé fixo */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {EMPRESA.nome}  •  {EMPRESA.telefone}  •  {EMPRESA.email}
          </Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
