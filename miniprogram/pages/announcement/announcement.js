// miniprogram/pages/announcement/announcement.js

const timeUtil = require('../../utils/time')
const app = getApp()
const db = wx.cloud.database()

Page({

  data: {
    announcement_list: [],
    announcement_imageSrc_list: [],

    init_step: 6,   // 初始/下拉刷新个数
    load_more_step: 5,  // 触底刷新个数

    show_loading: false,
    bottom_show: false
  },

  onImageTap: function(e){
    wx.vibrateShort()

    let that = this
    wx.previewImage({
      current: e.target.dataset.imgSrc,
      urls: that.data.announcement_imageSrc_list
    })
  },

  initAnnouncement: function() {
    let that = this
    this.setData({ 
      announcement_list: [],
      announcement_imageSrc_list: []
    })
    db.collection('announcement')
      .limit(that.data.init_step)
      .orderBy('time', 'desc')
      .get({
        success: function(res) {
          let bin_announcements = []
          let bin_img_list = []
          res.data.forEach(function(announcement){
            bin_announcements.push({
              imgSrc: announcement.imgSrc,
              content: announcement.content,
              time: timeUtil.formatDate(announcement.time)
            })
            if(announcement.imgSrc != "") {
              bin_img_list.push(announcement.imgSrc)
            }
          })
          that.setData({
            announcement_list: bin_announcements,
            announcement_imageSrc_list: bin_img_list
          })
        }
      })
  },
  loadMoreAnnouncement: function() {
    wx.vibrateShort()
    
    let that = this
    this.setData({ 
      show_loading: true,
      bottom_show: false
    })
    db.collection('announcement')
      .limit(that.data.load_more_step)
      .skip(that.data.announcement_list.length)
      .orderBy('time', 'desc')
      .get({
        success: function(res) {

          if(res.data.length == 0) {
            console.log("我是有底线的～")
            that.setData({ 
              bottom_show: true,
              show_loading: false 
            })
            return
          }

          let bin_announcements = []
          let bin_img_list = []
          res.data.forEach(function(announcement){
            bin_announcements.push({
              imgSrc: announcement.imgSrc,
              content: announcement.content,
              time: timeUtil.formatDate(announcement.time)
            })
            if(announcement.imgSrc != "") {
              bin_img_list.push(announcement.imgSrc)
            }
          })
          
          that.setData({
            announcement_list: that.data.announcement_list.concat(bin_announcements),
            announcement_imageSrc_list: that.data.announcement_imageSrc_list.concat(bin_img_list),
            show_loading: false
          })
        }
      })
  },

  onLoad: function (options) {
    this.initAnnouncement()
  },

  onReachBottom: function(options) {
    this.loadMoreAnnouncement()
  }
})