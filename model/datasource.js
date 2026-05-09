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

class DataSource {

  // ======================== 公司列表（按城市） ========================
  static async getCompaniesByCity(cityName) {
    if (config.useLocalData) {
      // 本地简单过滤
      const filtered = localCompanies.companys.filter(
        c => c.city.indexOf(cityName) > -1
      );
      return { companys: filtered.length ? filtered : localCompanies.companys };
    }
    return await Http.request({
      url: `/app/company/list/city/${cityName}`
    });
  }

  // ======================== 公司搜索（关键词） ========================
  static async searchCompanies(keyword) {
    if (config.useLocalData) {
      if (!keyword) return localCompanies;
      const kw = keyword.toLowerCase();
      const filtered = localCompanies.companys.filter(c =>
        c.name.toLowerCase().indexOf(kw) > -1 ||
        c.type.indexOf(kw) > -1 ||
        c.address.indexOf(kw) > -1 ||
        (c.source && c.source.indexOf(kw) > -1) ||
        (c.remark && c.remark.indexOf(kw) > -1)
      );
      return { companys: filtered.length ? filtered : localCompanies.companys };
    }
    return await Http.request({
      url: '/app/company/list/like',
      data: { keyword }
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
