// components/wall/decorate/decorate.js

const app = getApp()
const db = wx.cloud.database()

Component({

  properties: {
    win_height_root: Number
  },

  data: {
    win_height: 0,
    decorate_bg_list: []
  },

  methods: {
    decorateScroll: function(e) {
      console.log(e)
    }
  },

  lifetimes: {
    attached: function() {
      let that = this
      this.setData({ decorate_bg_list: [] })

      db.collection('decorate')
        .orderBy('time', 'asc')
        .get({
          success: function(res) {
            let bin_decorate_list = []
            res.data.forEach(function(decorate) {
              bin_decorate_list.push({
                imgSrc: decorate.imgSrc,
                show: false
              })
            })
            bin_decorate_list[0].show = true
            that.setData({ decorate_bg_list: bin_decorate_list })
          }
        })
    }
  },

  observers: {
    'win_height_root': function(win_height_root) {
      if(this.data.decorate_bg_list.length != 0) {
        let that = this

        this.setData({ win_height: win_height_root })
        let index = parseInt(win_height_root / 2500)

        let i = 0
        for(i=0; i < (index < this.data.decorate_bg_list.length ? index : this.data.decorate_bg_list.length); ++i) {
          this.data.decorate_bg_list[i].show = true
        }
        for(;i < this.data.decorate_bg_list.length; ++i) {
          this.data.decorate_bg_list[i].show = false
        }
        this.data.decorate_bg_list[0].show = true

        this.setData({ decorate_bg_list: that.data.decorate_bg_list}) 
      }
    }
  }
})
