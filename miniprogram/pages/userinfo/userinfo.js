// miniprogram/pages/userinfo/userinfo.js

const app = getApp()
const db = wx.cloud.database()

Page({

  data: {
    toptip: {
      msg: "",
      type: "success",
      show: false
    },
    academy_array: app.globalData.academy_array,
    academy_index: 0,
    grade_array: app.globalData.grade_array,
    grade_index: 0,
    student_num: "",
    motto: "",
    colorful: false,   // submit button colorful,
    userInfo: null
  },

  bindAcademyChange: function(e) {
    this.setData({ academy_index: e.detail.value })
  },

  bindGradeChange: function(e) {
    this.setData({ grade_index: e.detail.value })
  },

  onStudentNumBlur: function(e) {
    this.setData({ student_num: e.detail.value })
  },

  onMottoBlur: function(e) {
    this.setData({ motto: e.detail.value })
  },

  userinfoSubmit: function() {
    let that = this
    setTimeout(function(){
      that.setData({ colorful: true })

      if(that.data.student_num=="" || that.data.motto=="") {
        that.setData({ 
          toptip: {
            msg: "请完善个人信息:)",
            type: "error",
            show: true
          }
        })
        setTimeout(function(){ that.setData({ colorful: false}) }, 2000)
      } else if(that.data.student_num.length != 7) {
        that.setData({ 
          toptip: {
            msg: "请输入正确的学号:)",
            type: "error",
            show: true
          }
        })
        setTimeout(function(){ that.setData({ colorful: false}) }, 2000)
      } else {
        // @BACK
        let userinfoData = {
          academy: that.data.academy_array[that.data.academy_index],
          grade: that.data.grade_array[that.data.grade_index],
          studentNumber: that.data.student_num,
          motto: that.data.motto
        }
        console.log(userinfoData)
        
        wx.cloud.callFunction({
          name: "userinfo",
          data: {
            userInfo: userinfoData
          },
          complete: function() {
            that.setData({
              toptip: {
                msg: "修改个人信息成功～",
                type: "success",
                show: true
              },
            })

            let pages = getCurrentPages()
            let prepage = pages[pages.length-2]
            prepage.setData({
              userinfo_flag: true
            })

          }
        })
      }
    }, 500)
  },

  onVerifyTap: function() {

  },

  sendEmile: function() {
    wx.cloud.callFunction({
      name: "emile",
      data: {
        to_emile: '1753188@tongji.edu.cn',
        from: '二十二点零六团队 <Six_past_TwentyTwo@163.com>',    // 发件人必须是这个格式
        subject: '【二十二点零六】验证码',    // 主题
        text: '您的验证码是: 1234'   // 邮件内容，text或者html格式
      },
      complete: function(res) {
        console.log(res)
      }
    })
  },

  onLoad: function (options) {
    this.setData({
      academy_index: 0,
      grade_index: 0,
      student_num: "",
      motto: "",
      userInfo: app.globalData.userInfo
    })

    let that = this
    db.collection('user').where({
      _openid: app.globalData.openid
    }).get({
      success: function(res) {
        let userInfo = res.data[0]
        if(userInfo.academy != "未知学院") {
          that.setData({
            academy_index: that.data.academy_array.indexOf(userInfo.academy)
          })
        }
        if(userInfo.grade != "未知年级") {
          that.setData({
            grade_index: that.data.grade_array.indexOf(userInfo.grade)
          })
        }
        if(userInfo.studentNumber != "") {
          that.setData({ student_num: userInfo.studentNumber })
        }
        that.setData({ motto: userInfo.motto })
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