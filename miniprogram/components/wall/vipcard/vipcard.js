// components/wall/vipcard/vipcard.js

const app = getApp()
const db = wx.cloud.database()

Component({

  properties: {
    posLeft: {
      type: String,
      value: "10%"
    },
    z_index: Number,
    index: Number,

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
      value: "https://7369-six-past-twenty-two-8cvx689cf6da-1304135300.tcb.qcloud.la/in-project-resources/global/logo.svg?sign=c30d5c6d5c9d4fa3c182ef789e2d0953&t=1607785696"
    },
    description: {
      type: String,
      value: "告白从心开始"
    },
    academy: String,
    grade: String,
    bubble_left: String,
    bubble_right: String,
    unfold_refresh_flag: {
      type: Boolean,
      value: false
    },
    pull_down_flag_root: {
      type: Boolean,
      value: false
    },
    prohibit_stretch: {
      type: Boolean,
      value: false
    }
  },

  data: {
    fold_class: "",
    vipcard_height: "290rpx",
    flower_src: null,
    // fold_class: "vipcard-container-unfold",    // for vipcard unfold test
    // vipcard_height: "100vh",
    turn_over_class: "",
    slip_tolerance: 100,  // 手指下滑退出滑动距离最小值
    vipcard_switch_slip_tolerance: -50,
    touchDotX: 0,
    touchDotY: 0,
    smallcard_touchDotX: 0, // 检测小卡片下滑动
    smallcard_touchDotY: 0,

    ios_animate: false,
    android_animate: false,
    vipcard_tap_able: true,


    favorite_flag: false,
    star_flag: false,
    star_num_flag: 0,
    comment_flag: false,
    comment_num_flag: 0,
    prohibit_favorite: false,
    prohibit_star: false,   // 防止点赞过快
    able_navigate: true     // 收藏 点赞完 写完库才可以跳转
  },

  /**
   * 组件的方法列表
   */
  methods: {
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

    onVipCardTap: function() {
      // let fold_now = this.data.fold_class == "" ? "vipcard-container-unfold" : "";
      // this.setData({ fold_class: fold_now })

      this.backToTop()

      if(this.data.fold_class != "vipcard-container-unfold") {
        wx.vibrateShort()
        this.setData({ fold_class: "vipcard-container-unfold" })
      }

      let pages = getCurrentPages()
      let currpage = pages[pages.length-1]
      currpage.setData({
        switch_from_user: true,
        outdrop: true
      })
    },

    onEnvelopTap: function() {
      wx.vibrateShort()

      // let turn_over_now = this.data.turn_over_class=="" ? "envelop-turn-over": ""
      if(this.data.turn_over_class != "envelop-turn-over") {
        this.setData({ turn_over_class: "envelop-turn-over" })
      }
    },

    shrinkCallBack: function() {
      wx.vibrateShort()

      this.setData({ 
        fold_class: "",
        turn_over_class: ""
      })

      let pages = getCurrentPages()
      let currpage = pages[pages.length-1]
      currpage.setData({
        outdrop: false
      })
    },
    touchStart: function(e) {
      if(this.data.fold_class === "vipcard-container-unfold") {
        this.setData({
          touchDotX: e.touches[0].pageX,
          touchDotY: e.touches[0].pageY
        })
      } else {
        this.setData({
          smallcard_touchDotX: e.touches[0].pageX,
          smallcard_touchDotY: e.touches[0].pageY
        })
      }
    },
    touchEnd: function(e) {
      if(this.data.fold_class === "vipcard-container-unfold") {
        let touchMoveX = e.changedTouches[0].pageX
        let touchMoveY = e.changedTouches[0].pageY
        let tmX = touchMoveX - this.data.touchDotX
        let tmY = touchMoveY - this.data.touchDotY

        let absX = Math.abs(tmX)
        let absY = Math.abs(tmY)

        if (absX > 2 * absY) {
          if (tmX<0){
            console.log("左滑=====")
          }else if(tmX > this.data.slip_tolerance) {
            console.log("右滑=====")
            this.shrinkCallBack()
            return
          }
        }
        if (absY > absX * 2) {
          if(tmY < 0){
            console.log("上滑动=====  x")
          } else if(tmY > this.data.slip_tolerance) {
            console.log("下滑动=====")
            this.shrinkCallBack()
            return
          }
        } 

      } else {
        let touchMoveX = e.changedTouches[0].pageX
        let touchMoveY = e.changedTouches[0].pageY
        let tmX = touchMoveX - this.data.smallcard_touchDotX

        if (tmX < this.data.vipcard_switch_slip_tolerance){
          console.log("vip小卡左滑<<<<")
          wx.vibrateShort()
          this.vipcardEffect()
        } else if(tmX > -this.data.vipcard_switch_slip_tolerance) {
          console.log("vip小卡右滑>>>>")
        }

      }
    },

    vipcardEffect: function() {
      let that = this
      let pages = getCurrentPages()
      let currpage = pages[pages.length-1]

      this.setData({ vipcard_tap_able: false })
      currpage.setData({
        prohibit_vipcards_stretch_root: true
      })

      if(app.globalData.platform == "ios") {
        this.setData({ ios_animate: true })
      } else if(app.globalData.platform == "android" || app.globalData.platform == "devtools") {
        this.setData({ android_animate: true })
      } else {
        this.setData({ ios_animate: true }) // ios版本的动画要求比较低
      }
      
      setTimeout(function() {
        /* z-index & blub adaptive */
        currpage.setData({
          switch_vipcard: true,
          which_vipcard_root: that.properties.index
        })
      }, 1700)

      setTimeout(function(){
        that.setData({ vipcard_tap_able: true })
        currpage.setData({
          prohibit_vipcards_stretch_root: false
        })

        if(app.globalData.platform == "ios") {
          that.setData({ ios_animate: false })
        } else if(app.globalData.platform == "android" || app.globalData.platform == "devtools") {
          that.setData({ android_animate: false })
        } else {
          that.setData({ ios_animate: false })
        }
      }, 2500)
    },


    onFavoriteTap: function() {
      wx.vibrateShort()

      this.setData({ 
        able_navigate: false,
        prohibit_favorite: true
      })

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
            that.setData({ 
              able_navigate: true,
              prohibit_favorite: false
            })
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
                that.setData({ 
                  able_navigate: true,
                  prohibit_favorite: false
                })
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
            from_vip: true
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
                from_vip: true
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
    onNavigatorTap: function() {
      wx.vibrateShort()
      
      if(this.data.able_navigate) {
        let that = this
        wx.navigateTo({
          url: "../comment/comment?vipcard=true&cardId=" + that.data.card_id
        })
      }
    },

    /** 卡片底部 favorite star comment 信息 */
    updateVipCardFunctionInfo: function() {
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

      db.collection('vipcard').where({
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
      if(this.properties.card_id.startsWith("_default_vipcard_")) {
        this.setData({
          favorite_flag: true,
          star_flag: true,
          star_num_flag: "999+",
          comment_flag: true,
          comment_num_flag: "999+",
          prohibit_favorite: true,
          prohibit_star: true,
          able_navigate: false 
        })

        return
      }
      this.updateVipCardFunctionInfo()
    }
  },

  observers: {
    'unfold_refresh_flag': function(unfold_refresh_flag) {
      if(unfold_refresh_flag && this.data.fold_class == "vipcard-container-unfold") {
        this.updateVipCardFunctionInfo()
      }
    },
    'gender_left': function(gender_left) {
      if(gender_left == "男生") {
        this.setData({ flower_src: "https://7369-six-past-twenty-two-8cvx689cf6da-1304135300.tcb.qcloud.la/in-project-resources/envelop/blue-flower.png?sign=6b97b87b7c5b0e05eadd48425f2a41c9&t=1607863405" })
      } else if(gender_left == "女生") {
        this.setData({ flower_src: "https://7369-six-past-twenty-two-8cvx689cf6da-1304135300.tcb.qcloud.la/in-project-resources/envelop/pink-flower.png?sign=fcf581affbcaac074b513ec84c8eda7f&t=1607863398" })
      }
    },
    'fold_class': function() {
      let that = this;
      this.setData({
        vipcard_height: that.data.fold_class == "vipcard-container-unfold"? "100vh" : "290rpx",
        posLeft: that.data.fold_class == "vipcard-container-unfold" ? "0" : "10%"
      })
    },
    'pull_down_flag_root': function(pull_down_flag_root) {
      if(pull_down_flag_root) {
        let that = this
        setTimeout(function() {
          that.updateVipCardFunctionInfo()
        }, 3000)
      }
    }
  }
})
