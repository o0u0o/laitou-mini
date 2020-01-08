import {Company} from "../../model/company";
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    num: [1,2,3],
    companyData: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //搜索回调
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

  }
})
