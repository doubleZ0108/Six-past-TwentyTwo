// components/wall/navigation_system/navigation_system.js
Component({
  data: {
    tabbarItem: [
      {
        name: "主页",
        iconfont: "iconshouye"
      }, 
      {
        name: "空间",
        iconfont: "iconsvgmoban59"
      },
      {
        name: "收藏",
        iconfont: "iconshouye"
      }, {
        name: "搜索",
        iconfont: "iconsvgmoban59"
      }
    ],
    cardsItem: [
      {
        name_left: "DynamicName1",
        name_right: "DynamicName2",
        avatar_url: "../../../resource/img/avatar.jpg",
        description: "这里是一条表白，它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长",
        fold_class: "card-fold"
      },
      {
        name_left: "DynamicName3",
        name_right: "DynamicName4",
        avatar_url: "../../../resource/img/avatar.jpg",
        description: "一句话告白",
        fold_class: "card-fold"
      },
      {
        name_left: "DynamicName5",
        name_right: "DynamicName6",
        avatar_url: "../../../resource/img/avatar.jpg",
        description: "好的我爱你",
        fold_class: "card-fold"
      }
    ],
    currentTab: 0,
    scrollLeft: 0,
    winHeight: 0,
    navigatorLeft: 0,
  },

  methods: {
    /** for navigator */
    swichNavigator: function(e) {
      let current = e.currentTarget.dataset.current
      if(this.data.currentTab == current) {
        return false
      } else {
        this.setData({ currentTab: current })
      }

      this.setData({ navigatorLeft: this.data.currentTab * 25 + "%" })
    },

    /** for content */
    switchTab: function(e) {
      let that = this
      that.setData({ currentTab: e.detail.current })
      that.checkBoundary()

      this.setData({ navigatorLeft: this.data.currentTab * 25 + "%" })
    },
    checkBoundary: function() {
      let that = this;
      if(that.data.currentTab > 3) {
        that.setData({ scrollLeft: 300 })
      } else {
        that.setData({ scrollLeft: 0 })
      }
    },


    /**
     * TAP
     */
    onCardGroupTap: function(e) {
      console.log("card group tap...")

      console.log(e);
      
      for(let index=0; index<this.data.cardsItem.length; ++index){
        this.data.cardsItem[index].fold_class = "card-fold";
      }
      let that = this;
      this.setData({ cardsItem: that.data.cardsItem })

      // const query = wx.createSelectorQuery()      
      // let cardContainers = query.selectAll(".card-container")
      // console.log(cardContainers)

      // let cardContainers = this.selectAllComponents(".card-container")

      // cardContainers.forEach(function(card){
      //   console.log(card)

      // })

    }
  },
  lifetimes: {
    attached: function() {
      let that = this;
      //  高度自适应
      wx.getSystemInfo({
        success: function (res) {
          let calc = res.windowHeight; //顶部脱离文档流了(- res.windowWidth / 750 * 100);
          // console.log('==顶部高度==',calc)
          that.setData({
            winHeight: calc
          });
        }
      });
    }
  }
})
