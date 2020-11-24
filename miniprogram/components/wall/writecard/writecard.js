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
    touchDotX: 0,
    touchDotY: 0,
    writecard_bg: "../../../resource/img/write/fold_bg.svg",
    switcher1_gender_now: "gender-now-male",
    switcher1_text: "男生",
    switcher2_gender_now: "gender-now-female",
    switcher2_text: "女生",
    academy_array: [
      "未知","软件学院","土木学院","学院","学院","学院","学院","学院","学院","学院","学院","学院","学院","学院"
    ],
    academy_index: 0,
    grade_array: [
      "未知","大一","大二","大三","大四","研一","研二","研三","博一","博二","博三","博四","博五","其他"
    ],
    grade_index: 0,
    myName: "",
    taName: "",
    myDescription: "",
    taDescription: "",
    textarea: ""
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

    bindAcademyChange: function(e) {
      this.setData({ academy_index: e.detail.value })
    },

    bindGradeChange: function(e) {
      this.setData({ grade_index: e.detail.value })
    },

    formSubmit: function(e) {
      let writeData = {
        myName: e.detail.value.myName,
        taName: e.detail.value.taName,
        myGender: this.data.switcher1_text,
        taGender: this.data.switcher2_text,
        academy: this.data.academy_array[this.data.academy_index],
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
          return
        }
      }

      // @BACK √
      console.log(writeData)
      let that = this
      db.collection('card').add({
        data: {
          openid: app.globalData.openid,
          myName: e.detail.value.myName,
          taName: e.detail.value.taName,
          myGender: this.data.switcher1_text,
          taGender: this.data.switcher2_text,
          academy: this.data.academy_array[this.data.academy_index],
          grade: this.data.grade_array[this.data.grade_index],
          myDescription: e.detail.value.myDescription,
          taDescription: e.detail.value.taDescription,
          textarea: e.detail.value.textarea,
          starNum: 0,
          commentNum: 0,
          time: timeUtil.formatTime(new Date()),
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
                textarea: ""
               })
            }
          })

        }
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
            this.setData({ 
              fold_class: "",
            })
            return
          }
        }

        if (absY > absX * 2) {
          if(tmY > this.data.slip_tolerance) {
            this.setData({ 
              fold_class: "",
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
        writecard_bg: that.data.fold_class == "writecard-container-unfold" ? "../../../resource/img/write/unfold_bg.png" : "../../../resource/img/write/fold_bg.svg"
      })
    }
  }
})
