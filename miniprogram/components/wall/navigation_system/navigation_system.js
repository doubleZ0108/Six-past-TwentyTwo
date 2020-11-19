// components/wall/navigation_system/navigation_system.js
Component({
  data: {
    tabbarItem: [
      {
        name: "主页",
        iconfont: "iconshouye"
      }, 
      {
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
    cardsItem: [
      {
        name_left: "DynamicName1",
        name_right: "DynamicName2",
        avatar_url: "../../../resource/img/avatar/avatar.jpg",
        description: "这里是一条表白，它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长",
        refresh_flag: "refresh"
      },
      {
        name_left: "DynamicName3",
        name_right: "DynamicName4",
        avatar_url: "../../../resource/img/avatar/avatar.jpg",
        description: "一句话告白",
        refresh_flag: "refresh"
      },
      {
        name_left: "DynamicName5",
        name_right: "DynamicName6",
        avatar_url: "../../../resource/img/avatar/avatar.jpg",
        description: "好的我爱你",
        refresh_flag: "refresh"
      }
    ],
    currentTab: 0,
    scrollLeft: 0,
    winHeight: 0,
    navigatorLeft: 0,
    posLeft_base: 0.1
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

      // 切换tab时自动滑动到顶端
      this.backToTop()

    },
    checkBoundary: function() {
      let that = this;
      if(that.data.currentTab > 3) {
        that.setData({ scrollLeft: 300 })
      } else {
        that.setData({ scrollLeft: 0 })
      }
    },

    backToTop: function() {
      if (wx.pageScrollTo) {
        wx.pageScrollTo({
          scrollTop: 0
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法滚动到顶端，请升级到最新微信版本后重试。'
        })
      }
    },

    /**
     * TAP
     */
    onCardGroupTap: function(e) {
      // console.log("card group tap...")
      
      for(let index=0; index<this.data.cardsItem.length; ++index){
        this.data.cardsItem[index].refresh_flag = "refresh";
      }
      let that = this;
      this.setData({ cardsItem: that.data.cardsItem })
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
            winHeight: calc + 800 + 100   // 文档流的高度 + 展开一张卡片 + 底部留白
          });
        }
      });
    }
  },

  observers: {
    'currentTab': function(currentTab) {
      this.setData({ 
        navigatorLeft: this.data.currentTab * 25 + "%",
        posLeft_base: this.data.currentTab * -1 + 0.1
      })
    }
  }
})
