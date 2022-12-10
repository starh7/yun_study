import request from '../../../utils/request'
import PubSub from 'pubsub-js' 

// pages/recomandSong/recomandSong.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',//日期
    month:'',//月份
    musicList:'',//推荐歌曲列表
    index:0,//歌曲下标

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      month:new Date().getMonth()+1,
      day:new Date().getDate()
    })
    this.getRecommendSong()
    // 消息订阅获取切歌的id
    PubSub.subscribe('handelSwitch',(msg,type)=>{
      let {index,musicList} = this.data
      if(type === 'pre'){
        (index == 0)&&(index=musicList.length)
        index--
        this.setData({
          index
        })
         let musicId = musicList[index].id
         PubSub.publish("upDateMusic",musicId)
      }else{
        (index==musicList.length)&&(index == -1)
        index++
        this.setData({
          index
        })
         let musicId = musicList[index].id
         PubSub.publish("upDateMusic",musicId)
      }
    })
  },
  // 更新下标并查找音乐id
  /* upDateIndex(){
    let {index,musicList} = this.data
    this.setData({
      index
    })
     let musicId = musicList[index].id
     PubSub.publish("upDateMusic",musicId)
  }, */
  async getRecommendSong(){
    // 获取推荐列表要先登入
    let userInfo = wx.getStorageSync('userInfo')
    if(!userInfo){
      wx.showToast({
        title:'未登入，请登入',
        icon:'none',
        success:()=>{
          wx.navigateTo({
            url: '/pages/login/login',
          });
        }
      })
    }
    let recommendSong = await request("/recommend/songs")
    this.setData({
      musicList:recommendSong.data.dailySongs
    })
    // console.log(recommendSong);
  },
// 跳转详情页面
toSongDetail(event){
  let {song,index} = event.currentTarget.dataset
  this.setData({
    index
  })
  wx.navigateTo({
    url:'/songPackage/pages/songDetail/songDetail?musicId='+song.id
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