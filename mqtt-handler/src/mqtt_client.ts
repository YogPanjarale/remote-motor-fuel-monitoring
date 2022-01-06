import mqtt from "async-mqtt"

export const mqtt_client = mqtt.connect("mqtt://do1.yogpanjarale.com:1883", {
	username: "handler1",
	password: "Pleaseno",
});