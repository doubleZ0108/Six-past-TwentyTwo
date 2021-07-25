const random = (max, min) => {
  return Math.round(Math.random()*(max-min)+min);
}

const getVerifyCode = () => {
  var str="1234567890qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM";
  var res='';

  for(var i=0;i<4;i++){
    res+=str[random(0,61)];
  }
  return res
}

module.exports = {
  getVerifyCode: getVerifyCode
}