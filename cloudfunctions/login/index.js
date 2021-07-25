const cloud = require('wx-server-sdk')

// 初始化 cloud
// TODO
cloud.init({
  env: 'six-past-twenty-two-8cvx689cf6da'
})


exports.main = async (event, context) => {
  console.log(event)
  console.log(context)

  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
  const wxContext = cloud.getWXContext()

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    env: wxContext.ENV,
  }
}

