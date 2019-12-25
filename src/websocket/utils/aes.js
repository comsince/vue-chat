
import CryptoJS from 'crypto-js'
const iv = CryptoJS.enc.Base64.parse('ABEiM0RVZnd4eXp7fH1+fw==');

export function decrypt (text) {
    let decrypted = CryptoJS.AES.decrypt(text, iv, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
    //由于服务端加密的时候前四个字节时间参数，现在暂时忽略前4字节
    var resultWordArr = CryptoJS.enc.Hex.parse(decrypted.toString().slice(8));
    let result = resultWordArr.toString(CryptoJS.enc.Utf8);
    // let rmtimeResult = result.slice(4);
    return result;
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
    
    //pwd 必须base64解码

    let encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Base64.parse(timeEncryptCode), secretCode, {
         iv: secretCode, 
         mode: CryptoJS.mode.CBC, 
         padding: CryptoJS.pad.Pkcs7 
        });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

function convertTimeEncryptCode(encryptCode){
    
    // let encryptArr = string2Bin(encryptCode);
   let encryptArr = CryptoJS.enc.Base64.parse(encryptCode);

   encryptArr = wordToByteArray(encryptArr.words);
    // encryptArr  = string2Bin(encryptArr);
    let result = [];
    let curhour = (new Date().getMilliseconds()/1000 - 1514736000)/3600;
    for(var i=0; i < encryptArr.length + 4; i++){
        if(i < 4){
            if(i == 0){
              result.push(curhour & 0xFF);
            } else if(i == 1){
              result.push((curhour & 0xFF00) >> 8);
            } else if(i == 2){
              result.push((curhour & 0xFF0000) >> 16);
            } else if(i == 3){
               result.push((curhour & 0xFF) >> 24);
            }
        } else{
            result.push(encryptArr[i - 4]);
        }
    }
    console.log('convertTimeEncryptCode result '+result);

    // https://stackoverflow.com/questions/9267899/arraybuffer-to-base64-encoded-string
    var base64wordarr = btoa(String.fromCharCode(...new Uint8Array(result)));
    console.log("hash word "+base64wordarr);

    return base64wordarr;
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

  function wordToByteArray(wordArray) {
    var byteArray = [], word, i, j;
    for (i = 0; i < wordArray.length; ++i) {
        word = wordArray[i];
        for (j = 3; j >= 0; --j) {
            byteArray.push((word >> 8 * j) & 0xFF);
        }
    }
    return byteArray;
}

function byteArrayToString(byteArray) {
    var str = "", i;
    for (i = 0; i < byteArray.length; ++i) {
        str += escape(String.fromCharCode(byteArray[i]));
    }
    return str;
}
