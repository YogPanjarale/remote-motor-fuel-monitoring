import mqtt from "async-mqtt";
import schedule from "node-schedule";
import config from "./config";
import { Device } from "./device";

const client = mqtt.connect(config.mqtt.url, {
	username: config.mqtt.username,
	password: config.mqtt.password,
});

// const rule = new schedule.RecurrenceRule();
const device = new Device(client,"61646974690a")
const task = schedule.scheduleJob("*/30 * * * * *", async () => {
    device.loop()
    console.log("loop")
})

console.log(task," is running !");

client.on("connect", () => {
    client.publish("hello","there")
	console.log("connected");
	client.subscribe("#");
});
client.on("message", (_topic, _message) => {
	// console.log(`${t_opic}: ${_message.toString()}`);
});
