import {Company} from "../../model/company";
import {Banner} from "../../model/banner";

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
    console.log(bannerA.banners)
    this.setData({
      bannerA
    })
  },

  //结束搜索
  endsearchList(e) {
    let _this = this;
    console.log(e.detail.value)
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


  }
})
