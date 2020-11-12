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
    scaleFactor: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    taggleVipCardTap: function() {
      let that = this;
      this.setData({ scaleFactor: 1 - that.data.scaleFactor })
    }
  }
})
