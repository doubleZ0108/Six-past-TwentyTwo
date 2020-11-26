// components/wall/favoritecard/favoritecard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    posLeft: {
      type: String,
      value: "10%"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    fold_class: "",
    favorite_height: "290rpx",
    turn_over_class: "",
    slip_tolerance: 200,  // 手指下滑退出滑动距离最小值
    touchDotX: 0,
    touchDotY: 0,
    
    statistic_array: [1,11,111,1111,11111,111111]
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

    onFavoriteCardTap: function() {
      this.backToTop()
      
      if(this.data.fold_class != "favoritecard-container-unfold") {
        this.setData({ fold_class: "favoritecard-container-unfold" })
      }
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
            this.setData({ 
              fold_class: "",
              turn_over_class: ""
            })
            return
          }
        }

        if (absY > absX * 2) {
          if(tmY > this.data.slip_tolerance) {
            console.log("下滑动=====")
            this.setData({ 
              fold_class: "",
              turn_over_class: ""
            })
          }
        } 
      }
    }
  },

  observers: {
    'fold_class': function() {
      let that = this;
      this.setData({
        favorite_height: that.data.fold_class == "favoritecard-container-unfold"? "100vh" : "290rpx",
        posLeft: that.data.fold_class == "favoritecard-container-unfold" ? "0" : "10%"
      })
    }
  }
})

