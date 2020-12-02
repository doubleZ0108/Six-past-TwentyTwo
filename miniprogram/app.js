//app.js

// "tabBar": {
//   "list": [
//     {
//       "pagePath": "pages/wall/wall",
//       "text": "表白墙",
//       "iconPath": "resource/img/icon/wall/wall.png",
//       "selectedIconPath": "resource/img/icon/wall/wall_selected.png"
//     },
//     {
//       "pagePath": "pages/test/test",
//       "text": "测试"
//     }
//   ]
// },

App({
  onLaunch: function () {

    this.globalData = {
      academy_array: [
        "软件学院","土木工程学院","建筑与城市规划学院","设计创意学院","艺术与传媒学院","xx学院","yy学院","其他"
      ],
      grade_array: [
        "大一","大二","大三","大四","大五","研一","研二","研三","博士","老师","在读高中生","在读初中生","在读小学生","其他"
      ],
    }
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'ckkkx-7gnxqsp7c5938afc',  // TODO 换成release的库
        traceUser: true,
      })
    }

  }
})
