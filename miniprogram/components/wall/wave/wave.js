// components/wall/wave/wave.js
Component({

  properties: {
    current_tab: {
      type: Number,
      value: 0
    }
  },


  data: {
    warm_position_x: "25%",
    cool_position_x: "50%",
  },


  methods: {
    
  },

  observers: {
    'current_tab': function(current_tab) {
      /** TODO
       * current_tab: 0/1/2/3
       * 初始warm橙色wave position = 25%
       * 初始cool白色wave position = 50%
       */
      this.setData({
        warm_position_x: (current_tab+1)*25 + "%",
        cool_position_x: (-17*current_tab + 50) + "%"
      })
    }
  }
})
