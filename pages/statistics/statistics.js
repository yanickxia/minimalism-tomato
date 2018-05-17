// pages/statistics/statistics.js

let moment = require('../../lib/moment.min');
let utils = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tomatoHistoryByDate: null,
    todayTomato: null,
    tomatoGoal: null,
    todayTomatoRank: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log();
  },
  onShow: function (options) {
    let appInstance = getApp();
    let tomatoHistory = appInstance.globalData.tomatoHistory;
    
    let tomatoHistoryByDate = utils.spiteTomatoHistoryByDate(tomatoHistory);

//将今天的数据按照Task分类
    const todayStr = moment(new Date()).format(moment.HTML5_FMT.DATE);
    let todayTomato = tomatoHistoryByDate.get(todayStr);
    if (todayTomato == null){
      todayTomato = []
    }
    let todayFinshTask = utils.spiteTomatoHistoryByTask(todayTomato);
    let todayTomatoRank = [];
    todayFinshTask.forEach(function (value, key, map){
      todayTomatoRank.push({
        key: key,
        count: value.length
      });
    })
    this.setData({
      tomatoGoal: appInstance.globalData.tomatoGoal,
      tomatoHistoryByDate: tomatoHistoryByDate,
      todayTomato: todayFinshTask,
      todayTomatoCount: todayTomato.length,
      todayTomatoRank: todayTomatoRank
    })
  }
})