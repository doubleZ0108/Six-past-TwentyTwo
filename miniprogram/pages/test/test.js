// miniprogram/pages/test/test.js

const app = getApp()

Page({
  data: {

    academyIndex: [0, 0],
    academyArray: [
      ["全部", "嘉定校区", "四平校区"],
      ["未知", "软件学院", "建筑与城市规划学院"]
    ]
  },

  onAcademyPickerChange: function(e) {
    this.setData({
      academyIndex: e.detail.value
    })
  },
  onAcademyPickerColumnChange: function(e) {
    let data = {
      academyArray: this.data.academyArray,
      academyIndex: this.data.academyIndex
    }
    data.academyIndex[e.detail.column] = e.detail.value
    switch(e.detail.column) {
      case 0: {   /* 第一列滚动 */
        switch(data.academyIndex[0]) {
          case 0:   // 全部
            data.academyArray[1] = ["未知", "软件学院", "建筑与城市规划学院"]
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

})