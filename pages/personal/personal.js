// pages/personal/personal.js
import request from '../../utils/request'
let startY = 0;
let moveY = 0;
let moveDistance = 0;
Page({

  /**
   * 页面的初始数据
   */
  //  transform: translateY(0);
  data: {
    moveTransfrom:"translateY(0)",
    moveTranslate:"all .5s linear",
    userInfo:{},//用户信息
    rencentPlayList:[]//用户最近播放列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   let userInfo =  wx.getStorageSync("userInfo");
    this.setData({
      userInfo:JSON.parse(userInfo)
    })
    let userId = JSON.parse(userInfo).userId
    console.log(userId);
    this.getRencentPlayList(userId)
  },
  // 获取用户最近播放列表
  async  getRencentPlayList(uid){
    let rencentPlayList = await request('/user/record',{uid,type:0})
    // 为后面的索引提供key
    if(rencentPlayList.code == 200){
      let index = 1
    rencentPlayList.allData.forEach(item => {
      item.id = index++
      return item
    });
    // console.log(rencentPlayList.allData);
    this.setData({
      rencentPlayList:rencentPlayList.allData.slice(0,8)
    })
    }
  },
  bindtouchStart(event) {
    this.setData({
      moveTranslate : ""
    })
    startY = event.touches[0].clientY

    // console.log(startY)
  },
  bindtouchMove(e) { 
    moveY  = e.touches[0].clientY
    moveDistance = moveY - startY
    // console.log(moveDistance)
    if (moveDistance<0){
      moveDistance = 0
    }
    if (moveDistance>=80){
      moveDistance = 80
    }
    this.setData({
      moveTransfrom: `translateY(${moveDistance}rpx)`
    })
  },
  bindtouchEnd() { 
    this.setData({
      moveTransfrom: `translateY(0)`,
      moveTranslate: "all .5s linear"
    })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})