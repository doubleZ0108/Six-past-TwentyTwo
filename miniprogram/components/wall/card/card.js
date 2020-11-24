// components/wall/card/card.js

const app = getApp()
const db = wx.cloud.database()

Component({
  /**
   * 组件的属性列表
   */
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
    favorite: Boolean,
    star: Boolean,
    star_num: Number,
    comment_num: Number,
    refresh_flag: String,
    animate: Boolean,
    index: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    unfold: "",
    favorite_flag: false,
    star_flag: false,
    star_num_flag: 0
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
      // @BACK

      that = this
      if(that.data.favorite_flag) {
        wx.cloud.callFunction({
          name: "favorite",
          data: {
            card_id: that.properties.card_id,
            favorite_now: true
          },
          complete: function(res) {
            console.log("点赞成功")
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
                console.log("取消点赞成功")
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

      // @BACK

    }
  },

  lifetimes: {
    attached: function() {
      this.setData({
        favorite_flag: this.properties.favorite,
        star_flag: this.properties.star,
        star_num_flag: this.properties.star_num
      })
    },
  },

  observers: {
    'refresh_flag': function(fold_class) {
      this.setData({
        unfold: ""   // this is correct
        // unfold: "card-container-unfold"  // for card unfold style
      })
    }
  }
})
