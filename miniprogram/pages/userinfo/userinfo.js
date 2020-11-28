// miniprogram/pages/userinfo/userinfo.js

const verifyUtil = require('../../utils/verify')
const app = getApp()
const db = wx.cloud.database()

Page({

  data: {
    toptip: {
      msg: "",
      type: "success",
      show: false
    },
    // academy_array: app.globalData.academy_array,
    // academy_index: 0,
    academyIndex: [0, 0],
    academyArray: [
      ["全部", "嘉定校区", "四平校区"],
      app.globalData.academy_array
    ],
    grade_array: app.globalData.grade_array,
    grade_index: 0,
    student_num: "",
    motto: "",
    colorful: false,   // submit button colorful,
    userInfo: null,

    verifyCode: null,            // 验证码
    showVerifyBox: false,
    verify_code_input: null,    // 用户输入的验证码
    is_verified: false
  },
 

  bindAcademyPickerChange: function(e) {
    this.setData({
      academyIndex: e.detail.value
    })
  },
  bindAcademyPickerColumnChange: function(e) {
    let data = {
      academyArray: this.data.academyArray,
      academyIndex: this.data.academyIndex
    }
    data.academyIndex[e.detail.column] = e.detail.value
    switch(e.detail.column) {
      case 0: {   /* 第一列滚动 */
        switch(data.academyIndex[0]) {
          case 0:   // 全部
            data.academyArray[1] = app.globalData.academy_array
            break
          case 1:  // 嘉定
            data.academyArray[1] = ["软件学院", "艺术与传媒学院"]
            break
          case 2:  // 四平
            data.academyArray[1] = ["土木工程学院", "建筑与城市规划学院"]
            break
        }
        data.academyIndex[1] = 0
        break
      }
    }
    this.setData(data)
  },

  bindGradeChange: function(e) {
    this.setData({ grade_index: e.detail.value })
  },

  onStudentNumInput: function(e) {
    this.setData({ student_num: e.detail.value })
  },

  onMottoInput: function(e) {
    this.setData({ motto: e.detail.value })
  },

  userinfoSubmit: function() {
    let that = this
    this.setData({ colorful: true })

    if(this.data.student_num=="" || this.data.motto=="") {
      this.setData({ 
        toptip: {
          msg: "请完善个人信息:)",
          type: "error",
          show: true
        }
      })
      setTimeout(function(){ that.setData({ colorful: false}) }, 2000)
    } else if(this.data.student_num.length != 7) {
      this.setData({ 
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
        academy: that.data.academyArray[1][that.data.academyIndex[1]],
        grade: that.data.grade_array[that.data.grade_index],
        studentNumber: that.data.student_num,
        motto: that.data.motto,
        verified: that.data.is_verified
      }
      console.log(userinfoData)
      
      wx.cloud.callFunction({
        name: "userinfo",
        data: {
          userInfo: userinfoData,
        },
        complete: function(res) {
          that.setData({
            toptip: {
              msg: "修改个人信息成功～",
              type: "success",
              show: true
            },
          })

          if(!that.data.is_verified) {
            wx.showModal({
              title: '二十二点零六',
              showCancel: false,
              content: '未验证学号仅能使用<表白墙>，无法进行<聊天>',
              success (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            })
          } else {
            app.globalData._verified_secret = true
          }

          let pages = getCurrentPages()
          let prepage = pages[pages.length-2]
          prepage.setData({
            userinfo_flag: true
          })

        }
      })
    
    }
  },


  onVerifyCodeInput: function(e) {
    this.setData({ verify_code_input: e.detail.value })
  },
  onVerifyCancel: function() {
    this.setData({
      showVerifyBox: false,
      verify_code_input: ""
    })
  },
  // 输入完验证码 -> 确定
  onVerifyCodeSubmit: function() {
    if(this.data.verify_code_input == this.data.verifyCode) {   // 验证成功
      this.setData({ 
        is_verified: true,
        showVerifyBox: false,
        verify_code_input: ""
      })

    } else {
      this.setData({
        toptip: {
          msg: "验证码错误:)",
          type: "error",
          show: true
        }
      })
    }
  },

  // 发送验证码
  onVerifyTap: function() {
    if(this.data.student_num.length != 7) {
      this.setData({ 
        toptip: {
          msg: "请输入正确的学号:)",
          type: "error",
          show: true
        }
      })
      return
    }

    // 发送邮箱验证码
    let emileInfo = {
      studentNum: this.data.student_num,
      verifyCode: verifyUtil.getVerifyCode()
    }

    this.setData({ 
      verifyCode: emileInfo.verifyCode,
      showVerifyBox: true
    })

    this.sendEmile(emileInfo)
  },

  sendEmile: function(emileInfo) {
    let that = this
    wx.cloud.callFunction({
      name: "emile",
      data: {
        to_emile: emileInfo.studentNum + '@tongji.edu.cn',
        from: '二十二点零六团队 <Six_past_TwentyTwo@163.com>',    // 发件人必须是这个格式
        subject: '【二十二点零六】验证码',                // 主题
        text: '您的验证码是: ' + emileInfo.verifyCode   // 邮件内容，text或者html格式
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
      userInfo: app.globalData.userInfo,
      is_verified: app.globalData._verified_secret
    })

    let that = this
    db.collection('user').where({
      _openid: app.globalData.openid
    }).get({
      success: function(res) {
        let userInfo = res.data[0]
        if(userInfo.academy != "未知学院") {
          that.setData({
            // academy_index: that.data.academy_array.indexOf(userInfo.academy)
            academyIndex: [0, app.globalData.academy_array.indexOf(userInfo.academy)]
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
        that.setData({ 
          motto: userInfo.motto,
        })
      }
    })

  },

})