  /**
 * 首页逻辑处理
 * Creator：墨羲
 * morxislab
 */
//index.js
//获取应用实例
const app = getApp()
var still;
function getDateUntilEnding()
{
  var s1 = '2018-06-07';
  s1 = new Date(s1.replace(/-/g, "/"));
  var days = s1.getTime()-Date.now();
  still = parseInt(days / (1000 * 60 * 60 * 24));
}
Page({
  data: {
//预定义需要用到的变量
    isTicketOpen:false,
    isAboutOpen:false,
    isQuizOpen:false,
    saying: '加载中...',
    wxVersion: '加载中...',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onPullDownRefresh: function () {
      this.onLoad()
      wx.stopPullDownRefresh();
      
  },
  //事件处理函数
  //首先是主页点击下拉逻辑
  customToggle: function(){
    
    var tempIsOpen = !this.data.isAboutOpen;
    this.setData({
      isAboutOpen : tempIsOpen
    })
  },
  quizToggle: function () {

    var tempIsOpen = !this.data.isQuizOpen;
    this.setData({
      isQuizOpen: tempIsOpen
    })
    console.log(tempIsOpen)
  },
  ticketToggle: function () {

    var tempIsOpen = !this.data.isTicketOpen;
    this.setData({
      isTicketOpen: tempIsOpen
    })
  },
  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.list;
    console.log(list)
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  },
//主页跳转处理
  bindViewTap: function () {
    wx.navigateTo({
      url: '../usercenter/usercenter'
    })
  },
  startQuiz: function () {
    wx.navigateTo({
      url: '../quiz/quiz?id=1'
    })
  },
  customSetting: function(){
    wx.navigateTo({
      url: '../settings/settings?id=1'
    })
  },
  aboutQuiz: function () {
    wx.navigateTo({
      url: '../about/about?id=1'
    })
  },
  clickGTD: function(){
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
//点击文化综合后，选择科目，计算机的id是1，语文数学英语依次递增
  classSelector: function(){
    var allclass = ['语文', '数学', '英语'];
    wx.showActionSheet({
      itemList: allclass,
      success: res => {
        var index = res.tapIndex+2;
        wx.navigateTo({
          url: '../quiz/quiz?id=' + index
        })
      }});
  },
  
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载

    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  onShow: function () {

      if(wx.getStorageSync('questdata')=="")
      {
      wx.setStorageSync('questdata', 0)
    }
    
   getDateUntilEnding();
    wx.setNavigationBarTitle({
      title: '距高考还有'+still+'天'
    })

    wx.getSystemInfo({
      success: res => {
        this.setData({
          wxVersion: res.SDKVersion
        })

      }
    },
    )
    
  },
  onLoad: function(){
    wx.request({
      url: 'https://www.morusang.com/quiz/getsaying.php',
      header: {
        'content-type': 'text/html' // 默认值
      },
      complete: res =>{
        console.log(res);
        this.setData({
          sayin: res.data
        })
      }
    })
   

    wx.request({
      url: 'https://www.morusang.com/quiz/version.html',
      success: res => {
        this.setData({
          version: res.data
        })
      }
    })
  },
  onReady: function () {    //首次启动创建倒计时的默认变量，使用微信的能力开放存储
    wx.getStorage({
      key: 'speed',
      fail: function () {
        wx.setStorage({
          key: "speed",
          data: "50"
        })},
        complete: res =>{
        console.log(res)
        }
      }
    )
    wx.getStorage({
      key: 'countdownswitch',
      fail: function () {
        wx.setStorage({
          key: "countdownswitch",
          data: "1"
        })
      },
      complete: res => {
        console.log(res)
      }
    }
    )
    wx.getStorage({
      key: 'isJumped',
      fail: function () {
        wx.setStorage({
          key: "isJumped",
          data: "1"
        })
      },
      complete: res => {
        console.log(res)
      }
    }
    )
  },
  

  }
  

)
