// スタッフデータ
const staffData = [
  {
    id: '001',
    name: '向原あかり',
    age: 21,
    gender: '女性',
    station: '東葉高速線 八千代緑が丘駅',
    commuteTime: 100,
    availableDays: ['土', '日', '祝'],
    skills: {
      mnp: '◎',
      hikari: '◎',
      card: '◎',
      device: '◯'
    },
    carrierExperience: {
      docomo: '◎',
      au: '-',
      softbank: '-'
    },
    workSkills: {
      fieldSales: '◎',
      storeHelper: '◎',
      initialSetup: '-'
    },
    suitability: {
      closer: '◎',
      catcher: '◎',
      leader: '◯'
    },
    strengths: [
      '信頼関係を築く力が強い',
      'MNP獲得力が高い',
      'docomo経験あり',
      'コミュニケーション能力が高い'
    ]
  },
  {
    id: '002',
    name: '副島颯太',
    age: 20,
    gender: '男性',
    station: '東武東上線 ときわ台駅',
    commuteTime: 80,
    availableDays: ['土', '日', '祝'],
    skills: {
      mnp: '◎',
      hikari: '◯',
      card: '◯',
      device: '△'
    },
    carrierExperience: {
      docomo: '-',
      au: '-',
      softbank: '-'
    },
    workSkills: {
      fieldSales: '◎',
      storeHelper: '-',
      initialSetup: '-'
    },
    suitability: {
      closer: '◎',
      catcher: '◯',
      leader: '◎'
    },
    strengths: [
      'リーダー経験豊富',
      'MNP獲得力が高い',
      '相手主体の精神',
      '運転免許保有'
    ]
  },
  {
    id: '003',
    name: '桃崎晃大',
    age: 19,
    gender: '男性',
    station: '多摩モノレール線 大塚・帝京大学駅',
    commuteTime: 120,
    availableDays: ['土', '日', '祝'],
    skills: {
      mnp: '◎',
      hikari: '◯',
      card: '◯',
      device: '△'
    },
    carrierExperience: {
      docomo: '-',
      au: '-',
      softbank: '-'
    },
    workSkills: {
      fieldSales: '◎',
      storeHelper: '-',
      initialSetup: '-'
    },
    suitability: {
      closer: '◎',
      catcher: '◎',
      leader: '◯'
    },
    strengths: [
      '明るく丁寧な接客',
      '通勤範囲120分（遠方対応可）',
      'キャッチャー適性が高い',
      '運転免許保有'
    ]
  }
];

// 案件データ
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
    assignedStaff: '003',
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
    assignedStaff: '002',
    requiredSkills: ['出張販売経験◎', '3日間連続稼働できる体力'],
    commuteLimit: 90
  }
];

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
    staffId: '003',
    reason: '通勤範囲120分で遠方対応力◎。明るい性格でキャッチャー適性◎。',
    commuteTime: 90,
    matchScore: 90
  },
  {
    projectId: '20251122-001',
    staffId: '002',
    reason: '池袋まで15分の圧倒的アクセス。3日間連続でも体力温存できる。',
    commuteTime: 15,
    matchScore: 98
  }
];

