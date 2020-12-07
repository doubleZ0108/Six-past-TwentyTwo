// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    const result = await cloud.openapi.subscribeMessage.send({
        touser: wxContext.OPENID,
        page: 'index',      // TODO 这里可能需要更换路径
        lang: 'zh_CN',
        data: {
          thing1: {
            value: '表白墙系统开放'
          },
          time2: {
            value: '22:06'
          },
          thing3: {
            value: '每个晚上都会遇见🌙'
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