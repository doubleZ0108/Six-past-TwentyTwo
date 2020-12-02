// components/wall/decorate/decorate.js
Component({

  properties: {
    win_height_root: Number
  },

  data: {
    win_height: 0,
    decorate_0_effect: false,
    decorate_1_effect: false,
    decorate_2_effect: false,
    decorate_3_effect: false
  },

  methods: {

  },

  observers: {
    'win_height_root': function(win_height_root) {
      this.setData({ win_height: win_height_root })
      if(win_height_root > 0 && win_height_root < 2000) {   // #1
        this.setData({ 
          decorate_0_effect: true,
          decorate_1_effect: false,
          decorate_2_effect: false,
          decorate_3_effect: false
        })
      } else if(win_height_root > 2000 && win_height_root < 3000) {   // #2
        this.setData({ 
          decorate_1_effect: true,
          decorate_2_effect: false,
          decorate_3_effect: false
        })
      } else if(win_height_root > 3000 && win_height_root < 4000) {   // #3
        this.setData({ 
          decorate_2_effect: true,
          decorate_3_effect: false
        })
      } else if(win_height_root > 4000 && win_height_root < 5000) {   // #4        // #2
        this.setData({ 
          decorate_3_effect: true
        })
      }
    }
  }
})
