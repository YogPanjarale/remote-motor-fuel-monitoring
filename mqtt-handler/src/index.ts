require("dotenv").config();
import mqtt from "async-mqtt";

import { MongoClient ,} from "mongodb";
import { UnpackJson } from "./utils";
// console.log("hello")

const client =  mqtt.connect("mqtt://do1.yogpanjarale.com:1883", {
	username: "handler1",
	password: "Pleaseno",
});
MongoClient.connect(
	process.env.MONGO_URL as string
).then(async (mongoclient)=> {
	const db = mongoclient.db("rfms");
	
	const collection = db.collection("devices-mqtt");
	const events_collection = db.collection("events");
	const devices = db.collection("devices");
	const handleMessage: mqtt.OnMessageCallback = async (topic, message) => {
		const [_root, id, key] = topic.split("/");
        const data = key=="json"?JSON.parse(message.toString()):message.toString();
		// if (key !=="json"){
		// 	console.log(id, key, message.toString());
		// }
		
		devices.findOneAndUpdate({deviceId:id}, {$set: {[key]: key=="json"?UnpackJson(data):data}}).then(async (result)=>{
			console.log(result.value);
			
		})
        switch (key) {
            case "json":
                await collection.insertOne({deviceId:id,ts:new Date(),...data})
                break;
			case "fuelFilled":
				await events_collection.insertOne({deviceId:id,value:data,key:"fuelFilled",ts:new Date()})
				break;
			case "fuelDrained":
				await events_collection.insertOne({deviceId:id,value:data,key:"fuelFilled",ts:new Date()})
				break;
			case "switch":
				await events_collection.insertOne({deviceId:id,value:data,key:"switch",ts:new Date()})
				break;
			default:
				// console.log("default",key)
				break;
			}
			
	};

	client.on("message", handleMessage);
});
client.on("connect", () => {
	console.log("connected");
	client.subscribe("dev-sim/+/+");
});
client.on("error", console.error);