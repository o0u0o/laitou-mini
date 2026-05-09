import { config } from "../config/config";
import { promisic } from "./util";
import { Mock } from "./mock";
class Http {
  static async request({
    url,
    data,
    method = 'GET'
  }) {
    // 开发联调：命中 mock 路由则直接返回本地数据
    if (config.useMock) {
      const hit = Mock.match(url);
      if (hit) {
        console.info('[mock]', method, url, hit.data);
        return hit.data;
      }
    }
    const res = await promisic(wx.request)({
      url: `${config.apiBaseUrl}${url}`,
      data,
      method,
      // header: {
      //   appkey: config.appKey
      // }
    })
    return res.data
  }
}

//导出Http 工具
export {
  Http
}