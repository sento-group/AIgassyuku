// 100名のスタッフデータ（デモ版）
const staffData = [];

// 名前のサンプル
const firstNames = [
  '太郎', '花子', '一郎', '美咲', '健太', '由美', '大輔', '真理子', '翔太', '愛',
  '拓也', '麻衣', '直樹', '絵理', '雄大', '里奈', '慎一', '優子', '隆', '美穂',
  '浩二', '香織', '勇気', '奈々', '誠', '恵', '和也', '加奈', '貴史', '舞',
  '博之', '彩', '智也', '千尋', '亮', '未来', '達也', '萌', '修一', '明日香',
  '洋介', '結衣', '淳', '陽菜', '圭', '美優', '正', '菜々子', '剛', '桜',
  '明', '葵', '哲也', '凛', '学', '咲', '勝', '楓', '進', '詩織',
  '聡', '純', '悟', '瞳', '寛', '梨花', '豊', '莉子', '仁', '七海',
  '栄', '琴音', '司', '柚希', '亮太', '彩花', '幸太', '実花', '雅人', '結菜',
  '将', '千春', '優', '夏希', '匠', '心', '颯', '杏', '陸', '澪',
  '海斗', '咲希', '蓮', '美月', '悠斗', '愛梨', '颯太', '陽葵', '大和', '結愛'
];

const lastNames = [
  '佐藤', '鈴木', '高橋', '田中', '渡辺', '伊藤', '山本', '中村', '小林', '加藤',
  '吉田', '山田', '佐々木', '山口', '松本', '井上', '木村', '林', '斎藤', '清水',
  '森', '池田', '橋本', '山崎', '石川', '前田', '藤田', '後藤', '岡田', '長谷川',
  '村上', '近藤', '石井', '坂本', '遠藤', '青木', '藤井', '西村', '福田', '太田',
  '三浦', '岡本', '藤原', '松田', '竹内', '中島', '金子', '小川', '原田', '中野'
];

// 駅のサンプル（東京近郊）
const stations = [
  { line: 'JR山手線', station: '渋谷', time: 60 },
  { line: 'JR山手線', station: '新宿', time: 60 },
  { line: 'JR山手線', station: '池袋', time: 60 },
  { line: 'JR山手線', station: '東京', time: 60 },
  { line: 'JR山手線', station: '品川', time: 60 },
  { line: 'JR中央線', station: '中野', time: 70 },
  { line: 'JR中央線', station: '吉祥寺', time: 80 },
  { line: 'JR中央線', station: '立川', time: 90 },
  { line: '東急東横線', station: '自由が丘', time: 70 },
  { line: '東急東横線', station: '武蔵小杉', time: 75 },
  { line: '東急田園都市線', station: '二子玉川', time: 75 },
  { line: '東急田園都市線', station: '溝の口', time: 85 },
  { line: '東武東上線', station: 'ときわ台', time: 80 },
  { line: '東武東上線', station: '成増', time: 85 },
  { line: '西武池袋線', station: '練馬', time: 75 },
  { line: '西武池袋線', station: '石神井公園', time: 80 },
  { line: '西武新宿線', station: '高田馬場', time: 65 },
  { line: '小田急線', station: '下北沢', time: 70 },
  { line: '小田急線', station: '成城学園前', time: 85 },
  { line: '京王線', station: '調布', time: 85 },
  { line: '京王線', station: '府中', time: 90 },
  { line: '東京メトロ千代田線', station: '北千住', time: 80 },
  { line: '東京メトロ千代田線', station: '綾瀬', time: 85 },
  { line: '東京メトロ東西線', station: '西葛西', time: 85 },
  { line: '東京メトロ有楽町線', station: '有楽町', time: 60 },
  { line: '東京メトロ副都心線', station: '明治神宮前', time: 65 },
  { line: 'JR埼京線', station: '戸田', time: 90 },
  { line: 'JR埼京線', station: '浦和', time: 95 },
  { line: 'JR総武線', station: '錦糸町', time: 75 },
  { line: 'JR総武線', station: '船橋', time: 100 },
  { line: '東葉高速線', station: '八千代緑が丘', time: 100 },
  { line: '多摩モノレール', station: '大塚・帝京大学', time: 120 },
  { line: '京急線', station: '品川', time: 60 },
  { line: '京急線', station: '横浜', time: 90 },
  { line: '東急大井町線', station: '大井町', time: 70 }
];

// スキルレベルの生成（バラツキを持たせる）
function randomSkill() {
  const rand = Math.random();
  if (rand < 0.3) return '◎';
  if (rand < 0.6) return '◯';
  if (rand < 0.85) return '△';
  return '-';
}

function randomCarrierSkill() {
  const rand = Math.random();
  if (rand < 0.2) return '◎';
  if (rand < 0.4) return '◯';
  return '-';
}

// 強みの生成
const strengthsPool = [
  '信頼関係を築く力が強い', 'MNP獲得力が高い', 'コミュニケーション能力が高い',
  '明るく丁寧な接客が得意', 'リーダー経験豊富', '相手主体の精神',
  '効率よく仕事を遂行できる', 'マルチタスクが得意', '責任感があり最後まで実行する',
  '状況把握能力が高い', '柔軟な対応力がある', 'お客様対応に自信がある',
  '積極的に声かけができる', 'チームワークを大切にする', '新しいことに挑戦する意欲',
  '数字を意識して行動できる', 'クロージング力が高い', '提案力がある',
  '傾聴力がある', '論理的に説明できる', 'トラブル対応が得意',
  '学習意欲が高い', '粘り強く取り組める', '臨機応変な対応ができる'
];

// 100名のスタッフを生成
for (let i = 1; i <= 100; i++) {
  const station = stations[Math.floor(Math.random() * stations.length)];
  const age = 18 + Math.floor(Math.random() * 10); // 18-27歳
  const gender = Math.random() > 0.5 ? '男性' : '女性';
  
  const mnpSkill = randomSkill();
  const hikariSkill = randomSkill();
  const fieldSalesSkill = randomSkill();
  
  // 適性は主要スキルに基づいて決定
  const closerSuitability = mnpSkill === '◎' || mnpSkill === '◯' ? (mnpSkill === '◎' ? '◎' : '◯') : '△';
  const catcherSuitability = fieldSalesSkill === '◎' || fieldSalesSkill === '◯' ? (fieldSalesSkill === '◎' ? '◎' : '◯') : '△';
  const leaderSuitability = Math.random() > 0.7 ? '◎' : (Math.random() > 0.5 ? '◯' : '△');
  
  // ランダムに強みを3-5個選択
  const strengthCount = 3 + Math.floor(Math.random() * 3);
  const selectedStrengths = [];
  const shuffledStrengths = [...strengthsPool].sort(() => Math.random() - 0.5);
  for (let j = 0; j < strengthCount; j++) {
    selectedStrengths.push(shuffledStrengths[j]);
  }
  
  staffData.push({
    id: String(i).padStart(3, '0'),
    name: `${lastNames[i % lastNames.length]}${firstNames[i % firstNames.length]}`,
    age: age,
    gender: gender,
    station: `${station.line} ${station.station}駅`,
    commuteTime: station.time + Math.floor(Math.random() * 30), // ±30分のバラツキ
    availableDays: Math.random() > 0.3 ? ['土', '日', '祝'] : ['土', '日'], // 30%は土日のみ
    skills: {
      mnp: mnpSkill,
      hikari: hikariSkill,
      card: randomSkill(),
      device: randomSkill()
    },
    carrierExperience: {
      docomo: randomCarrierSkill(),
      au: randomCarrierSkill(),
      softbank: randomCarrierSkill()
    },
    workSkills: {
      fieldSales: fieldSalesSkill,
      storeHelper: randomSkill(),
      initialSetup: randomSkill()
    },
    suitability: {
      closer: closerSuitability,
      catcher: catcherSuitability,
      leader: leaderSuitability
    },
    strengths: selectedStrengths,
    // 稼働実績（デモ用）
    workHistory: {
      totalDays: Math.floor(Math.random() * 50), // 0-50日
      totalSales: Math.floor(Math.random() * 1000000), // 0-100万円
      averageScore: 70 + Math.floor(Math.random() * 30) // 70-100点
    }
  });
}

// 案件データを拡張（20件）
const projectData = [
  {
    id: '20251103-001',
    name: 'ヤマダデンキTL平和台駅前店',
    client: 'ヤマダデンキ',
    date: '2025-11-03',
    dateDisplay: '11/3(月祝)',
    station: '平和台駅',
    role: 'クローザー',
    count: 1,
    price: 23000,
    status: '配置済み',
    assignedStaff: '001',
    requiredSkills: ['MNP獲得力◎', 'クロージング経験', 'docomo製品知識'],
    commuteLimit: 90
  },
  {
    id: '20251115-001',
    name: 'ヤマダデンキ家電住まいる館入間店',
    client: 'ヤマダデンキ',
    date: '2025-11-15',
    dateDisplay: '11/15(土)',
    station: '入間市駅',
    role: 'キャッチャー',
    count: 1,
    price: 20000,
    status: '配置済み',
    assignedStaff: '002',
    requiredSkills: ['出張販売経験◎', '明るく声かけができる'],
    commuteLimit: 90
  },
  {
    id: '20251122-001',
    name: 'ヤマダデンキLABI池袋本店',
    client: 'ヤマダデンキ',
    date: '2025-11-22',
    dateDisplay: '11/22-24(土日月祝)',
    station: '池袋駅',
    role: 'キャッチャー',
    count: 1,
    days: 3,
    price: 60000,
    pricePerDay: 20000,
    status: '配置済み',
    assignedStaff: '003',
    requiredSkills: ['出張販売経験◎', '3日間連続稼働できる体力'],
    commuteLimit: 90
  }
];

// さらに案件を追加（11月の残り日程）
const additionalProjects = [
  { date: '2025-11-09', day: '土', name: 'ビックカメラ新宿西口店', role: 'キャッチャー', count: 2, price: 20000 },
  { date: '2025-11-10', day: '日', name: 'ヨドバシカメラ秋葉原店', role: 'クローザー', count: 1, price: 23000 },
  { date: '2025-11-16', day: '土', name: 'LABI新宿東口館', role: 'キャッチャー', count: 3, price: 20000 },
  { date: '2025-11-17', day: '日', name: 'ヤマダデンキ池袋総本店', role: 'クローザー', count: 2, price: 23000 },
  { date: '2025-11-23', day: '土', name: 'ヨドバシカメラ横浜店', role: 'キャッチャー', count: 2, price: 20000 },
  { date: '2025-11-24', day: '日', name: 'ビックカメラ池袋本店', role: 'クローザー', count: 1, price: 23000 },
  { date: '2025-11-30', day: '土', name: 'コジマ×ビック町田店', role: 'キャッチャー', count: 2, price: 20000 },
  { date: '2025-12-01', day: '日', name: 'ヤマダデンキ渋谷駅前店', role: 'クローザー', count: 1, price: 24000 },
  { date: '2025-12-07', day: '土', name: 'LABI品川大井町', role: 'キャッチャー', count: 3, price: 20000 },
  { date: '2025-12-08', day: '日', name: 'ヨドバシカメラ新宿西口本店', role: 'クローザー', count: 2, price: 24000 },
  { date: '2025-12-14', day: '土', name: 'ビックカメラ有楽町店', role: 'キャッチャー', count: 2, price: 21000 },
  { date: '2025-12-15', day: '日', name: 'ヤマダデンキ新宿西口店', role: 'クローザー', count: 1, price: 24000 },
  { date: '2025-12-21', day: '土', name: 'ヨドバシカメラ町田店', role: 'キャッチャー', count: 3, price: 21000 },
  { date: '2025-12-22', day: '日', name: 'LABI渋谷', role: 'クローザー', count: 2, price: 25000 }
];

let projectId = 4;
additionalProjects.forEach(proj => {
  const [year, month, day] = proj.date.split('-');
  projectData.push({
    id: `${proj.date.replace(/-/g, '')}-${String(projectId).padStart(3, '0')}`,
    name: proj.name,
    client: proj.name.split(/[店館]/)[0],
    date: proj.date,
    dateDisplay: `${month}/${day}(${proj.day})`,
    station: '都内各所',
    role: proj.role,
    count: proj.count,
    price: proj.price * proj.count,
    pricePerDay: proj.price,
    status: '未配置',
    assignedStaff: null,
    requiredSkills: proj.role === 'クローザー' ? ['MNP獲得力◎', 'クロージング経験'] : ['出張販売経験◎', '明るく声かけができる'],
    commuteLimit: 90
  });
  projectId++;
});

// 配置結果データ
const assignmentData = [
  {
    projectId: '20251103-001',
    staffId: '001',
    reason: 'docomo経験◎が決め手。高単価案件に最適。',
    commuteTime: 90,
    matchScore: 95
  },
  {
    projectId: '20251115-001',
    staffId: '002',
    reason: '出張販売経験◎。遠方対応力が高い。',
    commuteTime: 90,
    matchScore: 88
  },
  {
    projectId: '20251122-001',
    staffId: '003',
    reason: '池袋アクセス良好。3日間連続稼働可能。',
    commuteTime: 30,
    matchScore: 98
  }
];

