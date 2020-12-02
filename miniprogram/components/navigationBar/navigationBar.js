// components/navigationBar/navigationBar.js
const app = getApp()

Component({

  properties: {
    outdrop: {
      type: Boolean,
      value: false
    },
    text: {
      type: String,
      value: 'Wechat'
    },
    back: {
      type: Boolean,
      value: false
    },
    home: {
      type: Boolean,
      value: false
    }
  },
  data: {
    statusBarHeight: app.globalData.statusBarHeight + 'px',
    navigationBarHeight: (app.globalData.statusBarHeight + 44) + 'px',
    outdrop_root: false
  },

  methods: {
    backHome: function () {
      let pages = getCurrentPages()
      wx.navigateBack({
        delta: pages.length
      })
    },
    back: function () {
      wx.navigateBack({
        delta: 1
      })
    }
  },

  observers: {
    'outdrop': function(outdrop) {
      this.setData({ outdrop_root: outdrop })
    }
  }
})
