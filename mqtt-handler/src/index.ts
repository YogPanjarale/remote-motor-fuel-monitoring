require("dotenv").config();
import mqtt from "async-mqtt";

import { MongoClient ,} from "mongodb";
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
	const handleMessage: mqtt.OnMessageCallback = (topic, message) => {
		const [_root, id, key] = topic.split("/");
        const data = JSON.parse(message.toString());
		// console.log(id, key, message.toString());
        switch (key) {
            case "json":
                collection.insertOne({deviceId:id,ts:new Date(),...data})
                break;
			case "fuelFilled":
				events_collection.insertOne({deviceId:id,value:data,key:"fuelFilled",ts:new Date()})
				break;
			case "fuelDrained":
				events_collection.insertOne({deviceId:id,value:data,key:"fuelFilled",ts:new Date()})
				break;
			case "switch":
				events_collection.insertOne({deviceId:id,value:data,key:"switch",ts:new Date()})
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