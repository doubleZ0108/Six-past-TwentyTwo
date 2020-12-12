// miniprogram/pages/about/about.js
Page({

  data: {

  },

  onImageTap: function(e){
    wx.vibrateShort()
    wx.previewImage({
      current: e.target.dataset.imgsrc,
      urls: [e.target.dataset.imgsrc]
    })
  },
})