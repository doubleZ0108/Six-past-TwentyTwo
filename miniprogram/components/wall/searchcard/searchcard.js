// components/wall/searchcard/searchcard.js

const timeUtil = require('../../../utils/time')
const app = getApp()
const db = wx.cloud.database()
const _ = db.command

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    posLeft: {
      type: String,
      value: "310%"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    academy_array: ["全部"].concat(app.globalData.academy_array),
    academy_index: 0,
    grade_array: ["全部"].concat(app.globalData.grade_array),
    grade_index: 0,
    date: timeUtil.formatDate(new Date()),
    gender_left_isMale: true,
    gender_right_isFemale: true,
    gender_none: true,
    animate: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindAcademyChange: function(e) {
      this.setData({ academy_index: e.detail.value })
    },

    bindGradeChange: function(e) {
      this.setData({ grade_index: e.detail.value })
    },

    bindDateChange: function(e) {
      console.log(e.detail.value)
      this.setData({ date: e.detail.value })
    },

    onGenderLeftTap: function() {
      let that = this
      this.setData({ gender_left_isMale: !that.data.gender_left_isMale })
    },

    onGenerRightTap: function() {
      let that = this
      this.setData({ gender_right_isFemale: !that.data.gender_right_isFemale })
    },

    onGenderNoneTap: function() {
      let that = this
      this.setData({ gender_none: !that.data.gender_none })
    },

    onSearchTap: function() {
      this.setData({ animate: true })

      let searchData = {
        academy: this.data.academy_array[this.data.academy_index],
        grade: this.data.grade_array[this.data.grade_index],
        date: this.data.date,
        gender_left: this.data.gender_left_isMale ? "男生" : "女生",
        gender_right: this.data.gender_right_isFemale ? "女生" : "男生",
        gender_none: this.data.gender_none
      }

      // @BACK
      let pages = getCurrentPages()
      let currpage = pages[pages.length-1]
      currpage.setData({
        filterInfo: searchData
      })

      // 恢复动画
      let that = this
      setTimeout(function(){
        that.setData({ animate: false })
      }, 2000)  // TODO 动画播放时间

    }
  }
})
