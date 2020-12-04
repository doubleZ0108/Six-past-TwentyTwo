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
    // academy_array: ["全部"].concat(app.globalData.academy_array),
    // academy_index: 0,
    academyIndex: [0, 0],
    academyArray: [
      ["全部","校区","新生院","中外交流","字典排序","长度排序","除此之外"],
      ["全部"].concat(app.globalData.academy_array)
    ],
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
              data.academyArray[1] = ["全部"].concat(app.globalData.academy_array)
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

    bindDateTap: function() {
      wx.vibrateShort()
    },
    bindDateChange: function(e) {
      console.log(e.detail.value)
      this.setData({ date: e.detail.value })
    },

    onGenderLeftTap: function() {
      wx.vibrateShort()

      let that = this
      this.setData({ gender_left_isMale: !that.data.gender_left_isMale })
    },

    onGenerRightTap: function() {
      wx.vibrateShort()

      let that = this
      this.setData({ gender_right_isFemale: !that.data.gender_right_isFemale })
    },

    onGenderNoneTap: function() {
      wx.vibrateShort()

      let that = this
      this.setData({ gender_none: !that.data.gender_none })
    },

    onSearchTap: function() {
      wx.vibrateShort()
      
      this.setData({ animate: true })

      let searchData = {
        academy: this.data.academyArray[1][this.data.academyIndex[1]],
        grade: this.data.grade_array[this.data.grade_index],
        date: this.data.date,
        gender_left: this.data.gender_left_isMale ? "男生" : "女生",
        gender_right: this.data.gender_right_isFemale ? "女生" : "男生",
        gender_none: this.data.gender_none
      }

      // @BACK
      console.log(searchData)
      
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
