const app = getApp()
const utils = require('./utils');
const TimerStatus = utils.TimerStatus;
const debug = true;

function checkTimerStatus(a, b) {
  return a.id == b.id;
};


function setTimerStatus(page, newTimerStatus) {
  page.setData({
    timerStatus: newTimerStatus,
    beginBtnText: newTimerStatus.text,
    beginBtnClass: newTimerStatus.btnClass
  });
};

function init2Run(page) {
  let newTimerStatus = TimerStatus.RUNNING;
  page.setData({
    thisBeginTime: Date()
  })
  setTimerStatus(page, newTimerStatus);
  // 保持屏幕常亮
  wx.setKeepScreenOn({
    keepScreenOn: true
  })
};

//打断运行
function breakRunning(page) {
  //回归正常模式
  let newTimerStatus = TimerStatus.INIT;
  this.setTimerStatus(page, newTimerStatus);
  restToInit(page);
  // 保持屏幕常亮
  wx.setKeepScreenOn({
    keepScreenOn: false
  });

  wx.showToast({
    title: '失去一个🍅',
    icon: 'none',
    duration: 2000
  })
};

//去休息
function toResting(page) {
  let newTimerStatus = TimerStatus.RESTING;
  setTimerStatus(page, newTimerStatus);
}

//恢复到INIT状态
function restToInit(page) {
  // let remainTime = app.globalData.tomatoUnit * 60;
  let remainTime = getTomatoTime();
  page.setData({
    timerStatus: TimerStatus.INIT,
    beginBtnText: TimerStatus.INIT.text,
    beginBtnClass: TimerStatus.INIT.btnClass,
    remainingTime: remainTime,
    remainingTimeText: utils.parseTimeToStr(remainTime),
    remainingRestTime: getRestTime()
  })
};

function doneTomato(page) {
  let newTimerStatus = TimerStatus.WAITING_REST;
  page.setData({
    thisEndTime: Date(),
    timerStatus: TimerStatus.WAITING_REST,
  });
  // 关闭屏幕常亮
  wx.setKeepScreenOn({
    keepScreenOn: false
  })
  wx.vibrateLong();

  let thisFinshTask = {
    start: page.data.thisBeginTime,
    end: page.data.thisEndTime,
    task: page.data.todo
  };

  if(!app.globalData.autoRestEnable){
    utils.showFinish(thisFinshTask);
  }
  setTimerStatus(page, newTimerStatus);
  page.setData({
    remainingTimeText: utils.parseTimeToStr(getRestTime())
  });

  if(app.globalData.autoRestEnable){
    wx.showToast({
      title: '完成一个番茄',
      icon: 'none',
      duration: 2000
    });
    app.globalData.tomatoHistory.push(thisFinshTask);
  }
}



function doneRest(page) {
  let newTimerStatus = TimerStatus.INIT;
  restToInit(page);
  wx.showToast({
    title: '休息完成',
    icon: 'none',
    duration: 2000
  })
}

function getRestTime() {
  if(debug){
      return 2;
  }
  return app.globalData.restTimeUnit * 60;
};

function getTomatoTime() {
  if(debug){
      return 3;
  }
  return app.globalData.tomatoUnit * 60;
}

module.exports = {
  checkTimerStatus: checkTimerStatus,
  setTimerStatus: setTimerStatus,
  init2Run: init2Run,
  breakRunning: breakRunning,
  toResting: toResting,
  restToInit: restToInit,
  doneTomato:doneTomato,
  doneRest: doneRest
};
