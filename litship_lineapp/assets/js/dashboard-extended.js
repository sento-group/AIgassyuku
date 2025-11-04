// グローバル変数
let currentPage = 'overview';
let currentStaffPage = 1;
const staffPerPage = 12;
let filteredStaffData = [...staffData];
let filteredProjectData = [...projectData];

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
});

// ダッシュボード初期化
function initDashboard() {
    updateKPI();
    updateAlerts();
    updateSchedule();
    renderStaffList();
    renderProjectList();
    renderCalendar();
    renderAnalytics();
    setupEventListeners();
}

// ページ切り替え
function showPage(pageName) {
    // 全ページを非表示
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // 指定ページを表示
    document.getElementById(`page-${pageName}`).classList.add('active');
    currentPage = pageName;
    
    // ページごとの更新処理
    if (pageName === 'staff') {
        renderStaffList();
    } else if (pageName === 'projects') {
        renderProjectList();
    } else if (pageName === 'calendar') {
        renderCalendar();
    } else if (pageName === 'analytics') {
        renderAnalytics();
    }
}

// KPI更新
function updateKPI() {
    // 合計売上
    const totalSales = projectData.reduce((sum, project) => sum + project.price, 0);
    document.getElementById('totalSales').textContent = `¥${totalSales.toLocaleString()}`;
    
    // スタッフ数
    document.getElementById('totalStaff').textContent = `${staffData.length}人`;
    
    // 案件数
    document.getElementById('projectCount').textContent = `${projectData.length}件`;
    
    // 未配置件数
    const unassignedCount = projectData.filter(p => p.status === '未配置').length;
    document.getElementById('unassignedCount').textContent = unassignedCount;
    
    // 配置完了率
    const assignmentRate = Math.round((projectData.length - unassignedCount) / projectData.length * 100);
    document.getElementById('assignmentRate').textContent = `${assignmentRate}%`;
}

// アラート更新
function updateAlerts() {
    const alertSection = document.getElementById('alertSection');
    const alerts = [];
    
    // 未配置案件数
    const unassignedCount = projectData.filter(p => p.status === '未配置').length;
    if (unassignedCount > 0) {
        alerts.push({
            type: 'warning',
            icon: '⚠️',
            title: `人員不足アラート - 穴埋めくん`,
            message: `${unassignedCount}件の案件が未配置です。早急に人員配置が必要です。`
        });
    }
    
    // 配置完了
    if (unassignedCount === 0) {
        alerts.push({
            type: 'success',
            icon: '✅',
            title: '全案件配置完了！',
            message: `全${projectData.length}件の案件に人員を配置しました。`
        });
    }
    
    // スタッフ数に対する案件数
    const assignedStaffCount = new Set(
        projectData.filter(p => p.assignedStaff).map(p => p.assignedStaff)
    ).size;
    const utilizationRate = Math.round(assignedStaffCount / staffData.length * 100);
    
    if (utilizationRate < 10) {
        alerts.push({
            type: 'warning',
            icon: '📊',
            title: 'スタッフ稼働率が低めです',
            message: `現在の稼働率: ${utilizationRate}%。さらに案件を増やせる可能性があります。`
        });
    }
    
    alertSection.innerHTML = alerts.map(alert => `
        <div class="alert ${alert.type}">
            <div class="alert-icon">${alert.icon}</div>
            <div class="alert-content">
                <div class="alert-title">${alert.title}</div>
                <div class="alert-message">${alert.message}</div>
            </div>
        </div>
    `).join('');
}

// スケジュール更新
function updateSchedule() {
    const scheduleList = document.getElementById('scheduleList');
    const assignedProjects = projectData
        .filter(p => p.assignedStaff)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5); // 最新5件
    
    if (assignedProjects.length === 0) {
        scheduleList.innerHTML = '<p style="text-align:center;color:#718096;">配置済みの案件はまだありません</p>';
        return;
    }
    
    scheduleList.innerHTML = assignedProjects.map(project => {
        const staff = staffData.find(s => s.id === project.assignedStaff);
        const staffName = staff ? staff.name : '未配置';
        
        return `
            <div class="schedule-item">
                <div class="schedule-date">${project.dateDisplay}</div>
                <div class="schedule-staff">${staffName}</div>
                <div class="schedule-project">${project.name}</div>
                <div class="schedule-role">${project.role}</div>
            </div>
        `;
    }).join('');
}

// スタッフ一覧レンダリング（ページネーション対応）
function renderStaffList() {
    const staffList = document.getElementById('staffListExtended');
    const pagination = document.getElementById('staffPagination');
    
    // ページネーション計算
    const totalPages = Math.ceil(filteredStaffData.length / staffPerPage);
    const start = (currentStaffPage - 1) * staffPerPage;
    const end = start + staffPerPage;
    const pageStaff = filteredStaffData.slice(start, end);
    
    // スタッフカード生成
    staffList.innerHTML = pageStaff.map(staff => {
        const skills = [
            { label: 'MNP', level: staff.skills.mnp },
            { label: '光', level: staff.skills.hikari },
            { label: 'カード', level: staff.skills.card }
        ];
        
        const skillBadges = skills.map(skill => {
            const excellentClass = skill.level === '◎' ? 'excellent' : '';
            return `<span class="skill-badge ${excellentClass}">${skill.label}: ${skill.level}</span>`;
        }).join('');
        
        const suitabilities = [
            { label: 'クローザー', level: staff.suitability.closer },
            { label: 'キャッチャー', level: staff.suitability.catcher }
        ];
        
        const suitabilityBadges = suitabilities.map(suit => {
            const excellentClass = suit.level === '◎' ? 'excellent' : '';
            return `<span class="skill-badge ${excellentClass}">${suit.label}: ${suit.level}</span>`;
        }).join('');
        
        return `
            <div class="staff-card">
                <div class="staff-header">
                    <div class="staff-name">${staff.name}</div>
                    <div class="staff-id">${staff.id}</div>
                </div>
                <div class="staff-meta">
                    ${staff.age}歳 / ${staff.gender}<br>
                    ${staff.station}<br>
                    通勤範囲: ${staff.commuteTime}分以内
                </div>
                <div class="staff-skills">
                    ${skillBadges}
                </div>
                <div class="staff-skills">
                    ${suitabilityBadges}
                </div>
                <div class="staff-strengths">
                    <strong>💪 強み:</strong><br>
                    ${staff.strengths.slice(0, 2).join('、')}
                </div>
            </div>
        `;
    }).join('');
    
    // ページネーション生成
    const paginationHTML = [];
    
    // 前へボタン
    paginationHTML.push(`
        <button onclick="changeStaffPage(${currentStaffPage - 1})" ${currentStaffPage === 1 ? 'disabled' : ''}>
            ← 前へ
        </button>
    `);
    
    // ページ番号
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentStaffPage - 2 && i <= currentStaffPage + 2)) {
            paginationHTML.push(`
                <button onclick="changeStaffPage(${i})" class="${i === currentStaffPage ? 'active' : ''}">
                    ${i}
                </button>
            `);
        } else if (i === currentStaffPage - 3 || i === currentStaffPage + 3) {
            paginationHTML.push('<span>...</span>');
        }
    }
    
    // 次へボタン
    paginationHTML.push(`
        <button onclick="changeStaffPage(${currentStaffPage + 1})" ${currentStaffPage === totalPages ? 'disabled' : ''}>
            次へ →
        </button>
    `);
    
    pagination.innerHTML = paginationHTML.join('');
}

// ページ変更
function changeStaffPage(page) {
    const totalPages = Math.ceil(filteredStaffData.length / staffPerPage);
    if (page < 1 || page > totalPages) return;
    currentStaffPage = page;
    renderStaffList();
}

// フィルター適用
function applyFilters() {
    const searchValue = document.getElementById('staffSearch').value.toLowerCase();
    const skillFilter = document.getElementById('skillFilter').value;
    const stationFilter = document.getElementById('stationFilter').value;
    
    filteredStaffData = staffData.filter(staff => {
        // 検索
        const matchesSearch = !searchValue || 
            staff.name.toLowerCase().includes(searchValue) || 
            staff.id.includes(searchValue);
        
        // スキルフィルター
        let matchesSkill = true;
        if (skillFilter === 'mnp-excellent') matchesSkill = staff.skills.mnp === '◎';
        if (skillFilter === 'hikari-excellent') matchesSkill = staff.skills.hikari === '◎';
        if (skillFilter === 'closer-excellent') matchesSkill = staff.suitability.closer === '◎';
        if (skillFilter === 'catcher-excellent') matchesSkill = staff.suitability.catcher === '◎';
        
        // 路線フィルター
        const matchesStation = !stationFilter || staff.station.includes(stationFilter);
        
        return matchesSearch && matchesSkill && matchesStation;
    });
    
    currentStaffPage = 1;
    renderStaffList();
}

// フィルタークリア
function clearFilters() {
    document.getElementById('staffSearch').value = '';
    document.getElementById('skillFilter').value = '';
    document.getElementById('stationFilter').value = '';
    filteredStaffData = [...staffData];
    currentStaffPage = 1;
    renderStaffList();
}

// 案件一覧レンダリング
function renderProjectList() {
    const projectList = document.getElementById('projectListExtended');
    
    projectList.innerHTML = filteredProjectData.map(project => {
        const staff = staffData.find(s => s.id === project.assignedStaff);
        const staffName = staff ? staff.name : '未配置';
        const statusClass = project.status === '配置済み' ? 'assigned' : 'pending';
        
        return `
            <div class="project-item">
                <div class="project-info">
                    <h3>${project.name}</h3>
                    <div class="project-meta">
                        <span>📅 ${project.dateDisplay}</span>
                        <span>📍 ${project.station}</span>
                        <span>👤 ${project.role} × ${project.count}名</span>
                        <span>👨‍💼 ${staffName}</span>
                    </div>
                </div>
                <div class="project-price">¥${project.price.toLocaleString()}</div>
                <div class="project-status ${statusClass}">${project.status}</div>
            </div>
        `;
    }).join('');
}

// 案件フィルター適用
function applyProjectFilters() {
    const searchValue = document.getElementById('projectSearch').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const roleFilter = document.getElementById('roleFilter').value;
    
    filteredProjectData = projectData.filter(project => {
        const matchesSearch = !searchValue || project.name.toLowerCase().includes(searchValue);
        const matchesStatus = !statusFilter || project.status === statusFilter;
        const matchesRole = !roleFilter || project.role === roleFilter;
        
        return matchesSearch && matchesStatus && matchesRole;
    });
    
    renderProjectList();
}

// カレンダーレンダリング
function renderCalendar() {
    const calendar = document.getElementById('calendar');
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    // 月の最初と最後の日
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    // カレンダー生成
    let calendarHTML = '';
    
    // 曜日ヘッダー
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    weekdays.forEach(day => {
        calendarHTML += `<div style="text-align:center;font-weight:700;color:#667eea;">${day}</div>`;
    });
    
    // 空白セル
    for (let i = 0; i < startDayOfWeek; i++) {
        calendarHTML += '<div class="calendar-day"></div>';
    }
    
    // 日付セル
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayProjects = projectData.filter(p => p.date === dateStr);
        const hasEvent = dayProjects.length > 0;
        
        calendarHTML += `
            <div class="calendar-day ${hasEvent ? 'has-event' : ''}">
                <div class="calendar-day-number">${day}</div>
                ${hasEvent ? `<div class="calendar-day-events">${dayProjects.length}件</div>` : ''}
            </div>
        `;
    }
    
    calendar.innerHTML = calendarHTML;
}

// 分析レンダリング
function renderAnalytics() {
    renderSkillChart();
    renderSuitabilityChart();
    renderCommuteChart();
    renderSalesChart();
    renderTopStaff();
}

// スキル分布チャート
function renderSkillChart() {
    const ctx = document.getElementById('skillChart');
    if (!ctx) return;
    
    const mnpExcellent = staffData.filter(s => s.skills.mnp === '◎').length;
    const mnpGood = staffData.filter(s => s.skills.mnp === '◯').length;
    const mnpFair = staffData.filter(s => s.skills.mnp === '△').length;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['◎ 優秀', '◯ 良好', '△ 要育成'],
            datasets: [{
                data: [mnpExcellent, mnpGood, mnpFair],
                backgroundColor: ['#48bb78', '#4299e1', '#ed8936']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: { display: true, text: 'MNPスキル分布' }
            }
        }
    });
}

// 適性分布チャート
function renderSuitabilityChart() {
    const ctx = document.getElementById('suitabilityChart');
    if (!ctx) return;
    
    const closerExcellent = staffData.filter(s => s.suitability.closer === '◎').length;
    const catcherExcellent = staffData.filter(s => s.suitability.catcher === '◎').length;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['クローザー◎', 'キャッチャー◎'],
            datasets: [{
                label: '人数',
                data: [closerExcellent, catcherExcellent],
                backgroundColor: ['#667eea', '#764ba2']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: { y: { beginAtZero: true } }
        }
    });
}

// 通勤範囲分布
function renderCommuteChart() {
    const ctx = document.getElementById('commuteChart');
    if (!ctx) return;
    
    const under60 = staffData.filter(s => s.commuteTime <= 60).length;
    const under90 = staffData.filter(s => s.commuteTime > 60 && s.commuteTime <= 90).length;
    const over90 = staffData.filter(s => s.commuteTime > 90).length;
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['60分以内', '60-90分', '90分以上'],
            datasets: [{
                data: [under60, under90, over90],
                backgroundColor: ['#48bb78', '#4299e1', '#f56565']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });
}

// 売上予測チャート
function renderSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['10月', '11月', '12月', '1月', '2月', '3月'],
            datasets: [{
                label: '売上予測（万円）',
                data: [50, 103, 120, 95, 110, 130],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: { y: { beginAtZero: true } }
        }
    });
}

// TOPスタッフレンダリング
function renderTopStaff() {
    const topStaffList = document.getElementById('topStaffList');
    if (!topStaffList) return;
    
    // 稼働実績でソート
    const topStaff = [...staffData]
        .sort((a, b) => b.workHistory.averageScore - a.workHistory.averageScore)
        .slice(0, 10);
    
    topStaffList.innerHTML = topStaff.map((staff, index) => `
        <div class="top-staff-item">
            <div class="top-staff-rank">${index + 1}</div>
            <div class="top-staff-info">
                <div class="top-staff-name">${staff.name}（${staff.id}）</div>
                <div class="top-staff-stats">
                    稼働${staff.workHistory.totalDays}日 / 売上¥${staff.workHistory.totalSales.toLocaleString()}
                </div>
            </div>
            <div class="top-staff-score">${staff.workHistory.averageScore}点</div>
        </div>
    `).join('');
}

// 自動配置実行
function runAutoAssignment() {
    alert('自動配置機能は開発中です。未配置案件に最適なスタッフを自動配置します。');
}

// データエクスポート
function exportData() {
    const data = {
        staff: staffData,
        projects: projectData,
        assignments: assignmentData,
        exportDate: new Date().toISOString()
    };
    
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `line-management-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
}

// モーダル閉じる
function closeModal() {
    document.getElementById('assignmentModal').style.display = 'none';
}

// イベントリスナー設定
function setupEventListeners() {
    // 検索フィールドのリアルタイム検索
    const staffSearch = document.getElementById('staffSearch');
    if (staffSearch) {
        staffSearch.addEventListener('input', applyFilters);
    }
    
    const projectSearch = document.getElementById('projectSearch');
    if (projectSearch) {
        projectSearch.addEventListener('input', applyProjectFilters);
    }
}

