export const WS_PROTOCOL = 'wss';
export const WS_IP = 'chat.comsince.cn';
// export const WS_IP = 'localhost';
export const WS_PORT = 9326;
export const HEART_BEAT_INTERVAL = 25 * 1000;
export const RECONNECT_INTERVAL = 30 * 1000;
export const BINTRAY_TYPE = 'blob';

//signal
export const CONNECT = 'CONNECT';
export const DISCONNECT = 'DISCONNECT';
export const CONNECT_ACK = 'CONNECT_ACK';
export const PUBLISH = 'PUBLISH';
export const PUB_ACK = 'PUB_ACK';
//subsignal
export const FRP = 'FRP';
export const FP = 'FP';
export const FALS = 'FALS';
export const UPUI = 'UPUI';
export const GPGI = 'GPGI';
export const GPGM = 'GPGM';
export const GAM = 'GAM';
export const GC = 'GC';
export const GMI = 'GMI';
export const GKM = 'GKM';
export const GQ = 'GQ';
export const GD = 'GD';
export const MP = 'MP';
export const MS = "MS";
export const MN = "MN";
export const MR = "MR";
export const RMN = "RMN";
export const GQNUT = "GQNUT";
export const GMURL = "GMURL";
export const US = "US";
export const FAR =  "FAR";
export const FRN = "FRN";
export const FHR = "FHR";
export const FN = "FN";
export const MMI = "MMI";

export const HTTP_HOST = "https://"+WS_IP + "/"
export const LOGIN_API = HTTP_HOST + "login";
export const SNED_VERIFY_CODE_API = HTTP_HOST + "send_code";;

export const KEY_VUE_DEVICE_ID = 'vue-device-id';
export const KEY_VUE_USER_ID = 'vue-user-id'; 
export const KEY_VUE_TOKEN = 'vue-token';

//userId 这里为了演示静态登录，由于还没有登录界面所以暂时使用静态userid
export const USER_ID = 'TYTzTz33';
export const CLINET_ID = 'bccdb58cfdb34d861576810441000';
//token
export const TOKEN = '6Yz2rQDrtRPRc3j9PesLy0De17uX2RlVcvkxU/UmGEaMamd/kaagwWNThIWSGMd6SPVHxLeynho03sJWdbm7wFMRO8VTKf5Wogv7l7gKLsq81mswRha3j6FMdDVHVJ+MLJrVjrThkqXrK1rHwsZvGxpqSGcekHIggI1UEEJSXyQ=';

//是否使用七牛上传文件
export const UPLOAD_BY_QINIU = false;

export const ERROR_CODE = 400;
export const SUCCESS_CODE = 200;