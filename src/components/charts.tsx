import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CATEGORY_LIST, CATEGORY_META } from '../lib/categories'
import { formatLong } from '../lib/date'
import type { Category, CategoryWeight } from '../lib/types'
import type { ChartRow } from '../lib/series'

const GOLD = '#f2ca50'

interface TooltipPayloadItem {
  dataKey?: string | number
  value?: number | null
  color?: string
}

function ResonanceTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string | number
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-container-high ink-border rounded-lg px-4 py-3 text-xs shadow-lg">
      <p className="font-label-sm uppercase tracking-wider text-on-surface-variant mb-2">
        {typeof label === 'string' ? formatLong(label) : label}
      </p>
      <div className="space-y-1">
        {payload
          .filter((p) => p.value != null)
          .map((p) => (
            <div key={String(p.dataKey)} className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-2 capitalize" style={{ color: p.color }}>
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
                {p.dataKey}
              </span>
              <span className="font-semibold text-on-surface">{p.value}%</span>
            </div>
          ))}
      </div>
    </div>
  )
}

export function ResonanceChart({
  rows,
  categories = true,
  height = 256,
}: {
  rows: ChartRow[]
  categories?: boolean
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
        <XAxis
          dataKey="date"
          tickFormatter={(d: string) => String(Number(d.slice(8, 10)))}
          tick={{ fill: '#99907c', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          minTickGap={24}
        />
        <YAxis
          domain={[0, 100]}
          ticks={[0, 50, 100]}
          tick={{ fill: '#99907c', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip content={<ResonanceTooltip />} cursor={{ stroke: '#2c2c2e' }} />
        {categories &&
          CATEGORY_LIST.map((c) => (
            <Line
              key={c.key}
              type="monotone"
              dataKey={c.key}
              stroke={c.color}
              strokeWidth={1.5}
              strokeOpacity={0.5}
              dot={false}
              connectNulls
              isAnimationActive={false}
            />
          ))}
        <Line
          type="monotone"
          dataKey="overall"
          stroke={GOLD}
          strokeWidth={3}
          dot={false}
          connectNulls
          isAnimationActive={false}
          className="gold-glow"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function WeightDonut({
  weights,
  size = 176,
}: {
  weights: CategoryWeight[]
  size?: number
}) {
  const total = weights.reduce((sum, w) => sum + w.weight, 0)
  const data = weights.map((w) => ({
    category: w.category as Category,
    value: w.weight,
  }))

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="category"
            innerRadius="68%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
            stroke="none"
            paddingAngle={2}
            isAnimationActive={false}
          >
            {data.map((d) => (
              <Cell key={d.category} fill={CATEGORY_META[d.category].color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="font-serif text-signature-num text-3xl text-on-surface">{total}</span>
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
          Total
        </span>
      </div>
    </div>
  )
}
