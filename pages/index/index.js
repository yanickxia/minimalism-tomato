//index.js
//获取应用实例
const app = getApp()
const moment = require('../../lib/moment.min');
const TimerStatus = {
  INIT: {
    id: 1,
    text: '开始新的时间旅程',
    btnClass: 'primary'
  },
  RUNNING: {
    id: 2,
    text: '残忍中止这个番茄',
    btnClass: 'warn'
  },
  WAITING_REST: {
    id: 3,
    text: '开始休息一下吧',
    btnClass: 'primary'
  },
  RESTING: {
    id: 4,
    text: '完成休息',
    btnClass: 'warn'
  }
}

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
    timerStatus: TimerStatus.INIT,
    beginBtnClass: 'primary'
  },
  onShow: function (options) {
    if (this.checkTimerStatus(this.data.timerStatus , TimerStatus.INIT)) {
      this.restToInit();
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
    let newTimerStatus;
    //初始化状态点击
    if (this.checkTimerStatus(this.data.timerStatus , TimerStatus.INIT)) {

      newTimerStatus = TimerStatus.RUNNING;
      this.setData({
        thisBeginTime: Date()
      })
      this.setTimerStatus(newTimerStatus);
      // 保持屏幕常亮
      wx.setKeepScreenOn({
        keepScreenOn: true
      })
      this.data.intervalEvent = setInterval(this.refreshRemainingTime, 1000);
      return
    }

    //计时状态点击
    if (this.checkTimerStatus(this.data.timerStatus , TimerStatus.RUNNING)) {
      //回归正常模式
      newTimerStatus = TimerStatus.INIT;
      clearInterval(this.data.intervalEvent);

      this.setTimerStatus(newTimerStatus);
      this.restToInit();
      // 保持屏幕常亮
      wx.setKeepScreenOn({
        keepScreenOn: false
      });

      wx.showToast({
        title: '失去一个🍅',
        icon: 'none',
        duration: 2000
      })

      return
    }

    //休息等待模式下点击
    if (this.checkTimerStatus(this.data.timerStatus , TimerStatus.WAITING_REST)) {
      //回归正常模式
      newTimerStatus = TimerStatus.RESTING;
      this.setTimerStatus(newTimerStatus);

      this.data.intervalEvent = setInterval(this.refreshRemainingRestTime, 1000);
      return
    }
    //休息中点击
    if (this.checkTimerStatus(this.data.timerStatus , TimerStatus.RESTING)) {
      //回归正常模式
      newTimerStatus = TimerStatus.INIT;
      setTimerStatus(newTimerStatus);
      clearInterval(this.data.intervalEvent);
      return
    }
  },
  refreshRemainingTime: function () {
    let newRemainingTime = this.data.remainingTime - 1;
    //time end than close
    if (newRemainingTime == 0) {
      let newTimerStatus = TimerStatus.WAITING_REST;
      clearInterval(this.data.intervalEvent);
      this.setData({
        thisEndTime: Date(),
        timerStatus: TimerStatus.WAITING_REST,
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
      this.setTimerStatus(newTimerStatus);
      this.setData({
        remainingTimeText: this.parseTimeToStr(this.data.remainingRestTime)
      });
    }else {
      this.setData({
        remainingTime: newRemainingTime,
        remainingTimeText: this.parseTimeToStr(newRemainingTime)
      });
    }
  },
  showFinish: function (thisTask) {
    wx.showModal({
      title: '恭喜完成',
      content: '小番茄也能成大事 \n恭喜你又完成一个番茄 \n休息一下吧',
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
  refreshRemainingRestTime: function () {
    let newRemainingTime = this.data.remainingRestTime - 1;
    //time end than close
    if (newRemainingTime == 0) {
      clearInterval(this.data.intervalEvent);
      this.setData({
        remainingRestTime: app.globalData.restTimeUnit * 60
      });
    }
    this.setData({
      remainingRestTime: newRemainingTime,
      remainingTimeText: this.parseTimeToStr(newRemainingTime)
    });
  },
  restToInit: function () {
    let remainTime = app.globalData.tomatoUnit * 60;
    // let remainTime = 5;
    this.setData({
      remainingTime: remainTime,
      remainingTimeText: this.parseTimeToStr(remainTime),
      remainingRestTime: app.globalData.restTimeUnit * 60
    })
  },
  setTimerStatus: function(newTimerStatus){
    this.setData({
      timerStatus: newTimerStatus,
      beginBtnText: newTimerStatus.text,
      beginBtnClass:  newTimerStatus.btnClass
    });
  },
  checkTimerStatus: function (a,b) {
    return a.id == b.id;
  }
})
