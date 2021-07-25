// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'six-past-twenty-two-8cvx689cf6da'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    const result = await cloud.openapi.subscribeMessage.send({
        touser: wxContext.OPENID,
        page: 'index', 
        lang: 'zh_CN',
        data: {
          thing1: {
            value: '表白墙系统开放'
          },
          time2: {
            value: '22:06'
          },
          thing3: {
            value: '每个夜晚都会遇见🌙'
          }
        },
        templateId: 'KSrfOtJCMHZlzoX1IzPsFAJ_yBmGN0bRI2eK_SK-lxc',
        // miniprogramState: 'developer'
      })
    return result
  } catch (err) {
    return err
  }

}