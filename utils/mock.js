/**
 * 本地 Mock 数据与路由匹配
 * - 仅在 config.useMock = true 时生效
 * - 匹配规则按 URL 子串（避免 querystring 干扰）
 */

const banners = {
  banners: [
    { id: 1, img: 'https://img.icons8.com/color/720/conference-call.png' },
    { id: 2, img: 'https://img.icons8.com/color/720/permanent-job.png' },
    { id: 3, img: 'https://img.icons8.com/color/720/job.png' }
  ]
};

const companys = {
  companys: [
    {
      id: 101,
      name: '示例科技（深圳）有限公司',
      logo: 'https://img.icons8.com/color/240/company.png',
      province: '广东省', city: '深圳市', district: '南山区',
      address: '科技园 XX 路 1 号 A 座 8 楼',
      source: '(2023)粤0305民初XXXX号 判决书',
      type: '劳动争议'
    },
    {
      id: 102,
      name: '某某教育培训中心',
      logo: 'https://img.icons8.com/color/240/training.png',
      province: '广东省', city: '深圳市', district: '宝安区',
      address: '西乡街道 XX 大厦 12 楼',
      source: '深圳市监管局公开行政处罚决定书',
      type: '培训机构'
    },
    {
      id: 103,
      name: '示例供应链有限公司',
      logo: 'https://img.icons8.com/color/240/supplier.png',
      province: '广东省', city: '广州市', district: '天河区',
      address: '珠江新城 XX 写字楼 18 层',
      source: '中国执行信息公开网 失信被执行人',
      type: '失信被执行'
    },
    {
      id: 104,
      name: '匿名疑似传销组织',
      logo: 'https://img.icons8.com/color/240/warning-shield.png',
      province: '广西壮族自治区', city: '南宁市', district: '青秀区',
      address: '东葛路 XX 小区',
      source: '《XX 都市报》公开报道',
      type: '疑似传销'
    },
    {
      id: 105,
      name: '示例咨询公司',
      logo: 'https://img.icons8.com/color/240/consulting.png',
      province: '北京市', city: '北京市', district: '朝阳区',
      address: '建国路 XX 大厦 22 层',
      source: '裁判文书网 (2024)京0105民初XXXX号',
      type: '行政处罚'
    }
  ]
};

/**
 * 根据 url 匹配对应的 mock 响应
 * @param {string} url
 * @returns {{ data: any, code?: number } | null}
 */
function match(url) {
  if (!url) return null;
  if (url.indexOf('/banner/list') > -1 || url.indexOf('banner/list') > -1) {
    return { data: banners };
  }
  if (url.indexOf('/company/list/like') > -1) {
    return { data: companys };
  }
  if (url.indexOf('/company/list/city') > -1) {
    return { data: companys };
  }
  if (url.indexOf('/company/from/wx/add') > -1) {
    return { data: { code: 0, msg: '已进入审核池（mock）' } };
  }
  if (url.indexOf('/wechat/session/info') > -1) {
    return { data: { openid: 'mock-openid-0001' } };
  }
  return null;
}

export const Mock = { match };
