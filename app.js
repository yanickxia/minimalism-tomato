//app.js
App({
  onLaunch: function () {
    let storageConfig = wx.getStorageInfoSync();
    if (storageConfig.tomatoUnit == null) {
      console.log("init config.....")
      this.globalData = {
        tomatoUnit: 25,
        restTimeUnit: 5,
        autoRestEnable: false,
        tomatoGoal: 5,
        debug: false,
        tomatoHistory: [

        ]
      };
    } else {
      this.globalData = wx.getStorageInfoSync()
    }
  },
  onHide: function () {
    wx.setStorage(this.globalData);
  },
  globalData: {
    //每个番茄时长
    tomatoUnit: null,
    //休息时长
    restTimeUnit: null,
    //是否自动休息
    autoRestEnable: null,
    //每日目标
    tomatoGoal: null,
    /**
     * 历史完成记录
     * 一个List，每个Item的格式是
     * {start:开始时间, end:结束时间, task:任务 }
     */
    tomatoHistory: null
  }
})
