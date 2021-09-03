const [username, password]: string[] = process.env.AUTH_TOKEN?.split(".") || [
	"",
	"",
];
import mqtt from "async-mqtt";

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
	client.on("message", async (_topic, _message) => {
		console.log(`MQTT message: ${_topic} ${_message}`);
	});
}
export default client;
