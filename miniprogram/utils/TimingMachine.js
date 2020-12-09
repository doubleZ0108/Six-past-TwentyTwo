const startTime = 6
const lastTime = 16

const random = (max, min) => {
  return Math.round(Math.random()*(max-min)+min);
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
  if(time.day == 0 || time.day == 6) {  // 周六周日
    return true
  }
  if(time.hour == 22) {
    if(time.min >= startTime && time.min <= startTime+lastTime) {   // 22:06～22:22  16分钟
      return true
    }
  }

  return false
}

/** 现在到22:06的时间 */
const lengthToTime = () => {
  let now = new Date()
  let hour = now.getHours()
  let length = (22 - hour) > 6 ? 6 : (22 - hour)
  return length
}

/** 获取 再再再 字符串 */
const getZaiArray = () => {
  let str = ''
  for(let i=0;i<lengthToTime(); ++i) {
    str = str.concat('再')
  }
  return str
}

const getSystemCloseWord = (currentTab) => {
  let str = ""
  switch(currentTab) {
    case 0:
      str = "请" + getZaiArray() + "等一会儿，每个晚上都会相遇🌙"
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