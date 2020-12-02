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
    writecard_bg: "https://636b-ckkkx-7gnxqsp7c5938afc-1304135300.tcb.qcloud.la/in-project-resources/write/fold_bg.svg?sign=5d52b41d0e3fa96f03bff8658dce8767&t=1606878512",
    switcher1_gender_now: "gender-now-male",
    switcher1_text: "男生",
    switcher2_gender_now: "gender-now-female",
    switcher2_text: "女生",
    // academy_array: ["未知"].concat(app.globalData.academy_array),
    // academy_index: 0,
    academyIndex: [0, 0],
    academyArray: [
      ["全部", "嘉定校区", "四平校区"],
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

    onWriteCardTap: function() {
      if(this.data.fold_class != "writecard-container-unfold") {
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
        }
      }, 2000)
    },

    onSwitcher1Tap: function() {
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
            that.setData({ prohibit_submit: false })
          }
        }

      })
     
    },


    onVipPayTap: function() {
      this.setData({ showVipPayBox: true })
    },
    onVipPaySubmit: function() {
      this.setData({ 
        showVipPayBox: false,
        write_vipcard: true
      })
    },
    onVipPayCancel: function() {
      this.setData({ showVipPayBox: false })
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
            this.setData({ 
              fold_class: "",
              showVipPayBox: false,
              write_vipcard: false
            })
            return
          }
        }

        if (absY > absX * 2) {
          if(tmY > this.data.slip_tolerance) {
            this.setData({ 
              fold_class: "",
              showVipPayBox: false,
              write_vipcard: false
            })
            return
          }
        } 
      }
    }

    // TODO 提交表单的时候要恢复性别信息
  },

  observers: {
    'fold_class': function() {
      let that = this;
      this.setData({
        writecard_height: that.data.fold_class == "writecard-container-unfold"? "100vh" : "330rpx",
        posLeft: that.data.fold_class == "writecard-container-unfold" ? "0" : "10%",
        // writecard_bg: that.data.fold_class == "writecard-container-unfold" ? "../../../resource/img/write/unfold_bg.png" :  '../../../resource/img/write/fold_bg.svg'
        writecard_bg: that.data.fold_class == "writecard-container-unfold" ? "https://636b-ckkkx-7gnxqsp7c5938afc-1304135300.tcb.qcloud.la/in-project-resources/write/unfold_bg.png?sign=4618b7895932a5020e1be119a5413623&t=1606878179" :  'https://636b-ckkkx-7gnxqsp7c5938afc-1304135300.tcb.qcloud.la/in-project-resources/write/fold_bg.svg?sign=0b037fd52e233e68131097a6bff8a9ac&t=1606878189'
      })
    },
    'write_vipcard': function(write_vipcard) {
      if(this.data.fold_class == "writecard-container-unfold") {
        this.setData({
          // writecard_bg: write_vipcard ? '../../../resource/img/write/vip_unfold_bg.png' : '../../../resource/img/write/unfold_bg.png'
          writecard_bg: write_vipcard ? 'https://636b-ckkkx-7gnxqsp7c5938afc-1304135300.tcb.qcloud.la/in-project-resources/write/vip_unfold_bg.png?sign=44a38a1a065a5138c5640a4438e843df&t=1606878152' : 'https://636b-ckkkx-7gnxqsp7c5938afc-1304135300.tcb.qcloud.la/in-project-resources/write/unfold_bg.png?sign=d44ae2bdf9b846e0876f170405d84cc6&t=1606878091'
        })
      }
    }
  }
})
