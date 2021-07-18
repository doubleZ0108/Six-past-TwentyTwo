// components/wall/notice/notice.js

const db = wx.cloud.database()

Component({

  properties: {

  },


  data: {
    notices: [],
    notice_index: 0,
    animate: false
  },

  methods: {
    initNotice: function() {
      let that = this
      db.collection('announcement')
        .limit(16)
        .orderBy("time", "desc")
        .get({
          success: function(res) {
            let bin_notices = []
            res.data.forEach(function(notice) {
              bin_notices.push(notice.content)
              // bin_notices.push(notice.title)   // v1.x TODO
            })
            that.setData({ notices: bin_notices })
          }
        })
    },

    onNoticeTap: function() {
      wx.vibrateShort()
      
      wx.navigateTo({
        url: '../announcement/announcement',
      })
    }
  },

  lifetimes: {
    attached: function() {
      this.initNotice()

      let that = this
      setInterval(function(){
        let notice_index_now = that.data.notice_index
        that.setData({ notice_index: (notice_index_now + 2) % that.data.notices.length })
      }, 10000)
    }
  }
})
