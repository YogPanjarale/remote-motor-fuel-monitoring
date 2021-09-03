import EventEmitter from "events";

const emitter = new EventEmitter();
console.log('events exported')
export default emitter;