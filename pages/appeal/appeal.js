Page({
  data: {
    form: {
      type: '',
      target: '',
      contact: '',
      content: ''
    }
  },

  bindType(e) { this.data.form.type = e.detail.value; },
  bindTarget(e) { this.data.form.target = e.detail.value; },
  bindContact(e) { this.data.form.contact = e.detail.value; },
  bindContent(e) { this.data.form.content = e.detail.value; },

  submit() {
    const f = this.data.form;
    if (!f.type || !f.target || !f.content) {
      wx.lin.showToast({ title: '请完整填写必填项', icon: 'error' });
      return;
    }
    // TODO: 后端申诉接口未上线，先以本地占位提示
    wx.lin.showToast({
      title: '已收到，会在 3-5 个工作日内复核',
      icon: 'success'
    });
    setTimeout(() => wx.navigateBack({ delta: 1 }), 1200);
  }
});
