// components/wall/card/card.js

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
      value: "../../../resource/img/avatar/default_avatar.png"
    },
    description: {
      type: String,
      value: "告白从心开始"
    },
    academy: String,
    grade: String,
    bubble_left: String,
    bubble_right: String,
    star_num: Number,
    comment_num: Number,
    refresh_flag: String,
    animate: Boolean,
    index: Number,
    unfold_refresh_flag: {
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
    comment_num_flag: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onCardTap: function(e) {
      // console.log("card tap..")
      this.setData({
        unfold: "card-container-unfold"
      })
    },

    // TODO 要绑定 user 和 card间 收藏点赞评论的关系 让对应的icon高亮
    onFavoriteTap: function() {
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
          }
        })
      } else {
        db.collection('behavior').where({
          _openid: app.globalData.openid
        }).get({
          success: function(res) {
            let fresh_favoriteList = res.data[0].favoriteList
            fresh_favoriteList.splice(fresh_favoriteList.indexOf(that.properties.card_id), 1)
            
            wx.cloud.callFunction({
              name: "favorite",
              data: {
                card_id: that.properties.card_id,
                favorite_now: false,
                fresh_favoriteList: fresh_favoriteList
              },
              complete: function(res) {
                console.log("取消收藏成功")
              }
            })

          }
        })
      }

    },
    onStarTap: function() {
      let starNow = this.data.star_flag
      let starNumNow = this.data.star_num_flag
      this.setData({ 
        star_flag: !starNow,
        star_num_flag: starNow ? starNumNow - 1 : starNumNow + 1
      })

      // @BACK √
      let that = this
      if(that.data.star_flag) {
        wx.cloud.callFunction({
          name: "star",
          data: {
            card_id: that.properties.card_id,
            star_now: true
          },
          complete: function(res) {
            console.log("点赞成功")
          }
        })
      } else {
        db.collection('behavior').where({
          _openid: app.globalData.openid,
        }).get({
          success: function(res) {
            let fresh_starList = res.data[0].starList
            fresh_starList.splice(fresh_starList.indexOf(that.properties.card_id), 1)

            wx.cloud.callFunction({
              name: "star",
              data: {
                card_id: that.properties.card_id,
                star_now: false,
                fresh_starList: fresh_starList
              },
              complete: function(res) {
                console.log("取消收藏成功")
              }
            })

          }
        })
      }
    }
  },

  lifetimes: {
    attached: function() {

      // @BACK 如果人的favoriteList中有这个卡 点亮icon
      let that = this
      that.setData({
        star_num_flag: this.properties.star_num
      })

      db.collection('behavior').where({
        _openid: app.globalData.openid
      }).get({
        success: function(res){
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


    },
  },

  observers: {
    'unfold_refresh_flag': function(unfold_refresh_flag) {
      if(unfold_refresh_flag && this.data.unfold=="card-container-unfold") {
        let that = this

        that.setData({
          favorite_flag: false,
          star_flag: false,
          comment_num: false
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

        db.collection('card').where({
          _id: that.data.card_id
        }).get({
          success: function(res) {
            that.setData({ 
              star_num_flag: res.data[0].starNum,
              comment_num_flag: res.data[0].commentNum 
            })
          }
        })

      }
    },
    'refresh_flag': function(fold_class) {
      this.setData({
        unfold: ""   // this is correct
        // unfold: "card-container-unfold"  // for card unfold style
      })
    }
  }
})
