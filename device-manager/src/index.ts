import * as mqtt from "mqtt"; // import everything inside the mqtt module and give it the namespace "mqtt"
import { AsyncClient } from "async-mqtt";
const client = mqtt.connect("mqtt://do1.yogpanjarale.com:1883", {
	clientId: "my-client-id",
	username: "dev-man-",
	password: "Pleaseno",
});
const asyncClient = new AsyncClient(client);
const branch = "0x"
const devices = ["001"]
async function main() {
    await asyncClient.publish("Hello/Wolrd","stuff")
    asyncClient.subscribe(`devices/${branch}/#`)
}
setInterval(() => {
    devices.forEach(async (device) => {
        await asyncClient.publish(`devices/${branch}/${device}/update`, "1")
    })
}, 5000);
client.on("message", function (topic, message) {
	// message is Buffer
	console.log(`[Incomming message] : ${topic} , ${message.toString()}`);
	// client.end();
});
main();