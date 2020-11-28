
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

        // 新用户注册 @BACK √
        wx.cloud.callFunction({
          name: 'login',
          data: {},
          complete: function(login_res) {
            app.globalData.openid = login_res.result.openid
            app.globalData._verified_secret = false

            db.collection('user').add({
              data: {
                openid: login_res.openid,
                avatarUrl: userInfo_res.userInfo.avatarUrl,
                nickName: userInfo_res.userInfo.nickName,
                gender: userInfo_res.userInfo.gender==1 ? "男生" : (userInfo_res.userInfo.gender==2 ? "女生" : "未知"),
                academy: "未知学院",
                grade: "未知年级",
                studentNumber: "",
                motto: "二十二点零六",
                _verified_secret: false
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

              // get user info
              wx.getUserInfo({
                success: function(userInfo_res) {
                  app.globalData.userInfo = userInfo_res.userInfo

                  // get verified or not
                  db.collection('user').where({
                    _openid: app.globalData.openid
                  }).get({
                    success: function(res) {
                      app.globalData._verified_secret = res.data[0]._verified_secret

                      // switch tab
                      wx.switchTab({
                        url: '../wall/wall',
                      })
                    }
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