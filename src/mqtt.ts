const [username, password]: string[] = process.env.AUTH_TOKEN?.split(".") || [
	"",
	"",
];
import mqtt from "async-mqtt";
import events from "./events";
import { TemperatureEvent } from "./types/device";

const options = {
	port: parseInt(`${process.env.MQTT_PORT || 1883}`),
	username: username,
	password: password,
};
const client = mqtt.connect(`mqtt://${process.env.MQTT_BROKER}`, options);
console.log(
	` connected mqtt://${process.env.MQTT_BROKER}:${
		process.env.MQTT_PORT || 1883
	}`,
	options
);
if (process.env.MQTT !== "false") {
	client.subscribe("devices/+/+").then(() => {
		console.log("subscribed to devices/+/+");
	});
	client.subscribe("ping").then(() => {
		console.log("subscribed to ping");
	});
	client.on("connect", () => {
		console.log("MQTT client connected");
	});
	client.on("disconnect", () => {
		console.log("MQTT client disconnected");
	});
	client.on("message", async (topic, message) => {
		const [_, id, command] = topic.split("/");
		const condition1=_ === "devices" 
		const condition2= command.startsWith("temperature") 

		const condition3=!isNaN(command.charAt(command.length - 1) as unknown as number)
		if (condition1 && condition2 && condition3) {
			const val: TemperatureEvent = {
				id,
				no: parseInt(command.charAt(command.length - 1)),
				value: parseInt(message.toString()),
			};
			events.emit("engine:temp", val);
		}
		if (condition1 && command === "rpm") {
			const val={id,value:parseInt(message.toString())}
			events.emit("engine:rpm",val)
		}


		console.log(`MQTT message: ${topic} ${message}`);
	});
	events.on("mqtt.publish", ({ topic, payload }) => {
		client.publish(topic, payload);
	});
}
export default client;
