// components/wall/card/card.js
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
    unfold: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onCardTap: function(event) {
      this.setData({
        unfold: "card-container-unfold"
      })
    }
  }
})
