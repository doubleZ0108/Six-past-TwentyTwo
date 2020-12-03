// components/index/blackboard/blackboard.js
Component({

  properties: {

  },


  data: {
    currentTab: 0,
    info_list: [
      "111111",
      "22222",
      "文字文字文字很长很长很长文字文字文字很长很长很长文字文字文字很长很长很长文字文字文",
      ""
    ],
    left_btn_end: false,
    right_btn_end: false
  },


  methods: {
    switchTab: function(e) {
      if(e.detail.current != this.data.currentTab) {
        this.setData({ currentTab: e.detail.current })
      }
    },
  
    onLeftBtnTap: function() {
      wx.vibrateShort()
  
      let that = this
      if(this.data.currentTab != 0) {
        this.setData({ 
          currentTab: that.data.currentTab - 1,
          left_btn_end: false,
          right_btn_end: false
        })
      } else {
        // 第一个
        this.setData({ left_btn_end: true })
      }
    },
    onRightBtnTap: function() {
      wx.vibrateShort()
  
      let that = this
      if(this.data.currentTab != this.data.info_list.length - 1) {
        this.setData({ 
          currentTab: that.data.currentTab + 1,
          left_btn_end: false,
          right_btn_end: false
        })
      } else {
        // 最后一个
        this.setData({ right_btn_end: true })
      }
    },
  },

  observers: {
    'currentTab': function(currentTab) {
      let pages = getCurrentPages()
      let currpage = pages[pages.length-1]

      if(currentTab == this.data.info_list.length - 1) {
        currpage.setData({
          show_getUserInfo_btn: true
        })
      } else {
        currpage.setData({
          show_getUserInfo_btn: false
        })
      }
    }
  }
})
