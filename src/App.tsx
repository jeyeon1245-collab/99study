// 앱의 전체 레이아웃/상태/라우팅(탭 전환)을 관리하는 최상위 컴포넌트 파일입니다.
// - 파일 업로드 → 엑셀 파싱(parseFileSummaries) → 상태 보관(issues/usage/rows/projects)
// - 사이드바에서 "대시보드/데이터 테이블" 탭 전환
// - 상단 검색어(query)로 프로젝트명 필터링(차트/테이블 동시 적용)
import './App.css'
import { useState } from 'react'
import { parseFileSummaries, type IssuesSummary, type UsageSummary, type NormalizedRow, type ProjectPivot, ISSUE_CATEGORIES, USAGE_CATEGORIES } from './lib/excel'
import BarChartIssues from './components/BarChartIssues'
import DonutChartUsage from './components/DonutChartUsage'

// 좌측 고정 사이드바(단순 탭 전환 역할)
function Sidebar({ tab, setTab }: { tab: 'dashboard' | 'table'; setTab: (t: 'dashboard' | 'table') => void }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">메뉴</div>
      <nav className="sidebar-nav">
        {/* eslint-disable jsx-a11y/anchor-is-valid */}
        <a className={tab === 'dashboard' ? 'active' : ''} href="#" onClick={(e) => { e.preventDefault(); setTab('dashboard') }}>대시보드</a>
        <a className={tab === 'table' ? 'active' : ''} href="#" onClick={(e) => { e.preventDefault(); setTab('table') }}>데이터 테이블</a>
      </nav>
    </aside>
  )
}

type Stat = { label: string; value: string; color?: 'green' | 'amber' | 'rose' | 'muted' }

// 작은 통계 카드(개수/상태 등 간단 정보)
function StatCard({ label, value, color = 'muted' }: Stat) {
  return (
    <div className="panel stat-card">
      <div className={`stat-dot ${color}`} />
      <div className="stat-meta">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  )
}

// 공통 패널 컨테이너(제목 + 내용)
function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="panel">
      <div className="panel-title">{title}</div>
      {children}
    </div>
  )
}

// 대시보드 화면: 상단 통계 + 이슈 Bar 차트 + 용도 Donut 차트
// props로 집계된 요약 데이터(issues/usage)를 받아 렌더링만 담당합니다.
function DashboardPage({ issues, usage }: { issues: IssuesSummary[] | null, usage: UsageSummary[] | null }) {
  return (
    <div className="content">
      <div className="stat-grid">
        <StatCard label="총 프로젝트 수" value="3" color="green" />
        <StatCard label="완료된 프로젝트" value="1" color="green" />
        <StatCard label="작업중인 프로젝트" value="1" color="amber" />
        <StatCard label="미진행 프로젝트" value="1" color="rose" />
      </div>

      <div className="grid-2">
        <Panel title="프로젝트 정보">
          <ul className="bullets">
            <li>프로젝트명: 예시빌딩</li>
            <li>주소: 서울특별시 강남구 테헤란로 123</li>
            <li>층수: 15층</li>
            <li>연면적: 12,000㎡</li>
            <li>준공연도: 2018년</li>
          </ul>
        </Panel>
        <Panel title="검토사항">
          <div className="review-stats">
            <div><strong>총 오류</strong> 12</div>
            <div><strong>신규</strong> 3</div>
            <div><strong>진행중</strong> 5</div>
            <div><strong>완료</strong> 4</div>
          </div>
          <ol className="bullets">
            <li>전기 설비 점검 필요</li>
            <li>화재 안전 진단 예정(2025년 11월)</li>
            <li>공용 공간 리모델링 검토</li>
            <li>임대 계약 만료 현황 확인</li>
          </ol>
        </Panel>
      </div>

      <div className="grid-2">
        <Panel title="프로젝트 별 이슈 리스트">
          {issues ? (
            <BarChartIssues data={issues} />
          ) : (
            <div className="placeholder-chart">엑셀을 업로드하면 카테고리별 건수가 표시됩니다</div>
          )}
        </Panel>
        <Panel title="건물 용도별 이슈 리스트">
          {usage ? (
            <DonutChartUsage data={usage} />
          ) : (
            <div className="placeholder-chart">엑셀을 업로드하면 용도별 비율이 표시됩니다</div>
          )}
        </Panel>
      </div>
    </div>
  )
}

// 데이터 테이블 화면: 프로젝트별 요약 테이블 + 선택 프로젝트의 상세 테이블
// - projects: 프로젝트 피벗 요약(카테고리별 건수/총계)
// - rows: 정규화된 원시행(검토공종/검토내용/BIM작성기준 등)
function DataTablePage({ projects, rows }: { projects: ProjectPivot[] | null, rows: NormalizedRow[] | null }) {
  const [selected, setSelected] = useState<string | null>(null)
  const list = projects ?? []
  const sel = selected ?? (list[0]?.project ?? null)
  const details = (rows ?? []).filter(r => r.project === sel)
  return (
    <div className="content">
      <div className="panel">
        <div className="panel-title">프로젝트 현황 상세</div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th style={{width: '24%'}}>프로젝트명</th>
                <th>용도</th>
                <th>도서상이</th>
                <th>부재간섭</th>
                <th>정보누락</th>
                <th>시공성검토</th>
                <th>표기오류</th>
                <th>총계</th>
              </tr>
            </thead>
            <tbody>
              {list.map(p => (
                <tr key={p.project} className={sel === p.project ? 'active' : ''} onClick={() => setSelected(p.project)}>
                  <td>{p.project}</td>
                  <td>{p.usage}</td>
                  <td>{p.counts['도서상이']}</td>
                  <td>{p.counts['부재간섭']}</td>
                  <td>{p.counts['정보누락']}</td>
                  <td>{p.counts['시공성검토']}</td>
                  <td>{p.counts['표기오류']}</td>
                  <td><strong>{p.total}</strong></td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr><td colSpan={8} style={{textAlign:'center', color:'var(--muted)'}}>엑셀을 업로드하면 프로젝트별 요약이 표시됩니다</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel" style={{marginTop: 16}}>
        <div className="panel-title">검토 상세 데이터</div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th style={{width:'18%'}}>검토공종</th>
                <th>검토내용</th>
                <th style={{width:'22%'}}>BIM작성기준</th>
              </tr>
            </thead>
            <tbody>
              {details.map((d, i) => (
                <tr key={i}>
                  <td>{d.discipline ?? '-'}</td>
                  <td>{d.content ?? '-'}</td>
                  <td>{d.bimStandard ?? '-'}</td>
                </tr>
              ))}
              {details.length === 0 && (
                <tr><td colSpan={3} style={{textAlign:'center', color:'var(--muted)'}}>프로젝트 행을 선택하거나, 엑셀을 업로드하세요</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  // 현재 선택 탭(dashboard/table)
  const [tab, setTab] = useState<'dashboard' | 'table'>('dashboard')
  // 엑셀 파싱 후 요약 데이터(차트에 사용)
  const [issues, setIssues] = useState<IssuesSummary[] | null>(null)
  const [usage, setUsage] = useState<UsageSummary[] | null>(null)
  // 엑셀 파싱 후 정규화된 원시행/프로젝트 피벗(테이블/검색에 사용)
  const [rows, setRows] = useState<NormalizedRow[] | null>(null)
  const [projects, setProjects] = useState<ProjectPivot[] | null>(null)
  // 상단 검색어(프로젝트명 포함 필터)
  const [query, setQuery] = useState('')

  // 파일 업로드 → 엑셀 파싱 → 상태 저장
  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const { issues, usage, rows, projects } = await parseFileSummaries(file)
    setIssues(issues)
    setUsage(usage)
    setRows(rows)
    setProjects(projects)
  }

  // 검색어가 있을 때 대시보드용 요약(issues/usage)을 rows에서 재집계하여 반영
  const filteredRows = rows?.filter(r => !query || r.project.toLowerCase().includes(query.toLowerCase())) ?? null
  function withPercents<T extends { category: any; count: number; percent: number }>(cats: readonly any[], counts: Record<string, number>): T[] {
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1
    return cats.map((c: any) => ({ category: c, count: counts[c] ?? 0, percent: Math.round(((counts[c] ?? 0) / total) * 1000) / 10 })) as T[]
  }
  let dashIssues: IssuesSummary[] | null = issues
  let dashUsage: UsageSummary[] | null = usage
  if (filteredRows && filteredRows.length && query) {
    const ic: Record<string, number> = {}
    const uc: Record<string, number> = {}
    for (const r of filteredRows) {
      ic[r.issue] = (ic[r.issue] ?? 0) + 1
      uc[r.usage] = (uc[r.usage] ?? 0) + 1
    }
    dashIssues = withPercents<IssuesSummary>(ISSUE_CATEGORIES, ic)
    dashUsage = withPercents<UsageSummary>(USAGE_CATEGORIES, uc)
  }

  return (
    <div className="app">
      <Sidebar tab={tab} setTab={setTab} />
      <main className="main">
        <header className="topbar">
          <h1>{tab === 'dashboard' ? '대시보드' : '데이터 테이블'}</h1>
          <div className="toolbar" style={{margin:0, marginLeft:'auto'}}>
            <div>엑셀/CSV 파일 업로드:</div>
            <input type="file" accept=".xlsx,.xls,.csv" onChange={onFile} />
            <input className="search" placeholder="프로젝트명 또는 프로젝트 검색..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </header>
        {tab === 'dashboard' ? (
          <DashboardPage issues={dashIssues} usage={dashUsage} />
        ) : (
          <DataTablePage projects={projects?.filter(p => !query || p.project.toLowerCase().includes(query.toLowerCase())) ?? null} rows={rows?.filter(r => !query || r.project.toLowerCase().includes(query.toLowerCase())) ?? null} />
        )}
      </main>
    </div>
  )
}
