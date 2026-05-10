import { config } from "../config/config";
import { promisic } from "./util";

/**
 * 统一网络请求工具
 *  - 自动拼接 apiBaseUrl
 *  - 自动注入 Content-Type
 *  - 统一处理网络错误 / 非 2xx 状态码 / 业务错误码
 *  - 可选 loading 提示
 */
class Http {
  static async request({
    url,
    data = {},
    method = 'GET',
    header = {},
    showLoading = false,
    loadingText = '加载中'
  }) {
    if (showLoading) wx.showLoading({ title: loadingText, mask: true });

    let res;
    try {
      res = await promisic(wx.request)({
        url: `${config.apiBaseUrl}${url}`,
        data,
        method,
        timeout: 15000,
        header: Object.assign(
          { 'content-type': 'application/json' },
          header
        )
      });
    } catch (err) {
      Http._toast('网络异常，请稍后重试');
      throw err;
    } finally {
      if (showLoading) wx.hideLoading();
    }

    // HTTP 层
    if (res.statusCode < 200 || res.statusCode >= 300) {
      Http._toast(`服务器异常 (${res.statusCode})`);
      throw new Error(`HTTP ${res.statusCode}`);
    }

    // 业务层（约定 { code, msg, data }；code===0 视为成功，其余 toast）
    const body = res.data;
    if (body && typeof body === 'object' && 'code' in body && body.code !== 0 && body.code !== 200) {
      Http._toast(body.msg || '请求失败');
    }
    return body;
  }

  static _toast(title) {
    wx.showToast({ title, icon: 'none', duration: 2000 });
  }
}

export { Http }
