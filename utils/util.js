let moment = require('../lib/moment.min');

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//将历史记录按天分类
function spiteTomatoHistoryByDate(tomatoHistory) {
  let tomatoHistoryByDate = new Map()
  const todayStr = moment().format(moment.HTML5_FMT.DATE);

  for (let i = 0; i < tomatoHistory.length; i++) {
    let tomatoItem = tomatoHistory[i];

    let itemStartDay = moment(tomatoItem.start).format(moment.HTML5_FMT.DATE)
    if (tomatoHistoryByDate.get(itemStartDay) == null) {
      tomatoHistoryByDate.set(itemStartDay, []);
    }
    tomatoHistoryByDate.get(itemStartDay).push(tomatoItem)
  }
  return tomatoHistoryByDate;
}

/**
 * 分割 Tomato Hisotry by 任务名
 */
function spiteTomatoHistoryByTask(tomatoHistory) {
  let todayFinshTaskByTaskName = new Map();
  if (tomatoHistory == null) {
    return todayFinshTaskByTaskName;
  }

  for (let i = 0; i < tomatoHistory.length; i++) {
    let taskItem = tomatoHistory[i];
    let taskname = taskItem.task;
    if (todayFinshTaskByTaskName.get(taskname) == null) {
      todayFinshTaskByTaskName.set(taskname, []);
    }
    todayFinshTaskByTaskName.get(taskname).push(taskItem);
  }
  return todayFinshTaskByTaskName;
}

module.exports = {
  formatTime: formatTime,
  spiteTomatoHistoryByDate: spiteTomatoHistoryByDate,
  spiteTomatoHistoryByTask: spiteTomatoHistoryByTask
}