// components/index/blackboard/blackboard.js
Component({

  properties: {

  },


  data: {
    currentTab: 0,
    info_list: [
      "欢迎来到「二十二点零六」",
      "这里不仅仅是一个「表白墙」，更是分享感动、收获遇见的神奇小屋子",
      "而我，是「软件学院」大四的一名造梦工程师，希望能在这里见到有趣的你",
      "虽然这里是社交平台，但希望你能在平时专心学业心无旁骛，因此制定规则如下",
      " 开放时间: 1. 周一～周五：22:06开放，开放时长为16分钟 2. 周末/节假日：全天开放 3. 特殊纪念日：系统通知调整开放时间 注：其他未开放时间可以自由编辑表白并查看自己发出的所有表白",
      "「二十二点零六」 “每个夜晚都会遇见🌙”",
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
