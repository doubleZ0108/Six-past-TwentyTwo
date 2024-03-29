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
          thing5: {
            value: 'vip表白发布'
          },
          amount2: {
            value: '¥9.99'
          },
          thing1: {
            value: '请于今晚21:30前完成支付'
          },
          thing4: {
            value: '每个夜晚都会遇见🌙'
          }
        },
        templateId: '-ZaqZUukqxjxBjk_IMEPr_TYoUJIEE7j7ot3tUVWuxg',
        // miniprogramState: 'developer'
      })
    return result
  } catch (err) {
    return err
  }
}