// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'six-past-twenty-two-8cvx689cf6da'
})

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

   /** behavior commentList */
   db.collection('behavior').where({
    _openid: wxContext.OPENID,
  }).update({
    data: {
      commentList: _.push(event.cardId)
    }
  })
  /** card commentNum */
  db.collection(event.from_vip ? 'vipcard' : 'card').where({
    _id: event.cardId
  }).update({
    data: {
      commentNum: _.inc(1)
    }
  })

  return
}