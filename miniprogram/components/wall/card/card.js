// components/wall/card/card.js

const TimingMachine = require('../../../utils/TimingMachine')
const app = getApp()
const db = wx.cloud.database()

Component({

  properties: {
    card_id: String,
    name_left: {
      type: String,
      value: "PersonLeft"
    },
    name_right: {
      type: String,
      value: "PersonRight"
    },
    gender_left: {
      type: String,
      value: "男生"
    },
    gender_right: {
      type: String,
      value: "女生"
    },
    avatar_url: {
      type: String,
      // value: "../../../resource/img/avatar/default_avatar.png"
      value: "https://7369-six-past-twenty-two-8cvx689cf6da-1304135300.tcb.qcloud.la/in-project-resources/avatar/default_avatar.png?sign=945a1986bfcc43cbe57e6c7f3558e1cf&t=1607586968"
    },
    description: {
      type: String,
      value: "告白从心开始"
    },
    academy: String,
    grade: String,
    bubble_left: String,
    bubble_right: String,
    refresh_flag: String,
    animate: Boolean,
    index: Number,
    unfold_refresh_flag: {
      type: Boolean,
      value: false
    },
    pull_down_flag_root: {
      type: Boolean,
      value: false
    },
    is_vipcard: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    unfold: "",
    favorite_flag: false,
    star_flag: false,
    star_num_flag: 0,
    comment_flag: false,
    comment_num_flag: 0,

    prohibit_star: false,   // 防止点赞过快
    able_navigate: true     // 收藏 点赞完 写完库才可以跳转
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onCardTap: function(e) {
      wx.vibrateShort()

      this.setData({
        unfold: "card-container-unfold"
      })
    },

    // TODO 要绑定 user 和 card间 收藏点赞评论的关系 让对应的icon高亮
    onFavoriteTap: function() {
      wx.vibrateShort()

      this.setData({ able_navigate: false })

      let that = this
      this.setData({ favorite_flag: !that.data.favorite_flag })

      // @BACK √
      that = this
      if(that.data.favorite_flag) {
        wx.cloud.callFunction({
          name: "favorite",
          data: {
            card_id: that.properties.card_id,
            favorite_now: true
          },
          complete: function(res) {
            console.log("收藏成功")
            that.setData({ able_navigate: true })
          }
        })
      } else {
        db.collection('behavior').where({
          _openid: app.globalData.openid
        }).get({
          success: function(res) {
            let fresh_favoriteList = res.data[0].favoriteList
            fresh_favoriteList.splice(fresh_favoriteList.indexOf(that.properties.card_id), 1)
            fresh_favoriteList = Array.from(new Set(fresh_favoriteList))  // 去重 防止收藏有两遍
            
            wx.cloud.callFunction({
              name: "favorite",
              data: {
                card_id: that.properties.card_id,
                favorite_now: false,
                fresh_favoriteList: fresh_favoriteList
              },
              complete: function(res) {
                console.log("取消收藏成功")
                that.setData({ able_navigate: true })
              }
            })

          }
        })
      }

    },
    onStarTap: function() {
      wx.vibrateShort()

      this.setData({ able_navigate: false })

      let that = this
      this.setData({ 
        star_flag: !that.data.star_flag,
        prohibit_star: true
      })

      that = this
      this.setData({
        star_num_flag: that.data.star_flag ? that.data.star_num_flag + 1 : that.data.star_num_flag - 1
      })

      // @BACK √
      that = this
      if(that.data.star_flag) {
        wx.cloud.callFunction({
          name: "star",
          data: {
            card_id: that.properties.card_id,
            star_now: true,
            from_vip: that.properties.is_vipcard
          },
          complete: function(res) {
            console.log("点赞成功")
            that.setData({ 
              prohibit_star: false,
              able_navigate: true
            })
          }
        })
      } else {
        db.collection('behavior').where({
          _openid: app.globalData.openid,
        }).get({
          success: function(res) {
            let fresh_starList = res.data[0].starList
            fresh_starList.splice(fresh_starList.indexOf(that.properties.card_id), 1)
            fresh_starList = Array.from(new Set(fresh_starList))

            wx.cloud.callFunction({
              name: "star",
              data: {
                card_id: that.properties.card_id,
                star_now: false,
                fresh_starList: fresh_starList,
                from_vip: that.properties.is_vipcard
              },
              complete: function(res) {
                console.log("取消收藏成功")
                that.setData({ 
                  prohibit_star: false,
                  able_navigate: true
                })
              }
            })

          }
        })
      }

    },

    navigateCallBack: function() {
      let that = this
      if(this.data.is_vipcard) {
        wx.navigateTo({
          url: "../comment/comment?vipcard=true&cardId=" + that.data.card_id
        })
      } else {
        wx.navigateTo({
          url: "../comment/comment?cardId=" + that.data.card_id
        })
      }
    },
    onNavigatorTap: function() {
      wx.vibrateShort()
      
      if(this.data.able_navigate) {

        let pages = getCurrentPages()
        let currpage = pages[pages.length-1]

        if(currpage.data.current_tab == 1) {   // 我的主页随时都可以跳转
          this.navigateCallBack()
        } else {
          if(TimingMachine.checkingTime()) {    // 时间ok的话其他界面可以跳转评论
            this.navigateCallBack()
          } else {
            // 开放结束点击跳转界面强制刷新
            currpage.setData({
              pull_down_flag: true
            })
          }
        }
  
      }
    },

    /** 卡片底部 favorite star comment 信息 */
    updateCardFunctionInfo: function() {
      let that = this

      that.setData({
        favorite_flag: false,
        star_flag: false,
        comment_num: false,
        prohibit_star: true
      })

      db.collection('behavior').where({
        _openid: app.globalData.openid
      }).get({
        success: function(res) {
          let userBehavior = res.data[0]
          if(userBehavior.favoriteList.indexOf(that.data.card_id) != -1) {
            that.setData({ favorite_flag: true })
          }
          if(userBehavior.starList.indexOf(that.data.card_id) != -1) {
            that.setData({ star_flag: true })
          }
          if(userBehavior.commentList.indexOf(that.data.card_id) != -1) {
            that.setData({ comment_flag: true })
          }
        }
      })

      db.collection(that.data.is_vipcard ? 'vipcard' : 'card').where({
        _id: that.data.card_id
      }).get({
        success: function(res) {
          let cardInfo = res.data[0]
          that.setData({ 
            star_num_flag: cardInfo.starNum,
            comment_num_flag: cardInfo.commentNum,
            prohibit_star: false
          })
        }
      })

    }
  },

  lifetimes: {
    attached: function() {
      // @BACK 如果人的favoriteList中有这个卡 点亮icon
      this.updateCardFunctionInfo()
    },
  },

  observers: {
    'unfold_refresh_flag': function(unfold_refresh_flag) {
      if(unfold_refresh_flag && this.data.unfold=="card-container-unfold") {
        this.updateCardFunctionInfo()
      }
    },
    'refresh_flag': function(fold_class) {
      this.setData({
        unfold: ""   // this is correct
        // unfold: "card-container-unfold"  // for card unfold style
      })
    },
    'pull_down_flag_root': function(pull_down_flag_root) {
      if(pull_down_flag_root) {
        this.updateCardFunctionInfo()
      }
    }
  }
})
