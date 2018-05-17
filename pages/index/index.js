//index.js
//获取应用实例
const app = getApp()
const moment = require('../../lib/moment.min');

Page({
  data: {
    todo: '',
    todoIputDisabled: false,
    beginBtnDisabled: true,
    beginBtnText: '开始新的时间旅程',
    remainingTime: null,
    remainingTimeText: null,
    intervalEvent: null,
    thisBeginTime: null,
    thisEndTime: null,
    remainingRestTime: null,
    remainingRestTimeText: null,
    isOnCountDown: false,
    bindBeginTap: null,
  },
  onShow: function (options) {
    let remainTime = app.globalData.tomatoUnit * 60;
    // let remainTime = 3;
    if (!this.data.isOnCountDown) {
      this.setData({
        remainingTime: remainTime,
        remainingTimeText: this.parseTimeToStr(remainTime),
        remainingRestTime: app.globalData.restTimeUnit * 60,
        bindBeginTap: 'beginTap'
      })
    }
  },
  //输入函数
  bindKeyInput: function (e) {
    let beginBtnDisabled = e.detail.value.length < 0;
    this.setData({
      todo: e.detail.value,
      beginBtnDisabled: beginBtnDisabled
    });
  },
  beginTap: function (e) {
    //Disable for input todo
    this.setData({
      todoIputDisabled: !this.data.todoIputDisabled,
      thisBeginTime: Date(),
      isOnCountDown: true,
    });
    // 保持屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
    this.data.intervalEvent = setInterval(this.refreshRemainingTime, 1000);
  },
  refreshRemainingTime: function () {
    let newRemainingTime = this.data.remainingTime - 1;
    //time end than close
    if (newRemainingTime == 0) {
      clearInterval(this.data.intervalEvent);
      this.setData({
        thisEndTime: Date(),
        isOnCountDown: false,
      });
      // 关闭屏幕常亮
      wx.setKeepScreenOn({
        keepScreenOn: false
      })
      wx.vibrateLong();
      this.showFinish({
        start: this.data.thisBeginTime,
        end: this.data.thisEndTime,
        task: this.data.todo
      });
      this.setData({
        beginBtnText:'开始休息',
        bindBeginTap: 'startRestTime',
        remainingTimeText: this.parseTimeToStr(this.data.remainingRestTime)
      }); 
    }
    this.setData({
      remainingTime: newRemainingTime,
      remainingTimeText: this.parseTimeToStr(newRemainingTime)
    });
  },
  showFinish: function (thisTask) {
    wx.showModal({
      content: '小番茄也能成大事 \n 恭喜你又完成一个番茄 \n 休息一下吧',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          app.globalData.tomatoHistory.push(thisTask);
        }
      }
    });
  },
  parseTimeToStr: function (remainTime) {
    return moment(this.padLeft(parseInt(remainTime / 60).toString(), 2) + this.padLeft((remainTime % 60).toString(), 2), "mmss").format("mm:ss")
  },
  padLeft: function (nr, n, str) {
    return Array(n - String(nr).length + 1).join(str || '0') + nr;
  },
  startRestTime: function (e) {
    this.setData({
      isOnCountDown: true,
    });
    this.data.intervalEvent = setInterval(this.refreshRemainingRestTime, 1000);
  },
  refreshRemainingRestTime: function () {
    let newRemainingTime = this.data.remainingRestTime - 1;
    //time end than close
    if (newRemainingTime == 0) {
      clearInterval(this.data.intervalEvent);
      this.setData({
        isOnCountDown: false,
        remainingRestTime: app.globalData.restTimeUnit * 60
      });
    }
    this.setData({
      remainingRestTime: newRemainingTime,
      remainingTimeText: this.parseTimeToStr(newRemainingTime)
    });
  }
})
