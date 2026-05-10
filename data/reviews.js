/**
 * 面试准备盒 · 模拟点评数据
 *
 * 数据性质：仅为前端开发联调用模拟数据，非真实员工评价。
 * 字段约定：
 *   - id          唯一标识
 *   - author      作者昵称（脱敏，匿名）
 *   - position    岗位（可选）
 *   - score       综合星级（1-5 整数）
 *   - recommend   是否推荐入职
 *   - content     点评正文
 *   - tags[]      关键词标签
 *   - workYear    在职/离职信息
 *   - date        点评日期
 *   - dimensions  细分维度评分 { salary, growth, culture, workLife }（1-5）
 *
 * 使用方式：
 *   - byCompany[id]: 指定公司专属点评
 *   - generic:       通用兜底点评
 */

// ===== 各公司专属点评 =====
const byCompany = {
  1: [
    {
      id: 'r1-1',
      author: '匿名前员工',
      position: '前端开发',
      score: 2,
      recommend: false,
      content: '入职前承诺的薪资和福利与实际差距较大，加班严重且没有加班费。HR 在签合同时存在话术陷阱，建议求职者三思。',
      tags: ['加班严重', '无加班费', '话术多'],
      workYear: '已离职 · 在职 1 年',
      date: '2026-04-15',
      dimensions: { salary: 2, growth: 2, culture: 2, workLife: 1 }
    },
    {
      id: 'r1-2',
      author: '匿名在职员工',
      position: '产品经理',
      score: 3,
      recommend: false,
      content: '业务方向还可以，团队同事比较 nice，但管理层决策反复，项目频繁推翻重做。薪酬在贵阳算中等偏下。',
      tags: ['同事友好', '决策反复', '加班多'],
      workYear: '在职 2 年',
      date: '2026-03-22',
      dimensions: { salary: 2, growth: 3, culture: 3, workLife: 2 }
    },
    {
      id: 'r1-3',
      author: '匿名前员工',
      position: 'Java 开发',
      score: 1,
      recommend: false,
      content: '存在拖欠工资和加班费的仲裁记录，离职走流程时被卡了两个月。',
      tags: ['拖欠工资', '离职困难'],
      workYear: '已离职 · 在职 8 个月',
      date: '2026-02-08',
      dimensions: { salary: 1, growth: 2, culture: 1, workLife: 2 }
    }
  ],
  2: [
    {
      id: 'r2-1',
      author: '匿名前员工',
      position: '测试工程师',
      score: 2,
      recommend: false,
      content: '劳动合同执行不规范，存在劳务纠纷历史。技术氛围一般，老员工居多，新人晋升空间有限。',
      tags: ['合同纠纷', '晋升慢'],
      workYear: '已离职 · 在职 1.5 年',
      date: '2026-04-05',
      dimensions: { salary: 2, growth: 2, culture: 2, workLife: 3 }
    },
    {
      id: 'r2-2',
      author: '匿名在职员工',
      position: '后端开发',
      score: 3,
      recommend: true,
      content: '工作压力适中，弹性打卡。但福利较少，三餐自理，没有节日福利。',
      tags: ['弹性工作', '福利少'],
      workYear: '在职 3 年',
      date: '2026-03-12',
      dimensions: { salary: 3, growth: 3, culture: 3, workLife: 4 }
    }
  ]
};

// ===== 通用兜底点评（适用于所有失信/劳动争议类公司） =====
const generic = [
  {
    id: 'g-r1',
    author: '匿名求职者',
    position: '—',
    score: 2,
    recommend: false,
    content: '该公司在公开渠道存在劳动争议或失信被执行记录，建议入职前通过裁判文书网、信用中国核实最新信息，并要求签订规范的劳动合同。',
    tags: ['公开记录', '建议谨慎'],
    workYear: '未入职',
    date: '2026-04-30',
    dimensions: { salary: 2, growth: 2, culture: 2, workLife: 3 }
  },
  {
    id: 'g-r2',
    author: '匿名前员工',
    position: '—',
    score: 3,
    recommend: false,
    content: '工资能按时发放但偶有延迟，社保按最低基数缴纳，加班调休制度执行不严格。',
    tags: ['偶有延迟', '低基数社保'],
    workYear: '已离职',
    date: '2026-04-18',
    dimensions: { salary: 2, growth: 3, culture: 3, workLife: 3 }
  },
  {
    id: 'g-r3',
    author: '匿名在职员工',
    position: '—',
    score: 3,
    recommend: true,
    content: '小公司氛围较灵活，老板人不错。但成长路径不清晰，技术栈较老。',
    tags: ['氛围灵活', '路径不清'],
    workYear: '在职 1 年',
    date: '2026-03-30',
    dimensions: { salary: 3, growth: 2, culture: 4, workLife: 4 }
  }
];

function getByCompanyId(id) {
  return byCompany[Number(id)] || generic;
}

module.exports = {
  byCompany,
  generic,
  getByCompanyId
};
