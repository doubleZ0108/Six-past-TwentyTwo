// miniprogram/pages/comment/comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toptip: {
      msg: "",
      type: "success",
      show: false
    },
    commentItem: [
      {
        avatarSrc: "../../resource/img/avatar/avatar.jpg",
        name: "名字",
        content: "这是一条很长的评论,这是一条很长的评论,这是一条很长的评论,这是一条很长的评论,这是一条很长的评论,这是一条很长的评论,这是一条很长的评论这是一条很长的评论,这是一条很长的评论,这是一条很长的评论,这是一条很长的评论",
        animate: false
      },
      {
        avatarSrc: "../../resource/img/avatar/avatar.jpg",
        name: "名字",
        content: "这是一条很短的评论",
        animate: false
      },
      {
        avatarSrc: "../../resource/img/avatar/avatar.jpg",
        name: "名字",
        content: "这是一条很长的评论,这是一条很长的评论,这是一条很长的评论,这是一条很长的评论,这是一条很长的评论,这是一条很长的评论,这是一条很长的评论这是一条很长的评论,这是一条很长的评论,这是一条很长的评论,这是一条很长的评论",
        animate: false
      },
      {
        avatarSrc: "../../resource/img/avatar/avatar.jpg",
        name: "名字",
        content: "这是一条很短的评论",
        animate: false
      },
      {
        avatarSrc: "../../resource/img/avatar/avatar.jpg",
        name: "名字",
        content: "这是一条很长的评论,这是一条很长的评论,这是一条很长的评论,这是一条很长的评论,这是一条很长的评论,这是一条很长的评论,这是一条很长的评论这是一条很长的评论,这是一条很长的评论,这是一条很长的评论,这是一条很长的评论",
        animate: false
      },
      {
        avatarSrc: "../../resource/img/avatar/avatar.jpg",
        name: "名字",
        content: "这是一条很短的评论",
        animate: false
      },
    ],
    textarea: "",
    fromVip: false
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
          comment: that.data.textarea
        }
        that.setData({ textarea: "" })
        console.log(commentData)

        // @BACK
      }
    }, 500)    // 让blur事件执行完
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.cardId)
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
    let that = this;

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