  /**
 * 题目逻辑处理
 * Creator：墨羲
 * morxislab
 */
var list = ['题目及选项错误', '答案错误', '程序异常'];//报错类型
var context;
var curAddon;
var x, y;
var curId;
var reportable;
// 草稿纸处理开始
var context = null;// 使用 wx.createContext 获取绘图上下文 context
var isButtonDown = false;
var arrx = [];
var arry = [];
var arrz = [];
var canvasw = 0;
var canvash = 0;
//获取系统信息
wx.getSystemInfo({
  success: res => {
    console.log(res)
    canvasw = res.windowWidth;//设备宽度
    canvash = res.windowHeight;
  }
});
// 草稿纸结束
var current = 1;
var curProggess = 0;
var that;
var curAnswer;
var timer;
var proggessState;
var tempspeed;
var switchStat;
var tempquestion;
var wrongtype;
var jumpSwitch;
function answerQuestion(id) {
  memoInit();
  if (curAnswer == convert(id)) {
    wx.showToast({
      title: '回答正确',
      icon: 'success',
      duration: 900
    })
    if (jumpSwitch) {
      that.setData({ isJumped: 0 });
      getQuestion();

      that.setData({
        cur: current,
        errorState: '',
        addons : ''
      })

      var value = wx.getStorageSync('questdata')
      wx.setStorageSync('questdata', value + 1)
      console.log(value)
      proggessState = 1;

    }

    else {
      that.setData({ isJumped: 1 });
      that.setData({
        errorState: "正确答案:" + curAnswer ,
        addons:"解析:"+curAddon
      });
      proggessState = 0;
    }


  }

  else {
    wx.reportAnalytics('plus_ones', {
      true: 0,
    });
    that.setData({
      errorState: "正确答案:" + curAnswer,
        addons: "解析:" + curAddon
    });
    proggessState = 0;
  }

}

function convert(num) { //数字转大写字母
  var result = [];
  while (num) {
    var t = num % 26;
    if (!t) {
      t = 26;
      --num;
    }
    result.push(String.fromCodePoint(t + 64));
    num = ~~(num / 26);
  }
  return result.reverse().join('');
}
function getQuestion() {
  console.log(curId)
  wx.reportAnalytics('plus_ones', {     //题目数量上报,需要在微信后台开启统计字段
    questions: 1,
  });
  wrongtype = 1; //是否可以报错
  reportable = 0;
  var currentUrl = 'https://www.morusang.com/quiz/getquestion.php?id=' + current;  //按题目id获取json
  wx.request({
    url: currentUrl,
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: res => {
      that.setData(
        {
          question: res.data.question,
          sel1: res.data.A,
          sel2: res.data.B,
          sel3: res.data.C,
          sel4: res.data.D,

        }
      )
      curAddon = res.data.addons;
      curAnswer = res.data.answer;
      tempquestion = JSON.stringify(res.data);
      console.log(res);
    },
       complete: res => {
      console.log(res)
    }
  })

  current = current + 1;
}

function memoInit() {
  context = wx.createCanvasContext('canvas');
  context.beginPath()
  context.setStrokeStyle('#000000');
  context.setLineWidth(5);
  context.setLineCap('round');
  context.setLineJoin('round');
  context.setGlobalAlpha(1)
}
Page({
  //页面初始数据
  data: {
    displayAddons : 0,
    
    addons: '',
    memoSwitch: 0,
    cur: 1,
    progessColor: '0A64A4'

  },
  //草稿纸开始
  touchstart(e) {
    context.moveTo(e.touches[0].x, e.touches[0].y);
  },
  touchmove(e) {
    let x = e.touches[0].x;
    let y = e.touches[0].y;
    context.lineTo(x, y)
    context.stroke();
    context.draw(true);
    context.moveTo(x, y)

  },

  onExitTap: function () {
    this.setData({
      memoSwitch: 0
    })
  },
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },

  canvasEnd: function (event) {
    context.draw(true);
    isButtonDown = false;
  },
  cleardraw: function () {
    //清除画布
    context.clearRect(0, 0, canvasw, canvash);
    context.draw(true);
  },

  //草稿纸结束
  eastenEgg1: function () {
 

  
  },
  reportBug: function () {// 报错处理
    if (wrongtype) {
      wx.showModal({
        title: '请自行添加报错接口',
        content: '',
        confirmText: "确定",
         cancelText: " "
      })
    // 下列代码可作为报错处理的参考，本人暂使用leancloud作为用户反馈的解决方案，为了隐私安全，已经抹掉api的密码和访问途径，去掉注释后也无法使用
    //   wx.showModal({
    //     title: '报错提示',
    //     content: '请确认是否题目有问题后再选择报错',
    //     confirmText: "确定报错",
    //     cancelText: "手滑了",
    //     success: function (res) {
    //       wx.showActionSheet({
    //         itemList: list,
    //         success: res => {
    //           wx.request({
    //             url: '',
    //             method: "POST",
    //             data: {

    //               "status": "open",
    //               "content": tempquestion,
    //               "contact": list[res.tapIndex]

    //             },
    //             header: {
    //               'content-type': 'application/json',
    //               'X-LC-Id': '',
    //               'X-LC-Key': ''

    //             },
    //             success: res => {
    //               wx.showModal({
    //                 content: '反馈已提交',
    //                 showCancel: false,
    //                 success: function (res) {
    //                   if (res.confirm) {
    //                     wrongtype = 0;
    //                   }
    //                 }
    //               });
    //             }
    //           })
    //         }

    //       });

    //     }
    //   });
    //   wrongtype = 0;
    }
    else if(reportable){
      wx.showModal({
        content: '请勿重复报错',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wrongtype = 0;
          }
        }
      });
    }
  },
  nextTap: function () {
    proggessState = 1;
    that.setData({ isJumped: 0 });
    getQuestion();
  
    that.setData({
      cur: current,
      errorState: '',
      addons : ''
    })

    var value = wx.getStorageSync('questdata')
    wx.setStorageSync('questdata', value + 1)
    console.log("questdata" + value)
  },
  /**
     * 生命周期函数--监听页面初次渲染完成
     */
  onReady: function () {
    // 归零错误状态
    that.setData({
      errorState: '',
      addons : ''
    })
    if (switchStat) {
      timer = setInterval(  //进度条计时器
        function proggessing() {

          if (proggessState) {
            curProggess = curProggess + 0.35;


            if (curProggess < 100) {
              // console.log("toggled")
              that.setData(
                {
                  curPercent: curProggess,
                  progessColor: '#0A64A4'


                }
              )

            }
            else if (curProggess >= 100 && curProggess <= 100.5) {
              that.setData({
                progessColor: '#FF1300'
              })
              wx.showToast({
                title: '回答超时',
                icon: 'none',
                duration: 900
              })
            }

          }
        }
        , tempspeed
      )
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    memoInit();
    // 获取倒计时速度
    wx.getStorage({
      key: 'speed',
      success: res => {
        tempspeed = 100 - res.data;
        console.log('speed='+tempspeed)
      },
    })
    // 是否显示下一题按钮
    wx.getStorage({
      key: 'isJumped',
      success: res => {
        jumpSwitch = res.data;
        // console.log("isjump:" + jumpSwitch)
      },
    })
    // 是否显示倒计时
    wx.getStorage({
      key: 'countdownswitch',
      success: res => {
        switchStat = res.data;
      }
    })

    proggessState = 1;//开始计时


  },



  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //清空倒计时器，并归零当前计时器变量
    clearInterval(timer);
    current = 1;
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //清空倒计时器，并归零当前计时器变量
    clearInterval(timer);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

    this.setData({
      memoSwitch: 1
    })
    wx.stopPullDownRefresh();
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


  },
  /**
 * 页面加载处理函数
 */
  onLoad: function (options) {
    current = 1;
    curId = options.id;
    console.log(options);
    proggessState = 1;
    
    that = this;  //将this传给that，此处的this可以调用setData
    this.setData({ cur: current })//赋值当前题号
    getQuestion();
  },
  clickMe: event => {
    answerQuestion(event.currentTarget.id);
    curProggess = -5;
  }

})



