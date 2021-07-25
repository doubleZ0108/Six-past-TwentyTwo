// miniprogram/pages/feedback/feedback.js

const timeUtil = require('../../utils/time')
const app = getApp()
const db = wx.cloud.database()

Page({

  data: {
    content: "",
    contact: "",
    toptip: {
      msg: "",
      type: "success",
      show: false
    },
  },

  onContentTap: function() {
    wx.vibrateShort()
  },
  onContentInput: function(e) {
    this.setData({
      content: e.detail.value
    })
  },

  onContactTap: function() {
    wx.vibrateShort()
  },
  onContactInput: function(e) {
    this.setData({
      contact: e.detail.value
    })
  },

  feedbackSubmit: function() {
    let that = this
    this.setData({ colorful: true })

    if(this.data.content == "") {
      wx.vibrateLong()
      this.setData({
        toptip: {
          msg: "请输入反馈:)",
          type: "error",
          show: true
        }
      })
      setTimeout(function(){ that.setData({ colorful: false}) }, 2000)
    } else {
      wx.vibrateShort()

      let feedbackData = {
        openid: app.globalData.openid,
        content: this.data.content,
        contact: this.data.contact,
        time: timeUtil.formatTime(new Date)
      }

      db.collection('feedback').add({
        data: {
          openid: feedbackData.openid,
          content: feedbackData.content,
          contact: feedbackData.contact,
          time: feedbackData.time,
          isHandle: false
        },
        success: function() {
          that.setData({
            toptip: {
              msg: "感谢您宝贵的意见, 我们会进一步完善哦～",
              type: "success",
              show: true
            },
            content: "",
            contact: ""
          })
        }
      })
    }
  },

  onLoad: function (options) {

  },

})