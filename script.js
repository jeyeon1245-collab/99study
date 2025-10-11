// 건축 데이터 시뮬레이션
const buildingData = [
    {
        id: 1,
        name: "서울타워 오피스텔",
        region: "seoul",
        status: "ongoing",
        progress: 75,
        reviews: [
            { title: "구조안전성 검토", status: "완료", date: "2024-01-15" },
            { title: "화재안전 검토", status: "진행중", date: "2024-01-20" },
            { title: "환경영향평가", status: "대기", date: "2024-01-25" }
        ],
        manager: "김건축",
        budget: "50억원"
    },
    {
        id: 2,
        name: "부산 해운대 아파트",
        region: "busan",
        status: "planning",
        progress: 25,
        reviews: [
            { title: "토지이용계획 검토", status: "완료", date: "2024-01-10" },
            { title: "교통영향평가", status: "진행중", date: "2024-01-18" }
        ],
        manager: "이설계",
        budget: "120억원"
    },
    {
        id: 3,
        name: "대구 센트럴 플라자",
        region: "daegu",
        status: "completed",
        progress: 100,
        reviews: [
            { title: "최종 안전점검", status: "완료", date: "2024-01-05" },
            { title: "사용승인 검토", status: "완료", date: "2024-01-08" }
        ],
        manager: "박시공",
        budget: "80억원"
    },
    {
        id: 4,
        name: "인천 스마트시티",
        region: "seoul",
        status: "ongoing",
        progress: 60,
        reviews: [
            { title: "스마트시티 계획 검토", status: "완료", date: "2024-01-12" },
            { title: "ICT 인프라 검토", status: "진행중", date: "2024-01-22" },
            { title: "에너지 효율성 검토", status: "대기", date: "2024-01-28" }
        ],
        manager: "최기술",
        budget: "200억원"
    },
    {
        id: 5,
        name: "광주 문화센터",
        region: "busan",
        status: "planning",
        progress: 15,
        reviews: [
            { title: "문화시설 계획 검토", status: "진행중", date: "2024-01-16" }
        ],
        manager: "정문화",
        budget: "35억원"
    },
    {
        id: 6,
        name: "대전 연구단지",
        region: "daegu",
        status: "ongoing",
        progress: 85,
        reviews: [
            { title: "연구시설 안전검토", status: "완료", date: "2024-01-14" },
            { title: "실험실 환경검토", status: "진행중", date: "2024-01-21" }
        ],
        manager: "한연구",
        budget: "90억원"
    }
];

// 전역 변수
let currentPage = 1;
const itemsPerPage = 5;
let filteredData = [...buildingData];

// DOM 요소들
const searchInput = document.querySelector('.search-box input');
const filterBtn = document.querySelector('.filter-btn');
const filterMenu = document.querySelector('.filter-menu');
const regionFilter = document.getElementById('region-filter');
const statusFilter = document.getElementById('status-filter');
const periodFilter = document.getElementById('period-filter');
const buildingsTable = document.getElementById('buildingsTable');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const currentPageSpan = document.getElementById('currentPage');
const totalPagesSpan = document.getElementById('totalPages');
const modal = document.getElementById('detailModal');
const modalClose = document.querySelector('.modal-close');
const chartBtns = document.querySelectorAll('.chart-btn');

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing dashboard...');
    
    // DOM 요소들이 로드될 때까지 잠시 대기
    setTimeout(() => {
        initializeDashboard();
        setupEventListeners();
        setupFormSubmitHandler();
        renderTable();
        renderCharts();
        console.log('Dashboard initialization complete');
    }, 100);
});

// 대시보드 초기화
function initializeDashboard() {
    updateKPIs();
    updatePagination();
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 검색 기능
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // 필터 기능
    if (filterBtn) {
        filterBtn.addEventListener('click', toggleFilterMenu);
    }
    if (regionFilter) {
        regionFilter.addEventListener('change', applyFilters);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
    if (periodFilter) {
        periodFilter.addEventListener('change', applyFilters);
    }
    
    // 페이지네이션
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => changePage(-1));
    }
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => changePage(1));
    }
    
    // 모달
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    
    // 차트 버튼
    chartBtns.forEach(btn => {
        btn.addEventListener('click', () => switchChartPeriod(btn.dataset.period));
    });
    
    // 사이드바 토글 (모바일)
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
    
    // 새로고침 버튼
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshData);
    }
    
    // 내보내기 버튼
    const exportBtn = document.querySelector('.export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportData);
    }
    
    // 사이드바 메뉴 버튼들 (간단한 버전)
    setTimeout(() => {
        const sidebarItems = document.querySelectorAll('.sidebar-nav li');
        console.log('Found sidebar items:', sidebarItems.length);
        
        sidebarItems.forEach((item, index) => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Sidebar item clicked:', index);
                
                // 모든 활성 상태 제거
                sidebarItems.forEach(li => li.classList.remove('active'));
                
                // 클릭된 항목 활성화
                this.classList.add('active');
                
                // 메뉴 텍스트 가져오기
                const span = this.querySelector('span');
                if (span) {
                    console.log('Menu clicked:', span.textContent);
                }
            });
        });
    }, 200);
}

// 검색 기능
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    
    if (searchTerm === '') {
        filteredData = [...buildingData];
    } else {
        filteredData = buildingData.filter(building => 
            building.name.toLowerCase().includes(searchTerm) ||
            building.manager.toLowerCase().includes(searchTerm) ||
            building.region.toLowerCase().includes(searchTerm)
        );
    }
    
    currentPage = 1;
    renderTable();
    updatePagination();
}

// 필터 메뉴 토글
function toggleFilterMenu() {
    filterMenu.classList.toggle('active');
}

// 필터 적용
function applyFilters() {
    const region = regionFilter.value;
    const status = statusFilter.value;
    const period = periodFilter.value;
    
    filteredData = buildingData.filter(building => {
        let matches = true;
        
        if (region && building.region !== region) {
            matches = false;
        }
        
        if (status && building.status !== status) {
            matches = false;
        }
        
        // 기간 필터는 여기서는 간단히 구현
        if (period === 'month') {
            // 이번 달 데이터만 필터링 (실제로는 날짜 기반으로 구현)
            matches = matches && building.id <= 4;
        }
        
        return matches;
    });
    
    currentPage = 1;
    renderTable();
    updatePagination();
    updateKPIs();
}

// 테이블 렌더링
function renderTable() {
    const tbody = buildingsTable.querySelector('tbody');
    tbody.innerHTML = '';
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);
    
    pageData.forEach(building => {
        const row = createTableRow(building);
        tbody.appendChild(row);
    });
}

// 테이블 행 생성
function createTableRow(building) {
    const row = document.createElement('tr');
    
    const statusText = {
        'planning': '계획',
        'ongoing': '진행중',
        'completed': '완료'
    };
    
    const regionText = {
        'seoul': '서울',
        'busan': '부산',
        'daegu': '대구'
    };
    
    const pendingReviews = building.reviews.filter(review => review.status === '대기').length;
    
    row.innerHTML = `
        <td>${building.name}</td>
        <td>${regionText[building.region]}</td>
        <td><span class="status-badge status-${building.status}">${statusText[building.status]}</span></td>
        <td>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${building.progress}%"></div>
            </div>
            <span style="margin-left: 10px; font-size: 0.9rem;">${building.progress}%</span>
        </td>
        <td>
            <span style="color: ${pendingReviews > 0 ? '#ef4444' : '#10b981'}; font-weight: 500;">
                ${pendingReviews}건 대기
            </span>
        </td>
        <td>${building.manager}</td>
        <td>
            <button class="action-btn view-btn" onclick="showBuildingDetail(${building.id})">
                상세보기
            </button>
            <button class="action-btn edit-btn" onclick="editBuilding(${building.id})">
                편집
            </button>
            <button class="action-btn delete-btn" onclick="deleteBuilding(${building.id})">
                삭제
            </button>
        </td>
    `;
    
    return row;
}

// 건물 상세 정보 표시 (전역 함수로 정의)
window.showBuildingDetail = function(buildingId) {
    const building = buildingData.find(b => b.id === buildingId);
    if (!building) return;
    
    const statusText = {
        'planning': '계획',
        'ongoing': '진행중',
        'completed': '완료'
    };
    
    const regionText = {
        'seoul': '서울',
        'busan': '부산',
        'daegu': '대구'
    };
    
    // 기본 정보 업데이트
    document.getElementById('detail-name').textContent = building.name;
    document.getElementById('detail-region').textContent = regionText[building.region];
    document.getElementById('detail-status').textContent = statusText[building.status];
    document.getElementById('detail-progress').textContent = `${building.progress}%`;
    
    // 검토사항 목록 업데이트
    const reviewList = document.getElementById('reviewList');
    reviewList.innerHTML = '';
    
    building.reviews.forEach(review => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        
        const statusColor = {
            '완료': '#10b981',
            '진행중': '#3b82f6',
            '대기': '#ef4444'
        };
        
        reviewItem.innerHTML = `
            <h5>${review.title}</h5>
            <p style="color: ${statusColor[review.status]};">상태: ${review.status}</p>
            <p>일정: ${review.date}</p>
        `;
        
        reviewList.appendChild(reviewItem);
    });
    
    modal.classList.add('active');
}

// 모달 닫기 (전역 함수로 정의)
window.closeModal = function() {
    modal.classList.remove('active');
}

// 페이지 변경
function changePage(direction) {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    
    if (direction === -1 && currentPage > 1) {
        currentPage--;
    } else if (direction === 1 && currentPage < totalPages) {
        currentPage++;
    }
    
    renderTable();
    updatePagination();
}

// 페이지네이션 업데이트
function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    
    currentPageSpan.textContent = currentPage;
    totalPagesSpan.textContent = totalPages;
    
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
}

// KPI 업데이트
function updateKPIs() {
    const totalBuildings = filteredData.length;
    const ongoingBuildings = filteredData.filter(b => b.status === 'ongoing').length;
    const completedReviews = filteredData.reduce((sum, b) => 
        sum + b.reviews.filter(r => r.status === '완료').length, 0);
    const pendingReviews = filteredData.reduce((sum, b) => 
        sum + b.reviews.filter(r => r.status === '대기').length, 0);
    
    // KPI 값 업데이트 (실제로는 DOM 요소를 직접 업데이트)
    document.querySelector('.kpi-card:nth-child(1) .kpi-value').textContent = totalBuildings;
    document.querySelector('.kpi-card:nth-child(2) .kpi-value').textContent = ongoingBuildings;
    document.querySelector('.kpi-card:nth-child(3) .kpi-value').textContent = completedReviews;
    document.querySelector('.kpi-card:nth-child(4) .kpi-value').textContent = pendingReviews;
}

// 차트 렌더링
function renderCharts() {
    renderConstructionChart();
    renderRegionChart();
}

// 차트 인스턴스 저장
let constructionChart = null;
let regionChart = null;

// 공사 현황 차트
function renderConstructionChart() {
    const ctx = document.getElementById('constructionChart').getContext('2d');
    
    // 기존 차트가 있으면 제거
    if (constructionChart) {
        constructionChart.destroy();
    }
    
    const monthlyData = {
        labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        datasets: [{
            label: '신규 공사',
            data: [12, 19, 15, 25, 22, 18, 30, 28, 35, 32, 28, 40],
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            tension: 0.4
        }, {
            label: '완료 공사',
            data: [8, 15, 12, 20, 18, 25, 22, 30, 28, 35, 32, 38],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4
        }]
    };
    
    constructionChart = new Chart(ctx, {
        type: 'line',
        data: monthlyData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// 지역별 분포 차트
function renderRegionChart() {
    const ctx = document.getElementById('regionChart').getContext('2d');
    
    // 기존 차트가 있으면 제거
    if (regionChart) {
        regionChart.destroy();
    }
    
    const regionCounts = {
        'seoul': filteredData.filter(b => b.region === 'seoul').length,
        'busan': filteredData.filter(b => b.region === 'busan').length,
        'daegu': filteredData.filter(b => b.region === 'daegu').length
    };
    
    regionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['서울', '부산', '대구'],
            datasets: [{
                data: [regionCounts.seoul, regionCounts.busan, regionCounts.daegu],
                backgroundColor: [
                    '#667eea',
                    '#f093fb',
                    '#4facfe'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// 차트 기간 변경
function switchChartPeriod(period) {
    chartBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // 차트 재렌더링 (실제로는 데이터를 필터링하여 차트 업데이트)
    renderConstructionChart();
}

// 데이터 새로고침
function refreshData() {
    // 실제로는 서버에서 최신 데이터를 가져옴
    console.log('데이터 새로고침 중...');
    
    // 시뮬레이션: 약간의 지연 후 데이터 업데이트
    setTimeout(() => {
        renderTable();
        updateKPIs();
        renderCharts();
        console.log('데이터 새로고침 완료');
    }, 1000);
}

// 데이터 내보내기
function exportData() {
    const csvContent = generateCSV(filteredData);
    downloadCSV(csvContent, '건축데이터.csv');
}

// CSV 생성
function generateCSV(data) {
    const headers = ['건물명', '지역', '공사상태', '진행률', '담당자', '예산'];
    const csvRows = [headers.join(',')];
    
    data.forEach(building => {
        const regionText = {
            'seoul': '서울',
            'busan': '부산',
            'daegu': '대구'
        };
        
        const statusText = {
            'planning': '계획',
            'ongoing': '진행중',
            'completed': '완료'
        };
        
        const row = [
            building.name,
            regionText[building.region],
            statusText[building.status],
            building.progress,
            building.manager,
            building.budget
        ];
        csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
}

// CSV 다운로드
function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 필터 메뉴 외부 클릭 시 닫기
document.addEventListener('click', (e) => {
    if (!filterBtn.contains(e.target) && !filterMenu.contains(e.target)) {
        filterMenu.classList.remove('active');
    }
});

// 편집 관련 변수
let editingBuildingId = null;
let isAddingNew = false;

// 건물 추가 모달 표시 (전역 함수로 정의)
window.showAddModal = function() {
    console.log('showAddModal called'); // 디버깅 로그
    isAddingNew = true;
    editingBuildingId = null;
    document.getElementById('editModalTitle').textContent = '새 건물 추가';
    clearEditForm();
    document.getElementById('editModal').classList.add('active');
}

// 건물 편집 모달 표시 (전역 함수로 정의)
window.editBuilding = function(buildingId) {
    console.log('editBuilding called with ID:', buildingId); // 디버깅 로그
    isAddingNew = false;
    editingBuildingId = buildingId;
    const building = buildingData.find(b => b.id === buildingId);
    
    if (building) {
        document.getElementById('editModalTitle').textContent = '건물 정보 편집';
        populateEditForm(building);
        document.getElementById('editModal').classList.add('active');
    }
}

// 건물 삭제 (전역 함수로 정의)
window.deleteBuilding = function(buildingId) {
    console.log('deleteBuilding called with ID:', buildingId); // 디버깅 로그
    if (confirm('정말로 이 건물을 삭제하시겠습니까?')) {
        const index = buildingData.findIndex(b => b.id === buildingId);
        if (index > -1) {
            buildingData.splice(index, 1);
            filteredData = [...buildingData];
            renderTable();
            updateKPIs();
            updatePagination();
            renderCharts();
        }
    }
}

// 편집 폼 채우기
function populateEditForm(building) {
    document.getElementById('editName').value = building.name;
    document.getElementById('editRegion').value = building.region;
    document.getElementById('editStatus').value = building.status;
    document.getElementById('editProgress').value = building.progress;
    document.getElementById('editManager').value = building.manager;
    document.getElementById('editBudget').value = building.budget;
}

// 편집 폼 초기화
function clearEditForm() {
    document.getElementById('editName').value = '';
    document.getElementById('editRegion').value = 'seoul';
    document.getElementById('editStatus').value = 'planning';
    document.getElementById('editProgress').value = 0;
    document.getElementById('editManager').value = '';
    document.getElementById('editBudget').value = '';
}

// 편집 모달 닫기 (전역 함수로 정의)
window.closeEditModal = function() {
    document.getElementById('editModal').classList.remove('active');
    editingBuildingId = null;
    isAddingNew = false;
}

// 폼 제출 처리 (DOM 로드 후 실행)
function setupFormSubmitHandler() {
    const form = document.getElementById('buildingForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('editName').value,
                region: document.getElementById('editRegion').value,
                status: document.getElementById('editStatus').value,
                progress: parseInt(document.getElementById('editProgress').value),
                manager: document.getElementById('editManager').value,
                budget: document.getElementById('editBudget').value
            };
            
            if (isAddingNew) {
                // 새 건물 추가
                const newId = Math.max(...buildingData.map(b => b.id)) + 1;
                const newBuilding = {
                    id: newId,
                    ...formData,
                    reviews: [
                        { title: "초기 검토", status: "대기", date: new Date().toISOString().split('T')[0] }
                    ]
                };
                buildingData.push(newBuilding);
            } else {
                // 기존 건물 수정
                const building = buildingData.find(b => b.id === editingBuildingId);
                if (building) {
                    building.name = formData.name;
                    building.region = formData.region;
                    building.status = formData.status;
                    building.progress = formData.progress;
                    building.manager = formData.manager;
                    building.budget = formData.budget;
                }
            }
            
            // 데이터 업데이트
            filteredData = [...buildingData];
            renderTable();
            updateKPIs();
            updatePagination();
            renderCharts();
            
            closeEditModal();
        });
    }
}

// 키보드 단축키
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        searchInput.focus();
    }
    
    if (e.key === 'Escape') {
        closeModal();
        closeEditModal();
        filterMenu.classList.remove('active');
    }
});
