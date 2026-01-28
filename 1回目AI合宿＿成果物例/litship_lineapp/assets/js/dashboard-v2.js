// ========================================
// Global Variables
// ========================================
let staffData = [];
let projectData = [];
let currentPage = 1;
const itemsPerPage = 12;
let filteredStaffData = [];
let filteredProjectData = [];

// ========================================
// Page Navigation
// ========================================
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Remove active from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Show selected page
    document.getElementById(`page-${pageName}`).classList.add('active');

    // Set active nav item
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }

    // Update page title
    const titles = {
        'overview': 'ダッシュボード',
        'staff': 'スタッフ管理',
        'projects': '案件管理',
        'calendar': 'カレンダー',
        'analytics': '分析・レポート'
    };
    document.getElementById('pageTitle').textContent = titles[pageName] || 'ダッシュボード';

    // Load page-specific content
    if (pageName === 'staff') {
        currentPage = 1;
        filteredStaffData = [...staffData];
        renderStaffList();
    } else if (pageName === 'projects') {
        filteredProjectData = [...projectData];
        renderProjectList();
    } else if (pageName === 'calendar') {
        renderCalendar();
    } else if (pageName === 'analytics') {
        renderAnalytics();
    }
}

// ========================================
// Sidebar Toggle (Mobile)
// ========================================
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

// Close sidebar when clicking outside (Mobile)
document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.querySelector('.hamburger');
    
    if (window.innerWidth <= 768 && 
        sidebar && hamburger &&
        !sidebar.contains(e.target) && 
        !hamburger.contains(e.target)) {
        sidebar.classList.remove('active');
    }
});

// ========================================
// Load Data
// ========================================
function loadData() {
    if (typeof STAFF_DATA !== 'undefined') {
        staffData = STAFF_DATA;
        filteredStaffData = [...staffData];
    } else {
        // Fallback dummy data
        staffData = generateDummyStaff();
        filteredStaffData = [...staffData];
    }
    
    if (typeof PROJECT_DATA !== 'undefined') {
        projectData = PROJECT_DATA;
        filteredProjectData = [...projectData];
    } else {
        // Fallback dummy data
        projectData = generateDummyProjects();
        filteredProjectData = [...projectData];
    }

    updateKPICards();
    checkAlerts();
}

// Generate dummy staff data if not available
function generateDummyStaff() {
    const staff = [];
    const stations = ['池袋駅', '新宿駅', '渋谷駅', '品川駅', '東京駅', '上野駅', '秋葉原駅'];
    const skillLevels = ['◎', '○', '△'];
    
    for (let i = 1; i <= 100; i++) {
        staff.push({
            code: String(i).padStart(3, '0'),
            name: `スタッフ${i}`,
            station: stations[Math.floor(Math.random() * stations.length)],
            skills: {
                mnp: skillLevels[Math.floor(Math.random() * skillLevels.length)],
                hikari: skillLevels[Math.floor(Math.random() * skillLevels.length)],
                card: skillLevels[Math.floor(Math.random() * skillLevels.length)]
            },
            suitability: {
                closer: skillLevels[Math.floor(Math.random() * skillLevels.length)],
                catcher: skillLevels[Math.floor(Math.random() * skillLevels.length)]
            },
            totalDays: Math.floor(Math.random() * 50) + 10,
            averageRating: (Math.random() * 2 + 3).toFixed(1)
        });
    }
    return staff;
}

// Generate dummy project data if not available
function generateDummyProjects() {
    const projects = [];
    const locations = ['池袋', '新宿', '渋谷', '品川', '横浜', '大宮', '立川'];
    const clients = ['ヤマダ電機', 'ビックカメラ', 'ヨドバシカメラ', 'ノジマ', 'エディオン'];
    
    for (let i = 1; i <= 15; i++) {
        const startDate = new Date(2025, 10, i * 2); // November 2025
        projects.push({
            id: `P${String(i).padStart(3, '0')}`,
            name: `${clients[Math.floor(Math.random() * clients.length)]} ${locations[Math.floor(Math.random() * locations.length)]}店`,
            date: startDate.toLocaleDateString('ja-JP'),
            location: locations[Math.floor(Math.random() * locations.length)],
            requiredPeople: Math.floor(Math.random() * 5) + 3,
            unitPrice: (Math.floor(Math.random() * 5) + 12) * 1000,
            assigned: Math.random() > 0.3,
            assignedCount: Math.floor(Math.random() * 5) + 1,
            roles: ['クローザー', 'キャッチャー']
        });
    }
    return projects;
}

// ========================================
// Update KPI Cards
// ========================================
function updateKPICards() {
    const totalStaff = staffData.length;
    const totalProjects = projectData.length;
    const assignedProjects = projectData.filter(p => p.assigned).length;
    const assignmentRate = totalProjects > 0 ? Math.round((assignedProjects / totalProjects) * 100) : 0;
    
    // Calculate total sales (example)
    const avgSales = 350000; // Average per project
    const totalSales = avgSales * totalProjects;

    document.getElementById('totalStaff').textContent = `${totalStaff}人`;
    document.getElementById('projectCount').textContent = `${totalProjects}件`;
    document.getElementById('unassignedCount').textContent = totalProjects - assignedProjects;
    document.getElementById('assignmentRate').textContent = `${assignmentRate}%`;
    document.getElementById('totalSales').textContent = `¥${totalSales.toLocaleString()}`;
}

// ========================================
// Check Alerts
// ========================================
function checkAlerts() {
    const alertSection = document.getElementById('alertSection');
    const today = new Date();
    const currentDay = today.getDate();
    const deadline = 15;
    
    if (currentDay <= deadline) {
        const daysLeft = deadline - currentDay;
        const alertClass = daysLeft <= 3 ? 'alert-danger' : 'alert-warning';
        
        alertSection.innerHTML = `
            <div class="alert ${alertClass}">
                <i class="fas fa-exclamation-triangle"></i>
                <div>
                    <strong>注意:</strong> 来月の稼働日提出期限まで残り${daysLeft}日です
                </div>
            </div>
        `;
    }
}

// ========================================
// Render Staff List
// ========================================
function renderStaffList() {
    const container = document.getElementById('staffListExtended');
    if (!container) return;

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = filteredStaffData.slice(start, end);

    if (pageData.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 60px;">
                <div style="font-size: 64px; opacity: 0.3; margin-bottom: 20px;">👥</div>
                <div style="font-size: 18px; color: #718096;">該当するスタッフが見つかりませんでした</div>
            </div>
        `;
        return;
    }

    container.innerHTML = pageData.map(staff => `
        <div class="staff-card">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                <div>
                    <h3 style="margin-bottom: 5px; color: #1A3A52;">${staff.name}</h3>
                    <div style="font-size: 13px; color: #718096;">コード: ${staff.code}</div>
                </div>
                <div style="background: #E8F4F8; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; color: #00A0B0;">
                    ⭐ ${staff.averageRating || '4.5'}
                </div>
            </div>
            
            <div style="margin-bottom: 12px; padding: 10px; background: #F5F5F5; border-radius: 8px;">
                <div style="font-size: 13px; color: #666; margin-bottom: 5px;">📍 ${staff.station}</div>
                <div style="font-size: 13px; color: #666;">🗓️ 稼働日数: ${staff.totalDays || 0}日</div>
            </div>
            
            <div style="margin-bottom: 12px;">
                <div style="font-size: 12px; color: #718096; margin-bottom: 5px;">スキル評価</div>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <span class="skill-badge skill-${staff.skills.mnp}">MNP ${staff.skills.mnp}</span>
                    <span class="skill-badge skill-${staff.skills.hikari}">光 ${staff.skills.hikari}</span>
                    ${staff.skills.card ? `<span class="skill-badge skill-${staff.skills.card}">カード ${staff.skills.card}</span>` : ''}
                </div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <div style="font-size: 12px; color: #718096; margin-bottom: 5px;">適性</div>
                <div style="display: flex; gap: 8px;">
                    <span class="suitability-badge">クローザー ${staff.suitability.closer}</span>
                    <span class="suitability-badge">キャッチャー ${staff.suitability.catcher}</span>
                </div>
            </div>
            
            <div style="display: flex; gap: 8px;">
                <button class="btn btn-primary" style="flex: 1; padding: 10px; font-size: 13px;" onclick="viewStaffDetail('${staff.code}')">
                    詳細
                </button>
                <button class="btn btn-secondary" style="flex: 1; padding: 10px; font-size: 13px;" onclick="assignStaff('${staff.code}')">
                    配置
                </button>
            </div>
        </div>
    `).join('');

    renderPagination();
}

// ========================================
// Render Project List
// ========================================
function renderProjectList() {
    const container = document.getElementById('projectListExtended');
    if (!container) return;

    if (filteredProjectData.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 60px;">
                <div style="font-size: 64px; opacity: 0.3; margin-bottom: 20px;">📋</div>
                <div style="font-size: 18px; color: #718096;">該当する案件が見つかりませんでした</div>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredProjectData.map(project => {
        const statusBadge = project.assigned 
            ? '<span style="background: #d4edda; color: #155724; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">✓ 配置済み</span>'
            : '<span style="background: #fff3cd; color: #856404; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">未配置</span>';
        
        const progress = project.assigned ? Math.round((project.assignedCount / project.requiredPeople) * 100) : 0;
        const progressColor = progress >= 100 ? '#28a745' : progress >= 50 ? '#ffc107' : '#dc3545';
        
        return `
            <div class="project-card">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                    <div style="flex: 1;">
                        <h3 style="margin-bottom: 5px; color: #1A3A52;">${project.name}</h3>
                        <div style="font-size: 13px; color: #718096;">ID: ${project.id}</div>
                    </div>
                    ${statusBadge}
                </div>
                
                <div style="margin-bottom: 15px; padding: 12px; background: #F5F5F5; border-radius: 8px;">
                    <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px; font-size: 13px;">
                        <span>📅</span><span>${project.date}</span>
                        <span>📍</span><span>${project.location}</span>
                        <span>💰</span><span>¥${project.unitPrice.toLocaleString()}/日</span>
                    </div>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span style="font-size: 13px; color: #718096;">配置進捗</span>
                        <span style="font-size: 13px; font-weight: 600; color: ${progressColor};">
                            ${project.assignedCount || 0}/${project.requiredPeople}名 (${progress}%)
                        </span>
                    </div>
                    <div style="background: #E0E0E0; border-radius: 10px; height: 8px; overflow: hidden;">
                        <div style="background: ${progressColor}; height: 100%; width: ${progress}%; transition: width 0.3s;"></div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
                    ${project.roles.map(role => `
                        <span style="background: #E8F4F8; color: #00A0B0; padding: 4px 10px; border-radius: 15px; font-size: 12px; font-weight: 600;">
                            ${role}
                        </span>
                    `).join('')}
                </div>
                
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-primary" style="flex: 1; padding: 10px; font-size: 13px;" onclick="viewProjectDetail('${project.id}')">
                        詳細
                    </button>
                    <button class="btn btn-secondary" style="flex: 1; padding: 10px; font-size: 13px;" onclick="autoAssignProject('${project.id}')">
                        自動配置
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ========================================
// Render Pagination
// ========================================
function renderPagination() {
    const container = document.getElementById('staffPagination');
    if (!container) return;

    const totalPages = Math.ceil(filteredStaffData.length / itemsPerPage);
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    const buttons = [];

    // Previous button
    if (currentPage > 1) {
        buttons.push(`<button onclick="changePage(${currentPage - 1})">← 前へ</button>`);
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            const activeClass = i === currentPage ? 'active' : '';
            buttons.push(`<button class="${activeClass}" onclick="changePage(${i})">${i}</button>`);
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            buttons.push(`<span style="padding: 10px;">...</span>`);
        }
    }

    // Next button
    if (currentPage < totalPages) {
        buttons.push(`<button onclick="changePage(${currentPage + 1})">次へ →</button>`);
    }

    container.innerHTML = buttons.join('');
}

function changePage(page) {
    currentPage = page;
    renderStaffList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================================
// Filter Functions
// ========================================
function applyFilters() {
    const searchTerm = document.getElementById('staffSearch').value.toLowerCase();
    const skillFilter = document.getElementById('skillFilter').value;
    const stationFilter = document.getElementById('stationFilter').value;

    filteredStaffData = staffData.filter(staff => {
        // Search term filter
        const matchesSearch = !searchTerm || 
            staff.name.toLowerCase().includes(searchTerm) ||
            staff.code.toLowerCase().includes(searchTerm) ||
            staff.station.toLowerCase().includes(searchTerm);

        // Skill filter
        let matchesSkill = true;
        if (skillFilter) {
            if (skillFilter === 'mnp-excellent') matchesSkill = staff.skills.mnp === '◎';
            else if (skillFilter === 'hikari-excellent') matchesSkill = staff.skills.hikari === '◎';
            else if (skillFilter === 'closer-excellent') matchesSkill = staff.suitability.closer === '◎';
            else if (skillFilter === 'catcher-excellent') matchesSkill = staff.suitability.catcher === '◎';
        }

        // Station filter
        const matchesStation = !stationFilter || staff.station.includes(stationFilter);

        return matchesSearch && matchesSkill && matchesStation;
    });

    currentPage = 1;
    renderStaffList();
}

function clearFilters() {
    document.getElementById('staffSearch').value = '';
    document.getElementById('skillFilter').value = '';
    document.getElementById('stationFilter').value = '';
    filteredStaffData = [...staffData];
    currentPage = 1;
    renderStaffList();
}

function applyProjectFilters() {
    const searchTerm = document.getElementById('projectSearch').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const roleFilter = document.getElementById('roleFilter').value;

    filteredProjectData = projectData.filter(project => {
        const matchesSearch = !searchTerm || 
            project.name.toLowerCase().includes(searchTerm) ||
            project.location.toLowerCase().includes(searchTerm);

        const matchesStatus = !statusFilter || 
            (statusFilter === '配置済み' && project.assigned) ||
            (statusFilter === '未配置' && !project.assigned);

        const matchesRole = !roleFilter || project.roles.includes(roleFilter);

        return matchesSearch && matchesStatus && matchesRole;
    });

    renderProjectList();
}

function clearProjectFilters() {
    document.getElementById('projectSearch').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('roleFilter').value = '';
    filteredProjectData = [...projectData];
    renderProjectList();
}

// ========================================
// Auto Assignment
// ========================================
function runAutoAssignment() {
    const unassignedProjects = projectData.filter(p => !p.assigned || p.assignedCount < p.requiredPeople);
    
    if (unassignedProjects.length === 0) {
        alert('✅ すべての案件に配置が完了しています！');
        return;
    }
    
    // Show assignment modal
    const modal = document.getElementById('assignmentModal');
    const result = document.getElementById('assignmentResult');
    
    let resultHTML = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: #1A3A52; margin-bottom: 15px;">🤖 自動配置を実行中...</h3>
            <p style="color: #666;">対象案件: ${unassignedProjects.length}件</p>
        </div>
    `;
    
    unassignedProjects.forEach((project, index) => {
        // Simulate assignment
        const needed = project.requiredPeople - (project.assignedCount || 0);
        const availableStaff = staffData.filter(s => 
            (Math.random() > 0.3) && // Random availability
            (project.roles.includes('クローザー') && s.suitability.closer !== '△') ||
            (project.roles.includes('キャッチャー') && s.suitability.catcher !== '△')
        ).slice(0, needed);
        
        resultHTML += `
            <div style="padding: 15px; margin-bottom: 15px; background: #F5F5F5; border-radius: 8px; border-left: 4px solid #00A0B0;">
                <div style="font-weight: 700; color: #1A3A52; margin-bottom: 8px;">
                    ${project.name}
                </div>
                <div style="font-size: 13px; color: #666; margin-bottom: 10px;">
                    必要: ${needed}名 → 配置: ${availableStaff.length}名
                </div>
                ${availableStaff.length > 0 ? `
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        ${availableStaff.map(s => `
                            <span style="background: #E8F4F8; color: #00A0B0; padding: 4px 10px; border-radius: 15px; font-size: 12px; font-weight: 600;">
                                ${s.name}
                            </span>
                        `).join('')}
                    </div>
                ` : `
                    <div style="color: #dc3545; font-size: 13px;">⚠️ 条件に合うスタッフが見つかりませんでした</div>
                `}
            </div>
        `;
        
        // Update project
        if (availableStaff.length > 0) {
            project.assignedCount = (project.assignedCount || 0) + availableStaff.length;
            if (project.assignedCount >= project.requiredPeople) {
                project.assigned = true;
            }
        }
    });
    
    resultHTML += `
        <div style="margin-top: 20px; padding: 15px; background: #d4edda; border-radius: 8px; text-align: center;">
            <strong style="color: #155724;">✅ 自動配置が完了しました！</strong>
        </div>
        <button class="btn btn-primary" style="width: 100%; margin-top: 15px;" onclick="closeModal('assignmentModal'); updateKPICards(); if(document.getElementById('page-projects').classList.contains('active')) renderProjectList();">
            閉じる
        </button>
    `;
    
    result.innerHTML = resultHTML;
    modal.classList.add('active');
    modal.style.display = 'flex';
    
    // Update KPI
    updateKPICards();
}

// ========================================
// Export Data
// ========================================
function exportData() {
    const exportData = {
        staff: staffData,
        projects: projectData,
        exportDate: new Date().toLocaleString('ja-JP')
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ライン管理データ_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('✅ データをエクスポートしました！');
}

// Note: renderAnalytics is now in dashboard-v2-extended.js

// ========================================
// Modal Functions
// ========================================
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
}

function showAddProjectModal() {
    const modal = document.getElementById('addProjectModal');
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
        // Reset form
        document.getElementById('addProjectForm').reset();
    }
}

// Handle Add Project Form Submission
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addProjectForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const client = document.getElementById('projectClient').value;
            const name = document.getElementById('projectName').value;
            const price = parseInt(document.getElementById('projectPrice').value);
            const content = document.getElementById('projectContent').value;
            const greeting = document.getElementById('projectGreeting').value;
            const location = document.getElementById('projectLocation').value;
            const date = document.getElementById('projectDate').value;
            const people = parseInt(document.getElementById('projectPeople').value);
            const notes = document.getElementById('projectNotes').value;
            
            const roles = [];
            if (document.getElementById('roleCloser').checked) roles.push('クローザー');
            if (document.getElementById('roleCatcher').checked) roles.push('キャッチャー');
            
            // Create new project object
            const newProject = {
                id: `P${String(projectData.length + 1).padStart(3, '0')}`,
                name: `${client} ${name}`,
                client: client,
                date: new Date(date).toLocaleDateString('ja-JP'),
                location: location,
                requiredPeople: people,
                unitPrice: price,
                content: content,
                greeting: greeting,
                notes: notes,
                assigned: false,
                assignedCount: 0,
                roles: roles
            };
            
            // Add to project data
            projectData.push(newProject);
            filteredProjectData = [...projectData];
            
            // Show success message
            alert(`✅ 案件「${newProject.name}」を追加しました！`);
            
            // Close modal and refresh
            closeModal('addProjectModal');
            updateKPICards();
            
            // If on projects page, refresh list
            if (document.getElementById('page-projects').classList.contains('active')) {
                renderProjectList();
            }
        });
    }
});

// ========================================
// Initialize
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    loadData();
});

