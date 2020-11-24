
// miniprogram/pages/index/index.js

const app = getApp()
const db = wx.cloud.database()

Page({

  data: {

  },

  onUserInfoTap: function() { 
    wx.getUserInfo({
      success: function(userInfo_res) {
        app.globalData.userInfo = userInfo_res.userInfo

        // 用户注册 @BACK √
        wx.cloud.callFunction({
          name: 'login',
          data: {},
          complete: function(login_res) {
            app.globalData.openid = login_res.result.openid

            db.collection('user').add({
              data: {
                openid: login_res.openid,
                avatarUrl: userInfo_res.userInfo.avatarUrl,
                nickName: userInfo_res.userInfo.nickName,
                gender: userInfo_res.userInfo.gender==1 ? "男生" : (userInfo_res.userInfo.gender==2 ? "女生" : "未知")
              },
              success: function() {

                db.collection('behavior').add({
                  data: {
                    openid: login_res.openid,
                    favoriteList: [],
                    starList: [],
                    commentList: []
                  },
                  success: function() {
                    wx.switchTab({
                      url: '../wall/wall',
                    })
                  }
                })
              }
            })

          }
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
        if (res.authSetting['scope.userInfo']) {  // 已经授权过

          /** 用户登陆获取openid */
          wx.cloud.callFunction({
            name: 'login',
            data: {},
            complete: function(login_res) {
              app.globalData.openid = login_res.result.openid
              wx.getUserInfo({
                success: function(userInfo_res) {
                  app.globalData.userInfo = userInfo_res.userInfo
                  wx.switchTab({
                    url: '../wall/wall',
                  })
                },
                fail: function(res) {
                  console.log(res)
                }
              })

            }
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