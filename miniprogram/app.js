//app.js

App({
  onLaunch: function () {

    this.globalData = {}
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'ckkkx-7gnxqsp7c5938afc',  // TODO 换成release的库
        traceUser: true,
      })
    }

  }
})
