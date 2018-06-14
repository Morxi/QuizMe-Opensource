//logs.js
var still;
var s1;
const util = require('../../utils/util.js')
function getDateUntilEnding() {
  s1 = new Date(wx.getStorageSync('logs')[0]);
  var days = s1.getTime() - Date.now();
  still = parseInt(days / (1000 * 60 * 60 * 24));
}
Page({
  data: {
    logs: []
  },
  onLoad: function () {

  },
  onShow: function () {
    getDateUntilEnding()
    console.log(still)
    wx.getStorage({
      key: 'questdata',
      success: res => {
        this.setData({
          questnumber: res.data
        })
      }
    })
    this.setData({
      days: still,
      logs: wx.getStorageSync('logs').length,
    })
  }
})

