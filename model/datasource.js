/**
 * datasource.js — 数据源适配器
 *
 * 职责：根据 config.useLocalData 决定从本地 JSON 还是远程 API 获取数据。
 * model 层只调用 DataSource 的方法，不关心底层来源。
 *
 * 扩展路径：
 *   useLocalData = true  → 读取 /data/*.json（当前阶段）
 *   useLocalData = false → 走 Http.request() 调后端 API（后端就绪后切换）
 */

import { config } from '../config/config';
import { Http } from '../utils/http';

// ---- 本地数据（以 .js 模块形式导出，兼容小程序构建器） ----
const localCompanies  = require('../data/companies.js');
const localCategories = require('../data/categories.js');

// ---------------- 字段补全 ----------------
// 旧数据只有 type/source/remark，新版页面需要 status/scaleTags/riskTags/法人/信用代码 等。
// 这里在「读取」时统一补齐，避免一次性手工改 20 条数据；
// 后端就绪后该函数可整体删除——返回结构与服务端约定一致。
function normalize(c) {
  if (!c) return c;
  if (c._normalized) return c;

  const remark = c.remark || '';
  const source = c.source || '';

  // 1) 法定代表人（优先字段，其次从 remark 抓）
  let legalRepresentative = c.legalRepresentative;
  if (!legalRepresentative) {
    const m = remark.match(/法定代表人[：:]\s*([^\s。，,；;]+)/);
    legalRepresentative = m ? m[1] : '未公开';
  }

  // 2) 统一社会信用代码
  let socialCreditCode = c.socialCreditCode;
  if (!socialCreditCode) {
    const m = source.match(/统一社会信用代码[：:]\s*([0-9A-Z]{15,18})/);
    socialCreditCode = m ? m[1] : '';
  }

  // 3) 经营状态：默认存续；remark 出现"注销"则注销
  let status = c.status;
  if (!status) status = /注销/.test(remark) ? '注销' : '存续';

  // 4) 规模标签：默认小微（数据集均为小微/未公开公司）
  const scaleTags = c.scaleTags && c.scaleTags.length ? c.scaleTags : ['小微企业'];

  // 5) 风险标签：用 type + source + update_time 兜底构造一条
  let riskTags = c.riskTags;
  if (!riskTags || !riskTags.length) {
    riskTags = c.type ? [{
      label: c.type,
      source: source,
      date: c.update_time || ''
    }] : [];
  }

  return Object.assign({}, c, {
    status,
    scaleTags,
    riskTags,
    legalRepresentative,
    registeredCapital: c.registeredCapital || '未公开',
    establishDate: c.establishDate || '未公开',
    socialCreditCode,
    _normalized: true
  });
}

function normalizeList(list) {
  return (list || []).map(normalize);
}

class DataSource {

  // ======================== 公司列表（按城市） ========================
  static async getCompaniesByCity(cityName) {
    if (config.useLocalData) {
      const filtered = localCompanies.companys.filter(
        c => c.city.indexOf(cityName) > -1
      );
      const result = filtered.length ? filtered : localCompanies.companys;
      return { companys: normalizeList(result) };
    }
    return await Http.request({
      url: `/app/company/list/city/${cityName}`
    });
  }

  // ======================== 公司搜索（关键词） ========================
  static async searchCompanies(keyword) {
    if (config.useLocalData) {
      if (!keyword) return { companys: normalizeList(localCompanies.companys) };
      const kw = keyword.toLowerCase();
      const filtered = localCompanies.companys.filter(c =>
        c.name.toLowerCase().indexOf(kw) > -1 ||
        c.type.indexOf(kw) > -1 ||
        c.address.indexOf(kw) > -1 ||
        (c.source && c.source.indexOf(kw) > -1) ||
        (c.remark && c.remark.indexOf(kw) > -1)
      );
      const result = filtered.length ? filtered : localCompanies.companys;
      return { companys: normalizeList(result) };
    }
    return await Http.request({
      url: '/app/company/list/like',
      data: { keyword }
    });
  }

  // ======================== 公司详情（按 id） ========================
  static async getCompanyById(id) {
    if (config.useLocalData) {
      const cid = Number(id);
      const found = localCompanies.companys.find(c => c.id === cid);
      return found ? normalize(found) : null;
    }
    return await Http.request({
      url: `/app/company/${id}`
    });
  }

  // ======================== 提交公司信息 ========================
  static async addCompany(companyData) {
    if (config.useLocalData) {
      // 本地模式：模拟写入成功，返回与后端一致的响应结构
      console.info('[datasource:local] addCompany', companyData);
      return { code: 0, msg: '已进入审核池（本地）' };
    }
    return await Http.request({
      url: '/app/company/from/wx/add',
      method: 'POST',
      data: companyData
    });
  }

  // ======================== 获取分类列表 ========================
  static async getCategories() {
    if (config.useLocalData) {
      return localCategories;
    }
    // 后端就绪后增加对应接口
    return await Http.request({ url: '/app/category/list' });
  }

  // ======================== 微信登录（session） ========================
  static async getSessionInfo(code) {
    if (config.useLocalData) {
      return { openid: 'local-openid-0001' };
    }
    return await Http.request({
      url: '/wechat/session/info',
      data: { code }
    });
  }
}

export { DataSource };
