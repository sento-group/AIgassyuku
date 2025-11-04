// ========================================
// Calendar Functions
// ========================================
function renderCalendar() {
    const container = document.getElementById('calendar');
    if (!container) return;

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

    let calendarHTML = `
        <div style="margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <h3 style="font-size: 24px; color: #1A3A52;">${currentYear}年 ${monthNames[currentMonth]}</h3>
                <div style="display: flex; gap: 10px;">
                    <button class="btn btn-secondary" onclick="previousMonth()">← 前月</button>
                    <button class="btn btn-secondary" onclick="nextMonth()">次月 →</button>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px;">
                ${['日', '月', '火', '水', '木', '金', '土'].map((day, index) => `
                    <div style="text-align: center; font-weight: 700; padding: 15px; background: #F5F5F5; border-radius: 8px; color: ${index === 0 ? '#dc3545' : index === 6 ? '#007bff' : '#1A3A52'};">
                        ${day}
                    </div>
                `).join('')}
    `;

    // Empty cells before first day
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarHTML += '<div></div>';
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const dayOfWeek = date.getDay();
        const isToday = day === today.getDate() && currentMonth === today.getMonth();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        // Random events for demo
        const hasEvent = Math.random() > 0.7;
        const eventCount = hasEvent ? Math.floor(Math.random() * 3) + 1 : 0;

        calendarHTML += `
            <div style="
                border: 2px solid ${isToday ? '#00A0B0' : '#E0E0E0'};
                background: ${isWeekend ? '#E8F4F8' : 'white'};
                border-radius: 8px;
                padding: 10px;
                min-height: 100px;
                cursor: pointer;
                transition: all 0.3s;
                ${isToday ? 'box-shadow: 0 4px 12px rgba(0, 160, 176, 0.3);' : ''}
            " onmouseover="this.style.transform='scale(1.02)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)';" 
               onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none';">
                <div style="font-weight: ${isToday ? '700' : '600'}; color: ${isToday ? '#00A0B0' : dayOfWeek === 0 ? '#dc3545' : dayOfWeek === 6 ? '#007bff' : '#333'}; margin-bottom: 8px;">
                    ${day}
                </div>
                ${eventCount > 0 ? `
                    <div style="font-size: 11px; background: linear-gradient(135deg, #1A3A52, #00A0B0); color: white; padding: 4px 6px; border-radius: 4px; margin-bottom: 3px;">
                        📋 案件${eventCount}件
                    </div>
                ` : ''}
                ${hasEvent && Math.random() > 0.5 ? `
                    <div style="font-size: 11px; background: #28a745; color: white; padding: 4px 6px; border-radius: 4px;">
                        ✓ 配置完了
                    </div>
                ` : ''}
            </div>
        `;
    }

    calendarHTML += `
            </div>
        </div>

        <div class="card" style="margin-top: 30px;">
            <h3 style="margin-bottom: 15px; color: #1A3A52;">📅 今週の予定</h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
                ${generateWeeklySchedule()}
            </div>
        </div>
    `;

    container.innerHTML = calendarHTML;
}

function generateWeeklySchedule() {
    const schedules = [
        { date: '11/5 (火)', project: 'ヤマダ電機 池袋店', staff: 5, time: '10:00-18:00' },
        { date: '11/7 (木)', project: 'ビックカメラ 新宿店', staff: 8, time: '11:00-19:00' },
        { date: '11/9 (土)', project: 'ヨドバシカメラ 秋葉原店', staff: 12, time: '10:00-20:00' },
        { date: '11/10 (日)', project: 'ノジマ 横浜店', staff: 6, time: '10:00-18:00' }
    ];

    return schedules.map(schedule => `
        <div style="padding: 15px; background: #F5F5F5; border-radius: 8px; border-left: 4px solid #00A0B0; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <div style="font-weight: 700; color: #1A3A52; margin-bottom: 5px;">${schedule.project}</div>
                <div style="font-size: 13px; color: #718096;">
                    <span>📅 ${schedule.date}</span> · 
                    <span>🕐 ${schedule.time}</span> · 
                    <span>👥 ${schedule.staff}名配置</span>
                </div>
            </div>
            <button class="btn btn-secondary" style="padding: 8px 16px; font-size: 13px;">詳細</button>
        </div>
    `).join('');
}

function previousMonth() {
    alert('前月表示機能を実装中');
}

function nextMonth() {
    alert('次月表示機能を実装中');
}

// ========================================
// Analytics Functions
// ========================================
function renderAnalytics() {
    // Skills Chart
    renderSkillsChart();
    // Suitability Chart
    renderSuitabilityChart();
    // Commute Chart
    renderCommuteChart();
    // Sales Chart
    renderSalesChart();
    // Top Staff
    renderTopStaff();
}

function renderSkillsChart() {
    const ctx = document.getElementById('skillChart');
    if (!ctx) return;

    const mnpExcellent = staffData.filter(s => s.skills.mnp === '◎').length;
    const mnpGood = staffData.filter(s => s.skills.mnp === '○').length;
    const hikariExcellent = staffData.filter(s => s.skills.hikari === '◎').length;
    const hikariGood = staffData.filter(s => s.skills.hikari === '○').length;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['MNP ◎', 'MNP ○', '光 ◎', '光 ○'],
            datasets: [{
                data: [mnpExcellent, mnpGood, hikariExcellent, hikariGood],
                backgroundColor: ['#1A3A52', '#00A0B0', '#E8F4F8', '#4A90A4'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

function renderSuitabilityChart() {
    const ctx = document.getElementById('suitabilityChart');
    if (!ctx) return;

    const closerExcellent = staffData.filter(s => s.suitability.closer === '◎').length;
    const closerGood = staffData.filter(s => s.suitability.closer === '○').length;
    const catcherExcellent = staffData.filter(s => s.suitability.catcher === '◎').length;
    const catcherGood = staffData.filter(s => s.suitability.catcher === '○').length;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['クローザー ◎', 'クローザー ○', 'キャッチャー ◎', 'キャッチャー ○'],
            datasets: [{
                label: 'スタッフ数',
                data: [closerExcellent, closerGood, catcherExcellent, catcherGood],
                backgroundColor: ['#1A3A52', '#00A0B0', '#1A3A52', '#00A0B0'],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 5
                    }
                }
            }
        }
    });
}

function renderCommuteChart() {
    const ctx = document.getElementById('commuteChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['30分以内', '30-60分', '60-90分', '90分以上'],
            datasets: [{
                data: [35, 40, 20, 5],
                backgroundColor: ['#1A3A52', '#00A0B0', '#4A90A4', '#E8F4F8'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

function renderSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            datasets: [
                {
                    label: '目標売上',
                    data: [5000000, 5000000, 5000000, 5000000, 5000000, 5000000, 5000000, 5000000, 5000000, 5000000, 5000000, 5000000],
                    borderColor: '#1A3A52',
                    backgroundColor: 'rgba(26, 58, 82, 0.1)',
                    borderWidth: 2,
                    tension: 0.4
                },
                {
                    label: '実績',
                    data: [4800000, 5200000, 4900000, 5100000, 5300000, 4700000, 5400000, 5000000, 5200000, 5100000, 0, 0],
                    borderColor: '#00A0B0',
                    backgroundColor: 'rgba(0, 160, 176, 0.1)',
                    borderWidth: 2,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '¥' + (value / 1000000).toFixed(1) + 'M';
                        }
                    }
                }
            }
        }
    });
}

function renderTopStaff() {
    const topStaffList = document.getElementById('topStaffList');
    if (!topStaffList) return;

    const topStaff = [...staffData]
        .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
        .slice(0, 10);

    topStaffList.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 15px;">
            ${topStaff.map((staff, index) => `
                <div style="display: flex; align-items: center; padding: 15px; background: ${index < 3 ? 'linear-gradient(135deg, #1A3A52, #00A0B0)' : '#F5F5F5'}; border-radius: 12px; ${index < 3 ? 'color: white;' : ''}">
                    <div style="font-size: 24px; font-weight: 700; width: 40px; ${index < 3 ? 'color: #ffc107;' : 'color: #1A3A52;'}">
                        ${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                    </div>
                    <div style="flex: 1; margin: 0 15px;">
                        <div style="font-weight: 700; margin-bottom: 3px;">${staff.name}</div>
                        <div style="font-size: 12px; opacity: 0.8;">コード: ${staff.code} · 稼働: ${staff.totalDays}日</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 20px; font-weight: 700;">⭐ ${staff.averageRating}</div>
                        <div style="font-size: 11px; opacity: 0.8;">平均評価</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ========================================
// Action Functions
// ========================================
function viewStaffDetail(code) {
    const staff = staffData.find(s => s.code === code);
    if (!staff) return;

    const modal = document.getElementById('assignmentModal');
    const result = document.getElementById('assignmentResult');
    
    result.innerHTML = `
        <div style="max-width: 600px;">
            <h3 style="color: #1A3A52; margin-bottom: 20px; border-bottom: 3px solid #00A0B0; padding-bottom: 15px;">
                👤 ${staff.name}の詳細情報
            </h3>
            
            <div style="margin-bottom: 20px; padding: 15px; background: #E8F4F8; border-radius: 8px;">
                <div style="display: grid; grid-template-columns: auto 1fr; gap: 10px; font-size: 14px;">
                    <strong>スタッフコード:</strong><span>${staff.code}</span>
                    <strong>最寄駅:</strong><span>${staff.station}</span>
                    <strong>稼働日数:</strong><span>${staff.totalDays}日</span>
                    <strong>平均評価:</strong><span>⭐ ${staff.averageRating}</span>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4 style="color: #1A3A52; margin-bottom: 10px;">スキル評価</h4>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <span class="skill-badge skill-${staff.skills.mnp}">MNP ${staff.skills.mnp}</span>
                    <span class="skill-badge skill-${staff.skills.hikari}">光 ${staff.skills.hikari}</span>
                    <span class="skill-badge skill-${staff.skills.card}">カード ${staff.skills.card}</span>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4 style="color: #1A3A52; margin-bottom: 10px;">適性</h4>
                <div style="display: flex; gap: 10px;">
                    <span class="suitability-badge">クローザー ${staff.suitability.closer}</span>
                    <span class="suitability-badge">キャッチャー ${staff.suitability.catcher}</span>
                </div>
            </div>
            
            <button class="btn btn-primary" style="width: 100%; margin-top: 20px;" onclick="closeModal('assignmentModal')">
                閉じる
            </button>
        </div>
    `;
    
    modal.classList.add('active');
    modal.style.display = 'flex';
}

function assignStaff(code) {
    const staff = staffData.find(s => s.code === code);
    if (!staff) return;
    
    const unassignedProjects = projectData.filter(p => !p.assigned || p.assignedCount < p.requiredPeople);
    
    if (unassignedProjects.length === 0) {
        alert('配置可能な案件がありません');
        return;
    }
    
    const modal = document.getElementById('assignmentModal');
    const result = document.getElementById('assignmentResult');
    
    result.innerHTML = `
        <div style="max-width: 600px;">
            <h3 style="color: #1A3A52; margin-bottom: 20px;">
                📋 ${staff.name}を案件に配置
            </h3>
            
            <div style="margin-bottom: 20px;">
                <p style="color: #666;">配置可能な案件を選択してください</p>
            </div>
            
            ${unassignedProjects.map(project => `
                <div style="padding: 15px; margin-bottom: 10px; background: #F5F5F5; border-radius: 8px; cursor: pointer; transition: all 0.3s;" 
                     onmouseover="this.style.background='#E8F4F8'" 
                     onmouseout="this.style.background='#F5F5F5'"
                     onclick="confirmAssignment('${code}', '${project.id}')">
                    <div style="font-weight: 700; color: #1A3A52; margin-bottom: 5px;">${project.name}</div>
                    <div style="font-size: 13px; color: #666;">
                        📅 ${project.date} · 📍 ${project.location} · 💰 ¥${project.unitPrice.toLocaleString()}/日
                    </div>
                    <div style="margin-top: 8px; font-size: 13px;">
                        必要: ${project.requiredPeople}名 · 配置済み: ${project.assignedCount || 0}名
                    </div>
                </div>
            `).join('')}
            
            <button class="btn btn-secondary" style="width: 100%; margin-top: 15px;" onclick="closeModal('assignmentModal')">
                キャンセル
            </button>
        </div>
    `;
    
    modal.classList.add('active');
    modal.style.display = 'flex';
}

function confirmAssignment(staffCode, projectId) {
    const staff = staffData.find(s => s.code === staffCode);
    const project = projectData.find(p => p.id === projectId);
    
    if (confirm(`${staff.name}を「${project.name}」に配置しますか？`)) {
        project.assignedCount = (project.assignedCount || 0) + 1;
        if (project.assignedCount >= project.requiredPeople) {
            project.assigned = true;
        }
        
        alert(`✅ ${staff.name}を${project.name}に配置しました！`);
        closeModal('assignmentModal');
        updateKPICards();
        
        if (document.getElementById('page-projects').classList.contains('active')) {
            renderProjectList();
        }
    }
}

function viewProjectDetail(id) {
    const project = projectData.find(p => p.id === id);
    if (!project) return;

    const modal = document.getElementById('assignmentModal');
    const result = document.getElementById('assignmentResult');
    
    const progress = project.assigned ? Math.round((project.assignedCount / project.requiredPeople) * 100) : 0;
    const progressColor = progress >= 100 ? '#28a745' : progress >= 50 ? '#ffc107' : '#dc3545';
    
    result.innerHTML = `
        <div style="max-width: 600px;">
            <h3 style="color: #1A3A52; margin-bottom: 20px; border-bottom: 3px solid #00A0B0; padding-bottom: 15px;">
                📋 ${project.name}の詳細情報
            </h3>
            
            <div style="margin-bottom: 20px; padding: 15px; background: #E8F4F8; border-radius: 8px;">
                <div style="display: grid; grid-template-columns: auto 1fr; gap: 10px; font-size: 14px;">
                    <strong>案件ID:</strong><span>${project.id}</span>
                    <strong>日程:</strong><span>${project.date}</span>
                    <strong>場所:</strong><span>${project.location}</span>
                    <strong>単価:</strong><span>¥${project.unitPrice.toLocaleString()}/日</span>
                    ${project.client ? `<strong>受注元:</strong><span>${project.client}</span>` : ''}
                    ${project.content ? `<strong>業務内容:</strong><span>${project.content}</span>` : ''}
                    ${project.greeting ? `<strong>名乗り:</strong><span>${project.greeting}</span>` : ''}
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4 style="color: #1A3A52; margin-bottom: 10px;">配置状況</h4>
                <div style="margin-bottom: 8px; display: flex; justify-content: space-between; font-size: 14px;">
                    <span>${project.assignedCount || 0}/${project.requiredPeople}名</span>
                    <span style="color: ${progressColor}; font-weight: 600;">${progress}%</span>
                </div>
                <div style="background: #E0E0E0; border-radius: 10px; height: 12px; overflow: hidden;">
                    <div style="background: ${progressColor}; height: 100%; width: ${progress}%; transition: width 0.3s;"></div>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4 style="color: #1A3A52; margin-bottom: 10px;">必要な役割</h4>
                <div style="display: flex; gap: 10px;">
                    ${project.roles.map(role => `
                        <span style="background: #E8F4F8; color: #00A0B0; padding: 6px 12px; border-radius: 15px; font-size: 13px; font-weight: 600;">
                            ${role}
                        </span>
                    `).join('')}
                </div>
            </div>
            
            ${project.notes ? `
                <div style="margin-bottom: 20px; padding: 15px; background: #fff3cd; border-radius: 8px;">
                    <strong style="color: #856404;">📝 備考:</strong>
                    <p style="color: #856404; margin-top: 8px; margin-bottom: 0;">${project.notes}</p>
                </div>
            ` : ''}
            
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="btn btn-secondary" style="flex: 1;" onclick="closeModal('assignmentModal')">
                    閉じる
                </button>
                <button class="btn btn-primary" style="flex: 1;" onclick="closeModal('assignmentModal'); autoAssignProject('${project.id}')">
                    自動配置
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    modal.style.display = 'flex';
}

function autoAssignProject(id) {
    const project = projectData.find(p => p.id === id);
    if (!project) return;
    
    const needed = project.requiredPeople - (project.assignedCount || 0);
    
    if (needed <= 0) {
        alert('この案件は既に配置が完了しています');
        return;
    }
    
    // Find suitable staff
    const suitableStaff = staffData.filter(s => 
        (Math.random() > 0.3) && // Random availability
        ((project.roles.includes('クローザー') && s.suitability.closer !== '△') ||
        (project.roles.includes('キャッチャー') && s.suitability.catcher !== '△'))
    ).slice(0, needed);
    
    if (suitableStaff.length === 0) {
        alert('⚠️ 条件に合うスタッフが見つかりませんでした');
        return;
    }
    
    project.assignedCount = (project.assignedCount || 0) + suitableStaff.length;
    if (project.assignedCount >= project.requiredPeople) {
        project.assigned = true;
    }
    
    alert(`✅ ${project.name}に${suitableStaff.length}名のスタッフを配置しました！\n\n配置: ${suitableStaff.map(s => s.name).join(', ')}`);
    
    updateKPICards();
    if (document.getElementById('page-projects').classList.contains('active')) {
        renderProjectList();
    }
}

