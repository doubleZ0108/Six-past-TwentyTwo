// components/wall/navigation_system/navigation_system.js

const app = getApp()
const db = wx.cloud.database()

Component({
  properties: {
    reach_bottom_flag_root: {
      type: Boolean,
      value: false
    },
    pull_down_flag_root: {
      type: Boolean,
      value: false
    },
    unfold_refresh_flag: {
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
    show_loading: false,
    unfold_refresh_flag_naviagtion_system: false,

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
  },
  
  lifetimes: {
    attached: function() {
      let that = this
      db.collection('card').get({
        success: function(res) {
          // @BACK 第一次进入主页时加载主页的卡x张
          
          let bin_cards = []
          res.data.forEach(function(bin){
            bin_cards.push({
              card_id: bin._id,
              name_left: bin.myName,
              name_right: bin.taName,
              gender_left: bin.myGender,
              gender_right: bin.taGender,
              avatar_url: bin.avatarUrl,
              description: bin.textarea,
              academy: bin.academy,
              grade: bin.grade,
              bubble_left: bin.myDescription,
              bubble_right: bin.taDescription,
              refresh_flag: "refresh",
              animate: false
            })
          })
                        
          that.setData({ world_cards: bin_cards })

          that.adaptHeight()
  
        },
        fail: function(res) {
          console.log("主页刷新卡片列表出错")
        }
      })
    },
  },

  observers: {
    'unfold_refresh_flag': function(unfold_refresh_flag) {
      if(unfold_refresh_flag) {
        // console.log("navigation system is signialed")
        this.setData({ unfold_refresh_flag_naviagtion_system : unfold_refresh_flag })
      }
    },
    'currentTab': function(currentTab) {
      this.setData({ 
        navigatorLeft: this.data.currentTab * 25 + "%",
        posLeft_base: this.data.currentTab * -1 + 0.1
      })

      // @BACK 根据不同的tab重新拉取不同的cards
      // switch(currentTab) {
      //   case 0: {
      //     this.setData({ world_cards: this.initTestCards() })
      //     break
      //   }
      //   case 1: {
      //     this.setData({ my_cards: this.initTestCards() })
      //     break
      //   }
      //   case 2: {
      //     this.setData({ favorite_cards: this.initTestCards() })
      //     break
      //   }
      //   case 3: {
      //     this.setData({ filter_cards: this.initTestCards() })
      //     break
      //   }
      //   default: {
      //     this.setData({ world_cards: this.initTestCards() })
      //     break
      //   }
      // }

      // 切换tab时自动滑动到顶端
      this.backToTop()
    },
    'pull_down_flag_root': function(pull_down_flag_root) {
      if(pull_down_flag_root) {
        console.log(this.data.currentTab, "下拉刷新...")

        let that = this
        db.collection('card').get({
          success: function(res) {
            // @BACK 第一次进入主页时加载主页的卡x张
            
            let bin_cards = []
            res.data.forEach(function(bin){
              bin_cards.push({
                card_id: bin._id,
                name_left: bin.myName,
                name_right: bin.taName,
                gender_left: bin.myGender,
                gender_right: bin.taGender,
                avatar_url: bin.avatarUrl,
                description: bin.textarea,
                academy: bin.academy,
                grade: bin.grade,
                bubble_left: bin.myDescription,
                bubble_right: bin.taDescription,
                refresh_flag: "refresh",
                animate: false
              })
            })
                          
            that.setData({ world_cards: bin_cards })

            that.adaptHeight()
    
          },
          fail: function(res) {
            console.log("主页下拉刷新失败")
          }
        })

        // @BACK 根据不同的tab重新拉取该tab的cards
        // switch(this.data.currentTab) {
        //   case 0: {
        //     this.setData({ world_cards: this.initTestCards() })
        //     break
        //   }
        //   case 1: {
        //     this.setData({ my_cards: this.initTestCards() })
        //     break
        //   }
        //   case 2: {
        //     this.setData({ favorite_cards: this.initTestCards() })
        //     break
        //   }
        //   case 3: {
        //     this.setData({ filter_cards: this.initTestCards() })
        //     break
        //   }
        //   default: {
        //     this.setData({ world_cards: this.initTestCards() })
        //     break
        //   }
        // }
      
        this.adaptHeight()
      }
    },
    'reach_bottom_flag_root': function(reach_bottom_flag_root) {
      if(reach_bottom_flag_root) {
        console.log(this.data.currentTab, "加载更多...")

        this.setData({ show_loading: true })
        let that = this
        setTimeout(function() {
          that.setData({ show_loading: false })
        }, 2000)    // TODO 查询后端结束回调

        // @BACK 根据不同的tab拉取触底的新cards
        // let fresh_cards = this.getFreshTestCard()
        // switch(this.data.currentTab) {
        //   case 0: {
        //     let fresh_world_cards = this.data.world_cards.concat(fresh_cards)
        //     this.setData({
        //       world_cards: fresh_world_cards
        //     })
        //     break
        //   }
        //   case 1: {
        //     let fresh_my_cards = this.data.my_cards.concat(fresh_cards)
        //     this.setData({
        //       my_cards: fresh_my_cards
        //     })
        //     break
        //   }
        //   case 2: {
        //     let fresh_favorite_cards = this.data.favorite_cards.concat(fresh_cards)
        //     this.setData({
        //       favorite_cards: fresh_favorite_cards
        //     })
        //     break
        //   }
        //   case 3: {
        //     let fresh_filter_cards = this.data.filter_cards.concat(fresh_cards)
        //     this.setData({
        //       filter_cards: fresh_filter_cards
        //     })
        //     break
        //   }
        //   default: {
        //     let fresh_world_cards = this.data.world_cards.concat(fresh_cards)
        //     this.setData({
        //       world_cards: fresh_world_cards
        //     })
        //     break
        //   }
        // }

        this.adaptHeight()
      }
    },
  }
})
