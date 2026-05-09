Page({
  goHome() {
    wx.switchTab({ url: '/pages/home/home' });
  },
  goAppeal() {
    wx.navigateTo({ url: '/pages/appeal/appeal' });
  }
});
