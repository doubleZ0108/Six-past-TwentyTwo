const { formatTime } = require("./time");

const app = getApp()

const startTime = 6
const lastTime = 16

const getDateInfo = (time) => {
  return {
    year: time.getFullYear(),
    month: time.getMonth(),
    date: time.getDate(),
    hour: time.getHours(),
    min: time.getMinutes()
  }
}
const isSameDate = (date1, date2) => {
  let [dateInfo1, dateInfo2] = [getDateInfo(date1), getDateInfo(date2)]
  if(dateInfo1.year == dateInfo2.year &&
    dateInfo1.month == dateInfo2.month &&
    dateInfo1.date == dateInfo2.date) {
      return true
  }
  return false
}
/* ⚠注意起止必须为同一天 */
const inSpecialDate = (now, start, end) => {
  if(isSameDate(now, start)) {
    let [nowDateInfo, startDateInfo, endDateInfo] = [getDateInfo(now), getDateInfo(start), getDateInfo(end)]
    if(nowDateInfo.hour > startDateInfo.hour && nowDateInfo.hour < endDateInfo.hour) {
      return true
    }
    if((nowDateInfo.hour == startDateInfo.hour && nowDateInfo.min >= startDateInfo.min) || 
         (nowDateInfo.hour == endDateInfo.hour && nowDateInfo.min <= endDateInfo.min)) {
      return true
    }
  }
  return false
}
const checkingTime = () => {
  let now = new Date()
  let time = {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    date: now.getDate(),
    day: now.getDay(),
    hour: now.getHours(),
    min: now.getMinutes()
  }

  /** 周六周日 */
  if(time.day == 0 || time.day == 6) {
    return true
  }

  /** 特殊日期 TODO */
  let allDayOpenList = app.globalData.allDayOpenList
  let specialDayObj = app.globalData.specialDayObj

  for(let index = 0; index < allDayOpenList.length; ++index) {
    if(isSameDate(now, allDayOpenList[index])) {
      console.log("ALL DAY OPEN LIST YES!!!!")
      return true
    }
  }

  if(specialDayObj.inUse) {
    if(inSpecialDate(now, specialDayObj.start, specialDayObj.end)) {
      console.log("IN SPECIAL DATE YES!!!!")
      return true
    }
  }

  /** 22:06～22:22  16分钟 */
  if(time.hour == 22) {
    if(time.min >= startTime && time.min <= startTime+lastTime) {
      return true
    }
  }

  /** for test */
  if(time.day == 1) {
    return true
  }
  // if(time.hour == 22) {
  //   if(time.min >= 4 && time.min <= 6) {   // 22:06～22:22  16分钟
  //     return true
  //   }
  // }

  return false
}


const lengthToTime = () => {
  let now = new Date()
  let hour = now.getHours()
  let length = (22 - hour) > 6 ? 6 : (22 - hour)
  return length
}
const getZaiArray = () => {
  let str = ''
  for(let i=0;i<lengthToTime(); ++i) {
    str = str.concat('再')
  }
  return str
}
const getSystemCloseWord = (currentTab) => {
  let now = new Date()
  let hour = now.getHours()
  let min = now.getMinutes()
  if(hour > 22 || (hour==22 && min>22)) {
    return "明天晚上也会相遇🌙"
  }

  let str = ""
  switch(currentTab) {
    case 0:
      str = "请" + getZaiArray() + "等一会儿，每个夜晚都会遇见🌙"
      break
    case 2:
      str = "请" + getZaiArray() + "等一会儿，每条收藏都值得回味🌙"
      break
    case 3:
      str = "请" + getZaiArray() + "等一会儿，每次搜索都值得期待🌙"
      break
  }

  return str
}

module.exports = {
  checkingTime: checkingTime,
  getZaiArray: getZaiArray,
  getSystemCloseWord: getSystemCloseWord
}