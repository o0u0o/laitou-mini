import {Company} from "../../model/company";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyData: [],
    // 隐私授权弹窗
    showPrivacy: false,
    privacyContractName: '《隐私政策》',
    // 胶囊栏分类
    currentCategory: 'all',
    categoryCapsules: [
      { key: 'all',      name: '全部',       icon: 'history' },
      { key: '劳动争议',  name: '劳动争议',   icon: 'warning' },
      { key: '行政处罚',  name: '行政处罚',   icon: 'notification' },
      { key: '失信被执行', name: '失信被执行', icon: 'error' },
      { key: '疑似传销',  name: '疑似传销',   icon: 'eye' }
    ]
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
    const companyData = await Company.searchByKeyword('');
    this.setData({ companyData });
  },

  /**
   * 隐私授权检查（基础库 >= 2.32.3 + app.json 中 __usePrivacyCheck__:true 时生效）
   *  - 首次进入若未同意则弹窗
   *  - 收到隐私接口需要授权事件时也弹窗（onNeedPrivacyAuthorization）
   */
  checkPrivacy() {
    if (!wx.getPrivacySetting) return; // 老基础库直接放行
    wx.getPrivacySetting({
      success: (res) => {
        if (res.needAuthorization) {
          this.setData({
            showPrivacy: true,
            privacyContractName: res.privacyContractName || '《隐私政策》'
          });
        }
      }
    });
    if (wx.onNeedPrivacyAuthorization) {
      wx.onNeedPrivacyAuthorization((resolve) => {
        this._privacyResolve = resolve;
        this.setData({ showPrivacy: true });
      });
    }
  },

  // 同意（由 <button open-type="agreePrivacyAuthorization"> 触发）
  onAgreePrivacy() {
    this.setData({ showPrivacy: false });
    if (typeof this._privacyResolve === 'function') {
      this._privacyResolve({ event: 'agree', buttonId: 'agree-btn' });
      this._privacyResolve = null;
    }
  },

  // 拒绝
  onRejectPrivacy() {
    this.setData({ showPrivacy: false });
    if (typeof this._privacyResolve === 'function') {
      this._privacyResolve({ event: 'disagree' });
      this._privacyResolve = null;
    }
  },

  // 弹窗内查看隐私政策详情
  goPrivacyDetail() {
    wx.navigateTo({ url: '/pages/privacy/privacy' });
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

  // 跳转公司详情
  goDetail(e){
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/detail/detail?id=' + id });
  },

  // 热门标签点击：等价触发一次搜索
  onTagTap(e){
    const kw = e.currentTarget.dataset.kw;
    this.endsearchList({ detail: { value: kw } });
  },

  // 胶囊栏分类点击
  async onCapsuleTap(e) {
    const { key } = e.detail;
    this.setData({ currentCategory: key });
    const keyword = key === 'all' ? '' : key;
    const companyData = await Company.searchByKeyword(keyword);
    this.setData({ companyData });
  }
})
