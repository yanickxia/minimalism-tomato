//index.js
//获取应用实例
const app = getApp()
const moment = require('../../lib/moment.min');
const utils = require('./utils');
const timer = require('./timer');
const TimerStatus = utils.TimerStatus;

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
    if (TimerStatus.isInit(this.data.timerStatus)) {
      timer.restToInit(this);
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
    if (TimerStatus.isInit(this.data.timerStatus)) {
      timer.init2Run(this);
      this.data.intervalEvent = setInterval(this.refreshRemainingTime, 1000);
      return
    }
    //计时状态点击
    if (TimerStatus.isRunning(this.data.timerStatus)) {
      clearInterval(this.data.intervalEvent);
      timer.breakRunning(this);
      return
    }

    //休息等待模式下点击
    if (TimerStatus.isWait(this.data.timerStatus)) {
      //回归正常模式
      timer.toResting(this);
      this.data.intervalEvent = setInterval(this.refreshRemainingRestTime, 1000);
      return
    }
    //休息中点击
    if (TimerStatus.isResting(this.data.timerStatus)) {
      clearInterval(this.data.intervalEvent);
      timer.restToInit(this);
      return
    }
  },
  refreshRemainingTime: function () {
    let newRemainingTime = this.data.remainingTime - 1;
    //time end than close
    if (newRemainingTime <= 0) {
      clearInterval(this.data.intervalEvent);
      timer.doneTomato(this);
      if(app.globalData.autoRestEnable){
        this.data.intervalEvent = setInterval(this.refreshRemainingRestTime, 1000);
      }
    } else {
      this.setData({
        remainingTime: newRemainingTime,
        remainingTimeText: utils.parseTimeToStr(newRemainingTime)
      });
    }
  },
  refreshRemainingRestTime: function () {
    let newRemainingTime = this.data.remainingRestTime - 1;
    //time end than close
    if (newRemainingTime <= 0) {
      clearInterval(this.data.intervalEvent);
      timer.doneRest(this);
    } else {
      this.setData({
        remainingRestTime: newRemainingTime,
        remainingTimeText: utils.parseTimeToStr(newRemainingTime)
      });
    }
  }
})
