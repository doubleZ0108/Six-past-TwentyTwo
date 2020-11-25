// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  if(event.star_now) {  // 点赞

    /** behavior starList */
    db.collection('behavior').where({
      _openid: wxContext.OPENID,
    }).update({
      data: {
        starList: _.push(event.card_id)
      }
    })
    /** card starNum */
    db.collection('card').where({
      _id: event.card_id
    }).update({
      data: {
        starNum: _.inc(1)
      }
    })

  } else {  // 取消点赞

    /** behavior starList */
    db.collection('behavior').where({
      _openid: wxContext.OPENID
    }).update({
      data: {
        starList: _.set(event.fresh_starList)
      }
    })
    /** card starNum */
    db.collection('card').where({
      _id: event.card_id
    }).update({
      data: {
        starNum: _.inc(-1)
      }
    })
    
  }

  return
}