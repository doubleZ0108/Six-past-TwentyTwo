// miniprogram/pages/comment/comment.js

const timeUtil = require('../../utils/time')
const app = getApp()
const db = wx.cloud.database()

Page({

  data: {
    toptip: {
      msg: "",
      type: "success",
      show: false
    },
    commentItem: [],
    textarea: "",
    fromVip: false,
    cardInfo: {},
    favorite_flag: false,
    star_flag: false,
    star_num_flag: 0,

    prohibit_star: false,
    prohibit_comment: false,
    has_content: false   // 监听键盘blur
  },

  handleIntersectionObserver: function() {
    let that = this
    const query = wx.createSelectorQuery()
    query.selectAll(".comment-group").fields({
      id: true,
      context: true,
      node: true
    }, function (resList) {
      resList.forEach((res)=>{
        wx.createIntersectionObserver().relativeToViewport().observe('#'+res.id, (node) => {
          let commentIndex = parseInt(res.id.substr(8))
          // 仅第一次进行observe 播放动画
          if(node.intersectionRatio != 0) {
            that.data.commentItem[commentIndex].animate = true
            wx.createIntersectionObserver().relativeToViewport().disconnect('#'+res.id)
          } 
          that.setData({ commentItem: that.data.commentItem })
        })
      })
    }).exec()

  },

  onTextareaInput: function(e) {
    this.setData({ 
      textarea: e.detail.value,
    })
    this.setData({
      has_content: this.data.textarea.length!=0 ? true : false
    })
  },

  commentSubmit: function() {
    let that = this

    if(that.data.textarea == "") {
      wx.vibrateLong()

      that.setData({ 
        toptip: {
          msg: "请填写你的评论:)",
          type: "error",
          show: true
        }
      })
    } else {
      wx.vibrateShort()

      that.setData({
        prohibit_comment: true
      })

      let timeNow = new Date()
      let commentData = {
        comment: that.data.textarea,
        openid: app.globalData.openid,
        time: timeNow,
        avatarUrl: app.globalData.userInfo.avatarUrl,
        nickName: app.globalData.userInfo.nickName,
      }

      let fresh_commentItem = {
        avatarSrc: app.globalData.userInfo.avatarUrl,
        name: app.globalData.userInfo.nickName,
        content: that.data.textarea,
        animate: false
      }

      that.setData({
         commentItem: that.data.commentItem.concat([fresh_commentItem])
      })

      that.handleIntersectionObserver()

      // @BACK √
      wx.cloud.callFunction({
        name: "comment",
        data: {
          cardId: that.data.cardInfo.card_id,
          commentData: commentData,
          from_vip: that.data.fromVip
        },
        complete: function() {
          that.setData({ 
            textarea: "",
            prohibit_comment: false,
            has_content: false,
            toptip: {
              msg: "评论成功～",
              type: "success",
              show: true
            },
          })
        }
      })

    }
  },

  onFavoriteTap: function() {
    wx.vibrateShort()

    let that = this
    this.setData({ favorite_flag: !that.data.favorite_flag })

    // @BACK
    that = this
    if(that.data.favorite_flag) {
      wx.cloud.callFunction({
        name: "favorite",
        data: {
          card_id: that.data.cardInfo.card_id,
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
          fresh_favoriteList.splice(fresh_favoriteList.indexOf(that.data.cardInfo.card_id), 1)
          fresh_favoriteList = Array.from(new Set(fresh_favoriteList))

          wx.cloud.callFunction({
            name: "favorite",
            data: {
              card_id: that.data.cardInfo.card_id,
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
    wx.vibrateShort()

    let starNow = this.data.star_flag
    let starNumNow = this.data.star_num_flag
    this.setData({ 
      star_flag: !starNow,
      star_num_flag: starNow ? starNumNow - 1 : starNumNow + 1,
      prohibit_star: true
    })

    // @BACK
    let that = this
    if(that.data.star_flag) {
      wx.cloud.callFunction({
        name: "star",
        data: {
          card_id: that.data.cardInfo.card_id,
          star_now: true,
          from_vip: that.data.fromVip
        },
        complete: function(res) {
          console.log("点赞成功")
          that.setData({ prohibit_star: false })
        }
      })
    } else {
      db.collection('behavior').where({
        _openid: app.globalData.openid,
      }).get({
        success: function(res) {
          let fresh_starList = res.data[0].starList
          fresh_starList.splice(fresh_starList.indexOf(that.data.cardInfo.card_id), 1)
          fresh_starList = Array.from(new Set(fresh_starList))
          
          wx.cloud.callFunction({
            name: "star",
            data: {
              card_id: that.data.cardInfo.card_id,
              star_now: false,
              fresh_starList: fresh_starList,
              from_vip: that.data.fromVip
            },
            complete: function(res) {
              console.log("取消收藏成功")
              that.setData({ prohibit_star: false })
            }
          })

        }
      })
    }
  },

  initCommentList: function() {
    let that = this
    db.collection('comment')
    .orderBy('time', 'asc')
    .where({
      cardId: that.data.card_id
    })
    .get({
      success: function(res) {
        let commentList = res.data[0].commentList
        commentList.forEach(function(comment) {
          that.setData({
            commentItem: that.data.commentItem.concat({
              avatarSrc: comment.avatarUrl,
              name: comment.nickName,
              content: comment.comment,
              animate: false
            })
          })
        })
        that.handleIntersectionObserver()
      }
    })
  },

  onLoad: function (options) {
    this.setData({ card_id: options.cardId })

    if(options.vipcard) {
      this.setData({ fromVip: true })
    }

    let that = this
    /** card info */
    db.collection(options.vipcard ? 'vipcard' : 'card').where({
      _id: options.cardId
    }).get({
      success: function(res){
        let cardData = res.data[0]
        that.setData({
          cardInfo: {
            card_id: options.cardId,
            name_left: cardData.myName,
            name_right: cardData.taName,
            academy: cardData.academy,
            grade: cardData.grade,
            description: cardData.textarea,
            favorite: false,
            star: false,
          },
          star_num_flag: cardData.starNum
        })
      }
    })

    /** behavior favorite star */
    db.collection('behavior').where({
      _openid: app.globalData.openid
    }).get({
      success: function(res) {
        let userBehavior = res.data[0]
        if(userBehavior.favoriteList.indexOf(options.cardId) != -1) {
          that.setData({ 
            favorite_flag: true 
          })
        }
        if(userBehavior.starList.indexOf(options.cardId) != -1) {
          that.setData({ 
            star_flag: true
          })
        }
      }
    })
    
    // @BACK comment list
    this.initCommentList()
  
  },

  onShow: function () {
    this.handleIntersectionObserver()
  },

  onUnload: function () {
    // console.log("comment page unload")
    let pages = getCurrentPages()
    let prepage = pages[pages.length-2]
    prepage.setData({
      unfold_refresh_flag: true
    })
  },

  onPullDownRefresh: function () {
    wx.vibrateShort()
    
    let that = this
    that.setData({ commentItem: [] })
    db.collection('comment').where({
      cardId: that.data.cardInfo.card_id
    }).get({
      success: function(res) {
        let commentList = res.data[0].commentList
        commentList.forEach(function(comment) {
          that.setData({
            commentItem: that.data.commentItem.concat({
              avatarSrc: comment.avatarUrl,
              name: comment.nickName,
              content: comment.comment,
              animate: false
            })
          })
        })
        that.handleIntersectionObserver()
        wx.stopPullDownRefresh()
      }
    })
  },

})