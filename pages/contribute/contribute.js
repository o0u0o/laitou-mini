import { Company } from '../../model/company';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyData: {
      name: null,
      type: null,
      province: null,
      city: null,
      district: '',
      address: '',
      remark: ''
    },
    agreed: false
  },

  // 切换同意状态
  toggleAgree(){
    this.setData({ agreed: !this.data.agreed });
  },

  // 跳转投稿须知
  goNotice(){
    wx.navigateTo({ url: '/pages/notice/notice' });
  },

  // 跳转隐私政策
  goPrivacy(){
    wx.navigateTo({ url: '/pages/privacy/privacy' });
  },

  //绑定公司名字
  bindName(e){
    this.data.companyData.name = e.detail.value;
  },

  //绑定类型
  bindType(e){
    this.data.companyData.type = e.detail.value;
  },

  //绑定省
  bindProvince(e){
    this.data.companyData.province = e.detail.value;
  },

  //绑定地址
  bindAddress(e){
    this.data.companyData.address = e.detail.value;
  },

  //绑定城市
  bindCity(e){
    this.data.companyData.city = e.detail.value;
  },

  //绑定区
  bindDistrict(e){
    this.data.companyData.district = e.detail.value;
  },

  //绑定备注
  bindRemark(e){
    this.data.companyData.remark = e.detail.value;
  },

  //提交数据
  async submitData(e){
    // 合规门槛：必须勾选同意
    if (!this.data.agreed) {
      wx.lin.showToast({
        title: '请先阅读并同意《投稿须知》与《隐私政策》',
        icon: 'error'
      });
      return;
    }
    const c = this.data.companyData;
    if (!c.name || !c.type || !c.province) {
      wx.lin.showToast({
        title: '请完整填写必填项',
        icon: 'error'
      });
      return;
    }

    const res = await Company.addCompanyInfo(c);

    if (res && res.code === 500) {
      wx.lin.showToast({ title: '已有该信息', icon: 'error' });
      return;
    }
    if (res && res.code === 0) {
      wx.redirectTo({ url: '/pages/review-status/review-status' });
    }
  }

})
