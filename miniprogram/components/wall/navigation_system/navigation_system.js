// components/wall/navigation_system/navigation_system.js
Component({
  data: {
    tabbarItem: [
      {
        name: "主页",
        iconfont: "iconshouye"
      }, {
        name: "空间",
        iconfont: "iconsvgmoban59"
      },
      {
        name: "收藏",
        iconfont: "iconshouye"
      }, {
        name: "搜索",
        iconfont: "iconsvgmoban59"
      }
    ],
    currentTab: 0,
    scrollLeft: 0,
    winHeight: 0
  },

  methods: {
    /** for navigator */
    swichNavigator: function(e) {
      let current = e.currentTarget.dataset.current
      if(this.data.currentTab == current) {
        return false
      } else {
        this.setData({ currentTab: current })
      }
    },

    /** for content */
    switchTab: function(e) {
      let that = this
      that.setData({ currentTab: e.detail.current })
      that.checkBoundary()
    },
    checkBoundary: function() {
      let that = this;
      if(that.data.currentTab > 3) {
        that.setData({ scrollLeft: 300 })
      } else {
        that.setData({ scrollLeft: 0 })
      }
    }
  },
  lifetimes: {
    attached: function() {
      let that = this;
      //  高度自适应
      wx.getSystemInfo({
        success: function (res) {
          let calc = res.windowHeight; //顶部脱离文档流了(- res.windowWidth / 750 * 100);
          // console.log('==顶部高度==',calc)
          that.setData({
            winHeight: calc
          });
        }
      });
    }
  }
})
