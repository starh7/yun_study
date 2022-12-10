// pages/search/search.js
import request from '../../utils/request'
let flag = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderData:'',//搜索框关键字
    hotList:[],//热搜内容
    keyWord:'',//搜索词
    searchList:[],//搜索内容
    historyList:[],//历史搜索记录

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 调用初始化数据
    this.getInitData()
    // 查找历史记录
    this.getHistoryList()
  },
  // 获取初始化数据
  async getInitData(){
    let placeholder = await request('/search/default')
    let hotList = await request('/search/hot/detail')
    this.setData({
      placeholderData:placeholder.data.showKeyword,
      hotList:hotList.data
    })
  },
  // 获取历史记录
  getHistoryList(){
   let historyList =  wx.getStorageSync('historyList')
   this.setData({
    historyList:historyList?historyList:[]
   })
  },
  // 搜索歌曲
  searchSong(event){
    this.setData({
      keyWord:event.detail.value
    })
    if(flag){
      return
    }
    flag = true
    this.getSearchList(this.data.keyWord)
    setTimeout(()=>{
      flag = false
    },300)
    // console.log(event.detail.value);
  },
  // 获取关键词搜索列表
  async getSearchList(keyWord){
    if(!keyWord){
      this.setData({
        searchList:[]
      })
      return
    }
    let result = await request('/search',{keywords:keyWord,limit:10})
    this.setData({
      searchList:result.result.songs
    })
    this.setHistoryList()
  },
  // 存储历史搜索记录
  setHistoryList(){
    let {historyList,keyWord} = this.data
    if(historyList.indexOf(keyWord) !== -1){
      historyList.splice(historyList.indexOf(keyWord),1)
    }
    historyList.unshift(keyWord)
    this.setData({
      historyList
    })
    wx.setStorageSync("historyList",historyList)
  },
  // 清空输入框
  clearSearch(){
    this.setData({
      keyWord:'',
      searchList:[]
    })
  },
  //清空历史记录
  deleteSearchHistory(){
    this.setData({
      historyList:[]
    })
    wx.removeStorageSync('historyList')
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