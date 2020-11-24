// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  /** comment commentList */
  db.collection('comment').where({
    cardId: event.cardId
  }).update({
    data: {
      commentList: _.push(event.commentData)
    },
  })

  /** card starNum */
  db.collection('card').where({
    _id: event.cardId
  }).update({
    data: {
      commentNum: _.inc(1)
    }
  })

  return
}