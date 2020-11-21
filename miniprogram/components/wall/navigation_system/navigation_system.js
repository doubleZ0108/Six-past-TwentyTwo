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
        card_id: 0,
        name_left: "很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的名字1",
        name_right: "很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的名字2",
        gender_left: "男生",
        gender_right: "女生",
        avatar_url: "../../../resource/img/avatar/avatar.jpg",
        description: "这里是一条表白，它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长这里是一条表白，它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长这里是一条表白，它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长这里是一条表白，它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长这里是一条表白，它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长",
        academy: "很长很长很长很长很长很长很长很长的学院",
        grade: "大四",
        bubble_left: "左侧测左侧测试文本左侧测试文本左侧测左侧测试文本左侧测试文本左侧测左侧测试文本左侧测试文本左侧测左侧测试文本左侧测试文本左侧测左侧测试文本左侧测试文本左侧测左侧测试文本左侧测试文本",
        bubble_right: "右侧测试文本右侧测试文本右侧测试文本右侧测试文本右侧测试文本右侧测试文本右侧测试文本右侧测试文本右侧测试文本",
        favorite: true,
        star: true,
        star_num: 4,
        comment_num: 1,
        refresh_flag: "refresh",
        animate: false    // TODO: 用来实现Intersection Observer 暂未成功
      },
      {
        card_id: 1,
        name_left: "名字3",
        name_right: "名字4",
        gender_left: "女生",
        gender_right: "男生",
        avatar_url: "../../../resource/img/avatar/avatar.jpg",
        description: "一句话告白",
        academy: "软件学院",
        grade: "大四",
        bubble_left: "左侧测试文本",
        bubble_right: "右侧",
        favorite: false,
        star: true,
        star_num: 666,
        comment_num: 666,
        refresh_flag: "refresh",
        animate: false
      },
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
    },
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
              that.data.cardsItem[cardIndex].animate = true
            } else {
              that.data.cardsItem[cardIndex].animate = false
            }
            that.setData({ cardsItem: that.data.cardsItem })
          })
        })
      }).exec()
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
