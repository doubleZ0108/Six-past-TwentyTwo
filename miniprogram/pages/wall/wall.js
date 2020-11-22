// miniprogram/pages/wall/wall.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    drawer: false,
    world_cards: [
      {
        card_id: 0,
        name_left: "很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的名字1",
        name_right: "很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的名字2",
        gender_left: "男生",
        gender_right: "女生",
        avatar_url: "../../../resource/img/avatar/avatar.jpg",
        description: "这里是一条表白，它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长这里是一条表白，它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长这里是一条表白，它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长这里是一条表白，它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长这里是一条表白，它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长它很长很长很长很长",
        academy: "很长很长很长很长很长很长很长很长的学院",
        grade: "大四",
        bubble_left: "左侧测左侧测试文本左侧测试文本左侧测左侧测试文本左侧测试文本左侧测左侧测试文本左侧测试文本左侧测左侧测试文本左侧测试文本左侧测左侧测试文本左侧测试文本左侧测左侧测试文本左侧测试文本",
        bubble_right: "右侧测试文本右侧测试文本右侧测试文本右侧测试文本右侧测试文本右侧测试文本右侧测试文本右侧测试文本右侧测试文本",
        favorite: true,
        star: true,
        star_num: 4,
        comment_num: 1,
        refresh_flag: "refresh",
        animate: false    // TODO: 用来实现Intersection Observer 暂未成功
      },
      {
        card_id: 1,
        name_left: "名字3",
        name_right: "名字4",
        gender_left: "女生",
        gender_right: "男生",
        avatar_url: "../../../resource/img/avatar/avatar.jpg",
        description: "一句话告白",
        academy: "软件学院",
        grade: "大四",
        bubble_left: "左侧测试文本",
        bubble_right: "右侧",
        favorite: false,
        star: true,
        star_num: 666,
        comment_num: 666,
        refresh_flag: "refresh",
        animate: false
      },
    ],
  },

  heroTap: function() {
    let that = this
    this.setData({ drawer: !that.data.drawer })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("pull down")
    this.showConfetti()
  },

  showConfetti: function() {
    this.confetti = this.selectComponent("#confetti")
    this.confetti.showConfetti()
    setTimeout(function(){
      wx.stopPullDownRefresh()
    }, 1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("加载更多...")
    // @BACK
    let fresh_world_cards = this.data.world_cards[0]
    
    this.data.world_cards.push(...fresh_world_cards)
    let that = this
    this.setData({
      world_cards: that.data.world_cards
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})