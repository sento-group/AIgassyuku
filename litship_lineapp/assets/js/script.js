// 初期化
document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
});

// ダッシュボード初期化
function initDashboard() {
    // 現在日時を表示
    updateCurrentDate();
    
    // KPIを更新
    updateKPI();
    
    // アラートを表示
    updateAlerts();
    
    // スケジュールを表示
    updateSchedule();
    
    // 案件一覧を表示
    updateProjectList();
    
    // スタッフ一覧を表示
    updateStaffList();
}

// 現在日時を表示
function updateCurrentDate() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
    document.getElementById('currentDate').textContent = dateStr;
}

// KPIを更新
function updateKPI() {
    // 合計売上
    const totalSales = projectData.reduce((sum, project) => sum + project.price, 0);
    document.getElementById('totalSales').textContent = `¥${totalSales.toLocaleString()}`;
    
    // 稼働人数
    const activeStaffCount = new Set(projectData.map(p => p.assignedStaff)).size;
    document.getElementById('activeStaff').textContent = `${activeStaffCount}人`;
    
    // 案件数
    document.getElementById('projectCount').textContent = `${projectData.length}件`;
    
    // 配置済み件数
    const assignedCount = projectData.filter(p => p.status === '配置済み').length;
    document.getElementById('assignedCount').textContent = `${assignedCount}件`;
}

// アラートを更新
function updateAlerts() {
    const alertSection = document.getElementById('alertSection');
    const alerts = [];
    
    // 配置完了アラート
    const allAssigned = projectData.every(p => p.status === '配置済み');
    if (allAssigned) {
        alerts.push({
            type: 'success',
            icon: '✅',
            title: '全案件配置完了！',
            message: `全${projectData.length}件の案件に人員を配置しました。`
        });
    }
    
    // 未配置案件アラート
    const unassignedProjects = projectData.filter(p => p.status !== '配置済み');
    if (unassignedProjects.length > 0) {
        alerts.push({
            type: 'warning',
            icon: '⚠️',
            title: '人員不足アラート',
            message: `${unassignedProjects.length}件の案件が未配置です。`
        });
    }
    
    // 通勤時間90分超過アラート
    const longCommuteAssignments = assignmentData.filter(a => a.commuteTime >= 85);
    if (longCommuteAssignments.length > 0) {
        alerts.push({
            type: 'warning',
            icon: '🚃',
            title: '通勤時間注意',
            message: `${longCommuteAssignments.length}件の配置で通勤時間が90分に近い案件があります。`
        });
    }
    
    // HTMLを生成
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

// スケジュールを更新
function updateSchedule() {
    const scheduleList = document.getElementById('scheduleList');
    
    // 案件を日付順にソート
    const sortedProjects = [...projectData].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
    );
    
    scheduleList.innerHTML = sortedProjects.map(project => {
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

// 案件一覧を更新
function updateProjectList() {
    const projectList = document.getElementById('projectList');
    
    projectList.innerHTML = projectData.map(project => {
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
                        <span>👤 ${project.role}</span>
                        <span>👨‍💼 ${staffName}</span>
                    </div>
                </div>
                <div class="project-price">¥${project.price.toLocaleString()}</div>
                <div class="project-status ${statusClass}">${project.status}</div>
            </div>
        `;
    }).join('');
}

// スタッフ一覧を更新
function updateStaffList() {
    const staffList = document.getElementById('staffList');
    
    staffList.innerHTML = staffData.map(staff => {
        // スキルバッジを生成
        const skills = [
            { label: 'MNP', level: staff.skills.mnp },
            { label: '光', level: staff.skills.hikari },
            { label: 'カード', level: staff.skills.card },
            { label: '端末', level: staff.skills.device }
        ];
        
        const skillBadges = skills.map(skill => {
            const excellentClass = skill.level === '◎' ? 'excellent' : '';
            return `<span class="skill-badge ${excellentClass}">${skill.label}: ${skill.level}</span>`;
        }).join('');
        
        // 適性を表示
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
                    ${staff.age}歳 / ${staff.station}<br>
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
                    ${staff.strengths.join('、')}
                </div>
            </div>
        `;
    }).join('');
}

// 自動配置を実行
function runAutoAssignment() {
    // モーダルを表示
    const modal = document.getElementById('assignmentModal');
    const resultDiv = document.getElementById('assignmentResult');
    
    // 配置結果を生成
    const results = assignmentData.map(assignment => {
        const project = projectData.find(p => p.id === assignment.projectId);
        const staff = staffData.find(s => s.id === assignment.staffId);
        
        return `
            <div class="assignment-result-item">
                <h3>${project.name}</h3>
                <p><strong>📅 日付:</strong> ${project.dateDisplay}</p>
                <p><strong>👤 役割:</strong> ${project.role}</p>
                <p><strong>👨‍💼 配置スタッフ:</strong> ${staff.name}（${staff.id}）</p>
                <p><strong>💰 単価:</strong> ¥${project.price.toLocaleString()}</p>
                <p><strong>🚃 通勤時間:</strong> 約${assignment.commuteTime}分</p>
                <p><strong>✅ 推奨理由:</strong> ${assignment.reason}</p>
                <span class="match-score">マッチ度: ${assignment.matchScore}%</span>
            </div>
        `;
    }).join('');
    
    // サマリーを追加
    const totalSales = projectData.reduce((sum, p) => sum + p.price, 0);
    const summary = `
        <div class="assignment-result-item" style="background: #c6f6d5; border-left-color: #48bb78;">
            <h3>🎉 配置完了サマリー</h3>
            <p><strong>合計売上:</strong> ¥${totalSales.toLocaleString()}</p>
            <p><strong>配置件数:</strong> ${assignmentData.length}件</p>
            <p><strong>稼働人数:</strong> ${new Set(assignmentData.map(a => a.staffId)).size}人</p>
            <p><strong>平均マッチ度:</strong> ${Math.round(assignmentData.reduce((sum, a) => sum + a.matchScore, 0) / assignmentData.length)}%</p>
        </div>
    `;
    
    resultDiv.innerHTML = summary + results;
    modal.style.display = 'block';
}

// モーダルを閉じる
function closeModal() {
    document.getElementById('assignmentModal').style.display = 'none';
}

// モーダル外クリックで閉じる
window.onclick = function(event) {
    const modal = document.getElementById('assignmentModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// 自動リフレッシュ（30秒ごと）
setInterval(function() {
    updateCurrentDate();
}, 30000);

