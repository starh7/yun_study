// import { request } from "http"
// import request from '/utils/request.js'
import request from '../../utils/request'


// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [], // 轮播图数据
    recommendList: [], // 推荐歌单
    topList: []//排行榜歌单

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 轮播图数据
    let bannerListData = await request('/banner', { type: 2 });
    this.setData({
      bannerList: bannerListData.banners
    })
    // 推荐歌单
    let recommendListData = await request('/personalized', { limit: 10 });
    this.setData({
      recommendList: recommendListData.result
    })

    // 排行榜歌单
    let index = 0
    let topListArr = []
    let musicList = await request('/toplist');
    let musicId = musicList.list
    while (index < 5) {
      let topList = await request('/top/list', {id: musicId[index++].id});
      let  topItem = {
        name:topList.playlist.name,
        tracks:topList.playlist.tracks.slice(0,3)
      }
      topListArr.push(topItem)
      this.setData({
        topList:topListArr
      })
    }
    
  },
  // 跳转推荐页面
  toRecomend(){
    wx.navigateTo({
      url: '/songPackage/pages/recommendSong/recommendSong',
    });
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