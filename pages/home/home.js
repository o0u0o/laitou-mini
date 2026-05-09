import {Company} from "../../model/company";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyData: []
  },

  /**
   * 加载时
   */
  async onLoad(options) {
    this.initAllData()
  },

  /**
   * 初始化所有数据
   */
  async initAllData(){
    // 默认加载公司列表
    const companyData = await Company.searchByKeyword('');
    this.setData({ companyData });
  },

  // 搜索
  async endsearchList(e) {
    const keyword = e.detail.value;
    const companyData = await Company.searchByKeyword(keyword);
    this.setData({ companyData });
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
