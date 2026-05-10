/**
 * 面试准备盒 · 模拟薪资爆料数据
 *
 * 数据性质：仅为前端开发联调用模拟数据，非真实薪酬披露。
 * 字段约定：
 *   - id        唯一标识
 *   - title     岗位名称
 *   - amount    月薪（元）
 *   - workYear  工作经验
 *   - city      工作城市
 *   - date      爆料日期
 *   - extra     补充说明（可选）
 *
 * 使用方式：
 *   - byCompany[id]: 指定公司专属薪资数据
 *   - generic:       通用兜底数据（未在 byCompany 中命中的公司使用）
 */

// ===== 各公司专属薪资爆料 =====
const byCompany = {
  // 共创绿洲贵州医疗系统技术有限公司
  1: [
    { id: 's1-1', title: '前端开发工程师', amount: 8500,  workYear: '1-3 年', city: '贵阳', date: '2026-04-12', extra: '13 薪，无加班费，绩效与项目绑定' },
    { id: 's1-2', title: 'Java 开发工程师', amount: 9500,  workYear: '3-5 年', city: '贵阳', date: '2026-03-28', extra: '医保按最低基数缴纳，试用期 6 折' },
    { id: 's1-3', title: '产品经理',         amount: 11000, workYear: '3-5 年', city: '贵阳', date: '2026-02-15', extra: '需经常加班至 21:00' },
    { id: 's1-4', title: '前端开发工程师',   amount: 7800,  workYear: '1 年以下', city: '贵阳', date: '2026-01-20', extra: '应届试用期 6000' }
  ],
  // 贵州晟泰科技开发有限公司
  2: [
    { id: 's2-1', title: '后端开发工程师',   amount: 10000, workYear: '3-5 年', city: '贵阳', date: '2026-04-02', extra: '12 薪，无餐补' },
    { id: 's2-2', title: '测试工程师',       amount: 7500,  workYear: '1-3 年', city: '贵阳', date: '2026-03-18', extra: '存在拖欠工资记录' },
    { id: 's2-3', title: '运维工程师',       amount: 8800,  workYear: '3-5 年', city: '贵阳', date: '2026-02-08' }
  ]
};

// ===== 通用兜底数据（按公司性质，模拟生成的"行业平均水平"） =====
const generic = [
  { id: 'g-1', title: '项目经理',     amount: 9500, workYear: '5-10 年', city: '本地',  date: '2026-04-20', extra: '随项目奖金浮动较大' },
  { id: 'g-2', title: '行政文员',     amount: 4200, workYear: '1-3 年',  city: '本地',  date: '2026-04-08' },
  { id: 'g-3', title: '一线作业人员', amount: 5800, workYear: '不限',    city: '本地',  date: '2026-03-25', extra: '按工程量计酬，存在拖欠风险' },
  { id: 'g-4', title: '财务会计',     amount: 6500, workYear: '3-5 年',  city: '本地',  date: '2026-03-10' }
];

function getByCompanyId(id) {
  return byCompany[Number(id)] || generic;
}

module.exports = {
  byCompany,
  generic,
  getByCompanyId
};
