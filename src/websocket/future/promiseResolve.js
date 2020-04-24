export default class PromiseResolve {
    resolve;
    timeoutId;

    constructor(resolve,timeoutId){
        this.resolve = resolve;
        this.timeoutId = timeoutId;
    }
}