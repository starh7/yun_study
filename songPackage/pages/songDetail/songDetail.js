// pages/songDetail/songDetail.js
import request  from '../../../utils/request'
import PubSub from 'pubsub-js'
import moment from 'moment'
const appInstance = getApp()//获取到小程序全局唯一的 App 实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,//控制播放
    musicId:'',//歌曲id
    song:{},//歌曲详情
    songUrl:'',//歌曲连接
    currentTime:"00:00",//实时时间
    durationTime:"00:00",//总时长
    progressWidth:0,//进度条长度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    let musicId = options.musicId;
    this.setData({
      musicId
    })
    this.getSongDetail(musicId)

     // 控制同一首歌再进入播放
    if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId){
      this.setData({
        isPlay:true
       })
    }
    // 模拟器出现的音频控制器与页面同步
    // 都使用，把他放在this实列上
    this.backgroundAudioManager = wx.getBackgroundAudioManager() //获取背景音频实例
    this.backgroundAudioManager.onPlay(()=>{
      this.controlMusicPlay(true)
      appInstance.globalData.musicId = musicId
    })//控制播放
    this.backgroundAudioManager.onPause(()=>{
      this.controlMusicPlay(false)
    })//控制暂停
    // 真机上的小叉叉结束播放
    this.backgroundAudioManager.onStop(()=>{
      this.controlMusicPlay(false)
      PubSub.publish('handelSwitch','next')
      this.setData({
        currentTime:"00:00",
        progressWidth:0
      })
    })
    // 实时时长
    this.backgroundAudioManager.onTimeUpdate(()=>{
      // console.log(this.backgroundAudioManager.currentTime); 
      let currentTime = moment(this.backgroundAudioManager.currentTime*1000).format("mm:ss")
      let progressWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration*450
      // console.log(progressWidth);
      this.setData({
        currentTime,
        progressWidth
      })
    })
  },
  // 控制音乐播放状态
  controlMusicPlay(isPlay){
    this.setData({
      isPlay
     })
     appInstance.globalData.isMusicPlay = isPlay//同一首歌进入播放
  },
  // 处理音乐播放
  handleMusicPlay(){
    let {isPlay,musicId,songUrl} = this.data
    isPlay = !isPlay
    this.controlMusicPlay(isPlay)
    //  this.controlMusic(this.data.isPlay,this.data.musicId)
     this.controlMusic(isPlay,musicId,songUrl)
  },
  // 控制音乐播放
 async controlMusic(isPlay,musicId,songUrl){
  // 控制全局播放实列
  if(isPlay){//播放
    if(!songUrl){
      let songUrl = await request('/song/url',{id:musicId})
      this.setData({
        songUrl:songUrl.data[0].url
      })
    }
    songUrl = this.data.songUrl
    this.backgroundAudioManager.src = songUrl
    let name = this.data.song[0].name
    // console.log(name);
    this.backgroundAudioManager.title  = name
  }else{//暂停
    this.backgroundAudioManager.pause()
  }
  
  },
  // 获取歌单详情
  async getSongDetail(id){
    let song = await request('/song/detail',{ids:id})
    // console.log(song.songs[0].dt);
    let durationTime = moment(song.songs[0].dt).format("mm:ss")
    this.setData({
      song:song.songs,
      durationTime
    })
    wx.setNavigationBarTitle({
      title: this.data.song[0].name
    })
  },
  // 切换歌曲
  handleSwitch(event){
    // console.log(event.target.id);
    // 发表订阅消息切歌
    PubSub.publish('handelSwitch',event.target.id)
    PubSub.subscribe('upDateMusic',(msg,musicId)=>{
      this.controlMusic(true,musicId)
      this.getSongDetail(musicId)
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