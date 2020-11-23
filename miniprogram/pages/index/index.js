
// miniprogram/pages/index/index.js

const app = getApp()

Page({

  data: {

  },

  onUserInfoTap: function() { 
    wx.getUserInfo({
      success: function(res) {
        console.log(res)
        app.globalData.userInfo = res.userInfo
        wx.switchTab({
          url: '../wall/wall',
        })
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          console.log("已经授权过")

          wx.getUserInfo({
            success: function(res) {
              console.log(res)
              app.globalData.userInfo = res.userInfo
              wx.switchTab({
                url: '../wall/wall',
              })
            },
            fail: function(res) {
              console.log(res)
            }
          })
          
          wx.switchTab({
            url: '../wall/wall',
          })
        }
      }
    })
  
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})