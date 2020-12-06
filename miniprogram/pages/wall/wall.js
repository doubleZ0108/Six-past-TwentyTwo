// miniprogram/pages/wall/wall.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    drawer: false,
    reach_bottom_flag: false,
    pull_down_flag: false,
    unfold_refresh_flag: false
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


  sendSubscribe: function() {
    wx.cloud.callFunction({
      name: "subscribe",
      data: {},
      complete: function(res) {
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.sendSubscribe()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({ reach_bottom_flag: true })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})