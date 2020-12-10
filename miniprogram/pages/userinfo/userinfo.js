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
      ["全部","校区","新生院","中外交流","字典排序","长度排序","除此之外"],
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
 
  bindAcademyPickerTap: function() {
    wx.vibrateShort()
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
          case 1:  // 校区
            data.academyArray[1] = ["四平校区","嘉定校区","沪北校区","沪西校区"]
            break
          case 2:  // 新生院
            data.academyArray[1] = ["济勤学堂","同心学堂","同德学堂","同舟学堂","同和学堂","济美学堂","济世学堂","济人学堂","国豪学堂"]
            break
          case 3: // 中外交流
            data.academyArray[1] = ["国际文化交流学院","中德工程学院","中德学院","中法工程与管理学院","中意学院","中芬中心","中西学院"]
            break
          case 4: // 字典排序
            data.academyArray[1] = ['材料科学与工程学院', '测绘与地理信息学院', '创新创业学院', '电子与信息工程学院', '法学院', '国际文化交流学院', '国际足球学院', '海洋与地球科学学院', '航空航天与力学学院', '环境科学与工程学院', '环境与可持续发展学院', '化学科学与工程学院', '建筑与城市规划学院', '交通运输工程学院', '基础科学高等研究院', '经济与管理学院', '机械与能源工程学院', '口腔医学院', '马克思主义学院', '女子学院', '汽车学院', '人文学院', '软件学院', '上海国际知识产权学院', '设计创意学院', '生命科学与技术学院', '数学科学学院', '铁道与城市轨道交通研究院', '体育教学部', '土木工程学院', '外国语学院', '物理科学与工程学院', '新农村发展研究院', '新生院', '艺术与传媒学院', '医学院', '政治与国际关系学院', '职业技术教育学院', '中德工程学院', '中德学院', '中法工程与管理学院', '中芬中心', '中西学院', '中意学院']
            break
          case 5: // 长度排序
            data.academyArray[1] = ['新生院', '法学院', '医学院', '软件学院', '人文学院', '汽车学院', '女子学院', '中德学院', '中意学院', '中芬中心', '中西学院', '外国语学院', '口腔医学院', '体育教学部', '土木工程学院', '数学科学学院', '设计创意学院', '国际足球学院', '创新创业学院', '中德工程学院', '经济与管理学院', '马克思主义学院', '艺术与传媒学院', '交通运输工程学院', '职业技术教育学院', '新农村发展研究院', '国际文化交流学院', '建筑与城市规划学院', '机械与能源工程学院', '环境科学与工程学院', '材料科学与工程学院', '电子与信息工程学院', '政治与国际关系学院', '海洋与地球科学学院', '航空航天与力学学院', '物理科学与工程学院', '化学科学与工程学院', '基础科学高等研究院', '测绘与地理信息学院', '生命科学与技术学院', '中法工程与管理学院', '上海国际知识产权学院', '环境与可持续发展学院', '铁道与城市轨道交通研究院']
            break
          case 6: // 除此之外
            data.academyArray[1] = ["我们真的想不全了","如果没有您的学院","请见谅并给我们反馈","感谢","这几个选项请不要选择"]
            break
      }
        data.academyIndex[1] = 0
        break
      }
    }
    this.setData(data)
  },

  bindGradeTap: function() {
    wx.vibrateShort()
  },
  bindGradeChange: function(e) {
    this.setData({ grade_index: e.detail.value })
  },

  onStudentNumTap: function() {
    wx.vibrateShort()
  },
  onStudentNumInput: function(e) {
    this.setData({ student_num: e.detail.value })
  },

  onMottoTap: function() {
    wx.vibrateShort()
  },
  onMottoInput: function(e) {
    this.setData({ motto: e.detail.value })
  },

  userinfoSubmit: function() {
    let that = this
    this.setData({ colorful: true })

    if(this.data.student_num=="" || this.data.motto=="") {
      wx.vibrateLong()

      this.setData({ 
        toptip: {
          msg: "请完善个人信息:)",
          type: "error",
          show: true
        }
      })
      setTimeout(function(){ that.setData({ colorful: false}) }, 2000)
    } else if(this.data.student_num.length != 7) {
      wx.vibrateLong()

      this.setData({ 
        toptip: {
          msg: "请输入正确的学号:)",
          type: "error",
          show: true
        }
      })
      setTimeout(function(){ that.setData({ colorful: false}) }, 2000)
    } else {
      wx.vibrateShort()

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
              title: '学号验证提示',
              showCancel: false,
              content: '未验证学号仅支持使用「表白墙」功能，后续待发布「神秘功能」必须验证学号使用',
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
    wx.vibrateShort()
    this.setData({
      showVerifyBox: false,
      verify_code_input: ""
    })
  },
  // 输入完验证码 -> 确定
  onVerifyCodeSubmit: function() {
    if(this.data.verify_code_input == this.data.verifyCode) {   // 验证成功
      wx.vibrateShort()
      this.setData({ 
        is_verified: true,
        showVerifyBox: false,
        verify_code_input: "",
        toptip: {
          msg: "学号验证成功～",
          type: "error",
          show: true
        }
      })
    } else {
      wx.vibrateLong()
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
      wx.vibrateLong()
      this.setData({ 
        toptip: {
          msg: "请输入正确的学号:)",
          type: "error",
          show: true
        }
      })
      return
    }

    wx.vibrateShort()
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
    wx.cloud.callFunction({
      name: "emile",
      data: {
        to_emile: emileInfo.studentNum + '@tongji.edu.cn',
        from: '二十二点零六团队 <Six_past_TwentyTwo@163.com>',    // 发件人必须是这个格式
        subject: '【二十二点零六】验证码',                // 主题
        text: '“每个夜晚都会遇见🌙”\n您的验证码是: ' + emileInfo.verifyCode + '\n\n\n/* zzzzzzzzzzzzzzzz\n同济大学软件学院\n造梦工程师🌨'
      },
              // text: '您的验证码是: ' + emileInfo.verifyCode,   // 邮件内容，text或者html格式
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