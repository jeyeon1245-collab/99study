// 건물 용도별 이슈 비율을 표시하는 도넛 차트 컴포넌트
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from 'recharts'
import type { UsageSummary } from '../lib/excel'

const COLORS = ['#60a5fa', '#10b981', '#f59e0b', '#6366f1', '#ef4444', '#9ca3af']

export default function DonutChartUsage({ data }: { data: UsageSummary[] }) {
  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer>
        <PieChart>
          {/* 툴팁/범례 설정 */}
          <Tooltip formatter={(v: any) => [`${v}건`, '건수']} />
          <Legend verticalAlign="bottom" height={32} wrapperStyle={{ fontSize: 12 }} />
          <Pie
            data={data}
            dataKey="count"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            stroke="#fff"
            strokeWidth={1}
            // 라벨은 카테고리 + 비율로 간단 표기(겹침 완화 필요 시 커스텀 라벨러 사용 가능)
            label={(entry) => `${entry.category} ${entry.percent}%`}
          >
            {data.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
