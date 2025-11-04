// 実績データを保存（ローカルストレージ）
let performanceRecords = JSON.parse(localStorage.getItem('performanceRecords') || '[]');

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    initPerformancePage();
});

// ページ初期化
function initPerformancePage() {
    populateStaffSelects();
    populateProjectSelect();
    setupFormHandlers();
    renderQuickRegister();
    renderPerformanceList();
    updateStatsSummary();
    setDefaultDate();
}

// スタッフセレクトを初期化
function populateStaffSelects() {
    const selects = [
        document.getElementById('staffSelect'),
        document.getElementById('historyStaffFilter'),
        document.getElementById('skillsheetStaffSelect')
    ];
    
    selects.forEach(select => {
        if (!select) return;
        
        const currentOptions = select.innerHTML;
        select.innerHTML = currentOptions + staffData.map(staff => 
            `<option value="${staff.id}">${staff.name}（${staff.id}）</option>`
        ).join('');
    });
}

// 案件セレクトを初期化
function populateProjectSelect() {
    const select = document.getElementById('projectSelect');
    if (!select) return;
    
    select.innerHTML = '<option value="">選択してください</option>' + 
        projectData.map(project => 
            `<option value="${project.id}">${project.name} - ${project.dateDisplay}</option>`
        ).join('');
}

// デフォルト日付を設定
function setDefaultDate() {
    const dateInput = document.getElementById('workDate');
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
}

// フォームハンドラー設定
function setupFormHandlers() {
    // 評価ボタン
    document.querySelectorAll('.rating-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.rating-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            document.getElementById('rating').value = this.dataset.rating;
        });
    });
    
    // フォーム送信
    const form = document.getElementById('performanceForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

// フォーム送信処理
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        id: Date.now().toString(),
        staffId: document.getElementById('staffSelect').value,
        projectId: document.getElementById('projectSelect').value,
        workDate: document.getElementById('workDate').value,
        mnpCount: parseInt(document.getElementById('mnpCount').value) || 0,
        hikariCount: parseInt(document.getElementById('hikariCount').value) || 0,
        cardCount: parseInt(document.getElementById('cardCount').value) || 0,
        deviceCount: parseInt(document.getElementById('deviceCount').value) || 0,
        rating: parseInt(document.getElementById('rating').value),
        comment: document.getElementById('comment').value,
        createdAt: new Date().toISOString()
    };
    
    // 実績を保存
    performanceRecords.push(formData);
    localStorage.setItem('performanceRecords', JSON.stringify(performanceRecords));
    
    // スキルを更新
    updateStaffSkills(formData.staffId);
    
    // 成功メッセージ
    const staff = staffData.find(s => s.id === formData.staffId);
    const project = projectData.find(p => p.id === formData.projectId);
    
    document.getElementById('successMessage').innerHTML = `
        <p style="font-size:18px;"><strong>${staff.name}</strong> さんの実績を登録しました！</p>
        <p style="margin-top:15px;">案件: ${project.name}</p>
        <p>MNP: ${formData.mnpCount}件 / 光: ${formData.hikariCount}件 / カード: ${formData.cardCount}件</p>
        <p>評価: ${'⭐'.repeat(formData.rating)}</p>
    `;
    
    document.getElementById('successModal').style.display = 'block';
    
    // フォームをリセット
    document.getElementById('performanceForm').reset();
    document.querySelectorAll('.rating-btn').forEach(b => b.classList.remove('selected'));
    setDefaultDate();
    
    // 表示を更新
    renderPerformanceList();
    updateStatsSummary();
}

// スキル自動更新
function updateStaffSkills(staffId) {
    const staff = staffData.find(s => s.id === staffId);
    if (!staff) return;
    
    // このスタッフの全実績を集計
    const staffRecords = performanceRecords.filter(r => r.staffId === staffId);
    
    const totalMNP = staffRecords.reduce((sum, r) => sum + r.mnpCount, 0);
    const totalHikari = staffRecords.reduce((sum, r) => sum + r.hikariCount, 0);
    const totalCard = staffRecords.reduce((sum, r) => sum + r.cardCount, 0);
    const totalDevice = staffRecords.reduce((sum, r) => sum + r.deviceCount, 0);
    
    // スキルレベルを更新
    staff.skills.mnp = getSkillLevel(totalMNP);
    staff.skills.hikari = getSkillLevel(totalHikari);
    staff.skills.card = getSkillLevel(totalCard);
    staff.skills.device = getSkillLevel(totalDevice);
    
    // 適性を更新
    if (staff.skills.mnp === '◎' || staff.skills.hikari === '◎') {
        staff.suitability.closer = '◎';
    } else if (staff.skills.mnp === '◯' || staff.skills.hikari === '◯') {
        staff.suitability.closer = '◯';
    }
    
    if (totalMNP + totalHikari + totalCard + totalDevice >= 20) {
        staff.suitability.catcher = '◎';
    } else if (totalMNP + totalHikari + totalCard + totalDevice >= 10) {
        staff.suitability.catcher = '◯';
    }
    
    // 稼働実績を更新
    staff.workHistory.totalDays = staffRecords.length;
    staff.workHistory.averageScore = Math.round(
        staffRecords.reduce((sum, r) => sum + r.rating, 0) / staffRecords.length * 20
    );
}

// 実績数に応じたスキルレベルを返す
function getSkillLevel(count) {
    if (count >= 16) return '◎';
    if (count >= 6) return '◯';
    if (count >= 1) return '△';
    return '-';
}

// クイック登録を表示
function renderQuickRegister() {
    const container = document.getElementById('quickRegister');
    if (!container) return;
    
    const recentProjects = projectData
        .filter(p => p.assignedStaff)
        .slice(0, 6);
    
    if (recentProjects.length === 0) {
        container.innerHTML = '<p class="empty-state-text">配置済みの案件はまだありません</p>';
        return;
    }
    
    container.innerHTML = recentProjects.map(project => {
        const staff = staffData.find(s => s.id === project.assignedStaff);
        return `
            <div class="quick-register-card" onclick="fillQuickForm('${project.id}', '${project.assignedStaff}')">
                <div class="quick-register-project">${project.name}</div>
                <div class="quick-register-meta">
                    ${project.dateDisplay} / ${staff.name}
                </div>
            </div>
        `;
    }).join('');
}

// クイックフォーム入力
function fillQuickForm(projectId, staffId) {
    document.getElementById('staffSelect').value = staffId;
    document.getElementById('projectSelect').value = projectId;
    
    // 案件の日付を設定
    const project = projectData.find(p => p.id === projectId);
    if (project) {
        document.getElementById('workDate').value = project.date;
    }
    
    // フォームまでスクロール
    document.getElementById('performanceForm').scrollIntoView({ behavior: 'smooth' });
}

// 実績一覧を表示
function renderPerformanceList() {
    const container = document.getElementById('performanceList');
    if (!container) return;
    
    let filtered = [...performanceRecords];
    
    // フィルター適用
    const staffFilter = document.getElementById('historyStaffFilter')?.value;
    const periodFilter = document.getElementById('historyPeriodFilter')?.value || 'all';
    
    if (staffFilter) {
        filtered = filtered.filter(r => r.staffId === staffFilter);
    }
    
    // 期間フィルター
    const now = new Date();
    if (periodFilter === 'today') {
        const today = now.toISOString().split('T')[0];
        filtered = filtered.filter(r => r.workDate === today);
    } else if (periodFilter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(r => new Date(r.workDate) >= weekAgo);
    } else if (periodFilter === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(r => new Date(r.workDate) >= monthAgo);
    }
    
    // 日付順にソート（新しい順）
    filtered.sort((a, b) => new Date(b.workDate) - new Date(a.workDate));
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📊</div>
                <div class="empty-state-text">実績データがありません</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(record => {
        const staff = staffData.find(s => s.id === record.staffId);
        const project = projectData.find(p => p.id === record.projectId);
        
        return `
            <div class="performance-item">
                <div class="performance-header">
                    <div class="performance-staff">${staff.name}（${staff.id}）</div>
                    <div class="performance-date">${record.workDate}</div>
                </div>
                <div style="margin-bottom:15px;color:#718096;">${project.name}</div>
                <div class="performance-metrics">
                    <div class="metric-item">
                        <div class="metric-value">${record.mnpCount}</div>
                        <div class="metric-label">MNP</div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-value">${record.hikariCount}</div>
                        <div class="metric-label">光</div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-value">${record.cardCount}</div>
                        <div class="metric-label">カード</div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-value">${record.deviceCount}</div>
                        <div class="metric-label">端末</div>
                    </div>
                </div>
                <div class="performance-rating">${'⭐'.repeat(record.rating)}</div>
                ${record.comment ? `<div class="performance-comment">${record.comment}</div>` : ''}
            </div>
        `;
    }).join('');
}

// 統計サマリーを更新
function updateStatsSummary() {
    const totalMNP = performanceRecords.reduce((sum, r) => sum + r.mnpCount, 0);
    const totalHikari = performanceRecords.reduce((sum, r) => sum + r.hikariCount, 0);
    const totalCard = performanceRecords.reduce((sum, r) => sum + r.cardCount, 0);
    const avgRating = performanceRecords.length > 0 
        ? (performanceRecords.reduce((sum, r) => sum + r.rating, 0) / performanceRecords.length).toFixed(1)
        : 0;
    
    const totalMNPEl = document.getElementById('totalMNP');
    const totalHikariEl = document.getElementById('totalHikari');
    const totalCardEl = document.getElementById('totalCard');
    const avgRatingEl = document.getElementById('avgRating');
    
    if (totalMNPEl) totalMNPEl.textContent = totalMNP;
    if (totalHikariEl) totalHikariEl.textContent = totalHikari;
    if (totalCardEl) totalCardEl.textContent = totalCard;
    if (avgRatingEl) avgRatingEl.textContent = avgRating;
}

// 履歴フィルター適用
function applyHistoryFilters() {
    renderPerformanceList();
}

// セクション切り替え
function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`section-${sectionName}`).classList.add('active');
}

// スキルシート生成
function generateSkillSheet() {
    const staffId = document.getElementById('skillsheetStaffSelect').value;
    if (!staffId) {
        alert('スタッフを選択してください');
        return;
    }
    
    const staff = staffData.find(s => s.id === staffId);
    const staffRecords = performanceRecords.filter(r => r.staffId === staffId);
    
    const totalMNP = staffRecords.reduce((sum, r) => sum + r.mnpCount, 0);
    const totalHikari = staffRecords.reduce((sum, r) => sum + r.hikariCount, 0);
    const totalCard = staffRecords.reduce((sum, r) => sum + r.cardCount, 0);
    const totalDevice = staffRecords.reduce((sum, r) => sum + r.deviceCount, 0);
    
    const preview = document.getElementById('skillsheetPreview');
    preview.innerHTML = `
        <div class="skillsheet-container">
            <div class="skillsheet-header">
                <div class="skillsheet-title">スキルシート</div>
                <div class="skillsheet-date">発行日: ${new Date().toLocaleDateString('ja-JP')}</div>
            </div>
            
            <div class="skillsheet-section">
                <div class="skillsheet-section-title">基本情報</div>
                <div class="skillsheet-grid">
                    <div class="skillsheet-item">
                        <span class="skillsheet-item-label">氏名</span>
                        <span class="skillsheet-item-value">${staff.name}</span>
                    </div>
                    <div class="skillsheet-item">
                        <span class="skillsheet-item-label">スタッフコード</span>
                        <span class="skillsheet-item-value">${staff.id}</span>
                    </div>
                    <div class="skillsheet-item">
                        <span class="skillsheet-item-label">年齢</span>
                        <span class="skillsheet-item-value">${staff.age}歳</span>
                    </div>
                    <div class="skillsheet-item">
                        <span class="skillsheet-item-label">性別</span>
                        <span class="skillsheet-item-value">${staff.gender}</span>
                    </div>
                    <div class="skillsheet-item">
                        <span class="skillsheet-item-label">最寄駅</span>
                        <span class="skillsheet-item-value">${staff.station}</span>
                    </div>
                    <div class="skillsheet-item">
                        <span class="skillsheet-item-label">通勤範囲</span>
                        <span class="skillsheet-item-value">${staff.commuteTime}分以内</span>
                    </div>
                </div>
            </div>
            
            <div class="skillsheet-section">
                <div class="skillsheet-section-title">スキル評価</div>
                <div class="skillsheet-grid">
                    <div class="skillsheet-item">
                        <span class="skillsheet-item-label">MNP獲得</span>
                        <span class="skillsheet-item-value ${staff.skills.mnp === '◎' ? 'excellent' : staff.skills.mnp === '◯' ? 'good' : ''}">${staff.skills.mnp}</span>
                    </div>
                    <div class="skillsheet-item">
                        <span class="skillsheet-item-label">光契約</span>
                        <span class="skillsheet-item-value ${staff.skills.hikari === '◎' ? 'excellent' : staff.skills.hikari === '◯' ? 'good' : ''}">${staff.skills.hikari}</span>
                    </div>
                    <div class="skillsheet-item">
                        <span class="skillsheet-item-label">カード契約</span>
                        <span class="skillsheet-item-value ${staff.skills.card === '◎' ? 'excellent' : staff.skills.card === '◯' ? 'good' : ''}">${staff.skills.card}</span>
                    </div>
                    <div class="skillsheet-item">
                        <span class="skillsheet-item-label">端末販売</span>
                        <span class="skillsheet-item-value ${staff.skills.device === '◎' ? 'excellent' : staff.skills.device === '◯' ? 'good' : ''}">${staff.skills.device}</span>
                    </div>
                </div>
            </div>
            
            <div class="skillsheet-section">
                <div class="skillsheet-section-title">適性評価</div>
                <div class="skillsheet-grid">
                    <div class="skillsheet-item">
                        <span class="skillsheet-item-label">クローザー適性</span>
                        <span class="skillsheet-item-value ${staff.suitability.closer === '◎' ? 'excellent' : staff.suitability.closer === '◯' ? 'good' : ''}">${staff.suitability.closer}</span>
                    </div>
                    <div class="skillsheet-item">
                        <span class="skillsheet-item-label">キャッチャー適性</span>
                        <span class="skillsheet-item-value ${staff.suitability.catcher === '◎' ? 'excellent' : staff.suitability.catcher === '◯' ? 'good' : ''}">${staff.suitability.catcher}</span>
                    </div>
                    <div class="skillsheet-item">
                        <span class="skillsheet-item-label">リーダー適性</span>
                        <span class="skillsheet-item-value ${staff.suitability.leader === '◎' ? 'excellent' : staff.suitability.leader === '◯' ? 'good' : ''}">${staff.suitability.leader}</span>
                    </div>
                </div>
            </div>
            
            <div class="skillsheet-section">
                <div class="skillsheet-section-title">実績サマリー</div>
                <div class="skillsheet-performance-summary">
                    <div class="skillsheet-performance-grid">
                        <div class="skillsheet-performance-item">
                            <div class="skillsheet-performance-value">${totalMNP}</div>
                            <div class="skillsheet-performance-label">MNP獲得</div>
                        </div>
                        <div class="skillsheet-performance-item">
                            <div class="skillsheet-performance-value">${totalHikari}</div>
                            <div class="skillsheet-performance-label">光契約</div>
                        </div>
                        <div class="skillsheet-performance-item">
                            <div class="skillsheet-performance-value">${totalCard}</div>
                            <div class="skillsheet-performance-label">カード</div>
                        </div>
                        <div class="skillsheet-performance-item">
                            <div class="skillsheet-performance-value">${staffRecords.length}</div>
                            <div class="skillsheet-performance-label">稼働日数</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="skillsheet-section">
                <div class="skillsheet-section-title">強み</div>
                <div class="skillsheet-strengths">
                    <ul>
                        ${staff.strengths.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="skillsheet-footer">
                発行元: 株式会社Lit Ship / このスキルシートは ${new Date().toLocaleDateString('ja-JP')} 時点の情報です
            </div>
        </div>
    `;
    
    document.getElementById('exportActions').style.display = 'flex';
}

// PDF出力
function exportSkillSheetPDF() {
    const { jsPDF } = window.jspdf;
    const content = document.getElementById('skillsheetPreview');
    
    html2canvas(content, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        
        const staffId = document.getElementById('skillsheetStaffSelect').value;
        const staff = staffData.find(s => s.id === staffId);
        pdf.save(`スキルシート_${staff.name}_${new Date().toISOString().split('T')[0]}.pdf`);
    });
}

// Excel出力（CSVで代用）
function exportSkillSheetExcel() {
    const staffId = document.getElementById('skillsheetStaffSelect').value;
    const staff = staffData.find(s => s.id === staffId);
    const staffRecords = performanceRecords.filter(r => r.staffId === staffId);
    
    const totalMNP = staffRecords.reduce((sum, r) => sum + r.mnpCount, 0);
    const totalHikari = staffRecords.reduce((sum, r) => sum + r.hikariCount, 0);
    const totalCard = staffRecords.reduce((sum, r) => sum + r.cardCount, 0);
    
    const csv = [
        ['スキルシート'],
        ['発行日', new Date().toLocaleDateString('ja-JP')],
        [],
        ['基本情報'],
        ['氏名', staff.name],
        ['スタッフコード', staff.id],
        ['年齢', staff.age],
        ['性別', staff.gender],
        ['最寄駅', staff.station],
        ['通勤範囲', `${staff.commuteTime}分以内`],
        [],
        ['スキル評価'],
        ['MNP獲得', staff.skills.mnp],
        ['光契約', staff.skills.hikari],
        ['カード契約', staff.skills.card],
        ['端末販売', staff.skills.device],
        [],
        ['適性評価'],
        ['クローザー適性', staff.suitability.closer],
        ['キャッチャー適性', staff.suitability.catcher],
        ['リーダー適性', staff.suitability.leader],
        [],
        ['実績サマリー'],
        ['MNP獲得', totalMNP],
        ['光契約', totalHikari],
        ['カード契約', totalCard],
        ['稼働日数', staffRecords.length]
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `スキルシート_${staff.name}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
}

// 画像出力
function exportSkillSheetImage() {
    const content = document.getElementById('skillsheetPreview');
    
    html2canvas(content, { scale: 2 }).then(canvas => {
        const staffId = document.getElementById('skillsheetStaffSelect').value;
        const staff = staffData.find(s => s.id === staffId);
        
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `スキルシート_${staff.name}_${new Date().toISOString().split('T')[0]}.png`;
            a.click();
        });
    });
}

// テキストコピー
function copySkillSheetText() {
    const staffId = document.getElementById('skillsheetStaffSelect').value;
    const staff = staffData.find(s => s.id === staffId);
    
    const text = `
スキルシート

【基本情報】
氏名: ${staff.name}
スタッフコード: ${staff.id}
年齢: ${staff.age}歳
性別: ${staff.gender}
最寄駅: ${staff.station}
通勤範囲: ${staff.commuteTime}分以内

【スキル評価】
MNP獲得: ${staff.skills.mnp}
光契約: ${staff.skills.hikari}
カード契約: ${staff.skills.card}
端末販売: ${staff.skills.device}

【適性評価】
クローザー適性: ${staff.suitability.closer}
キャッチャー適性: ${staff.suitability.catcher}
リーダー適性: ${staff.suitability.leader}

【強み】
${staff.strengths.map(s => `・${s}`).join('\n')}
    `.trim();
    
    navigator.clipboard.writeText(text).then(() => {
        alert('テキストをコピーしました！');
    });
}

// 一括PDF出力
function bulkExportPDF() {
    alert('一括PDF出力機能は開発中です。全スタッフのスキルシートをZIPファイルで出力します。');
}

// 一括Excel出力
function bulkExportExcel() {
    alert('一括Excel出力機能は開発中です。全スタッフのスキルシートを1つのExcelファイルにまとめて出力します。');
}

// 成功モーダルを閉じる
function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
}

// モーダル外クリックで閉じる
window.onclick = function(event) {
    const modal = document.getElementById('successModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

