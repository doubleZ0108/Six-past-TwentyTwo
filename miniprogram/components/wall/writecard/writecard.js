// components/wall/writecard/writecard.js

const timeUtil = require('../../../utils/time')
const app = getApp()
const db = wx.cloud.database()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    posLeft: {
      type: String,
      value: "110%"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    fold_class: "",
    writecard_height: "330rpx",
    // fold_class: "writecard-container-unfold",    // for vipcard unfold test
    // writecard_height: "100vh",
    slip_tolerance: 200,  // 手指下滑退出滑动距离最小值
    animate: false,
    toptip: {
      msg: "",
      type: "success",
      show: false
    },
    show_error: false,  // 未完善所有所有信息提交时报错
    colorful: false,   // submit button colorful,
    prohibit_submit: false,
    touchDotX: 0,
    touchDotY: 0,
    // writecard_bg: "../../../resource/img/write/fold_bg.svg",
    writecard_bg: "https://7369-six-past-twenty-two-8cvx689cf6da-1304135300.tcb.qcloud.la/in-project-resources/write/fold_bg.svg?sign=f6b5baa0c6115d817f925095dcbe4f56&t=1607589361",
    switcher1_gender_now: "gender-now-male",
    switcher1_text: "男生",
    switcher2_gender_now: "gender-now-female",
    switcher2_text: "女生",
    // academy_array: ["未知"].concat(app.globalData.academy_array),
    // academy_index: 0,
    academyIndex: [0, 0],
    academyArray: [
      ["全部","校区","新生院","中外交流","字典排序","长度排序","除此之外"],
      ["未知"].concat(app.globalData.academy_array)
    ],
    grade_array: ["未知"].concat(app.globalData.grade_array),
    grade_index: 0,
    myName: "",
    taName: "",
    myDescription: "",
    taDescription: "",
    textarea: "",

    showVipPayBox: false,
    write_vipcard: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    backToTop: function() {
      if (wx.pageScrollTo) {
        wx.pageScrollTo({
          scrollTop: 0
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法滚动到顶端，请升级到最新微信版本后重试。'
        })
      }
    },

    onQRcodeTap: function(e) {
      wx.vibrateShort()
      wx.previewImage({
        current: e.target.dataset.qrcode,
        urls: [e.target.dataset.qrcode]
      })
    },

    onWriteCardTap: function() {
      if(this.data.fold_class != "writecard-container-unfold") {
        wx.vibrateShort()
        this.backToTop()
        this.setData({ animate: true })
      }

      let that = this
      setTimeout(function() {
        if(that.data.fold_class != "writecard-container-unfold") {
          that.setData({ 
            fold_class: "writecard-container-unfold",
            animate: false
          })

          // 隐藏顶部bar
          let pages = getCurrentPages()
          let currpage = pages[pages.length-1]
          currpage.setData({
            outdrop: true
          })
        }
      }, 2000)
    },

    onSwitcher1Tap: function() {
      wx.vibrateShort()

      let that = this
      if(this.data.switcher1_gender_now == "" || this.data.switcher1_gender_now == "gender-now-male") {
        this.setData({ switcher1_gender_now: "gender-now-female" })
        setTimeout(function(){
          that.setData({ switcher1_text: "女生" })
        }, 600)
      } else {
        this.setData({ switcher1_gender_now: "gender-now-male" })
        setTimeout(function(){
          that.setData({ switcher1_text: "男生" })
        }, 600)
      }
    },
    onSwitcher2Tap: function() {
      wx.vibrateShort()

      let that = this
      if(this.data.switcher2_gender_now == "" || this.data.switcher2_gender_now == "gender-now-female") {
        this.setData({ switcher2_gender_now: "gender-now-male" })
        setTimeout(function(){
          that.setData({ switcher2_text: "男生" })
        }, 600)
      } else {
        this.setData({ switcher2_gender_now: "gender-now-female" })
        setTimeout(function(){
          that.setData({ switcher2_text: "女生" })
        }, 600)
      }
    },

    bindMyNameTap: function() {
      wx.vibrateShort()
    },
    bindTaNameTap: function() {
      wx.vibrateShort()
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
              data.academyArray[1] = ["未知"].concat(app.globalData.academy_array)
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

    bindMyDescriptionTap: function() {
      wx.vibrateShort()
    },
    bindTaDescriptionTap: function() {
      wx.vibrateShort()
    },
    
    bindTextareaTap: function() {
      wx.vibrateShort()
    },

    formSubmit: function(e) {
      this.setData({ colorful: true })
      let that = this

      let writeData = {
        myName: e.detail.value.myName,
        taName: e.detail.value.taName,
        myGender: this.data.switcher1_text,
        taGender: this.data.switcher2_text,
        academy: this.data.academyArray[1][this.data.academyIndex[1]],
        grade: this.data.grade_array[this.data.grade_index],
        myDescription: e.detail.value.myDescription,
        taDescription: e.detail.value.taDescription,
        textarea: e.detail.value.textarea
      }

      for(var index in writeData){
        if(writeData[index] == ""){
          console.log("请完善所有信息")

          wx.vibrateLong()

          this.setData({ 
            toptip: {
              msg: "请完善所有内容:)",
              type: "error",
              show: true
            }
          })
          setTimeout(function(){ that.setData({ colorful: false}) }, 2000)
          return
        }
      }

      wx.vibrateShort()
      // @BACK √

      this.setData({ prohibit_submit: true })
      console.log(writeData)

      wx.showModal({
        title: "发送表白提示",
        content: "发送表白后无法修改和删除，确认发送吗？",
        showCancel: true,
        cancelText: "继续编辑",
        cancelColor: '#000000',   // TODO 等待调整
        confirmText: "确认发送",
        confirmColor: that.data.write_vipcard ? '#576B95' : '#576B91', // 金色 or 背景色
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.vibrateShort()

            let timeNow = new Date()
            if(that.data.write_vipcard == false) {    // 发布普通card
              db.collection('card').add({
                data: {
                  openid: app.globalData.openid,
                  myName: writeData.myName,
                  taName: writeData.taName,
                  myGender: writeData.myGender,
                  taGender: writeData.taGender,
                  academy: writeData.academy,
                  grade: writeData.grade,
                  myDescription: writeData.myDescription,
                  taDescription: writeData.taDescription,
                  textarea: writeData.textarea,
                  starNum: 0,
                  commentNum: 0,
                  time: timeUtil.formatDate(timeNow),
                  timestamp: timeNow.getTime(),
                  avatarUrl: app.globalData.userInfo.avatarUrl
                },
                success: function(res) {
        
                  db.collection('comment').add({
                    data: {
                      cardId: res._id,
                      commentList: []
                    },
                    success: function() {
                      that.setData({ 
                        toptip: {
                          msg: "表白发布成功～",
                          type: "success",
                          show: true
                        },
                        myName: "",
                        taName: "",
                        myDescription: "",
                        taDescription: "",
                        textarea: "",
                        prohibit_submit: false
                      })
                    }
                  })
        
                }
              })  
            } else {    // 发布vipcard
              console.log("write vip")
              db.collection('vipcard').add({
                data: {
                  openid: app.globalData.openid,
                  myName: writeData.myName,
                  taName: writeData.taName,
                  myGender: writeData.myGender,
                  taGender: writeData.taGender,
                  academy: writeData.academy,
                  grade: writeData.grade,
                  myDescription: writeData.myDescription,
                  taDescription: writeData.taDescription,
                  textarea: writeData.textarea,
                  starNum: 0,
                  commentNum: 0,
                  time: timeUtil.formatDate(timeNow),
                  timeDetail: timeUtil.formatTime(timeNow),
                  timestamp: timeNow.getTime(),
                  avatarUrl: app.globalData.userInfo.avatarUrl,
                  pay: false
                },
                success: function(res) {
        
                  db.collection('comment').add({
                    data: {
                      cardId: res._id,
                      commentList: []
                    },
                    success: function() {
                      that.setData({ 
                        toptip: {
                          msg: "vip表白发布成功～",
                          type: "success",
                          show: true
                        },
                        myName: "",
                        taName: "",
                        myDescription: "",
                        taDescription: "",
                        textarea: "",
                        prohibit_submit: false,
                        write_vipcard: false
                      })
                    }
                  })
        
                }
              }) 
            }

          } else if (res.cancel) {
            console.log('用户点击取消')
            wx.vibrateShort()

            that.setData({ prohibit_submit: false })
          }
        }

      })
     
    },


    sendVipPaySubscribe: function() {
      wx.cloud.callFunction({
        name: "vippaysubscribe",
        data: {},
        complete: function(res) {
          console.log(res)
        }
      })
    },

    onVipPayTap: function() {
      wx.vibrateShort()

      this.setData({ showVipPayBox: true })
    },
    onVipPaySubmit: function() {
      wx.vibrateShort()

      this.sendVipPaySubscribe()
      
      this.setData({ 
        showVipPayBox: false,
        write_vipcard: true
      })
    },
    onVipPayCancel: function() {
      wx.vibrateShort()

      this.setData({ showVipPayBox: false })
    },


    shrinkCallBack: function() {
      wx.vibrateShort()

      this.setData({ 
        fold_class: "",
        showVipPayBox: false,
        write_vipcard: false
      })

      // 显示顶部bar
      let pages = getCurrentPages()
      let currpage = pages[pages.length-1]
      currpage.setData({
        outdrop: false
      })
    },
    touchStart: function(e) {
      if(this.data.fold_class === "writecard-container-unfold") {
        this.setData({
          touchDotX: e.touches[0].pageX,
          touchDotY: e.touches[0].pageY
        })
      }
    },
    touchEnd: function(e) {
      if(this.data.fold_class === "writecard-container-unfold") {
        let touchMoveX = e.changedTouches[0].pageX
        let touchMoveY = e.changedTouches[0].pageY
        let tmX = touchMoveX - this.data.touchDotX
        let tmY = touchMoveY - this.data.touchDotY

        let absX = Math.abs(tmX)
        let absY = Math.abs(tmY)

        if (absX > 2 * absY) {
          if(tmX > this.data.slip_tolerance) {
            this.shrinkCallBack()
            return
          }
        }

        if (absY > absX * 2) {
          if(tmY > this.data.slip_tolerance) {
            this.shrinkCallBack()
            return
          }
        } 
      }
    }
  },

  observers: {
    'fold_class': function() {
      let that = this;
      this.setData({
        writecard_height: that.data.fold_class == "writecard-container-unfold"? "100vh" : "330rpx",
        posLeft: that.data.fold_class == "writecard-container-unfold" ? "0" : "10%",
        // writecard_bg: that.data.fold_class == "writecard-container-unfold" ? "../../../resource/img/write/unfold_bg.png" :  '../../../resource/img/write/fold_bg.svg'
        writecard_bg: that.data.fold_class == "writecard-container-unfold" ? "https://7369-six-past-twenty-two-8cvx689cf6da-1304135300.tcb.qcloud.la/in-project-resources/write/unfold_bg.png?sign=10de73ca9e76e49844227b078c3e4e10&t=1607589378" :  'https://7369-six-past-twenty-two-8cvx689cf6da-1304135300.tcb.qcloud.la/in-project-resources/write/fold_bg.svg?sign=d1670b385b976ca67cca0e0d0ef7052a&t=1607589391'
      })
    },
    'write_vipcard': function(write_vipcard) {
      if(this.data.fold_class == "writecard-container-unfold") {
        this.setData({
          // writecard_bg: write_vipcard ? '../../../resource/img/write/vip_unfold_bg.png' : '../../../resource/img/write/unfold_bg.png'
          writecard_bg: write_vipcard ? 'https://7369-six-past-twenty-two-8cvx689cf6da-1304135300.tcb.qcloud.la/in-project-resources/write/vip_unfold_write_bg_small.png?sign=2e590c64f4dd3862c45eba29ee5195bb&t=1607590677' : 'https://7369-six-past-twenty-two-8cvx689cf6da-1304135300.tcb.qcloud.la/in-project-resources/write/unfold_bg.png?sign=8bad8f0c2d540ea1e2a8aa94efef414d&t=1607589427'
        })
      }
    }
  }
})
