export default class Logger {
    static log(text){
      var time = new Date();
      console.log("[" + time.toLocaleTimeString() + "] " + text);
    }
}