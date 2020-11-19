// components/wall/searchcard/searchcard.js
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
    academy_array: [
      "软件学院","土木学院","建筑与城市规划学院","学院","学院","学院","学院","学院","学院","学院","学院","学院","学院"
    ],
    academy_index: 0,
    grade_array: [
      "大一","大二","大三","大四","研一","研二","研三","博一","博二","博三","博四","博五","其他"
    ],
    grade_index: 0,
    date: "2020-11-19",
    gender_left_isMale: true,
    gender_right_isFemale: true,
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

    onSearchTap: function() {
      this.setData({ animate: true })

      let searchData = {
        academy: this.data.academy_array[this.data.academy_index],
        grade: this.data.grade_array[this.data.grade_index],
        date: this.data.date,
        gender_left: this.data.gender_left_isMale ? "男生" : "女生",
        gender_right: this.data.gender_right_isFemale ? "女生" : "男生"
      }

      let that = this
      setTimeout(function(){
        that.setData({ animate: false })
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 1000
        })
      }, 2000)  // TODO 动画播放时间

      // @BACK
      console.log(searchData)

    }
  }
})
