// miniprogram/pages/wall/wall.js

Page({

  data: {
    drawer: false,
    reach_bottom_flag: false,
    pull_down_flag: false,
    unfold_refresh_flag: false,
    which_vipcard_root: -1
  },

  heroTap: function() {
    wx.vibrateShort()
    
    let that = this
    this.setData({ drawer: !that.data.drawer })
    
    // 顶部bar
    let pages = getCurrentPages()
    let currpage = pages[pages.length-1]
    currpage.setData({
      outdrop: that.data.drawer
    })
  },

  userInfoTap: function() {
    wx.vibrateShort()
    wx.navigateTo({
      url: '../userinfo/userinfo',
    })
  },
  feedbackTap: function() {
    wx.vibrateShort()
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },
  announcementTap: function() {
    wx.vibrateShort()
    wx.navigateTo({
      url: '../announcement/announcement',
    })
  },
  aboutTap: function() {
    wx.vibrateShort()
    wx.navigateTo({
      url: '../about/about',
    })
  },

  onLoad: function (options) {

  },

  onPullDownRefresh: function () {
    wx.vibrateShort()

    this.setData({ pull_down_flag: true })
    this.showConfetti()
  },

  showConfetti: function() {
    this.confetti = this.selectComponent("#confetti")
    this.confetti.showConfetti()
    setTimeout(function(){
      wx.stopPullDownRefresh()
    }, 1000)
  },

  onReachBottom: function () {
    this.setData({ reach_bottom_flag: true })
  },

})