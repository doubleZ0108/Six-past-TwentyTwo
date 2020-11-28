// components/wall/vipcard/vipcard.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    posLeft: {
      type: String,
      value: "10%"
    },
    z_index: Number,
    index: Number,
    which_vipcard: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    fold_class: "",
    vipcard_height: "290rpx",
    // fold_class: "vipcard-container-unfold",    // for vipcard unfold test
    // vipcard_height: "100vh",
    turn_over_class: "",
    slip_tolerance: 200,  // 手指下滑退出滑动距离最小值
    touchDotX: 0,
    touchDotY: 0,
    smallcard_touchDotX: 0, // 检测小卡片下滑动
    smallcard_touchDotY: 0,

    commentId: 999,
    animate: false,
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
        this.setData({ fold_class: "vipcard-container-unfold" })
      }
    },

    onEnvelopTap: function() {
      // let turn_over_now = this.data.turn_over_class=="" ? "envelop-turn-over": ""
      if(this.data.turn_over_class != "envelop-turn-over") {
        this.setData({ turn_over_class: "envelop-turn-over" })
      }
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
            this.setData({ 
              fold_class: "",
              turn_over_class: ""
            })
            return
          }
        }
        if (absY > absX * 2) {
          if(tmY < 0){
            console.log("上滑动=====  x")
          } else if(tmY > this.data.slip_tolerance) {
            console.log("下滑动=====")
            this.setData({ 
              fold_class: "",
              turn_over_class: ""
            })
            return
          }
        } 
      } else {
        let touchMoveX = e.changedTouches[0].pageX
        let touchMoveY = e.changedTouches[0].pageY
        let tmX = touchMoveX - this.data.smallcard_touchDotX
        let tmY = touchMoveY - this.data.smallcard_touchDotX

        let absX = Math.abs(tmX)
        let absY = Math.abs(tmY)

        if (absX > 2 * absY) {
          if (tmX < 0 && -tmX > this.data.slip_tolerance){
            console.log("左滑=====")
            // TODO 
           this.vipcardEffect()

           let pages = getCurrentPages()
           let currpage = pages[pages.length-1]
           currpage.setData({
             switch_from_user: true
           })
          }
        }
      }
    },

    vipcardEffect: function() {
      this.setData({ animate: true })
      let that = this
      setTimeout(function(){
        that.setData({ animate: false })
      }, 2500)
      setTimeout(function() {
        /* z-index adaptive */
        let pages = getCurrentPages()
        let currpage = pages[pages.length-1]
        currpage.setData({
          switch_vipcard: true
        })
      }, 1250)
    }
  },

  observers: {
    'fold_class': function() {
      let that = this;
      this.setData({
        vipcard_height: that.data.fold_class == "vipcard-container-unfold"? "100vh" : "290rpx",
        posLeft: that.data.fold_class == "vipcard-container-unfold" ? "0" : "10%"
      })
    },
    'which_vipcard': function(which_vipcard) {      
      if(which_vipcard == this.data.index) {
        this.vipcardEffect()
      }
    }
  }
})
