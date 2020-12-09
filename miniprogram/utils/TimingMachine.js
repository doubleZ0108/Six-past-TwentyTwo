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

module.exports = {
  checkingTime: checkingTime
}