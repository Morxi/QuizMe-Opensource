// pages/settings/settings.js
var tempspeed;
var switchStat;
var jumpStat;
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countSpeed: 50,
    switchs: false,
  },

  slider1change: e => {
    tempspeed = e.detail.value
    console.log(tempspeed)
},
  switchTap: e => {
    switchStat = e.detail.value
  },
  jumpTap: e=>{
    jumpStat = e.detail.value;
  },
buttonLogin:function(){
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
    }
  })
  // 获取用户信息
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        wx.getUserInfo({
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            this.globalData.userInfo = res.userInfo

            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (this.userInfoReadyCallback) {
              this.userInfoReadyCallback(res)
            }
          }
        })
      }
    }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this; 
  },
/**
* 动作-点击删档重来
*/
cleanall:function(){
  wx.showModal({
    title: '警告',
    content: '现在走还来得及',
    confirmText: "确定删档",
    cancelText: "怕了怕了",
    success: function (res) {
      console.log(res);
      if (res.confirm) {
        wx.clearStorage()
        wx.navigateBack({
          delta: 5
        })
      } else {
        console.log('用户点击辅助操作')
      }
    }
  });
  

},
/**
* 动作-点击保存设置
*/
  saveSet: function(){
  wx.setStorage({
    key: 'speed',
    data: tempspeed,
  })
  wx.setStorage({
    key: 'countdownswitch',
    data: switchStat,
  })
  wx.setStorage({
    key: 'isJumped',
    data: jumpStat,
  })
  wx.showToast({
    title: '保存成功',
    icon: 'success',
    duration: 500
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
    wx.getStorage({
      key: 'speed',
      success: res => {
        tempspeed = res.data;
        that.setData({
          countSpeed: res.data
        })
      },
    })
    wx.getStorage({
      key: 'countdownswitch',
      success: res => {
        switchStat = res.data;
        that.setData({
          switchs: switchStat
        })
      }
    })
    wx.getStorage({
      key: 'isJumped',
      success: res => {
        jumpStat = res.data;
        that.setData({
          jumps: jumpStat
        })
      }
    })
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