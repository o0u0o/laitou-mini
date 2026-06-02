import {Company} from "../../model/company";
import { withPrivacy } from "../../utils/privacy";

Page(withPrivacy({

  /**
   * 页面的初始数据
   */
  data: {
    companyData: [],
    isSearch: false
    // 隐私授权字段（showPrivacy / privacyContractName）由 withPrivacy 注入
  },

  /**
   * 加载时
   */
  async onLoad(options) {
    this.initAllData();
    this.checkPrivacy();
  },

  /**
   * 初始化所有数据
   */
  async initAllData(){
    // 默认加载公司列表
    const res = await Company.searchByKeyword('');
    this.setData({ companyData: (res && res.companys) || [], isSearch: false });
  },

  // 搜索
  async endsearchList(e) {
    const keyword = e.detail.value;
    const res = await Company.searchByKeyword(keyword);
    const isSearch = !!(keyword && keyword.trim().length > 0);
    this.setData({ companyData: (res && res.companys) || [], isSearch });
  },

  // 跳转：投稿须知 / 隐私政策 / 申诉反馈
  goNotice(){ wx.navigateTo({ url: '/pages/notice/notice' }); },
  goPrivacy(){ wx.navigateTo({ url: '/pages/privacy/privacy' }); },
  goAppeal(){ wx.navigateTo({ url: '/pages/appeal/appeal' }); },

  // 跳转公司详情
  goDetail(e){
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/detail/detail?id=' + id });
  },

  // 热门标签点击：等价触发一次搜索
  onTagTap(e){
    const kw = e.currentTarget.dataset.kw;
    this.endsearchList({ detail: { value: kw } });
  }
}))
