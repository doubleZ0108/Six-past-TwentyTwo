// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()//链接数据库
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  if(event.favorite_now) {
    db.collection('behavior').where({
      _openid: wxContext.OPENID,
    }).update({
      data: {
        favoriteList: _.push(event.card_id)
      }
    })
  } else {

    db.collection('behavior').where({
      _openid: wxContext.OPENID
    }).update({
      data: {
        favoriteList: _.set(event.fresh_favoriteList)
      }
    })

  }
}