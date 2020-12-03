// miniprogram/pages/index/index.js

const app = getApp()
const db = wx.cloud.database()

Page({

  data: {
    guide_show: true,   // 显指导信息
    bg_blur: true,    // 背景模糊
    near_end: false,   // 接近跳转界面时切换背景颜色
    day_or_night: "day",
    show_getUserInfo_btn: false
  },



  onUserInfoTap: function() { 
    let that = this
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
                    that.loadingAnimation()
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

  timeAdapt: function() {
    let date = new Date()
    // let date = new Date()
    let hour = date.getHours()

    if(hour > 6 && hour < 17) {
      this.setData({ day_or_night: "day" })
    } else {
      this.setData({ day_or_night: "night" })
    }
  },

  loadingAnimation: function() {
    let that = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {  // 已经授权过
          that.setData({ 
            guide_show: false,
            bg_blur: false
          })

          setTimeout(function() {
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

                        /* platform */
                        wx.getSystemInfo({
                          success:function(res){
                            app.globalData.platform = res.platform

                            that.setData({ near_end: true })

                            setTimeout(function(){
                              /******** redirect **********/
                              wx.redirectTo({
                                url: '../wall/wall',
                              })
                            }, 1000)
                          }
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
          }, 5000)
        }
      }
    })
  },

  _quickLogin_secret: function() {
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {  // 已经授权过
          /** 用户登陆获取openid */
          wx.cloud.callFunction({
            name: 'login',
            data: {},
            complete: function(login_res) {
              app.globalData.openid = login_res.result.openid

              /* get user info */
              wx.getUserInfo({
                success: function(userInfo_res) {
                  app.globalData.userInfo = userInfo_res.userInfo

                  /* get verified or not */
                  db.collection('user').where({
                    _openid: app.globalData.openid
                  }).get({
                    success: function(res) {
                      app.globalData._verified_secret = res.data[0]._verified_secret

                      /* platform */
                      wx.getSystemInfo({
                        success:function(res){
                          app.globalData.platform = res.platform

                          /******** redirect **********/
                          wx.redirectTo({
                            url: '../wall/wall',
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

          }
        })   
        
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.timeAdapt()

    // this.loadingAnimation()
    // this._quickLogin_secret()
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