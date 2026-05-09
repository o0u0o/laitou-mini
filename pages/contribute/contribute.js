Page({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
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

    const { Company } = require('../../model/company');
    const res = await Company.addCompanyInfo(c);

    if (res && res.code === 500) {
      wx.lin.showToast({ title: '已有该信息', icon: 'error' });
      return;
    }
    if (res && res.code === 0) {
      wx.redirectTo({ url: '/pages/review-status/review-status' });
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }

})

  //提交数据到服务器
  submitData(e){
    let _this = this;

    // 合规门槛：必须勾选同意
    if (!_this.data.agreed) {
      wx.lin.showToast({
        title: '请先阅读并同意《投稿须知》与《隐私政策》',
        icon: 'error'
      });
      return;
    }
    const c = _this.data.companyData;
    if (!c.name || !c.type || !c.province) {
      wx.lin.showToast({
        title: '请完整填写必填项',
        icon: 'error'
      });
      return;
    }

    console.log("======================")
    console.log(_this.data.companyData)
    console.log("======================")

    // 本地 mock 开关：不发网络，直接进入「审核中」
    try {
      const { config } = require('../../config/config');
      if (config && config.useMock) {
        wx.redirectTo({ url: '/pages/review-status/review-status' });
        return;
      }
    } catch (err) { /* ignore */ }

    wx.request({
      method: 'POST',
      //dataType: 'json',
      url: 'https://laitou.aiuiot.com/laitou-java/app/company/from/wx/add',
      data: JSON.stringify(_this.data.companyData),
      header: {
        "Content-Type": "application/json"
      },
      success: res => {
        let msg = res.data.msg
        console.log(res.data)

        if(res.data.code === 500){
          wx.lin.showToast({
            title: "已有该信息",
            icon: 'error',
          })
        }

        if(res.data.code === 0){
          // 提交成功 → 进入「审核中」状态页
          wx.redirectTo({ url: '/pages/review-status/review-status' });
        }
        

        
        console.log(res.data.msg)
      },
      error: res =>{
        console(res.data.msg)
      }
    })


  },




  /**
   * 组件的方法列表
   */
  methods: {

  }

})
