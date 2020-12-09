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
    if(time.min >=6 && time.min <=22) {   // 22:06～22:22  16分钟
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

module.exports = {
  checkingTime: checkingTime,
  getZaiArray: getZaiArray
}