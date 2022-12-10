// pages/login/login.js
import request from '../../utils/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    password:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 登入前端验证
  bindInput(e){
  // console.log(e)
  // 获取输入框内容
  let type = e.target.id
  this.setData({
    [type]:e.detail.value
  })
  },
  // 判断账号是否为空
  async login(){
    let { phone, password } = this.data;
    if (!phone) {
      wx.showToast({
        title: '号码不能为空',
        icon:"none"
      })
      return
    }
    // 判断账号格式
    let phereg = /^1[3-9]\d{9}$/
    if (!(phereg.test(phone))) {
      wx.showToast({
        title: '号码格式不正确',
        icon: "none"
      })
      return
    }
    // 判断密码
  if(!password) {
    wx.showToast({
      title: '密码不能为空',
      icon: "none"
    })
    return
  }
  // 后端验证
   let result = await request('/login/cellphone',{phone,password,isLogin:true})
   if(result.code == 200){
    wx.showToast({
      title: 'success',
    })
    wx.setStorageSync("userInfo",JSON.stringify(result.profile) )
    wx.reLaunch({
      url:'/pages/personal/personal'
    })
   }else if(result.code == 400){
    wx.showToast({
      title: '页面不存在',
      icon: "none"
    })
   }else if(result.code == 400){
    wx.showToast({
      title: '服务器错误',
      icon: "none"
    })
   }else{
    wx.showToast({
      title: '登入失败，请从新登入',
      icon: "none"
    })
   }
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