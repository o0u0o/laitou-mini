/**
 * 类型枚举
 * 同样以 .js 模块形式导出，避免 require('xxx.json') 在小程序构建时的兼容问题。
 */
module.exports = [
  { value: '劳动争议', label: '劳动争议' },
  { value: '行政处罚', label: '行政处罚' },
  { value: '失信被执行', label: '失信被执行' },
  { value: '培训机构', label: '培训机构' },
  { value: '疑似传销', label: '疑似传销' },
  { value: '疑似诈骗', label: '疑似诈骗' },
  { value: '其他', label: '其他' }
];
