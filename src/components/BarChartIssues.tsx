// 카테고리(이슈 유형)별 건수를 표시하는 막대그래프 컴포넌트
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, LabelList } from 'recharts'
import type { IssuesSummary } from '../lib/excel'

export default function BarChartIssues({ data }: { data: IssuesSummary[] }) {
  // 커스텀 툴팁: 호버 시 카테고리명/건수/비율 노출
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const row = payload[0].payload as IssuesSummary
      return (
        <div style={{ background: 'white', border: '1px solid #e5e7eb', padding: 8, borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
          <div>건수: <strong>{row.count}건</strong></div>
          <div>비율: <strong>{row.percent}%</strong></div>
        </div>
      )
    }
    return null
  }

  // 막대 내부(또는 너무 낮으면 막대 위)에 건수/비율 라벨을 표시
  const CenteredCountLabel = (props: any) => {
    const { x = 0, y = 0, width = 0, height = 0, value, index = 0 } = props
  const p = data?.[index]?.percent ?? 0
  const text = `${value ?? 0}건 (${p}%)`
    const cx = x + width / 2
    // If the bar is too short, draw label above the bar for readability
    if (height < 18) {
      return (
        <text x={cx} y={y - 6} textAnchor="middle" dominantBaseline="auto" fill="#374151" fontSize={12} fontWeight={700}>
          {text}
        </text>
      )
    }
    const cy = y + height / 2
    return (
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="#ffffff" stroke="rgba(0,0,0,0.35)" strokeWidth={2} style={{ paintOrder: 'stroke fill' }} fontSize={12} fontWeight={700}>
        {text}
      </text>
    )
  }

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 12, right: 12, left: 12, bottom: 4 }}>
          {/* 보조격자/축/툴팁 설정 */}
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="category" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          {/* 실 데이터: count 키를 막대 높이로 사용 */}
          <Bar dataKey="count" fill="#3b82f6" radius={[6,6,0,0]}>
            <LabelList dataKey="count" content={<CenteredCountLabel />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
