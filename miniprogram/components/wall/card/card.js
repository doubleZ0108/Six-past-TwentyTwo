// components/wall/card/card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    name_left: {
      type: String,
      value: "PersonLeft"
    },
    name_right: {
      type: String,
      value: "PersonRight"
    },
    avatar_url: {
      type: String,
      value: "../../../resource/img/default_avatar.png"
    },
    description: {
      type: String,
      value: "告白从心开始"
    }
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
