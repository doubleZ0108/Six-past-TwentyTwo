// components/wall/hero/hero.js

const app = getApp()
const db = wx.cloud.database()

Component({
  properties: {
    userinfo_flag: {
      type: Boolean,
      value: false
    }
  },

  data: {
    // avatarUrl: '../../../resource/img/avatar/default_avatar.png',
    avatarUrl: 'https://7369-six-past-twenty-two-8cvx689cf6da-1304135300.tcb.qcloud.la/in-project-resources/avatar/default_avatar.png?sign=4c641da11029064a36c8b4f2914a7ef4&t=1607588947',
    nickName: "起个名字吧",
    gender: "神秘",
    academy: "未知学院",
    grade: "未知年级",
    motto: "二十二点零六"
  },

  methods: {
    updateUserinfo: function() {
      let that = this
      db.collection('user').where({
        _openid: app.globalData.openid
      }).get({
        success: function(res) {
          let userInfo = res.data[0]
          that.setData({
            academy: userInfo.academy,
            grade: userInfo.grade,
            motto: userInfo.motto
          })
        }
      })
    }
  },

  lifetimes: {
    attached: function() {
      this.setData({
        avatarUrl: app.globalData.userInfo.avatarUrl,
        nickName: app.globalData.userInfo.nickName,
        gender: app.globalData.userInfo.gender==1 ? '男生' : (app.globalData.userInfo.gender==1 ? '女生' : '神秘')
      })
      
      this.updateUserinfo()
    }
  },

  observers: {
    'userinfo_flag': function(userinfo_flag) {
      if(userinfo_flag) {
        this.updateUserinfo()
      }
    }
  }
})
