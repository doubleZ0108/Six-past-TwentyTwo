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
    date: "2020-11-19"
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
    }
  }
})
