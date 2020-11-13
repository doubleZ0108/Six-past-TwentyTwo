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
    fold_class: "",
    touchDotX: 0,
    touchDotY: 0,
    interval: 0,
    time: 0,
    vipcard_height: "290rpx"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onVipCardTap: function() {
      // let fold_now = this.data.fold_class == "" ? "vipcard-container-unfold" : "";
      // this.setData({ fold_class: fold_now })

      this.setData({ fold_class: "vipcard-container-unfold" })
    },

    touchStart: function(e) {
      if(this.data.fold_class === "vipcard-container-unfold") {
        this.setData({
          touchDotX: e.touches[0].pageX,
          touchDotY: e.touches[0].pageY
        })
      }
    },
    touchMove: function(e) {
      if(this.data.fold_class === "vipcard-container-unfold") {
        let touchMoveX = e.changedTouches[0].pageX;
        let touchMoveY = e.changedTouches[0].pageY;
        let tmX = touchMoveX - this.data.touchDotX;
        let tmY = touchMoveY - this.data.touchDotY;

        let absX = Math.abs(tmX);
        let absY = Math.abs(tmY);

        if (absY > absX * 2 && tmY >= 0) {
            console.log("下滑动=====")
        } 
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
          } else {
            // TODO
            console.log("下滑动=====")
            this.setData({ fold_class: "" })
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
