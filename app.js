import { config } from "./config/config";
import { DataSource } from "./model/datasource";
import { promisic } from "./utils/util";

App({
  globalData: {
    userInfo: null,
    openID: ''
  },

  async onLaunch() {
    // 启动日志（保留 1 条审计）
    const logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);

    // 本地数据模式：跳过真实登录，给伪造 openid 即可
    if (config.useLocalData) {
      this.globalData.openID = 'local-openid-0001';
      return;
    }

    // 真实登录：wx.login -> 后端换 openId（统一走 DataSource，便于切换/Mock）
    try {
      const { code } = await promisic(wx.login)();
      if (!code) return;
      const res = await DataSource.getSessionInfo(code);
      this.globalData.openID = res && res.openid ? res.openid : '';
    } catch (e) {
      // 登录失败不阻塞页面渲染；具体错误已由 Http 统一 toast
    }

    // 注意：wx.getUserInfo 自基础库 2.10.4 起已废弃。
    // 需要用户头像/昵称时，请在页面通过 <button open-type="getUserInfo"> 或 wx.getUserProfile 触发。
  }
})
