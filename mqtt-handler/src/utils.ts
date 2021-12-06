import config from "./config";

export function UnpackJson(json:any){
    const topics:{[key:string]:any} = config.mqtt.topics;
    const map = new Map();
    for (let topic in topics){
        map.set(topics[topic],topic);
    }
    const result:{[key:string]:any} = {};
    for (let key in json){
        const topic = map.get(key);
        if (topic){
            result[topic] = json[key];
        }
    }
    return result;
}