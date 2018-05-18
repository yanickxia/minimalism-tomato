// pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //每个番茄时长
    tomatoUnit: null,
    //休息时长
    restTimeUnit: null,
    //是否自动休息
    autoRestEnable: null,
    //每日目标
    tomatoGoal: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let appInstance = getApp();
    this.setData({
      tomatoUnit: appInstance.globalData.tomatoUnit,
      restTimeUnit: appInstance.globalData.restTimeUnit,
      autoRestEnable: appInstance.globalData.autoRestEnable,
      tomatoGoal: appInstance.globalData.tomatoGoal
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  autoRestSwitch: function(e) {
    let appInstance = getApp();
    appInstance.globalData.autoRestEnable = e.detail.value;
  },

  tomatoUnitChange: function(e) {
    let appInstance = getApp();
    appInstance.globalData.tomatoUnit = e.detail.value;
  },
  restTimeUnitChange: function(e) {
    let appInstance = getApp();
    appInstance.globalData.restTimeUnit = e.detail.value;
  },
  tomatoGoalChange: function(e) {
    let appInstance = getApp();
    appInstance.globalData.tomatoGoal = e.detail.value;
  },
  devBindTap: function(e) {
    let appInstance = getApp();
    appInstance.globalData.debug = !appInstance.globalData.debug;
    let toastText = '切换为正常模式'
    if(appInstance.globalData.debug){
      toastText = '切换为Debug模式'
    }
    wx.showToast({
      title: toastText,
      icon: 'none',
      duration: 2000
    })
  }
})
