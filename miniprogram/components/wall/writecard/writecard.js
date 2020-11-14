// components/wall/writecard/writecard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    posLeft: {
      type: String,
      value: "110%"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    fold_class: "",
    writecard_height: "330rpx",
    // fold_class: "writecard-container-unfold",    // for vipcard unfold test
    // writecard_height: "100vh",
    slip_tolerance: 200,  // 手指下滑退出滑动距离最小值
    touchDotX: 0,
    touchDotY: 0,
    writecard_bg: "../../../resource/img/write/fold_bg.svg"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onWriteCardTap: function() {
      if(this.data.fold_class != "writecard-container-unfold") {
        this.setData({ fold_class: "writecard-container-unfold" })
      }
    },

    touchStart: function(e) {
      if(this.data.fold_class === "writecard-container-unfold") {
        this.setData({
          touchDotX: e.touches[0].pageX,
          touchDotY: e.touches[0].pageY
        })
      }
    },
    touchEnd: function(e) {
      if(this.data.fold_class === "writecard-container-unfold") {
        let touchMoveX = e.changedTouches[0].pageX;
        let touchMoveY = e.changedTouches[0].pageY;
        let tmX = touchMoveX - this.data.touchDotX;
        let tmY = touchMoveY - this.data.touchDotY;

        let absX = Math.abs(tmX);
        let absY = Math.abs(tmY);

        if (absY > absX * 2) {
          if(tmY > this.data.slip_tolerance) {
            console.log("下滑动=====")
            this.setData({ 
              fold_class: "",
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
        writecard_height: that.data.fold_class == "writecard-container-unfold"? "100vh" : "330rpx",
        posLeft: that.data.fold_class == "writecard-container-unfold" ? "0" : "10%",
        // writecard_bg: that.data.fold_class == "writecard-container-unfold" ? "../../../resource/img/write/unfold_bg.png" : "../../../resource/img/write/fold_bg.svg"
        writecard_bg: that.data.fold_class == "writecard-container-unfold" ? "https://doublez-site-bed.oss-cn-shanghai.aliyuncs.com/img/20201114201650.png" : "https://doublez-site-bed.oss-cn-shanghai.aliyuncs.com/img/20201114201658.svg"
      })
    }
  }
})
