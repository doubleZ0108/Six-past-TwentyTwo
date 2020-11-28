// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  db.collection('user')
  .where({
    _openid: wxContext.OPENID
  })
  .update({
    data: {
      academy: event.userInfo.academy,
      grade: event.userInfo.grade,
      studentNumber: event.userInfo.studentNumber,
      motto: event.userInfo.motto,
      _verified_secret: event.userInfo.verified
    }
  })
  
  return
}