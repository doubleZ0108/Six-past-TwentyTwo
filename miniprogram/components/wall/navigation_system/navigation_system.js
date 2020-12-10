// components/wall/navigation_system/navigation_system.js

const timeUtil = require('../../../utils/time')
const TimingMachine = require('../../../utils/TimingMachine')
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
    },
    switch_vipcard: {
      type: Boolean,
      value: false
    },
    switch_from_user: {
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

    /** 各tab下的数组 */
    world_cards: [],

    my_cards: [],
    my_cards_vip: [],
    my_cards_normal: [],

    favorite_cards: [],
    favorite_cards_vip: [],
    favorite_cards_normal: [],

    filter_cards: [],
    filter_cards_vip: [],
    filter_cards_normal: [],

    /** 主页vipcard控制 */
    vip_card_total: 0,
    vip_cards_zindex: [],
    vip_cards: [],
    vipcard_auto_switch_timer: null,
    which_vipcard: -1,

    /** 底部提示信息 */
    world_bottom: {
      show: false,
      text: "今天没有更多表白了, 这里是有底线的～"
    },
    my_bottom: {
      show: false,
      text: "我没有更多表白了, 这里是有底线的～"
    },
    favorite_bottom: {
      show: false,
      text: "没有更多收藏的表白了, 这里是有底线的～"
    },
    filter_bottom: {
      show: false,
      text: "没有更多搜索到的表白了, 这里是有底线的～"
    },
    filter_info: null,

    init_step: 16,   // 初始/下拉刷新个数
    load_more_step: 10,  // 触底刷新个数
  },

  methods: {
    /** for navigator */
    swichNavigator: function(e) {
      wx.vibrateShort()

      let current = e.currentTarget.dataset.current
      if(this.data.currentTab == current) {
        return false
      } else {
        this.setData({ currentTab: current })
      }
    },

    /** for content */
    switchTab: function(e) {
      wx.vibrateShort()

      if(e.detail.current != this.data.currentTab) {
        this.setData({ currentTab: e.detail.current })
      }
      this.checkBoundary()
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
      let blankHeight = -200

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
          })

          // decorate
          let pages = getCurrentPages()
          let currpage = pages[pages.length-1]
          currpage.setData({
            win_height_root: that.data.winHeight + 300
          })
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

    onDeleteTap: function() {
      wx.navigateTo({
        url: '../delete/delete',
      })
    },


    /********************** card list logic *******************************/
    clearCardList: function() {
      this.setData({
        world_cards: [],
        favorite_cards: [],
        filter_cards: []
      })
    },
    clearBottom: function() {
      // 清空底部状态
      this.setData({
        world_bottom: { 
          show: false
        },
        my_bottom: {
          show: false
        },
        favorite_bottom: {
          show: false
        },
        filter_bottom: {
          show: false
        }
      })
    },

    initWorldCardList: function() {
      let that = this
      this.setData({
        world_cards: []
      })

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
          if(that.data.world_cards.length == 0){
            that.setData({
              world_bottom: {
                show: true,
                text: "今天没有更多表白了, 这里是有底线的～"
              }
            })
          }

          that.adaptHeight()
  
        },
        fail: function(res) {
          console.log("主页刷新卡片列表出错")
        }
      })
    },
    loadMoreWorldCardList: function() {
      this.setData({ 
        show_loading: true,
        world_bottom: { 
          show: false
        }
      })

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
              world_bottom: {
                show: true,
                text: "今天没有更多表白了, 这里是有底线的～"
              },
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
      this.setData({ 
        my_cards: [],
        my_cards_vip: [],
        my_cards_normal: []
      })

      /** vip cards */
      db.collection('vipcard')
      .limit(that.data.init_step)
      .orderBy('timestamp', 'desc')
      .where({
        _openid: app.globalData.openid,
        pay: true
      })
      .get({
        success: function(res) {          
          let bin_vipcards = []
          res.data.forEach(function(bin){
            bin_vipcards.push({
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
              animate: false,
              is_vipcard: true
            })
          })           
          that.setData({ my_cards_vip: bin_vipcards })    

          /** normal cards */
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
                  animate: false,
                  is_vipcard: false
                })
              })         
              that.setData({ my_cards_normal: bin_cards })

              /** concat */
              that.setData({ my_cards: that.data.my_cards_vip.concat(that.data.my_cards_normal) })
              if(that.data.my_cards.length == 0) {
                that.setData({
                  my_bottom: {
                    show: true,
                    text: "我没有更多表白了, 这里是有底线的～"
                  },
                })
              }
              that.adaptHeight()
            },
            fail: function() {
              console.log("我的空间刷新卡片列表出错")
            }
          })

        },
        fail: function() {
          console.log("我的空间刷新vip卡片列表出错")
        }
      })
    
    },
    loadMoreMyCardList: function() {
      this.setData({ 
        show_loading: true,
        my_bottom: {
          show: false
        }
      })
      let that = this

      /** vip cards */
      db.collection('vipcard')
      .limit(that.data.load_more_step)
      .skip(that.data.my_cards_vip.length)
      .orderBy('timestamp', 'desc')
      .where({
        _openid: app.globalData.openid,
        pay: true
      })
      .get({
        success: function(res) {
          let bin_vipcards = []
          res.data.forEach(function(bin){
            bin_vipcards.push({
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
              animate: false,
              is_vipcard: true
            })
          })
                        
          that.setData({ 
            my_cards_vip: that.data.my_cards_normal.concat(bin_vipcards),
            my_cards: that.data.my_cards.concat(bin_vipcards)
          })

          /** normal card */
          db.collection('card')
          .limit(that.data.load_more_step)
          .skip(that.data.my_cards_normal.length)
          .orderBy('timestamp', 'desc')
          .where({
            _openid: app.globalData.openid
          })
          .get({
            success: function(res) {          
              if(res.data.length == 0) {
                that.setData({ 
                  my_bottom: {
                    show: true,
                    text: "我没有更多表白了, 这里是有底线的～"
                  },
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
                  animate: false,
                  is_vipcard: false
                })
              })
                            
              that.setData({ 
                my_cards_normal: that.data.my_cards_normal.concat(bin_cards),
                my_cards: that.data.my_cards.concat(bin_cards)
              })

              that.adaptHeight()
      
              that.setData({ show_loading: false })
            },
            fail: function(res) {
              console.log("我的空间加载更多卡片列表出错")
            }
          })
        
        },
        fail: function(res) {
          console.log("我的空间加载更多vip卡片列表出错")
        }
      })

    },

    initFavoriteCardList: function() {
      let that = this
      this.setData({ 
        favorite_cards: [],
        favorite_cards_vip: [],
        favorite_cards_normal: []
      })

      db.collection('behavior').where({
        _openid: app.globalData.openid
      }).get({
        success: function(res) {
          let favoriteList = res.data[0].favoriteList

          /** vip cards */
          db.collection('vipcard')
          .limit(that.data.init_step)
          .orderBy('timestamp', 'desc')
          .where({
            _id: _.in(favoriteList),
            pay: true
          })
          .get({
            success: function(res) {  
              let bin_vipcards = []
              res.data.forEach(function(bin){
                bin_vipcards.push({
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
                  animate: false,
                  is_vipcard: true
                })
              })         
              that.setData({ favorite_cards_vip: bin_vipcards })

              /** normal cards */
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
                      animate: false,
                      is_vipcard: false
                    })
                  })         
                  that.setData({ favorite_cards_normal: bin_cards })

                  /** concat */
                  that.setData({ favorite_cards: that.data.favorite_cards_vip.concat(that.data.favorite_cards_normal) })
                  if(that.data.favorite_cards.length == 0) {
                    that.setData({
                      favorite_bottom: {
                        show: true,
                        text: "没有更多收藏的表白了, 这里是有底线的～"
                      },
                    })
                  }
                  that.adaptHeight()
                },
                fail: function() {
                  console.log("收藏刷新卡片列表出错")
                }
              })

            },
            fail: function() {
              console.log("收藏刷新vip卡片列表出错")
            }
          })
              
        }
      })
    
    },
    loadMoreFavoriteCardList: function() {
      let that = this
      this.setData({ 
        show_loading: true,
        favorite_bottom: {
          show: false
        }
      })

      db.collection('behavior').where({
        _openid: app.globalData.openid
      }).get({
        success: function(res) {
          let favoriteList = res.data[0].favoriteList

          /** vip card */
          db.collection('vipcard')
          .limit(that.data.load_more_step)
          .skip(that.data.favorite_cards_vip.length)
          .orderBy('timestamp', 'desc')
          .where({
            _id: _.in(favoriteList),
            pay: true
          })
          .get({
            success: function(res) {          
              let bin_vipcards = []
              res.data.forEach(function(bin){
                bin_vipcards.push({
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
                  animate: false,
                  is_vipcard: true
                })
              })
                            
              that.setData({ 
                favorite_cards_vip: that.data.favorite_cards_vip.concat(bin_vipcards),
                favorite_cards: that.data.favorite_cards.concat(bin_vipcards)
              })

              /** normal card */
              db.collection('card')
              .limit(that.data.load_more_step)
              .skip(that.data.favorite_cards_normal.length)
              .orderBy('timestamp', 'desc')
              .where({
                _id: _.in(favoriteList)
              })
              .get({
                success: function(res) {          
                  if(res.data.length == 0) {
                    that.setData({ 
                      favorite_bottom: {
                        show: true,
                        text: "没有更多收藏的表白了, 这里是有底线的～"
                      },
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
                      animate: false,
                      is_vipcard: false
                    })
                  })
                                
                  that.setData({ 
                    favorite_cards_normal: that.data.favorite_cards_normal.concat(bin_cards),
                    favorite_cards: that.data.favorite_cards.concat(bin_cards)
                  })

                  that.adaptHeight()
        
                  that.setData({ show_loading: false })
                },
                fail: function(res) {
                  console.log("收藏加载更多卡片列表出错")
                }
              })


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
      this.setData({
        filter_cards: [],
        filter_cards_vip: [],
        filter_cards_normal: []
      })

      /** vip cards */
      db.collection('vipcard')
      .limit(that.data.init_step)
      .orderBy('timestamp', 'asc')
      .where({
        academy: filterInfo.academy=="全部" ? _.in(["未知"].concat(app.globalData.academy_array)) : filterInfo.academy,
        grade: filterInfo.grade=="全部" ? _.in(["未知"].concat(app.globalData.grade_array)) : filterInfo.grade,
        time: filterInfo.date,
        myGender: filterInfo.gender_none ? _.in(['男生','女生']) : filterInfo.gender_left,
        taGender: filterInfo.gender_none ? _.in(['男生','女生']) : filterInfo.gender_right,
        pay: true
      })
      .get({
        success: function(res) {            
          let bin_vipcards = []
          res.data.forEach(function(bin){
            bin_vipcards.push({
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
              animate: false,
              is_vipcard: true
            })
          })                 
          that.setData({ filter_cards_vip: bin_vipcards })

          /** normal cards */
          db.collection('card')
          .limit(that.data.init_step)
          .orderBy('timestamp', 'asc')
          .where({
            academy: filterInfo.academy=="全部" ? _.in(["未知"].concat(app.globalData.academy_array)) : filterInfo.academy,
            grade: filterInfo.grade=="全部" ? _.in(["未知"].concat(app.globalData.grade_array)) : filterInfo.grade,
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
                  animate: false,
                  is_vipcard: false
                })
              })                 
              that.setData({ filter_cards_normal: bin_cards })
              
              that.setData({ filter_cards: that.data.filter_cards_vip.concat(that.data.filter_cards_normal) })
              if(that.data.filter_cards.length == 0) {
                that.setData({
                  filter_bottom: {
                    show: true,
                    text: "没有更多搜索到的表白了, 这里是有底线的～"
                  }
                })
              }

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
        fail: function(res) {
          console.log("搜索vip卡片列表出错")
        }
      })

    },
    loadMoreFilterCardList: function() {
      this.setData({ 
        show_loading: true,
        filter_bottom: {
          show: false
        }
      })

      let that = this
      let filterInfo = this.data.filter_info

      /** vip cards */
      db.collection('vipcard')
      .limit(that.data.load_more_step)
      .skip(that.data.filter_cards_vip.length)
      .orderBy('timestamp', 'asc')
      .where({
        academy: filterInfo.academy=="全部" ? _.in(["未知"].concat(app.globalData.academy_array)) : filterInfo.academy,
        grade: filterInfo.grade=="全部" ? _.in(["未知"].concat(app.globalData.grade_array)) : filterInfo.grade,
        time: filterInfo.date,
        myGender: filterInfo.gender_none ? _.in(['男生','女生']) : filterInfo.gender_left,
        taGender: filterInfo.gender_none ? _.in(['男生','女生']) : filterInfo.gender_right,
        pay: true
      })
      .get({
        success: function(res) {          
          let bin_vipcards = []
          res.data.forEach(function(bin){
            bin_vipcards.push({
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
              animate: false,
              is_vipcard: true
            })
          })               
          that.setData({ 
            filter_cards_vip: that.data.filter_cards_vip.concat(bin_vipcards),
            filter_cards: that.data.filter_cards.concat(bin_vipcards)
          })

          /** normal cards */
          db.collection('card')
          .limit(that.data.load_more_step)
          .skip(that.data.filter_cards_normal.length)
          .orderBy('timestamp', 'asc')
          .where({
            academy: filterInfo.academy=="全部" ? _.in(["未知"].concat(app.globalData.academy_array)) : filterInfo.academy,
            grade: filterInfo.grade=="全部" ? _.in(["未知"].concat(app.globalData.grade_array)) : filterInfo.grade,
            time: filterInfo.date,
            myGender: filterInfo.gender_none ? _.in(['男生','女生']) : filterInfo.gender_left,
            taGender: filterInfo.gender_none ? _.in(['男生','女生']) : filterInfo.gender_right
          })
          .get({
            success: function(res) {          
              if(res.data.length == 0) {
                that.setData({ 
                  filter_bottom: {
                    show: true,
                    text: "没有更多搜索到的表白了, 这里是有底线的～"
                  },
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
                  animate: false,
                  is_vipcard: false
                })
              })               
              that.setData({ 
                filter_cards_normal: that.data.filter_cards_normal.concat(bin_cards),
                filter_cards: that.data.filter_cards.concat(bin_cards)
              })

              that.adaptHeight()
              that.setData({ show_loading: false })
            },
            fail: function(res) {
              console.log("搜索卡片列表出错")
            }
          })
        
        },
        fail: function(res) {
          console.log("搜索vip卡片列表出错")
        }
      })
    
    },


    initVipCardEffect: function() {
      /** vipcard init */

      clearInterval(this.data.vipcard_auto_switch_timer)
      this.setData({
        vipcard_auto_switch_timer: null,
      })
      let buf_vip_cards_zindex = []
      for(let i=this.data.vip_card_total; i>0; --i) {
        buf_vip_cards_zindex.push(i+1)
      }

      let that = this
      this.setData({
        vip_cards_zindex: buf_vip_cards_zindex,
        which_vipcard: -1,
        vipcard_auto_switch_timer: setInterval(function(){
          that.setData({
            which_vipcard: (that.data.which_vipcard + 1) % that.data.vip_card_total,
          })
        }, 5000),   // double time
      })
       
    },
    initStartDefaultVipCard: function() {
      let default_vipcard = {
        card_id: "_default_vipcard_001",
        name_left: "22:06",
        name_right: "同济大学",
        gender_left: "男生",
        gender_right: "女生",
        // avatar_url: "../../../resource/img/avatar/avatar.jpg",
        avatar_url: "https://636b-ckkkx-7gnxqsp7c5938afc-1304135300.tcb.qcloud.la/in-project-resources/avatar/avatar.jpg?sign=12591de976e2d2dec98b48bac7733efd&t=1606878954",
        description: "这里是对同济的❤️和磕衿提示",
        academy: "软件学院",
        grade: "大四",
        bubble_left: "左气泡内容",
        bubble_right: "左气泡内容",
      }
      return default_vipcard
    },
    initEndDefaultVipCard: function() {
      let default_vipcard = {
        card_id: "_default_vipcard_100",
        name_left: "22:06",
        name_right: "16分钟",
        gender_left: "男生",
        gender_right: "女生",
        // avatar_url: "../../../resource/img/avatar/avatar.jpg",
        avatar_url: "https://636b-ckkkx-7gnxqsp7c5938afc-1304135300.tcb.qcloud.la/in-project-resources/avatar/avatar.jpg?sign=12591de976e2d2dec98b48bac7733efd&t=1606878954",
        description: "这里是结束的card",
        academy: "软件学院",
        grade: "大四",
        bubble_left: "左气泡内容",
        bubble_right: "左气泡内容",
      }
      return default_vipcard
    },
    initDefaultVipCardList: function() {
      this.setData({ vip_cards: [] })

      let bin_cards = []
      bin_cards.unshift(this.initStartDefaultVipCard())
      bin_cards.push(this.initEndDefaultVipCard())

      this.setData({ 
        vip_cards: bin_cards,
        vip_card_total: bin_cards.length
      })
      this.initVipCardEffect()
    },
    initVipCardList: function() {
      let that = this
      db.collection('vipcard')
      .limit(20)   // TODO 这里应该没限制
      .where({
        time: timeUtil.formatDate(new Date())
      })
      .orderBy('timestamp', 'asc')
      .get({
        success: function(res) {          
          let bin_cards = []
          res.data.forEach(function(bin){
            if(bin.pay) {
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
              })
            }
          })
   
          bin_cards.unshift(that.initStartDefaultVipCard())
          bin_cards.push(that.initEndDefaultVipCard())

          that.setData({ 
            vip_cards: bin_cards,
            vip_card_total: bin_cards.length
          })
          that.initVipCardEffect()
        },
        fail: function() {
          console.log("刷新vip卡片列表出错")
        }
      })
    },
  },
  
  lifetimes: {
    attached: function() {
      if(TimingMachine.checkingTime()) {
        this.initWorldCardList()
        if(this.data.world_cards.length == 0) {
          this.setData({ 
            world_bottom: {
              show: true,
              text: "今天没有更多表白了, 这里是有底线的～"
            }
          })
        }
        this.initVipCardList()
      } else {
        this.clearCardList()
        this.initDefaultVipCardList()
        this.setData({
          world_bottom: {
            show: true,
            text: TimingMachine.getSystemCloseWord(0)
          }
        })
      }
    },
  },

  observers: {
    'unfold_refresh_flag': function(unfold_refresh_flag) {  // 用于控制只有一张卡会展开，某一个展开时其余关闭
      if(unfold_refresh_flag) {
        // console.log("navigation system is signialed")
        this.setData({ unfold_refresh_flag_naviagtion_system : unfold_refresh_flag })
      }
    },
    'filterInfo': function(filterInfo) {    // 接受filter传递的信息 在navigation system中产生filter cards
      if(filterInfo) {
        if(TimingMachine.checkingTime()) {
          this.setData({ 
            filter_info: filterInfo,
            filter_bottom: {
              show: false
            }
          })
          this.initFilterCardList()
          if(this.data.filter_cards.length == 0) {
            this.setData({
              filter_bottom: {
                show: true,
                text: "没有更多搜索到的表白了, 这里是有底线的～"
              }
            })
          }
        } else {
          this.setData({
            filter_cards: [],
            filter_bottom: {
              show: true,
              text: TimingMachine.getSystemCloseWord(3)
            }
          })
        }
      }
    },
    'switch_vipcard': function(switch_vipcard) {  // 控制vipcard层级
      if(switch_vipcard) {
        let that = this
        this.setData({
          vip_cards_zindex: [that.data.vip_cards_zindex.pop()].concat(that.data.vip_cards_zindex)
        })
      }
    },
    'switch_from_user': function(switch_from_user) {    // 当用户自行切换vipcard时停止卡片轮播定时器
      if(switch_from_user) {
        clearInterval(this.data.vipcard_auto_switch_timer)
        this.setData({
          vipcard_auto_switch_timer: null,
        })
      }
    },
    'currentTab': function(currentTab) {    // 监听tab切换，
      this.setData({ 
        navigatorLeft: this.data.currentTab * 25 + "%",
        posLeft_base: this.data.currentTab * -1 + 0.1
      })

      this.clearBottom()
      
      // 切换tab时自动滑动到顶端
      this.backToTop()
      this.adaptHeight()

      // wave position
      let pages = getCurrentPages()
      let currpage = pages[pages.length-1]
      currpage.setData({
        current_tab: currentTab
      })

      // 不在规定时间内
      if(!TimingMachine.checkingTime()) {
        this.clearCardList()
        switch(currentTab) {
          case 0: {
            this.setData({
              world_bottom: {
                show: true,
                text: TimingMachine.getSystemCloseWord(0)
              }
            })
            break
          }
          case 2: {
            this.setData({
              favorite_bottom: {
                show: true,
                text: TimingMachine.getSystemCloseWord(2)
              }
            })
            break
          }
          case 3: {
            this.setData({
              filter_bottom: {
                show: true,
                text: TimingMachine.getSystemCloseWord(3)
              }
            })
            break
          }
        }
      } else {
        if(currentTab==0 && this.data.world_cards.length == 0) {
          this.setData({ 
            world_bottom: {
              show: true,
              text: "今天没有更多表白了, 这里是有底线的～"
            }
          })
        } else if(currentTab==3 && this.data.filter_cards.length == 0) {
          this.setData({
            filter_bottom: {
              show: true,
              text: "没有更多搜索到的表白了, 这里是有底线的～"
            }
          })
        }
      }

      if(this.data.my_cards.length == 0 && currentTab == 1) {
        this.initMyCardList()
      } else if(this.data.favorite_cards.length ==0 && currentTab == 2 && TimingMachine.checkingTime()) {
        this.initFavoriteCardList()
      }
    },
    'pull_down_flag_root': function(pull_down_flag_root) {  // 监听下拉刷新
      if(pull_down_flag_root) {
        console.log(this.data.currentTab, "下拉刷新...")

        this.clearBottom()
        this.backToTop()
 
        // @BACK 根据不同的tab重新拉取该tab的cards
        if(TimingMachine.checkingTime()) {
          switch(this.data.currentTab) {
            case 0: {
              this.initWorldCardList()
              this.initVipCardList()
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
            case 3 : {
              this.setData({
                filter_bottom: {
                  show: true,
                  text: "没有更多搜索到的表白了, 这里是有底线的～"
                },
              })
            }
          }
        } else {
          this.clearCardList()
          switch(this.data.currentTab) {
            case 0: {
              this.setData({
                world_bottom: {
                  show: true,
                  text: TimingMachine.getSystemCloseWord(0)
                }
              })
              break
            }
            case 1: {
              this.initMyCardList()
              break
            }
            case 2: {
              this.setData({
                favorite_bottom: {
                  show: true,
                  text: TimingMachine.getSystemCloseWord(2)
                }
              })
              break
            }
            case 3: {
              this.setData({
                filter_bottom: {
                  show: true,
                  text: TimingMachine.getSystemCloseWord(3)
                }
              })
              break
            }
          }
        }
      
        this.adaptHeight()
      }
    },
    'reach_bottom_flag_root': function(reach_bottom_flag_root) {  // 监听触底
      if(reach_bottom_flag_root) {
        wx.vibrateShort()

        console.log(this.data.currentTab, "加载更多...")

        this.clearBottom()

        // @BACK 根据不同的tab拉取触底的新cards
        if(TimingMachine.checkingTime()) {
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
              } else {
                this.setData({ 
                  filter_bottom: {
                    show: true,
                    text: "没有更多搜索到的表白了, 这里是有底线的～"
                  }
                })
              }
              break
            }
          }
        } else {
          this.clearCardList()
          switch(this.data.currentTab) {
            case 0: {
              this.setData({
                world_bottom: {
                  show: true,
                  text: TimingMachine.getSystemCloseWord(0)
                }
              })
              break
            }
            case 1: {
              this.loadMoreMyCardList()
              break
            }
            case 2: {
              this.setData({
                favorite_bottom: {
                  show: true,
                  text: TimingMachine.getSystemCloseWord(2)
                }
              })
              break
            }
            case 3: {
              this.setData({
                filter_bottom: {
                  show: true,
                  text: TimingMachine.getSystemCloseWord(3)
                }
              })
              break
            }
          }
        }

        this.adaptHeight()
      }
    },
  }
})
