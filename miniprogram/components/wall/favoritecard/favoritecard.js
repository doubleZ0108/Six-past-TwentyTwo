// components/wall/favoritecard/favoritecard.js

const app = getApp()
const db = wx.cloud.database()

Component({

  properties: {
    posLeft: {
      type: String,
      value: "10%"
    }
  },

  data: {
    fold_class: "",
    favorite_height: "290rpx",
    turn_over_class: "",
    slip_tolerance: 100,  // 手指下滑退出滑动距离最小值
    touchDotX: 0,
    touchDotY: 0,

    userInfo: null,
    
    statistic_array: [
      { label: "我发表的表白数量", data: 0 },
      { label: "我收获的点赞总数", data: 0 },
      { label: "我收获的评论总数", data: 0 },
      { label: "我收藏的表白数量", data: 0 },
      { label: "我点赞的表白数量", data: 0 },
      { label: "我发送的评论数量", data: 0 },
    ]
  },


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

    onFavoriteCardTap: function() {
      
      if(this.data.fold_class != "favoritecard-container-unfold") {   // 展开favorite card
        wx.vibrateShort()
        this.backToTop()

        this.setData({ fold_class: "favoritecard-container-unfold" })

        // 隐藏顶部bar
        let pages = getCurrentPages()
        let currpage = pages[pages.length-1]
        currpage.setData({
          outdrop: true
        })
      }
    },

    shrinkCallBack: function() {
      wx.vibrateShort()
      
      this.setData({ 
        fold_class: "",
        turn_over_class: ""
      })

      // 显示顶部bar
      let pages = getCurrentPages()
      let currpage = pages[pages.length-1]
      currpage.setData({
        outdrop: false
      })
    },
    touchStart: function(e) {
      if(this.data.fold_class === "favoritecard-container-unfold") {
        this.setData({
          touchDotX: e.touches[0].pageX,
          touchDotY: e.touches[0].pageY
        })
      }
    },
    touchEnd: function(e) {
      if(this.data.fold_class === "favoritecard-container-unfold") {
        let touchMoveX = e.changedTouches[0].pageX;
        let touchMoveY = e.changedTouches[0].pageY;
        let tmX = touchMoveX - this.data.touchDotX;
        let tmY = touchMoveY - this.data.touchDotY;

        let absX = Math.abs(tmX);
        let absY = Math.abs(tmY);
        if (absX > 2 * absY) {
          if(tmX > this.data.slip_tolerance) {
            console.log("右滑=====")
            this.shrinkCallBack()
            return
          }
        }

        if (absY > absX * 2) {
          if(tmY > this.data.slip_tolerance) {
            console.log("下滑动=====")
            this.shrinkCallBack()
          }
        } 
      }
    },

    updateStatisticData: function() {
      let that = this

      wx.cloud.callFunction({
        name: "statistic",
        data: {},
        complete: function(res) {
          let cardList = res.result.data
          let commentSum = 0, starSum = 0
          cardList.forEach(function(card) {
            commentSum += card.commentNum
            starSum += card.starNum
          })
          that.data.statistic_array[0].data = cardList.length
          that.data.statistic_array[1].data = starSum
          that.data.statistic_array[2].data = commentSum

          db.collection('behavior').where({
            _openid: app.globalData.openid
          }).get({
            success: function(res) {
              let userData = res.data[0]
              that.data.statistic_array[3].data = Array.from(new Set(userData.favoriteList)).length
              that.data.statistic_array[4].data = Array.from(new Set(userData.starList)).length
              that.data.statistic_array[5].data = userData.commentList.length
              let buf_that = that
              that.setData({ statistic_array: buf_that.data.statistic_array })
            }
          })
        }
      })
    }
  },

  lifetimes: {
    attached: function() {
      // this.updateStatisticData()
      this.setData({ userInfo: app.globalData.userInfo })
    }
  },

  observers: {
    'fold_class': function(fold_class) {
      let that = this
      this.setData({
        favorite_height: that.data.fold_class == "favoritecard-container-unfold"? "100vh" : "290rpx",
        posLeft: that.data.fold_class == "favoritecard-container-unfold" ? "0" : "10%"
      })

      if(fold_class) {
        this.updateStatisticData()
      }
    }
  }
})

