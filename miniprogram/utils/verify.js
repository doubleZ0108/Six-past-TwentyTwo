const random = (max, min) => {
  return Math.round(Math.random()*(max-min)+min);
}

const getVerifyCode = () => {
  //将数字、小写字母及大写字母输入
  var str="1234567890qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM";
  //给一个空字符串
  var res='';

  for(var i=0;i<4;i++){
    //将得到的结果给字符串，调用随机函数，0最小数，62表示数字加字母的总数
    res+=str[random(0,61)];
  }
  return res
}

module.exports = {
  getVerifyCode: getVerifyCode
}