import { Svg, Rect, Line, Text as SvgText, G } from "@react-pdf/renderer";
import { CORES } from "../config";

export interface Barra {
  label: string;
  value: number;
  color: string;
}

interface Props {
  data: Barra[];
  width?: number;
  height?: number;
  /** Formata o rótulo de valor exibido acima de cada barra. */
  formatValue: (v: number) => string;
}

/** Gráfico de barras verticais simples desenhado em SVG (vetorial no PDF). */
export function BarChart({ data, width = 500, height = 210, formatValue }: Props) {
  const marginTop = 18;
  const marginBottom = 34;
  const marginX = 8;
  const plotH = height - marginTop - marginBottom;
  const plotW = width - marginX * 2;
  const max = Math.max(...data.map((d) => d.value), 1);
  const slot = plotW / data.length;
  const barWidth = Math.min(slot * 0.55, 90);
  const baseY = marginTop + plotH;

  return (
    <Svg width={width} height={height}>
      {/* Linha de base */}
      <Line
        x1={marginX}
        y1={baseY}
        x2={width - marginX}
        y2={baseY}
        strokeWidth={1}
        stroke={CORES.cinzaLinha}
      />
      {data.map((d, i) => {
        const h = max > 0 ? (d.value / max) * plotH : 0;
        const x = marginX + i * slot + (slot - barWidth) / 2;
        const y = baseY - h;
        const cx = x + barWidth / 2;
        return (
          <G key={i}>
            <Rect
              x={x}
              y={y}
              width={barWidth}
              height={Math.max(h, 0.5)}
              fill={d.color}
              rx={3}
            />
            <SvgText
              x={cx}
              y={y - 5}
              textAnchor="middle"
              style={{ fontSize: 8 }}
              fill={CORES.cinzaTexto}
            >
              {formatValue(d.value)}
            </SvgText>
            <SvgText
              x={cx}
              y={baseY + 14}
              textAnchor="middle"
              style={{ fontSize: 8 }}
              fill={CORES.cinzaClaro}
            >
              {d.label}
            </SvgText>
          </G>
        );
      })}
    </Svg>
  );
}
