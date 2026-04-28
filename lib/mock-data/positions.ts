import type { Position } from '@/lib/types'

export const mockPositions: Position[] = [
  {
    id: 'position-1',
    batchId: 'batch-1',
    version: 'V1.0',
    status: 'published',
    name: 'Java 后端开发工程师',
    shortName: 'Java开发',
    industry: '互联网/IT',
    majors: ['软件工程', '计算机科学与技术'],
    salaryRange: [12000, 25000],
    coverImage: '/placeholder.svg?height=200&width=300',
    certificates: [{ id: 'cert-1', name: '软考中级' }, { id: 'cert-2', name: 'Java认证' }],
    description: '负责公司核心业务系统的后端开发工作，参与系统架构设计和技术方案制定，保障系统高可用和高性能。',
    responsibilities: [
      { id: 'resp-1', name: '负责后端服务的设计、开发和维护', description: '' },
      { id: 'resp-2', name: '参与系统架构设计和技术选型', description: '' },
      { id: 'resp-3', name: '编写技术文档和单元测试', description: '' },
      { id: 'resp-4', name: '解决生产环境问题，优化系统性能', description: '' }
    ],
    requirements: [
      '本科及以上学历，计算机相关专业',
      '熟练掌握 Java 编程语言',
      '熟悉 Spring Boot、MyBatis 等框架',
      '了解 MySQL、Redis 等数据库',
      '具备良好的沟通能力和团队协作精神',
    ],
    careerPath: {
      horizontal: ['全栈工程师', '技术产品经理', '技术顾问'],
      vertical: ['高级开发工程师', '技术专家', '架构师', '技术总监'],
    },
    abilityModel: {
      nodes: [
        { id: 'r1', type: 'responsibility', data: { label: '后端服务开发', description: '负责核心服务开发' }, position: { x: 50, y: 100 } },
        { id: 'r2', type: 'responsibility', data: { label: '系统架构设计', description: '参与架构设计' }, position: { x: 50, y: 250 } },
        { id: 'u1', type: 'unit', data: { label: '编程开发能力', description: '核心编程技能' }, position: { x: 300, y: 100 } },
        { id: 'u2', type: 'unit', data: { label: '架构设计能力', description: '系统设计技能' }, position: { x: 300, y: 250 } },
        { id: 'a1', type: 'ability', data: { label: 'Java 编程', category: '专业技能' }, position: { x: 550, y: 50 } },
        { id: 'a2', type: 'ability', data: { label: '数据库设计', category: '专业技能' }, position: { x: 550, y: 150 } },
        { id: 'a3', type: 'ability', data: { label: '系统架构', category: '专业技能' }, position: { x: 550, y: 250 } },
        { id: 'a4', type: 'ability', data: { label: '问题解决', category: '通用能力' }, position: { x: 550, y: 350 } },
      ],
      edges: [
        { id: 'e1', source: 'r1', target: 'u1' },
        { id: 'e2', source: 'r2', target: 'u2' },
        { id: 'e3', source: 'u1', target: 'a1' },
        { id: 'e4', source: 'u1', target: 'a2' },
        { id: 'e5', source: 'u2', target: 'a3' },
        { id: 'e6', source: 'u2', target: 'a4' },
      ],
    },
    competencyConfig: [
      { id: 'c1', abilityId: 'ability-1', abilityName: 'Java 编程', level: 'proficient', ruleDescription: '能够独立完成复杂业务功能开发', weight: 30 },
      { id: 'c2', abilityId: 'ability-4', abilityName: '数据库设计', level: 'master', ruleDescription: '能够进行数据库表设计和SQL优化', weight: 25 },
      { id: 'c3', abilityId: 'ability-5', abilityName: '系统架构', level: 'comprehend', ruleDescription: '理解常见架构模式和设计原则', weight: 20 },
      { id: 'c4', abilityId: 'ability-7', abilityName: '问题解决', level: 'master', ruleDescription: '能够快速定位和解决技术问题', weight: 25 },
    ],
    abilityBindings: [],
    abilityDomains: [],
    createdBy: 'user-2',
    collaborators: ['user-2'],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
    favoriteCount: 128,
  },
  {
    id: 'position-2',
    batchId: 'batch-1',
    version: 'V1.0',
    status: 'published',
    name: '前端开发工程师',
    shortName: '前端开发',
    industry: '互联网/IT',
    majors: ['软件工程', '计算机科学与技术'],
    salaryRange: [10000, 22000],
    coverImage: '/placeholder.svg?height=200&width=300',
    certificates: [{ id: 'cert-1', name: '前端认证' }],
    description: '负责公司产品的前端开发工作，实现产品界面和交互功能，提升用户体验。',
    responsibilities: [
      { id: 'resp-1', name: '负责前端页面的开发和维护', description: '' },
      { id: 'resp-2', name: '与设计师和后端工程师协作', description: '' },
      { id: 'resp-3', name: '优化前端性能和用户体验', description: '' },
      { id: 'resp-4', name: '编写前端组件和工具库', description: '' }
    ],
    requirements: [
      '本科及以上学历',
      '熟练掌握 HTML/CSS/JavaScript',
      '熟悉 React 或 Vue 框架',
      '了解前端工程化和构建工具',
      '有良好的审美和用户体验意识',
    ],
    careerPath: {
      horizontal: ['全栈工程师', 'UI设计师', '产品经理'],
      vertical: ['高级前端工程师', '前端架构师', '技术专家'],
    },
    abilityModel: {
      nodes: [
        { id: 'r1', type: 'responsibility', data: { label: '页面开发', description: '负责前端页面开发' }, position: { x: 50, y: 100 } },
        { id: 'u1', type: 'unit', data: { label: '前端开发能力', description: '核心前端技能' }, position: { x: 300, y: 100 } },
        { id: 'a1', type: 'ability', data: { label: '前端开发', category: '专业技能' }, position: { x: 550, y: 50 } },
        { id: 'a2', type: 'ability', data: { label: '沟通表达', category: '软技能' }, position: { x: 550, y: 150 } },
      ],
      edges: [
        { id: 'e1', source: 'r1', target: 'u1' },
        { id: 'e2', source: 'u1', target: 'a1' },
        { id: 'e3', source: 'u1', target: 'a2' },
      ],
    },
    competencyConfig: [
      { id: 'c1', abilityId: 'ability-3', abilityName: '前端开发', level: 'proficient', ruleDescription: '能够独立完成复杂前端功能开发', weight: 40 },
      { id: 'c2', abilityId: 'ability-10', abilityName: '沟通表达', level: 'master', ruleDescription: '能够清晰表达技术方案', weight: 20 },
    ],
    abilityBindings: [],
    abilityDomains: [],
    createdBy: 'user-2',
    collaborators: ['user-2'],
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-02-28T00:00:00Z',
    favoriteCount: 96,
  },
  {
    id: 'position-3',
    batchId: 'batch-2',
    version: 'V1.0',
    status: 'pending',
    name: '机器学习工程师',
    shortName: 'ML工程师',
    industry: '互联网/IT',
    majors: ['人工智能', '计算机科学与技术', '数学'],
    salaryRange: [15000, 35000],
    coverImage: '/placeholder.svg?height=200&width=300',
    certificates: [{ id: 'cert-1', name: '机器学习认证' }, { id: 'cert-2', name: '深度学习认证' }],
    description: '负责公司AI产品的算法研发和模型训练工作，推动AI技术在业务中的应用落地。',
    responsibilities: [
      { id: 'resp-1', name: '负责机器学习算法的研究和开发', description: '' },
      { id: 'resp-2', name: '进行数据分析和特征工程', description: '' },
      { id: 'resp-3', name: '训练和优化机器学习模型', description: '' },
      { id: 'resp-4', name: '将模型部署到生产环境', description: '' }
    ],
    requirements: [
      '硕士及以上学历优先',
      '熟练掌握 Python 编程',
      '熟悉机器学习算法和框架',
      '有深度学习项目经验',
      '具备较强的数学基础',
    ],
    careerPath: {
      horizontal: ['数据科学家', 'AI产品经理', '技术顾问'],
      vertical: ['高级算法工程师', '算法专家', '首席科学家'],
    },
    abilityModel: {
      nodes: [
        { id: 'r1', type: 'responsibility', data: { label: '算法研发', description: '负责算法研究和开发' }, position: { x: 50, y: 100 } },
        { id: 'u1', type: 'unit', data: { label: '机器学习能力', description: '核心ML技能' }, position: { x: 300, y: 100 } },
        { id: 'a1', type: 'ability', data: { label: 'Python 编程', category: '专业技能' }, position: { x: 550, y: 50 } },
        { id: 'a2', type: 'ability', data: { label: '问题解决', category: '通用能力' }, position: { x: 550, y: 150 } },
      ],
      edges: [
        { id: 'e1', source: 'r1', target: 'u1' },
        { id: 'e2', source: 'u1', target: 'a1' },
        { id: 'e3', source: 'u1', target: 'a2' },
      ],
    },
    competencyConfig: [
      { id: 'c1', abilityId: 'ability-2', abilityName: 'Python 编程', level: 'proficient', ruleDescription: '能够熟练使用Python进行算法开发', weight: 35 },
      { id: 'c2', abilityId: 'ability-7', abilityName: '问题解决', level: 'proficient', ruleDescription: '能够独立解决复杂技术问题', weight: 30 },
    ],
    abilityBindings: [],
    abilityDomains: [],
    createdBy: 'user-2',
    collaborators: ['user-2'],
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z',
    favoriteCount: 75,
  },
  {
    id: 'position-4',
    batchId: 'batch-1',
    version: 'V1.0',
    status: 'draft',
    name: '测试开发工程师',
    shortName: '测试开发',
    industry: '互联网/IT',
    majors: ['软件工程', '计算机科学与技术'],
    salaryRange: [10000, 20000],
    coverImage: '/placeholder.svg?height=200&width=300',
    certificates: [{ id: 'cert-1', name: '软件测试认证' }],
    description: '负责公司产品的质量保障工作，设计和执行测试用例，开发自动化测试工具。',
    responsibilities: [
      { id: 'resp-1', name: '设计和执行测试用例', description: '' },
      { id: 'resp-2', name: '开发自动化测试脚本', description: '' },
      { id: 'resp-3', name: '跟踪和管理缺陷', description: '' },
      { id: 'resp-4', name: '参与代码评审', description: '' }
    ],
    requirements: [
      '本科及以上学历',
      '熟悉软件测试流程和方法',
      '掌握至少一门编程语言',
      '了解自动化测试框架',
      '有较强的逻辑思维能力',
    ],
    careerPath: {
      horizontal: ['开发工程师', '产品经理', '项目经理'],
      vertical: ['高级测试工程师', '测试架构师', '质量总监'],
    },
    abilityModel: {
      nodes: [],
      edges: [],
    },
    competencyConfig: [],
    abilityBindings: [],
    abilityDomains: [],
    createdBy: 'user-2',
    collaborators: ['user-2'],
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
    favoriteCount: 0,
  },
  {
    id: 'position-5',
    batchId: 'batch-3',
    version: 'V1.0',
    status: 'published',
    name: '市场营销专员',
    shortName: '营销专员',
    industry: '市场营销',
    majors: ['市场营销', '工商管理'],
    salaryRange: [8000, 15000],
    coverImage: '/placeholder.svg?height=200&width=300',
    certificates: [{ id: 'cert-1', name: '营销师证书' }],
    description: '负责公司产品的市场推广和品牌建设工作，制定营销策略，执行营销活动。',
    responsibilities: [
      { id: 'resp-1', name: '制定市场营销策略', description: '' },
      { id: 'resp-2', name: '策划和执行营销活动', description: '' },
      { id: 'resp-3', name: '管理社交媒体账号', description: '' },
      { id: 'resp-4', name: '分析市场数据和用户反馈', description: '' }
    ],
    requirements: [
      '本科及以上学历，市场营销相关专业',
      '有较强的文案写作能力',
      '熟悉各类营销渠道和工具',
      '有创意思维和执行力',
      '良好的沟通协调能力',
    ],
    careerPath: {
      horizontal: ['品牌经理', '产品经理', '商务拓展'],
      vertical: ['高级营销专员', '营销经理', '市场总监'],
    },
    abilityModel: {
      nodes: [
        { id: 'r1', type: 'responsibility', data: { label: '营销策划', description: '负责营销活动策划' }, position: { x: 50, y: 100 } },
        { id: 'u1', type: 'unit', data: { label: '营销能力', description: '核心营销技能' }, position: { x: 300, y: 100 } },
        { id: 'a1', type: 'ability', data: { label: '沟通表达', category: '软技能' }, position: { x: 550, y: 100 } },
      ],
      edges: [
        { id: 'e1', source: 'r1', target: 'u1' },
        { id: 'e2', source: 'u1', target: 'a1' },
      ],
    },
    competencyConfig: [
      { id: 'c1', abilityId: 'ability-10', abilityName: '沟通表达', level: 'proficient', ruleDescription: '能够清晰表达营销方案', weight: 40 },
    ],
    abilityBindings: [],
    abilityDomains: [],
    createdBy: 'user-2',
    collaborators: ['user-2'],
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-03-05T00:00:00Z',
    favoriteCount: 45,
  },
  {
    id: 'position-6',
    batchId: 'batch-1',
    version: 'V1.0',
    status: 'rejected',
    name: '运维工程师',
    shortName: '运维',
    industry: '互联网/IT',
    majors: ['软件工程', '计算机科学与技术'],
    salaryRange: [10000, 20000],
    coverImage: '/placeholder.svg?height=200&width=300',
    certificates: [{ id: 'cert-1', name: 'Linux认证' }, { id: 'cert-2', name: 'K8s认证' }],
    description: '负责公司服务器和网络设备的运维工作，保障系统稳定运行。',
    responsibilities: [
      { id: 'resp-1', name: '负责服务器运维和监控', description: '' },
      { id: 'resp-2', name: '处理系统故障和告警', description: '' },
      { id: 'resp-3', name: '优化系统性能', description: '' },
      { id: 'resp-4', name: '编写运维自动化脚本', description: '' }
    ],
    requirements: [
      '本科及以上学历',
      '熟悉 Linux 操作系统',
      '了解网络和安全知识',
      '掌握 Shell 脚本编写',
      '有责任心和抗压能力',
    ],
    careerPath: {
      horizontal: ['开发工程师', '安全工程师', '云架构师'],
      vertical: ['高级运维工程师', '运维架构师', '运维总监'],
    },
    abilityModel: {
      nodes: [],
      edges: [],
    },
    competencyConfig: [],
    abilityBindings: [],
    abilityDomains: [],
    createdBy: 'user-2',
    collaborators: ['user-2'],
    createdAt: '2024-02-25T00:00:00Z',
    updatedAt: '2024-03-08T00:00:00Z',
    favoriteCount: 0,
  },
]

export const getPositionById = (id: string): Position | undefined => {
  return mockPositions.find(position => position.id === id)
}

export const getPositionsByBatchId = (batchId: string): Position[] => {
  return mockPositions.filter(position => position.batchId === batchId)
}

export const getPositionsByStatus = (status: Position['status']): Position[] => {
  return mockPositions.filter(position => position.status === status)
}

export const getPublishedPositions = (): Position[] => {
  return mockPositions.filter(position => position.status === 'published')
}
