// components/wall/hero/hero.js

const app = getApp()

Component({
  properties: {

  },

  data: {
    avatarUrl: '../../../resource/img/avatar/default_avatar.png',
    nickName: "起个名字吧",
    gender: "神秘"
  },

  methods: {

  },

  lifetimes: {
    attached: function() {
      this.setData({
        avatarUrl: app.globalData.userInfo.avatarUrl,
        nickName: app.globalData.userInfo.nickName,
        gender: app.globalData.userInfo.gender==1 ? '男生' : (app.globalData.userInfo.gender==1 ? '女生' : '神秘')
      })
    }
  }
})
