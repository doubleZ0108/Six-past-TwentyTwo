// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  if(event.favorite_now) {  // 收藏
    db.collection('behavior').where({
      _openid: wxContext.OPENID,
    }).update({
      data: {
        favoriteList: _.push(event.card_id)
      }
    })
  } else {    // 取消收藏
    db.collection('behavior').where({
      _openid: wxContext.OPENID
    }).update({
      data: {
        favoriteList: _.set(event.fresh_favoriteList)
      }
    })
  }

  return
}