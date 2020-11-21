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
    gender_left: {
      type: String,
      value: "男生"
    },
    gender_right: {
      type: String,
      value: "女生"
    },
    avatar_url: {
      type: String,
      value: "../../../resource/img/avatar/default_avatar.png"
    },
    description: {
      type: String,
      value: "告白从心开始"
    },
    academy: {
      type: String,
      value: ""
    },
    grade: {
      type: String,
      value: ""
    },
    bubble_left: {
      type: String,
      value: ""
    },
    bubble_right: {
      type: String,
      value: ""
    },
    refresh_flag: {
      type: String,
      value: ""
    },
    animate: {
      type: Boolean,
      value: false
    },
    index: {
      type: Number,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    unfold: "",
    commentId: 123
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onCardTap: function(e) {
      // console.log("card tap..")
      this.setData({
        unfold: "card-container-unfold"
      })
    }
  },

  observers: {
    'refresh_flag': function(fold_class) {
      this.setData({
        unfold: ""   // this is correct
        // unfold: "card-container-unfold"  // for card unfold style
      })
    }
  }
})
