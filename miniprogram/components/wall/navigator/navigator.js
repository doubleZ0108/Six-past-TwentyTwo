// components/wall/icons/icons.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
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
    scrollLeft: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    swichNavigator: function(e) {
      let current = e.currentTarget.dataset.current
      if(this.data.currentTab == current) {
        return false
      } else {
        this.setData({ currentTab: current })
      }
    },
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
  }
})
