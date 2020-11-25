// components/wall/navigation_system/navigation_system.js

const timeUtil = require('../../../utils/time')
const app = getApp()
const db = wx.cloud.database()
const _ = db.command

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
    },
    filterInfo: {
      type: Object,
      value: null
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
    filter_cards: [],

    world_bottom_show: false,
    my_bottom_show: false,
    favorite_bottom_show: false,
    filter_bottom_show: false,
    filter_info: null,

    init_step: 2,   // 初始/下拉刷新个数
    load_more_step: 1,  // 触底刷新个数
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
      for(let index=0; index<this.data.my_cards.length; ++index){
        this.data.my_cards[index].refresh_flag = "refresh";
      }
      for(let index=0; index<this.data.favorite_cards.length; ++index){
        this.data.favorite_cards[index].refresh_flag = "refresh";
      }
      for(let index=0; index<this.data.filter_cards.length; ++index){
        this.data.filter_cards[index].refresh_flag = "refresh";
      }
      
      let that = this
      this.setData({ 
        world_cards: that.data.world_cards,
        my_cards: that.data.my_cards,
        favorite_cards: that.data.favorite_cards,
        filter_cards: that.data.filter_cards
      })
    },


    /********************** card list logic *******************************/
    initWorldCardList: function() {
      let that = this
      db.collection('card')
      .limit(that.data.init_step)   // 初始加载多少
      .orderBy('timestamp', 'desc')
      .where({
        time: timeUtil.formatDate(new Date())
      })
      .get({
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
    loadMoreWorldCardList: function() {

      this.setData({ show_loading: true })

      let that = this
      db.collection('card')
      .limit(that.data.load_more_step)   // 每次触底新加载多少
      .skip(that.data.world_cards.length)
      .orderBy('timestamp', 'desc')
      .where({
        time: timeUtil.formatDate(new Date())
      })
      .get({
        success: function(res) {
          // @BACK 第一次进入主页时加载主页的卡x张
          
          if(res.data.length == 0) {
            console.log("我是有底线的～")
            that.setData({ 
              world_bottom_show: true,
              show_loading: false 
            })
            return
          }
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
                        
          that.setData({ world_cards: that.data.world_cards.concat(bin_cards) })

          that.adaptHeight()
  
          that.setData({ show_loading: false })
        },
        fail: function(res) {
          console.log("主页加载更多卡片列表出错")
        }
      })
    },


    initMyCardList: function() {
      let that = this
      db.collection('card')
      .limit(that.data.init_step)
      .orderBy('timestamp', 'desc')
      .where({
        _openid: app.globalData.openid
      })
      .get({
        success: function(res) {          
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
          that.setData({ my_cards: bin_cards })
          that.adaptHeight()
        },
        fail: function() {
          console.log("我的空间刷新卡片列表出错")
        }
      })
    },
    loadMoreMyCardList: function() {

      this.setData({ show_loading: true })

      let that = this
      db.collection('card')
      .limit(that.data.load_more_step)
      .skip(that.data.my_cards.length)
      .orderBy('timestamp', 'desc')
      .where({
        _openid: app.globalData.openid
      })
      .get({
        success: function(res) {          
          if(res.data.length == 0) {
            that.setData({ 
              my_bottom_show: true,
              show_loading: false 
            })
            return
          }
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
                        
          that.setData({ my_cards: that.data.my_cards.concat(bin_cards) })

          that.adaptHeight()
  
          that.setData({ show_loading: false })
        },
        fail: function(res) {
          console.log("我的空间加载更多卡片列表出错")
        }
      })
    },

    initFavoriteCardList: function() {
      let that = this
      db.collection('behavior').where({
        _openid: app.globalData.openid
      }).get({
        success: function(res) {
          let favoriteList = res.data[0].favoriteList

          db.collection('card')
          .limit(that.data.init_step)
          .orderBy('timestamp', 'desc')
          .where({
            _id: _.in(favoriteList)
          })
          .get({
            success: function(res) {  
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
              that.setData({ favorite_cards: bin_cards })
              that.adaptHeight()
            },
            fail: function() {
              console.log("收藏刷新卡片列表出错")
            }
          })

        }
      })
    },
    loadMoreFavoriteCardList: function() {
      let that = this
      db.collection('behavior').where({
        _openid: app.globalData.openid
      }).get({
        success: function(res) {
          let favoriteList = res.data[0].favoriteList

          db.collection('card')
          .limit(that.data.load_more_step)
          .skip(that.data.favorite_cards.length)
          .orderBy('timestamp', 'desc')
          .where({
            _id: _.in(favoriteList)
          })
          .get({
            success: function(res) {          
              if(res.data.length == 0) {
                that.setData({ 
                  favorite_bottom_show: true,
                  show_loading: false 
                })
                return
              }
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
                            
              that.setData({ favorite_cards: that.data.favorite_cards.concat(bin_cards) })

              that.adaptHeight()
      
              that.setData({ show_loading: false })
            },
            fail: function(res) {
              console.log("收藏加载更多卡片列表出错")
            }
          })

        }
      })
    },

    initFilterCardList: function() {
      let that = this
      let filterInfo = this.data.filter_info
      db.collection('card')
      .limit(that.data.init_step)
      .orderBy('timestamp', 'desc')
      .where({
        academy: filterInfo.academy=="全部" ? "未知" : filterInfo.academy,
        grade: filterInfo.grade=="全部" ? "未知" : filterInfo.grade,
        time: filterInfo.date,
        myGender: filterInfo.gender_none ? _.in(['男生','女生']) : filterInfo.gender_left,
        taGender: filterInfo.gender_none ? _.in(['男生','女生']) : filterInfo.gender_right
      })
      .get({
        success: function(res) {            
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
          that.setData({ filter_cards: bin_cards })
          that.adaptHeight()

          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1000
          })
        },
        fail: function(res) {
          console.log("搜索卡片列表出错")
        }
      })
    },
    loadMoreFilterCardList: function() {
      this.setData({ show_loading: true })

      let that = this
      let filterInfo = this.data.filter_info
      db.collection('card')
      .limit(that.data.load_more_step)
      .skip(that.data.filter_cards.length)
      .orderBy('timestamp', 'desc')
      .where({
        academy: filterInfo.academy=="全部" ? "未知" : filterInfo.academy,
        grade: filterInfo.grade=="全部" ? "未知" : filterInfo.grade,
        time: filterInfo.date,
        myGender: filterInfo.gender_none ? _.in(['男生','女生']) : filterInfo.gender_left,
        taGender: filterInfo.gender_none ? _.in(['男生','女生']) : filterInfo.gender_right
      })
      .get({
        success: function(res) {          
          if(res.data.length == 0) {
            that.setData({ 
              filter_bottom_show: true,
              show_loading: false 
            })
            return
          }
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
          that.setData({ filter_cards: that.data.filter_cards.concat(bin_cards) })
          that.adaptHeight()
          that.setData({ show_loading: false })
        },
        fail: function(res) {
          console.log("搜索卡片列表出错")
        }
      })
    },

  },
  
  lifetimes: {
    attached: function() {
      this.initWorldCardList()
    },
  },

  observers: {
    'unfold_refresh_flag': function(unfold_refresh_flag) {
      if(unfold_refresh_flag) {
        // console.log("navigation system is signialed")
        this.setData({ unfold_refresh_flag_naviagtion_system : unfold_refresh_flag })
      }
    },
    'filterInfo': function(filterInfo) {
      if(filterInfo) {
        this.setData({ filter_info: filterInfo })
        this.initFilterCardList()
      }
    },
    'currentTab': function(currentTab) {
      this.setData({ 
        navigatorLeft: this.data.currentTab * 25 + "%",
        posLeft_base: this.data.currentTab * -1 + 0.1
      })

      this.setData({
        world_bottom_show: false,
        my_bottom_show: false,
        favorite_bottom_show: false
      })

      // 切换tab时自动滑动到顶端
      this.backToTop()
      this.adaptHeight()

      if(this.data.my_cards.length == 0 && currentTab == 1) {
        this.initMyCardList()
      } else if(this.data.favorite_cards.length ==0 && currentTab == 2) {
        this.initFavoriteCardList()
      }
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
              star_num: bin.starNum,
              comment_num: bin.commentNum,
              refresh_flag: "refresh",
              animate: false
            })
          })
                        
          that.setData({ world_cards: bin_cards })

          that.adaptHeight()
  
        },
        fail: function(res) {
          console.log(res)
        }
      })
        // @BACK 根据不同的tab重新拉取该tab的cards
        switch(this.data.currentTab) {
          case 0: {
            this.initWorldCardList()
            break
          }
          case 1: {
            this.initMyCardList()
            break
          }
          case 2: {
            this.initFavoriteCardList()
            break
          }
          case 3: {
            this.initFilterCardList()
            break
          }
          default: {
            this.initWorldCardList()
            break
          }
        }
      
        this.adaptHeight()
      }
    },
    'reach_bottom_flag_root': function(reach_bottom_flag_root) {
      if(reach_bottom_flag_root) {
        console.log(this.data.currentTab, "加载更多...")

        // @BACK 根据不同的tab拉取触底的新cards
        switch(this.data.currentTab) {
          case 0: {
            this.loadMoreWorldCardList()
            break
          }
          case 1: {
            this.loadMoreMyCardList()
            break
          }
          case 2: {
            this.loadMoreFavoriteCardList()
            break
          }
          case 3: {
            if(this.data.filter_info) {   // 如果用户曾搜索过
              this.loadMoreFilterCardList()
            }
            break
          }
          default: {
            this.loadMoreWorldCardList()
            break
          }
        }

        this.adaptHeight()
      }
    },
  }
})
