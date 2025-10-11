# 건축 데이터 대시보드

건축 데이터(건물 정보, 공사별 검토사항 등)를 웹 대시보드 형태로 시각화하는 인터랙티브 웹 애플리케이션입니다.

## 주요 기능

### 📊 데이터 시각화
- **KPI 카드**: 총 건물 수, 진행중인 공사, 검토 완료, 대기중인 검토사항
- **차트**: 월별 공사 현황 (라인 차트), 지역별 건물 분포 (도넛 차트)
- **데이터 테이블**: 건물 현황 상세 정보

### 🔍 인터랙티브 기능
- **실시간 검색**: 건물명, 공사번호, 담당자로 검색
- **고급 필터링**: 지역, 공사 상태, 기간별 필터링
- **드릴다운**: 건물 상세 정보 모달 팝업
- **페이지네이션**: 대용량 데이터 효율적 표시

### 📱 반응형 디자인
- 데스크톱, 태블릿, 모바일 최적화
- 사이드바 토글 (모바일)
- 터치 친화적 인터페이스

### 🛠️ 추가 기능
- **데이터 내보내기**: CSV 형식으로 데이터 다운로드
- **실시간 새로고침**: 최신 데이터 업데이트
- **키보드 단축키**: Ctrl+F (검색), ESC (모달 닫기)

## 기술 스택

- **HTML5**: 시맨틱 마크업
- **CSS3**: Flexbox, Grid, 애니메이션
- **JavaScript (ES6+)**: 모듈화된 코드 구조
- **Chart.js**: 데이터 시각화
- **Font Awesome**: 아이콘

## 설치 및 실행

### 1. 프로젝트 클론
```bash
git clone [repository-url]
cd architecture-dashboard
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```

또는

```bash
npm start
```

브라우저에서 `http://localhost:3000`으로 접속

## 프로젝트 구조

```
feature-checklist/
├── index.html          # 메인 HTML 파일
├── styles.css          # CSS 스타일시트
├── script.js           # JavaScript 로직
├── package.json        # 프로젝트 설정
└── README.md          # 프로젝트 문서
```

## 사용법

### 기본 사용
1. **대시보드 개요**: 메인 페이지에서 전체 현황 확인
2. **검색**: 상단 검색창에서 건물명 또는 담당자 검색
3. **필터링**: 필터 버튼으로 지역, 상태, 기간별 필터링
4. **상세보기**: 테이블의 "상세보기" 버튼으로 건물별 상세 정보 확인

### 고급 기능
- **차트 인터랙션**: 차트 상단 버튼으로 월별/분기별/연별 전환
- **데이터 내보내기**: 우측 상단 "내보내기" 버튼으로 CSV 다운로드
- **실시간 업데이트**: "새로고침" 버튼으로 최신 데이터 반영

## 데이터 구조

### 건물 정보
```javascript
{
  id: number,           // 고유 ID
  name: string,         // 건물명
  region: string,       // 지역 (seoul, busan, daegu)
  status: string,       // 공사 상태 (planning, ongoing, completed)
  progress: number,     // 진행률 (0-100)
  reviews: Array,       // 검토사항 목록
  manager: string,      // 담당자
  budget: string        // 예산
}
```

### 검토사항
```javascript
{
  title: string,        // 검토 제목
  status: string,       // 상태 (완료, 진행중, 대기)
  date: string          // 일정
}
```

## 커스터마이징

### 데이터 수정
`script.js` 파일의 `buildingData` 배열을 수정하여 실제 데이터로 교체

### 스타일 변경
`styles.css` 파일에서 색상, 폰트, 레이아웃 등 수정 가능

### 기능 확장
- 새로운 필터 옵션 추가
- 추가 차트 타입 구현
- API 연동으로 실시간 데이터 연동

## 브라우저 지원

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 라이선스

MIT License

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 문의사항

프로젝트에 대한 문의사항이나 버그 리포트는 Issues를 통해 제출해 주세요.

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
