// components/wall/navigation_system/navigation_system.js
Component({
  properties: {
    world_cards_root: Array
  },

  data: {
    tabbarItem: [
      {
        name: "主页",
        iconfont: "icongonggao"
      }, 
      {
        name: "空间",
        iconfont: "iconshouye"
      },
      {
        name: "收藏",
        iconfont: "iconyanjing1"
      }, {
        name: "搜索",
        iconfont: "iconsousuo"
      }
    ],
    currentTab: 0,
    scrollLeft: 0,
    winHeight: 0,
    navigatorLeft: 0,
    posLeft_base: 0.1,

    world_cards: []
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
      
      for(let index=0; index<this.data.world_cards.length; ++index){
        this.data.world_cards[index].refresh_flag = "refresh";
      }
      let that = this;
      this.setData({ world_cards: that.data.world_cards })
    },
  },
  
  lifetimes: {
    attached: function() {
      let that = this
      //  高度自适应
      wx.getSystemInfo({
        success: function (res) {
          let calc = res.windowHeight; //顶部脱离文档流了(- res.windowWidth / 750 * 100);
          // console.log('==顶部高度==',calc)
          that.setData({
            winHeight: calc + 800 + 100   // 文档流的高度 + 展开一张卡片 + 底部留白
          });
        }
      })
    },

    ready: function() {
      let that = this;
      const query = wx.createSelectorQuery()

      query.selectAll(".normalcard-group").fields({
        id: true,
        context: true,
        node: true
      }, function (resList) {
        console.log(resList)
        resList.forEach((res)=>{
          wx.createIntersectionObserver().relativeToViewport().observe('#'+res.id, (node) => {
            let cardIndex = parseInt(res.id.substr(11))
            if(node.intersectionRatio != 0) {
              that.data.world_cards[cardIndex].animate = true
            } else {
              that.data.world_cards[cardIndex].animate = false
            }
            that.setData({ world_cards: that.data.world_cards })
          })
        })
      }).exec()
    }
  },

  observers: {
    // 'winHeight': function() {
    //   let that = this
    //   wx.getSystemInfo({
    //     success: function (res) {
    //       let calc = res.windowHeight
    //       that.setData({
    //         winHeight: calc + 800 + 100
    //       });
    //     }
    //   })
    // },
    'currentTab': function(currentTab) {
      this.setData({ 
        navigatorLeft: this.data.currentTab * 25 + "%",
        posLeft_base: this.data.currentTab * -1 + 0.1
      })
    },
    'world_cards_root': function(world_cards_root) {
      this.setData({
        world_cards: world_cards_root
      })

      let that = this
      wx.getSystemInfo({
        success: function (res) {
          let calc = res.windowHeight
          that.setData({
            winHeight: calc + that.data.world_cards.length * 300 + 100
          });
        }
      })
    }
  }
})
