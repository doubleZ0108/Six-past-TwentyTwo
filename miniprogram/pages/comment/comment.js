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
          // console.log(res.id, node.intersectionRatio)
          let commentIndex = parseInt(res.id.substr(8))
          if(node.intersectionRatio != 0) {
            that.data.commentItem[commentIndex].animate = true
          } else {
            that.data.commentItem[commentIndex].animate = false
          }
          that.setData({ commentItem: that.data.commentItem })
        })
      })
    }).exec()

    
  },


  onTextareaBlur: function(e) {
    this.setData({ textarea: e.detail.value })
  },

  commentSubmit: function() {
    let that = this

    setTimeout(function(){
      if(that.data.textarea == "") {
        that.setData({ 
          toptip: {
            msg: "请填写你的评论:)",
            type: "error",
            show: true
          }
        })
      } else {
        that.setData({
          toptip: {
            msg: "评论成功～",
            type: "success",
            show: true
          }
        })

        let commentData = {
          comment: that.data.textarea,
          openid: app.globalData.openid,
          time: timeUtil.formatTime(new Date()),
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
          },
          complete: function() {
            that.setData({ textarea: "" })
          }
        })

      }
    }, 500)    // 让blur事件执行完
  },


  onFavoriteTap: function() {
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
    let starNow = this.data.star_flag
    let starNumNow = this.data.star_num_flag
    this.setData({ 
      star_flag: !starNow,
      star_num_flag: starNow ? starNumNow - 1 : starNumNow + 1
    })

    // @BACK
    let that = this
    if(that.data.star_flag) {
      wx.cloud.callFunction({
        name: "star",
        data: {
          card_id: that.data.cardInfo.card_id,
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
          fresh_starList.splice(fresh_starList.indexOf(that.data.cardInfo.card_id), 1)

          wx.cloud.callFunction({
            name: "star",
            data: {
              card_id: that.data.cardInfo.card_id,
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.cardId)

    let that = this
    /** card info */
    db.collection('card').where({
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
        console.log(userBehavior)
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
        console.log(that.data)
      }
    })
    
    // TODO @BACK comment list
    db.collection('comment').where({
      cardId: options.cardId
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

      }
    })


    if(options.vipcard) {
      console.log("this is from vipcard navigator!!!")
      this.setData({ fromVip: true })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.handleIntersectionObserver()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})