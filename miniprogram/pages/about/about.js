// miniprogram/pages/about/about.js

const db = wx.cloud.database()
const _ = db.command

Page({
  data: {
    about_our_img: null
  },

  onImageTap: function(e){
    wx.vibrateShort()
    wx.previewImage({
      current: e.target.dataset.imgsrc,
      urls: [e.target.dataset.imgsrc]
    })
  },

  onLoad: function() {
    let that = this

    db.collection('contentful')
    .where({
      what_is_this: _.eq("AboutOur")
    })
    .get({
      success: function(res) {
        let aboutData = res.data[0]
        that.setData({
          about_our_img: aboutData.imgSrc
        })
      }
    })
  }
})