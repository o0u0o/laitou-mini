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

  },

  //绑定公司名字
  bindName(e){
    console.log(e.detail.value)
    let _this = this;
    _this.data.companyData.name = e.detail.value
    console.log(this.data.companyData)
  },

  //绑定类型
  bindType(e){
    console.log(e.detail.value)
    let _this = this;
    _this.data.companyData.type = e.detail.value
    console.log(this.data.companyData)
  },

  //绑定省
  bindProvince(e){
    console.log(e.detail.value)
    let _this = this;
    _this.data.companyData.province = e.detail.value
    console.log(this.data.companyData)
  },

  //绑定地址
  bindAddress(e){
    console.log(e.detail.value)
    let _this = this;
    _this.data.companyData.address = e.detail.value
    console.log(this.data.companyData)
  },

  //绑定城市
  bindCity(e){
    console.log(e.detail.value)
    let _this = this;
    _this.data.companyData.city = e.detail.value
    console.log(this.data.companyData)
  },

  //绑定区
  bindDistrict(e){
    console.log(e.detail.value)
    let _this = this;
    _this.data.companyData.district = e.detail.value
    console.log(this.data.companyData)
  },

  //绑定备注
  bindRemark(e){
    console.log(e.detail.value)
    let _this = this;
    _this.data.companyData.remark = e.detail.value
    console.log(this.data.companyData)
  },

  //提交数据到服务器
  submitData(e){
    let _this = this;

    console.log("======================")
    console.log(_this.data.companyData)
    console.log("======================")
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
          wx.lin.showToast({
            title: "提交成功",
            icon: 'success',
          })
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
