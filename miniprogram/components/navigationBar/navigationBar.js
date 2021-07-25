// components/navigationBar/navigationBar.js
const app = getApp()

Component({

  properties: {
    outdrop: {
      type: Boolean,
      value: false
    },
    pull_down: {
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
    navigationBarHeight: 88,
    outdrop_root: false,
    animate: false
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

  lifetimes: {
    attached: function() {
      this.setData({ navigationBarHeight: app.globalData.statusBarHeight + 44 })
    }
  },

  observers: {
    'outdrop': function(outdrop) {
      this.setData({ outdrop_root: outdrop })
    },
    'pull_down': function(pull_down) {
      this.setData({ animate: true })

      let that = this
      setTimeout(function() {
        that.setData({ animate: false })
      }, 2000)
    }
  }
})
