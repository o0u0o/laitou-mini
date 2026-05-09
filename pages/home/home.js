import {Company} from "../../model/company";
import {Banner} from "../../model/banner";
import {config} from "../../config/config";
import {Mock} from "../../utils/mock";

Page({

  /**
   * 组件的初始数据
   */
  data: {
    bannerA: null,
    num: [1,2,3],
    companyData: []
  },

  /**
   * 加载时
   * @param options
   * @returns {Promise<void>}
   */
  async onLoad(options) {
    this.initAllData()
    console.log("load...")
  },

  /**
   * 初始化所有数据
   * @returns {Promise<void>}
   */
  async initAllData(){
    const bannerA = await Banner.getHomeLocationA()
    console.log(bannerA && bannerA.banners)
    this.setData({ bannerA })

    // mock 模式下默认展示一批示例公司数据，便于预览列表样式
    if (config.useMock) {
      const hit = Mock.match('/company/list/like');
      if (hit) this.setData({ companyData: hit.data });
    }
  },

  //结束搜索
  endsearchList(e) {
    let _this = this;
    console.log(e.detail.value)

    // mock 模式直接走本地数据，不发网络请求
    if (config.useMock) {
      const hit = Mock.match('/company/list/like');
      if (hit) {
        _this.setData({ companyData: hit.data });
        return;
      }
    }

    wx.request({
      url: 'https://laitou.aiuiot.com/laitou-java/app/company/list/like',
      data: {
        keyword: e.detail.value
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        _this.setData({
          companyData: res.data
        })

        console.log('查询数据成功')
        console.log(res.data)
        console.log(_this.data.companyData)
      }
    })
  },


  /**
   * 组件的方法列表
   */
  methods: {
    //搜索回调


  },

  // 跳转：投稿须知 / 隐私政策 / 申诉反馈
  goNotice(){ wx.navigateTo({ url: '/pages/notice/notice' }); },
  goPrivacy(){ wx.navigateTo({ url: '/pages/privacy/privacy' }); },
  goAppeal(){ wx.navigateTo({ url: '/pages/appeal/appeal' }); },

  // 热门标签点击：等价触发一次搜索
  onTagTap(e){
    const kw = e.currentTarget.dataset.kw;
    this.endsearchList({ detail: { value: kw } });
  }
})
