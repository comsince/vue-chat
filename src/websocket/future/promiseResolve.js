export default class PromiseResolve {
    resolve;
    timeoutId;
    protoMessageId;

    constructor(resolve,timeoutId){
        this.resolve = resolve;
        this.timeoutId = timeoutId;
    }
}