// 엑셀 파일을 읽어 대시보드/테이블에 필요한 형태로 변환하는 유틸 함수 모음입니다.
// - 이슈/용도 카테고리 집계(Bar/Donut 차트용)
// - 프로젝트별 피벗 요약 및 상세 행 생성(데이터 테이블용)
import * as XLSX from 'xlsx'

export type IssueCategory = '도서상이' | '부재간섭' | '정보누락' | '시공성검토' | '표기오류'
export type IssueRow = {
  프로젝트?: string
  카테고리: IssueCategory | string
  건수?: number
  용도?: string
}

export type IssuesSummary = {
  category: IssueCategory
  count: number
  percent: number
}

const KNOWN_CATEGORIES: IssueCategory[] = ['도서상이', '부재간섭', '정보누락', '시공성검토', '표기오류']
export const ISSUE_CATEGORIES = KNOWN_CATEGORIES as readonly IssueCategory[]

export type UsageCategory = '데이터센터' | '공동주택' | '물류창고' | '업무시설' | '문화시설' | '기타'
export type UsageSummary = { category: UsageCategory; count: number; percent: number }

// 화면에 쓰기 좋은 형태로 정규화한 한 행(프로젝트 단위의 이슈 기록)
export type NormalizedRow = {
  project: string
  usage: UsageCategory
  issue: IssueCategory
  discipline?: string
  content?: string
  bimStandard?: string
}

export type ProjectPivot = {
  project: string
  usage: UsageCategory
  total: number
  counts: Record<IssueCategory, number>
}

const KNOWN_USAGE: UsageCategory[] = ['데이터센터', '공동주택', '물류창고', '업무시설', '문화시설', '기타']
export const USAGE_CATEGORIES = KNOWN_USAGE as readonly UsageCategory[]

// 카테고리 문자열을 사전 정의된 이슈 카테고리로 매핑(포함단어 기준 간단 규칙)
function mapIssueCategory(raw: string): IssueCategory | undefined {
  const exact = KNOWN_CATEGORIES.find((c) => c === raw)
  if (exact) return exact
  if (/도서|도면|상이/.test(raw)) return '도서상이'
  if (/간섭/.test(raw)) return '부재간섭'
  if (/누락|정보/.test(raw)) return '정보누락'
  if (/시공|검토/.test(raw)) return '시공성검토'
  if (/표기|오류|오타/.test(raw)) return '표기오류'
  return undefined
}

// 용도 문자열을 사전 정의된 용도 카테고리로 매핑(포함단어 기준 간단 규칙)
function mapUsageCategory(raw: string): UsageCategory {
  if (/데이터.?센터/i.test(raw)) return '데이터센터'
  if (/공동.?주택|아파트/i.test(raw)) return '공동주택'
  if (/물류|창고/i.test(raw)) return '물류창고'
  if (/업무|오피스|사무|빌딩/i.test(raw)) return '업무시설'
  if (/문화|박물관|전시|공연/i.test(raw)) return '문화시설'
  return '기타'
}

// 자유 텍스트(검토내용 등)에서 이슈 카테고리를 유추
function inferIssueFromText(text: string): IssueCategory | undefined {
  const t = text.toLowerCase()
  if (/도면|상이|호칭상|치수상|명칭상/.test(t)) return '도서상이'
  if (/간섭|충돌|interference|clash/.test(t)) return '부재간섭'
  if (/누락|미기재|미표기|정보.*부족|자료.*부족/.test(t)) return '정보누락'
  if (/시공성|시공.*곤란|공법.*검토|공정.*검토/.test(t)) return '시공성검토'
  if (/표기|오류|오타|기입.*오류|단위.*오류/.test(t)) return '표기오류'
  return undefined
}

// counts → percent(%) 계산을 포함한 배열로 변환
function withPercents<T extends { count: number }>(cats: readonly string[], counts: Record<string, number>) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1
  return cats.map((cat) => ({
    category: cat,
    count: counts[cat] ?? 0,
    percent: Math.round(((counts[cat] ?? 0) / total) * 1000) / 10,
  })) as any as T[]
}

// 파일명/열값에서 프로젝트명을 추출(파일명 패턴 보정 포함)
function deriveProjectName(rr: any): string {
  const direct = rr.프로젝트명 ?? rr.프로젝트 ?? rr.project ?? rr.Project
  if (direct) return String(direct)
  const fname: string = String((rr.파일명 ?? rr['파일 명'] ?? rr.filename ?? rr.file ?? '').toString())
  if (!fname) return '프로젝트'
  const base = fname.replace(/\.[^.]+$/, '')
  // Trim common suffixes
  return base.replace(/(_?전체)?_?검토(보고서)?$/i, '')
}

// 엑셀 파일을 파싱하여 요약(issues/usage) + 상세(rows) + 프로젝트 피벗(projects)을 반환
export async function parseFileSummaries(file: File): Promise<{ issues: IssuesSummary[]; usage: UsageSummary[]; rows: NormalizedRow[]; projects: ProjectPivot[] }> {
  const buf = await file.arrayBuffer()
  const wb = XLSX.read(buf, { type: 'array' })
  const wsname = wb.SheetNames[0]
  const ws = wb.Sheets[wsname]
  const rows: IssueRow[] = XLSX.utils.sheet_to_json(ws, { defval: '' }) as any

  const issueCounts: Record<IssueCategory, number> = {
    도서상이: 0,
    부재간섭: 0,
    정보누락: 0,
    시공성검토: 0,
    표기오류: 0,
  }
  const usageCounts: Record<UsageCategory, number> = {
    데이터센터: 0,
    공동주택: 0,
    물류창고: 0,
    업무시설: 0,
    문화시설: 0,
    기타: 0,
  }

  const normalized: NormalizedRow[] = []
  const perProject: Record<string, ProjectPivot> = {}

  for (const r of rows) {
    const rr: any = r as any
    const rawCat = String(((rr.카테고리 ?? rr.category ?? rr['Category'] ?? '') as string).toString().trim())
    let issue = mapIssueCategory(rawCat)
    if (!issue) {
      const text = String((rr.검토내용 ?? rr['검토 내용'] ?? rr.내용 ?? rr.note ?? rr.description ?? '').toString())
      if (text) issue = inferIssueFromText(text)
    }
    const c = Number((rr.건수 ?? rr.count ?? 1) as number)
    const count = Number.isFinite(c) && c > 0 ? c : 1
    if (issue) issueCounts[issue] += count

    let rawUse = String(((rr.용도 ?? rr.건물용도 ?? rr.용도구분 ?? rr.usage ?? rr.Usage ?? rr['Building Use'] ?? '') as string).toString().trim())
    if (!rawUse) {
      // Try infer from filename if present (e.g., KT_DC_xxx -> 데이터센터)
      const fname = String((rr.파일명 ?? rr['파일 명'] ?? rr.filename ?? rr.file ?? '').toString())
      if (/\bDC\b|data.?center|datacenter|센터/i.test(fname)) rawUse = '데이터센터'
      else if (/APT|아파트|공동.?주택/i.test(fname)) rawUse = '공동주택'
      else if (/LOG|물류|창고/i.test(fname)) rawUse = '물류창고'
      else if (/OFFICE|업무|오피스|사무/i.test(fname)) rawUse = '업무시설'
      else if (/CULT|문화|뮤지엄|박물관|전시|공연/i.test(fname)) rawUse = '문화시설'
    }
    const use = mapUsageCategory(rawUse)
    usageCounts[use] += count

    // 정규화된 행과 프로젝트별 합계를 동시에 생성
    if (issue) {
      const project = deriveProjectName(rr)
      normalized.push({
        project,
        usage: use,
        issue,
        discipline: rr.검토공종 ?? rr['검토 공종'] ?? rr.공종 ?? rr.discipline,
        content: rr.검토내용 ?? rr['검토 내용'] ?? rr.내용 ?? rr.note ?? rr.description,
        bimStandard: rr.BIM작성기준 ?? rr['BIM작성기준'] ?? rr.BIM ?? rr.standard,
      })
      if (!perProject[project]) {
        perProject[project] = {
          project,
          usage: use,
          total: 0,
          counts: { 도서상이: 0, 부재간섭: 0, 정보누락: 0, 시공성검토: 0, 표기오류: 0 },
        }
      }
      perProject[project].counts[issue] += count
      perProject[project].total += count
    }
  }

  return {
    issues: withPercents<IssuesSummary>(KNOWN_CATEGORIES, issueCounts),
    usage: withPercents<UsageSummary>(KNOWN_USAGE, usageCounts),
    rows: normalized,
    projects: Object.values(perProject),
  }
}

// Backwards-compatible function for issues only
export async function parseIssuesFromFile(file: File): Promise<IssuesSummary[]> {
  const { issues } = await parseFileSummaries(file)
  return issues
}
