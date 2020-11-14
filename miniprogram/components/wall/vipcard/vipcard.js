// components/wall/vipcard/vipcard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    scaleFactor: 0,
    // fold_class: "",
    // vipcard_height: "290rpx",
    fold_class: "vipcard-container-unfold",    // for vipcard unfold test
    vipcard_height: "100vh",
    turn_class_class: "",
    slip_tolerance: 200,  // 手指下滑退出滑动距离最小值
    touchDotX: 0,
    touchDotY: 0,
    interval: 0,
    time: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onVipCardTap: function() {
      // let fold_now = this.data.fold_class == "" ? "vipcard-container-unfold" : "";
      // this.setData({ fold_class: fold_now })
      if(this.data.fold_class != "vipcard-container-unfold") {
        this.setData({ fold_class: "vipcard-container-unfold" })
      }
    },

    onEnvelopTap: function() {
      // let turn_over_now = this.data.turn_class_class=="" ? "envelop-turn-over": ""
      if(this.data.turn_class_class != "envelop-turn-over") {
        this.setData({ turn_over_class: "envelop-turn-over" })
      }
    },

    touchStart: function(e) {
      if(this.data.fold_class === "vipcard-container-unfold") {
        this.setData({
          touchDotX: e.touches[0].pageX,
          touchDotY: e.touches[0].pageY
        })
      }
    },
    touchEnd: function(e) {
      if(this.data.fold_class === "vipcard-container-unfold") {
        let touchMoveX = e.changedTouches[0].pageX;
        let touchMoveY = e.changedTouches[0].pageY;
        let tmX = touchMoveX - this.data.touchDotX;
        let tmY = touchMoveY - this.data.touchDotY;

        let absX = Math.abs(tmX);
        let absY = Math.abs(tmY);
        if (absX > 2 * absY) {
          if (tmX<0){
            console.log("左滑=====")
          }else{
            console.log("右滑=====")
          }
        }
        if (absY > absX * 2) {
          if(tmY < 0){
            console.log("上滑动=====")
          } else if(tmY > this.data.slip_tolerance) {
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
        vipcard_height: that.data.fold_class == "vipcard-container-unfold"? "100vh" : "290rpx"
      })
    }
  }
})
