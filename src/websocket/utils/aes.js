
import CryptoJS from 'crypto-js'
const iv = CryptoJS.enc.Base64.parse('ABEiM0RVZnd4eXp7fH1+fw==');

export function decrypt (text) {
    let decrypted = CryptoJS.AES.decrypt(text, iv, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
    //由于服务端加密的时候前四个字节时间参数，现在暂时忽略前4字节
    let result = decrypted.toString(CryptoJS.enc.Utf8);
    let rmtimeResult = result.slice(4);
    return rmtimeResult;
  }


  export function encrypt(encryptCode,key) {
      console.log('code '+encryptCode+' key '+key);
    let keyArry = new Array(16);
    for(let i = 0; i<16; i++){
        //这里是至打印字符编码
        keyArry[i] = key.charCodeAt(i) & 0xFF;
    }
    let keyCode = String.fromCharCode.apply(String, keyArry);
    let secretCode = CryptoJS.enc.Utf8.parse(keyCode);
    console.log('keycode '+keyCode);

    let timeEncryptCode = convertTimeEncryptCode(encryptCode);
    console.log('timeEncryptCode '+timeEncryptCode);
    
    let encrypted = CryptoJS.AES.encrypt(timeEncryptCode, secretCode, {
         iv: secretCode, 
         mode: CryptoJS.mode.CBC, 
         padding: CryptoJS.pad.Pkcs7 
        });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

function convertTimeEncryptCode(encryptCode){
    let encryptArr = string2Bin(encryptCode);
    let result = [];
    for(var i=0; i < encryptCode.length + 4; i++){
        if(i < 4){
            result.push(1 & 0xFF);
        } else{
            result.push(encryptArr[i - 4]);
        }
    }
    console.log('convertTimeEncryptCode result '+result);
    return bin2String(result);
}

function bin2String(array) {
    var result = "";
  for (var i = 0; i < array.length; i++) {
    result += String.fromCharCode(parseInt(array[i], 2));
  }
  return result;
}

function string2Bin(str) {
    var result = [];
    for (var i = 0; i < str.length; i++) {
      result.push(str.charCodeAt(i).toString(2));
    }
    return result;
  }