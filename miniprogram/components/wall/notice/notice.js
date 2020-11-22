// components/wall/notice/notice.js
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
    notices: [
      "这里是一条公告，它很长很长很长很长它很长很长很长很长它很长很长很长很长",
      "111",
      "2222",
      "333",
      "444"
    ],
    notice_index: 0,
    animate: false
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },

  lifetimes: {
    attached: function() {
      let that = this
      setInterval(function(){
        let notice_index_now = that.data.notice_index
        that.setData({ notice_index: (notice_index_now + 2) % that.data.notices.length })
      }, 10000)
    }
  }
})
