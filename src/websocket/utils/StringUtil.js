export default class StringUtils {
    static b64_to_utf8(str) {
        return decodeURIComponent(escape(atob(str)));
    }


    static utf8_to_b64(str) {
        return btoa(unescape(encodeURIComponent(str)));
    }
}