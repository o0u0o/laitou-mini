// pages/detail/detail.js
import { Company } from "../../model/company";

Page({
  data: {
    company: null,
    activeTab: 0  // 0=基本信息  1=风险信息  2=元信息
  },

  async onLoad(options) {
    const id = options && options.id;
    if (!id) {
      wx.showToast({ title: '缺少参数 id', icon: 'none' });
      return;
    }
    const company = await Company.getById(id);
    if (!company) {
      wx.showToast({ title: '未找到该公司', icon: 'none' });
      return;
    }
    wx.setNavigationBarTitle({ title: company.name });
    this.setData({ company });
  },

  // l-segment 切换
  onTabChange(e) {
    this.setData({ activeTab: Number(e.detail.index) });
  },

  // 复制信用代码
  copyCode() {
    const code = this.data.company && this.data.company.socialCreditCode;
    if (!code) return;
    wx.setClipboardData({ data: code });
  },

  // 申诉入口
  goAppeal() {
    wx.navigateTo({ url: '/pages/appeal/appeal' });
  }
})
