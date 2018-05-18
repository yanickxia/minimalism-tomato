const app = getApp()
const moment = require('../../lib/moment.min');
const TimerStatus = {
  INIT: {
    id: 1,
    text: '开始新的时间旅程',
    btnClass: 'primary',
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
  },
  isInit(input) {
    return input.id == 1;
  },
  isRunning(input) {
    return input.id == 2;
  },
  isWait(input) {
    return input.id == 3;
  },
  isResting(input) {
    return input.id == 4;
  }
};

function parseTimeToStr(remainTime) {
  return moment(padLeft(parseInt(remainTime / 60).toString(), 2) + padLeft((remainTime % 60).toString(), 2), "mmss").format("mm:ss")
};

// 左补齐
function padLeft(nr, n, str) {
  return Array(n - String(nr).length + 1).join(str || '0') + nr;
};

function showFinish(thisTask) {
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
};

module.exports = {
  TimerStatus: TimerStatus,
  parseTimeToStr: parseTimeToStr,
  showFinish: showFinish
}
