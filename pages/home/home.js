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
    console.log(bannerA && bannerA.banners)
    this.setData({ bannerA })

    // 默认加载公司列表
    const companyData = await Company.searchByKeyword('');
    this.setData({ companyData });
  },

  // 搜索
  async endsearchList(e) {
    const keyword = e.detail.value;
    console.log('搜索关键词:', keyword);
    const companyData = await Company.searchByKeyword(keyword);
    this.setData({ companyData });
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
