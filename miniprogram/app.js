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
        '软件学院', '新生院', '土木工程学院', '建筑与城市规划学院', '设计创意学院', '艺术与传媒学院', '汽车学院', '交通运输工程学院', '测绘与地理信息学院', '机械与能源工程学院', '环境科学与工程学院', '材料科学与工程学院', '电子与信息工程学院', '经济与管理学院', '数学科学学院', '海洋与地球科学学院', '航空航天与力学学院', '物理科学与工程学院', '化学科学与工程学院', '法学院', '人文学院', '外国语学院', '马克思主义学院', '政治与国际关系学院', '基础科学高等研究院', '生命科学与技术学院', '医学院', '口腔医学院', '体育教学部', '铁道与城市轨道交通研究院', '国际足球学院', '上海国际知识产权学院', '创新创业学院', '女子学院', '职业技术教育学院', '新农村发展研究院', '环境与可持续发展学院', '国际文化交流学院', '中德学院', '中法工程与管理学院', '中德工程学院', '中意学院', '中芬中心', '中西学院',"其他"
      ],
      grade_array: [
        "大一","大二","大三","大四","大五","研一","研二","研三","博士","老师","在读高中生","在读初中生","在读小学生","其他"
      ],
    }
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      // env: 'ckkkx-7gnxqsp7c5938afc',  // TODO 换成release的库
      wx.cloud.init({
        env: 'six-past-twenty-two-8cvx689cf6da',
        traceUser: true,
      })
    }

  }
})
