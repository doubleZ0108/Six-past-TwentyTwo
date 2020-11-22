// components/wall/navigation_system/navigation_system.js

Component({
  properties: {
    reach_bottom_flag_root: {
      type: Boolean,
      value: false
    },
    pull_down_flag_root: {
      type: Boolean,
      value: false
    }
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

    world_cards: [],
    my_cards: [],
    favorite_cards: [],
    filter_cards: []
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
    },

    /** system level */
    adaptHeight: function() {
      // 高度自适应

      let cardsNum = 0
      let cardHeight = 300
      let blankHeight = 100

      switch(this.data.currentTab) {
        case 0: {
          cardsNum = this.data.world_cards.length
          break
        }
        case 1: {
          cardsNum = this.data.my_cards.length
          break
        }
        case 2: {
          cardsNum = this.data.favorite_cards.length
          break
        }
        case 3: {
          cardsNum = this.data.filter_cards.length
          break
        }
        default: {
          cardsNum = this.data.world_cards.length
        }
      }

      let that = this
      wx.getSystemInfo({
        success: function (res) {
          let calcHeight = res.windowHeight
          that.setData({
            winHeight: calcHeight + cardsNum * cardHeight + blankHeight
          });
        }
      })
    },

    backToTop: function() {
      if (wx.pageScrollTo) {
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 500
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



    initTestCards: function() {
      let cards = [
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
        {
          card_id: 2,
          name_left: "名5",
          name_right: "名字名字6",
          gender_left: "女生",
          gender_right: "女生",
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
      ]
      return cards
    },
    getFreshTestCard: function() {
      return [{
        card_id: 666,
        name_left: "新数据1",
        name_right: "新数据2",
        gender_left: "男生",
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
      }]
    }
  },
  
  lifetimes: {
    attached: function() {
      // @BACK 第一次进入主页时加载主页的卡x张
      this.setData({ world_cards: this.initTestCards() })
      this.adaptHeight()
    },

    ready: function() {
      let that = this;
      const query = wx.createSelectorQuery()

      query.selectAll(".normalcard-group").fields({
        id: true,
        context: true,
        node: true
      }, function (resList) {
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
    'currentTab': function(currentTab) {
      this.setData({ 
        navigatorLeft: this.data.currentTab * 25 + "%",
        posLeft_base: this.data.currentTab * -1 + 0.1
      })

      // @BACK 根据不同的tab重新拉取不同的cards
      switch(currentTab) {
        case 0: {
          this.setData({ world_cards: this.initTestCards() })
          break
        }
        case 1: {
          this.setData({ my_cards: this.initTestCards() })
          break
        }
        case 2: {
          this.setData({ favorite_cards: this.initTestCards() })
          break
        }
        case 3: {
          this.setData({ filter_cards: this.initTestCards() })
          break
        }
        default: {
          this.setData({ world_cards: this.initTestCards() })
          break
        }
      }

      // 切换tab时自动滑动到顶端
      this.backToTop()
    },
    'pull_down_flag_root': function(pull_down_flag_root) {
      if(pull_down_flag_root) {
        console.log(this.data.currentTab, "下拉刷新...")
        
        // @BACK 根据不同的tab重新拉取该tab的cards
        switch(this.data.currentTab) {
          case 0: {
            this.setData({ world_cards: this.initTestCards() })
            break
          }
          case 1: {
            this.setData({ my_cards: this.initTestCards() })
            break
          }
          case 2: {
            this.setData({ favorite_cards: this.initTestCards() })
            break
          }
          case 3: {
            this.setData({ filter_cards: this.initTestCards() })
            break
          }
          default: {
            this.setData({ world_cards: this.initTestCards() })
            break
          }
        }
      
        this.adaptHeight()
      }
    },
    'reach_bottom_flag_root': function(reach_bottom_flag_root) {
      if(reach_bottom_flag_root) {
        console.log(this.data.currentTab, "加载更多...")

        wx.showToast({
          title: '正在加载xx信息',
          icon: 'loading',
          duration: 2000,
          mask: true
        })

        // @BACK 根据不同的tab拉取触底的新cards
        let fresh_cards = this.getFreshTestCard()
        switch(this.data.currentTab) {
          case 0: {
            let fresh_world_cards = this.data.world_cards.concat(fresh_cards)
            this.setData({
              world_cards: fresh_world_cards
            })
            break
          }
          case 1: {
            let fresh_my_cards = this.data.my_cards.concat(fresh_cards)
            this.setData({
              my_cards: fresh_my_cards
            })
            break
          }
          case 2: {
            let fresh_favorite_cards = this.data.favorite_cards.concat(fresh_cards)
            this.setData({
              favorite_cards: fresh_favorite_cards
            })
            break
          }
          case 3: {
            let fresh_filter_cards = this.data.filter_cards.concat(fresh_cards)
            this.setData({
              filter_cards: fresh_filter_cards
            })
            break
          }
          default: {
            let fresh_world_cards = this.data.world_cards.concat(fresh_cards)
            this.setData({
              world_cards: fresh_world_cards
            })
            break
          }
        }

        this.adaptHeight()
      }
    },
  }
})
